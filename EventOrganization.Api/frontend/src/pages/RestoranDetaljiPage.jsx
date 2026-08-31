import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getRestoranById } from '../api/restoranApi';
import { getPaketiByRestoranId } from '../api/paketApi';
import { getSaleByPaketId } from '../api/salaApi';
import { getUslugeByPaketId } from '../api/uslugaApi';

import './RestoranDetaljiPage.css';

const naziviTipovaUsluga = {
    FOTOGRAF: 'Fotografi',
    KETERING: 'Ketering',
    DEKORATER: 'Dekorateri',
    MUZICKI_IZVODJAC: 'Muzički izvođači',
};

const redosledTipovaUsluga = [
    'FOTOGRAF',
    'KETERING',
    'DEKORATER',
    'MUZICKI_IZVODJAC',
];

const linkPreviewCache = new Map();

function grupisiUslugePoTipu(usluge) {
    const grupe = {
        FOTOGRAF: [],
        KETERING: [],
        DEKORATER: [],
        MUZICKI_IZVODJAC: [],
    };

    usluge.forEach((usluga) => {
        if (grupe[usluga.tipUsluge]) {
            grupe[usluga.tipUsluge].push(usluga);
        }
    });

    return grupe;
}

function formatEnumValue(value) {
    if (!value) {
        return '';
    }

    return value
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (slovo) => slovo.toUpperCase());
}

function formatCena(value) {
    if (value == null) {
        return 'Nije definisana';
    }

    return `${Number(value).toLocaleString('sr-RS')} €`;
}

function getLinkTekst() {
    return 'Pogledaj ponudu';
}

function getDomen(url) {
    try {
        return new URL(url).hostname.replace('www.', '');
    } catch {
        return url;
    }
}

function getGoogleMapsLink(adresa, grad) {
    const lokacija = `${adresa}, ${grad}`;

    return (
        'https://www.google.com/maps/search/' +
        '?api=1&query=' +
        encodeURIComponent(lokacija)
    );
}

async function getLinkPreview(url) {
    if (linkPreviewCache.has(url)) {
        return linkPreviewCache.get(url);
    }

    const response = await fetch(
        `https://api.microlink.io/?url=${encodeURIComponent(url)}&meta=true`,
    );

    if (!response.ok) {
        throw new Error('Nije moguće učitati pregled linka.');
    }

    const result = await response.json();

    if (result.status !== 'success' || !result.data) {
        return null;
    }

    const image =
        typeof result.data.image === 'string'
            ? result.data.image
            : result.data.image?.url;

    const logo =
        typeof result.data.logo === 'string'
            ? result.data.logo
            : result.data.logo?.url;

    const preview = {
        title: result.data.title || getDomen(url),
        description: result.data.description || '',
        image: image || logo || null,
        url: result.data.url || url,
    };

    linkPreviewCache.set(url, preview);

    return preview;
}

function PortfolioPreview({ usluga }) {
    const [preview, setPreview] = useState(undefined);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        let aktivno = true;

        async function loadPreview() {
            try {
                const result = await getLinkPreview(usluga.portfolio);

                if (aktivno) {
                    setPreview(result);
                }
            } catch {
                if (aktivno) {
                    setPreview(null);
                }
            }
        }

        loadPreview();

        return () => {
            aktivno = false;
        };
    }, [usluga.portfolio]);

    const imaSliku = preview?.image && !imageError;

    return (
        <a
            href={usluga.portfolio}
            target="_blank"
            rel="noreferrer"
            className={
                imaSliku
                    ? 'portfolio-preview'
                    : 'portfolio-preview bez-slike'
            }
        >
            {imaSliku && (
                <img
                    src={preview.image}
                    alt={preview.title || usluga.naziv}
                    onError={() => setImageError(true)}
                />
            )}

            <div className="portfolio-preview-tekst">
                <span>Portfolio</span>

                <strong>
                    {preview === undefined
                        ? getLinkTekst()
                        : preview?.title || getLinkTekst()}
                </strong>

                {preview?.description && (
                    <p className="portfolio-preview-opis">
                        {preview.description}
                    </p>
                )}

                <small>{getDomen(usluga.portfolio)}</small>
            </div>

            <span className="portfolio-arrow">↗</span>
        </a>
    );
}

function RestoranDetaljiPage() {
    const { restoranId } = useParams();
    const navigate = useNavigate();

    const korisnikJson = localStorage.getItem('korisnik');
    const korisnik = korisnikJson ? JSON.parse(korisnikJson) : null;

    const jeRadnik =
        korisnik?.uloga === 'MENADZER' ||
        korisnik?.uloga === 'OPERATER';

    const jeMenadzer = korisnik?.uloga === 'MENADZER';
    const jeKlijent = korisnik?.uloga === 'KLIJENT';

    const [restoran, setRestoran] = useState(null);
    const [paketi, setPaketi] = useState([]);
    const [aktivanPaketId, setAktivanPaketId] = useState(null);
    const [aktivanTipUsluge, setAktivanTipUsluge] = useState(null);
    const [salePoPaketu, setSalePoPaketu] = useState({});
    const [uslugePoPaketu, setUslugePoPaketu] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [detaljiLoading, setDetaljiLoading] = useState({});
    const [detaljiError, setDetaljiError] = useState({});

    useEffect(() => {
        async function loadPage() {
            setIsLoading(true);
            setError('');

            try {
                const [restoranResult, paketiResult] = await Promise.all([
                    getRestoranById(restoranId),
                    getPaketiByRestoranId(restoranId),
                ]);

                setRestoran(restoranResult);
                setPaketi(paketiResult);

                if (paketiResult.length > 0) {
                    const prviPaketId = paketiResult[0].paketId;

                    setAktivanPaketId(prviPaketId);
                    await loadPaketDetalje(prviPaketId);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadPage();
    }, [restoranId]);

    async function loadPaketDetalje(paketId) {
        if (
            salePoPaketu[paketId] !== undefined &&
            uslugePoPaketu[paketId] !== undefined
        ) {
            return;
        }

        setDetaljiLoading((prev) => ({
            ...prev,
            [paketId]: true,
        }));

        setDetaljiError((prev) => ({
            ...prev,
            [paketId]: '',
        }));

        try {
            const [saleResult, uslugeResult] = await Promise.all([
                getSaleByPaketId(restoranId, paketId),
                getUslugeByPaketId(restoranId, paketId),
            ]);

            setSalePoPaketu((prev) => ({
                ...prev,
                [paketId]: saleResult,
            }));

            setUslugePoPaketu((prev) => ({
                ...prev,
                [paketId]: uslugeResult,
            }));
        } catch (error) {
            setDetaljiError((prev) => ({
                ...prev,
                [paketId]: error.message,
            }));
        } finally {
            setDetaljiLoading((prev) => ({
                ...prev,
                [paketId]: false,
            }));
        }
    }

    async function handlePaketClick(paketId) {
        setAktivanPaketId(paketId);
        setAktivanTipUsluge(null);

        await loadPaketDetalje(paketId);
    }

    if (isLoading) {
        return (
            <div className="restoran-detalji-page">
                <div className="restoran-page-state">
                    Učitavanje restorana...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="restoran-detalji-page">
                <div className="restoran-page-state restoran-page-error">
                    {error}
                </div>
            </div>
        );
    }

    const aktivanPaket = paketi.find(
        (paket) => paket.paketId === aktivanPaketId,
    );

    const saleAktivnogPaketa =
        salePoPaketu[aktivanPaketId] ?? [];

    const uslugeAktivnogPaketa =
        uslugePoPaketu[aktivanPaketId] ?? [];

    const grupisaneUsluge = grupisiUslugePoTipu(
        uslugeAktivnogPaketa,
    );

    const tipoviSaUslugama = redosledTipovaUsluga.filter(
        (tip) => grupisaneUsluge[tip].length > 0,
    );

    const prikazanTipUsluge =
        aktivanTipUsluge &&
            tipoviSaUslugama.includes(aktivanTipUsluge)
            ? aktivanTipUsluge
            : tipoviSaUslugama[0];

    const uslugeZaPrikaz = prikazanTipUsluge
        ? grupisaneUsluge[prikazanTipUsluge]
        : [];

    return (
        <div className="restoran-detalji-page">
            <main className="restoran-detalji-container">
                {!jeRadnik && (
                    <button
                        type="button"
                        className="restoran-nazad-button"
                        onClick={() => navigate('/restorani')}
                    >
                        ← Nazad na restorane
                    </button>
                )}

                <header className="restoran-zaglavlje">
                    <span className="restoran-kicker">
                        Restoran
                    </span>

                    <h1>{restoran.naziv}</h1>

                    <div className="restoran-kontakt">
                        <a
                            href={getGoogleMapsLink(
                                restoran.adresa,
                                restoran.grad,
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="restoran-adresa-link"
                        >
                            {restoran.adresa}, {restoran.grad}
                        </a>

                        <span className="restoran-dot">•</span>

                        <a
                            href={`tel:${restoran.telefon}`}
                            className="restoran-telefon-link"
                        >
                            {restoran.telefon}
                        </a>
                    </div>

                    {restoran.radnoVreme && (
                        <span className="restoran-radno-vreme">
                            Radno vreme: {restoran.radnoVreme}
                        </span>
                    )}
                </header>

                {jeKlijent && (
                    <div className="restoran-rezervacija-akcija">
                        <button
                            type="button"
                            className="restoran-rezervisi-button"
                            onClick={() =>
                                navigate(
                                    `/restorani/${restoranId}/nova-rezervacija`,
                                )
                            }
                        >
                            Rezerviši događaj
                        </button>
                    </div>
                )}

                {jeRadnik && (
                    <div className="restoran-radnik-akcije">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/restorani/${restoranId}/nova-rezervacija`,
                                )
                            }
                        >
                            Kreiraj rezervaciju
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/restorani/${restoranId}/rezervacije`,
                                )
                            }
                        >
                            Pregled rezervacija
                        </button>

                        {jeMenadzer && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/restorani/${restoranId}/upravljanje-ponudom`,
                                    )
                                }
                            >
                                Upravljanje ponudom
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/restorani/${restoranId}/cenovnik`,
                                )
                            }
                        >
                            Cenovnik
                        </button>
                    </div>
                )}

                <section className="restoran-ponuda">
                    <div className="ponuda-card">
                        <div className="ponuda-naslov">
                            <h2 className="ponuda-naslov-jedan">
                                PAKETI U PONUDI RESTORANA
                            </h2>
                        </div>

                        {paketi.length === 0 ? (
                            <div className="restoran-empty">
                                Ovaj restoran trenutno nema aktivnih paketa.
                            </div>
                        ) : (
                            <>
                                <div className="paketi-izbor">
                                    {paketi.map((paket) => (
                                        <button
                                            key={paket.paketId}
                                            type="button"
                                            className={
                                                aktivanPaketId ===
                                                    paket.paketId
                                                    ? 'paket-dugme aktivan'
                                                    : 'paket-dugme'
                                            }
                                            onClick={() =>
                                                handlePaketClick(paket.paketId)
                                            }
                                        >
                                            {paket.naziv}
                                        </button>
                                    ))}
                                </div>

                                {aktivanPaket && (
                                    <div className="izabrani-paket">
                                        <h3>{aktivanPaket.naziv}</h3>

                                        {aktivanPaket.opis && (
                                            <p>{aktivanPaket.opis}</p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {aktivanPaket &&
                            detaljiLoading[aktivanPaketId] && (
                                <div className="restoran-info-message">
                                    Učitavanje ponude...
                                </div>
                            )}

                        {aktivanPaket &&
                            detaljiError[aktivanPaketId] && (
                                <div className="restoran-error-message">
                                    {detaljiError[aktivanPaketId]}
                                </div>
                            )}

                        {aktivanPaket &&
                            !detaljiLoading[aktivanPaketId] &&
                            !detaljiError[aktivanPaketId] && (
                                <>
                                    <div className="ponuda-divider" />

                                    <section className="sale-sekcija">
                                        <div className="ponuda-podnaslov">
                                            <span>Dostupni prostor</span>
                                            <h3>Sale</h3>
                                        </div>

                                        {saleAktivnogPaketa.length === 0 ? (
                                            <p className="restoran-empty-inner">
                                                Za ovaj paket nisu definisane sale.
                                            </p>
                                        ) : (
                                            <div className="sale-lista">
                                                {saleAktivnogPaketa.map(
                                                    (sala) => (
                                                        <div
                                                            key={sala.salaId}
                                                            className="sala-card"
                                                        >
                                                            <strong>
                                                                Sala {sala.rbrS}
                                                            </strong>

                                                            <div>
                                                                <span>
                                                                    Kapacitet
                                                                </span>

                                                                <b>
                                                                    {sala.kapacitet}{' '}
                                                                    gostiju
                                                                </b>
                                                            </div>

                                                            <div>
                                                                <span>
                                                                    Cena stolice
                                                                </span>

                                                                <b>
                                                                    {formatCena(
                                                                        sala.cenaStolice,
                                                                    )}
                                                                </b>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </section>

                                    <div className="ponuda-divider" />

                                    <section className="usluge-sekcija">
                                        <div className="ponuda-podnaslov">
                                            <span>Dodatna ponuda</span>
                                            <h3>Dodatne usluge</h3>
                                        </div>

                                        {uslugeAktivnogPaketa.length === 0 ? (
                                            <p className="restoran-empty-inner">
                                                Ovaj paket nema dodatnih usluga.
                                            </p>
                                        ) : (
                                            <>
                                                <div className="usluge-tabs">
                                                    {tipoviSaUslugama.map(
                                                        (tip) => (
                                                            <button
                                                                key={tip}
                                                                type="button"
                                                                className={
                                                                    prikazanTipUsluge ===
                                                                        tip
                                                                        ? 'usluga-tab aktivan'
                                                                        : 'usluga-tab'
                                                                }
                                                                onClick={() =>
                                                                    setAktivanTipUsluge(
                                                                        tip,
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    naziviTipovaUsluga[
                                                                    tip
                                                                    ]
                                                                }
                                                            </button>
                                                        ),
                                                    )}
                                                </div>

                                                <div className="usluge-lista">
                                                    {uslugeZaPrikaz.map(
                                                        (usluga) => (
                                                            <article
                                                                key={
                                                                    usluga.uslugaId
                                                                }
                                                                className="usluga-card"
                                                            >
                                                                <div className="usluga-header">
                                                                    <div>
                                                                        <h4>
                                                                            {
                                                                                usluga.naziv
                                                                            }
                                                                        </h4>

                                                                        {usluga.opis && (
                                                                            <p>
                                                                                {
                                                                                    usluga.opis
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    <strong className="usluga-cena">
                                                                        {formatCena(
                                                                            usluga.cena,
                                                                        )}
                                                                    </strong>
                                                                </div>

                                                                <div className="usluga-detalji">
                                                                    {usluga.telefon && (
                                                                        <span>
                                                                            Telefon:{' '}
                                                                            <strong>
                                                                                {
                                                                                    usluga.telefon
                                                                                }
                                                                            </strong>
                                                                        </span>
                                                                    )}

                                                                    {usluga.tipFoto && (
                                                                        <span>
                                                                            Vrsta fotografije:{' '}
                                                                            <strong>
                                                                                {formatEnumValue(
                                                                                    usluga.tipFoto,
                                                                                )}
                                                                            </strong>
                                                                        </span>
                                                                    )}

                                                                    {usluga.cenaFoto !=
                                                                        null && (
                                                                            <span>
                                                                                Cena fotografije:{' '}
                                                                                <strong>
                                                                                    {formatCena(
                                                                                        usluga.cenaFoto,
                                                                                    )}
                                                                                </strong>
                                                                            </span>
                                                                        )}

                                                                    {usluga.tipMuzicara && (
                                                                        <span>
                                                                            Izvođač:{' '}
                                                                            <strong>
                                                                                {formatEnumValue(
                                                                                    usluga.tipMuzicara,
                                                                                )}
                                                                            </strong>
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {usluga.portfolio && (
                                                                    <PortfolioPreview
                                                                        usluga={
                                                                            usluga
                                                                        }
                                                                    />
                                                                )}
                                                            </article>
                                                        ),
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </section>
                                </>
                            )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default RestoranDetaljiPage;