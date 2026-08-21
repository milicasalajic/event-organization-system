import { useEffect, useState } from 'react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
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

function grupisiUslugePoTipu(usluge) {
    const grupe = {
        FOTOGRAF: [],
        KETERING: [],
        DEKORATER: [],
        MUZICKI_IZVODJAC: [],
    };

    usluge.forEach((usluga) => {
        if (grupe[usluga.tipUsluge]) {
            grupe[usluga.tipUsluge].push(
                usluga,
            );
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
        .replace(
            /\b\w/g,
            (slovo) =>
                slovo.toUpperCase(),
        );
}

function getLinkTekst(tipUsluge) {
    switch (tipUsluge) {
        case 'FOTOGRAF':
            return 'Pogledaj radove';

        case 'DEKORATER':
            return 'Pogledaj dekoracije';

        case 'KETERING':
            return 'Pogledaj ponudu';

        case 'MUZICKI_IZVODJAC':
            return 'Pogledaj nastupe';

        default:
            return 'Više informacija';
    }
}

function RestoranDetaljiPage() {
    const { restoranId } = useParams();
    const navigate = useNavigate();

    const korisnikJson =
        localStorage.getItem(
            'korisnik',
        );

    const korisnik =
        korisnikJson
            ? JSON.parse(
                korisnikJson,
            )
            : null;

    const jeRadnik =
        korisnik?.uloga ===
        'MENADZER' ||
        korisnik?.uloga ===
        'OPERATER';

    const jeMenadzer =
        korisnik?.uloga ===
        'MENADZER';

    const [restoran, setRestoran] =
        useState(null);

    const [paketi, setPaketi] =
        useState([]);

    const [
        aktivanPaketId,
        setAktivanPaketId,
    ] = useState(null);

    const [
        aktivanTipUsluge,
        setAktivanTipUsluge,
    ] = useState(null);

    const [
        salePoPaketu,
        setSalePoPaketu,
    ] = useState({});

    const [
        uslugePoPaketu,
        setUslugePoPaketu,
    ] = useState({});

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [error, setError] =
        useState('');

    const [
        detaljiLoading,
        setDetaljiLoading,
    ] = useState({});

    const [
        detaljiError,
        setDetaljiError,
    ] = useState({});

    useEffect(() => {
        async function loadPage() {
            setIsLoading(true);
            setError('');

            try {
                const [
                    restoranResult,
                    paketiResult,
                ] =
                    await Promise.all([
                        getRestoranById(
                            restoranId,
                        ),
                        getPaketiByRestoranId(
                            restoranId,
                        ),
                    ]);

                setRestoran(
                    restoranResult,
                );

                setPaketi(
                    paketiResult,
                );

                if (
                    paketiResult.length >
                    0
                ) {
                    const prviPaketId =
                        paketiResult[0]
                            .paketId;

                    setAktivanPaketId(
                        prviPaketId,
                    );

                    await loadPaketDetalje(
                        prviPaketId,
                    );
                }
            } catch (error) {
                setError(
                    error.message,
                );
            } finally {
                setIsLoading(
                    false,
                );
            }
        }

        loadPage();
    }, [restoranId]);

    async function loadPaketDetalje(
        paketId,
    ) {
        if (
            salePoPaketu[
            paketId
            ] !== undefined &&
            uslugePoPaketu[
            paketId
            ] !== undefined
        ) {
            return;
        }

        setDetaljiLoading(
            (prev) => ({
                ...prev,
                [paketId]: true,
            }),
        );

        setDetaljiError(
            (prev) => ({
                ...prev,
                [paketId]: '',
            }),
        );

        try {
            const [
                saleResult,
                uslugeResult,
            ] =
                await Promise.all([
                    getSaleByPaketId(
                        restoranId,
                        paketId,
                    ),
                    getUslugeByPaketId(
                        restoranId,
                        paketId,
                    ),
                ]);

            setSalePoPaketu(
                (prev) => ({
                    ...prev,
                    [paketId]:
                        saleResult,
                }),
            );

            setUslugePoPaketu(
                (prev) => ({
                    ...prev,
                    [paketId]:
                        uslugeResult,
                }),
            );
        } catch (error) {
            setDetaljiError(
                (prev) => ({
                    ...prev,
                    [paketId]:
                        error.message,
                }),
            );
        } finally {
            setDetaljiLoading(
                (prev) => ({
                    ...prev,
                    [paketId]:
                        false,
                }),
            );
        }
    }

    async function handlePaketClick(
        paketId,
    ) {
        setAktivanPaketId(
            paketId,
        );

        setAktivanTipUsluge(
            null,
        );

        await loadPaketDetalje(
            paketId,
        );
    }

    if (isLoading) {
        return (
            <div className="restoran-detalji-page">
                <div className="page-state">
                    Učitavanje
                    restorana...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="restoran-detalji-page">
                <div className="page-state page-state-error">
                    {error}
                </div>
            </div>
        );
    }

    const aktivanPaket =
        paketi.find(
            (paket) =>
                paket.paketId ===
                aktivanPaketId,
        );

    const saleAktivnogPaketa =
        salePoPaketu[
        aktivanPaketId
        ] ?? [];

    const uslugeAktivnogPaketa =
        uslugePoPaketu[
        aktivanPaketId
        ] ?? [];

    const grupisaneUsluge =
        grupisiUslugePoTipu(
            uslugeAktivnogPaketa,
        );

    const tipoviSaUslugama =
        redosledTipovaUsluga.filter(
            (tip) =>
                grupisaneUsluge[
                    tip
                ].length > 0,
        );

    const prikazanTipUsluge =
        aktivanTipUsluge &&
            tipoviSaUslugama.includes(
                aktivanTipUsluge,
            )
            ? aktivanTipUsluge
            : tipoviSaUslugama[0];

    const uslugeZaPrikaz =
        prikazanTipUsluge
            ? grupisaneUsluge[
            prikazanTipUsluge
            ]
            : [];

    return (
        <div className="restoran-detalji-page">
            <main className="restoran-detalji-container">

                <section className="restoran-hero">
                    <div className="restoran-hero-naslov">
                        <span className="restoran-kicker">
                            Restoran
                        </span>

                        <h1>
                            {
                                restoran.naziv
                            }
                        </h1>
                    </div>

                    <div className="restoran-meta">
                        <div className="restoran-meta-item">
                            <span>
                                Adresa
                            </span>

                            <strong>
                                {
                                    restoran.adresa
                                }
                            </strong>
                        </div>

                        <div className="restoran-meta-item">
                            <span>
                                Grad
                            </span>

                            <strong>
                                {
                                    restoran.grad
                                }
                            </strong>
                        </div>

                        <div className="restoran-meta-item">
                            <span>
                                Telefon
                            </span>

                            <strong>
                                {
                                    restoran.telefon
                                }
                            </strong>
                        </div>
                    </div>
                </section>

                {jeRadnik && (
                    <div className="restoran-radnik-akcije">

                        <button
                            type="button"
                            className="rezervacije-button"
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
                                className="upravljanje-ponudom-button"
                                onClick={() =>
                                    navigate(
                                        `/restorani/${restoranId}/upravljanje-ponudom`,
                                    )
                                }
                            >
                                Upravljanje ponudom
                            </button>
                        )}
                    </div>
                )}

                <section className="paketi-sekcija">

                    <div className="section-heading">

                        <div>
                            <span className="section-kicker">
                                Ponuda restorana
                            </span>

                            <h2>
                                Izaberite paket
                            </h2>
                        </div>

                        <span className="section-count">
                            {paketi.length}{' '}
                            {paketi.length ===
                                1
                                ? 'paket'
                                : 'paketa'}
                        </span>

                    </div>

                    {paketi.length ===
                        0 ? (
                        <div className="empty-state">
                            Ovaj restoran
                            trenutno nema
                            pakete u ponudi.
                        </div>
                    ) : (
                        <div className="paketi-grid">

                            {paketi.map(
                                (paket) => (
                                    <button
                                        key={
                                            paket.paketId
                                        }
                                        type="button"
                                        className={
                                            aktivanPaketId ===
                                                paket.paketId
                                                ? 'paket-option aktivan'
                                                : 'paket-option'
                                        }
                                        onClick={() =>
                                            handlePaketClick(
                                                paket.paketId,
                                            )
                                        }
                                    >
                                        <div className="paket-option-top">

                                            <h3>
                                                {
                                                    paket.naziv
                                                }
                                            </h3>

                                        </div>

                                        <p>
                                            {paket.opis ||
                                                'Pogledajte sale i dodatne usluge ovog paketa.'}
                                        </p>

                                        <span className="paket-pregled">
                                            Pogledaj paket
                                        </span>

                                    </button>
                                ),
                            )}

                        </div>
                    )}

                </section>

                {aktivanPaket && (
                    <section className="paket-detalji-panel">

                        <div className="paket-detalji-header">

                            <div>
                                <span className="section-kicker">
                                    Izabrani paket
                                </span>

                                <h2>
                                    {
                                        aktivanPaket.naziv
                                    }
                                </h2>
                            </div>

                            {aktivanPaket.opis && (
                                <p>
                                    {
                                        aktivanPaket.opis
                                    }
                                </p>
                            )}

                        </div>

                        {detaljiLoading[
                            aktivanPaketId
                        ] && (
                                <div className="detalji-loading">
                                    Učitavanje
                                    detalja paketa...
                                </div>
                            )}

                        {detaljiError[
                            aktivanPaketId
                        ] && (
                                <div className="detalji-error">
                                    {
                                        detaljiError[
                                        aktivanPaketId
                                        ]
                                    }
                                </div>
                            )}

                        {!detaljiLoading[
                            aktivanPaketId
                        ] &&
                            !detaljiError[
                            aktivanPaketId
                            ] && (
                                <>
                                    <div className="sale-blok">

                                        <div className="subsection-heading">

                                            <div>
                                                <h3>
                                                    Dostupne
                                                    sale
                                                </h3>

                                                <p>
                                                    Sale koje
                                                    možete
                                                    izabrati uz
                                                    ovaj paket.
                                                </p>
                                            </div>

                                            <span className="subsection-count">
                                                {
                                                    saleAktivnogPaketa.length
                                                }
                                            </span>

                                        </div>

                                        {saleAktivnogPaketa.length ===
                                            0 ? (
                                            <div className="empty-inline">
                                                Paket
                                                trenutno nema
                                                dostupnih
                                                sala.
                                            </div>
                                        ) : (
                                            <div className="sale-grid">

                                                {saleAktivnogPaketa.map(
                                                    (
                                                        sala,
                                                    ) => (
                                                        <div
                                                            className="sala-item"
                                                            key={
                                                                sala.salaId
                                                            }
                                                        >
                                                            <div>
                                                                <strong>
                                                                    Sala{' '}
                                                                    {
                                                                        sala.rbrS
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    Kapacitet
                                                                </span>
                                                            </div>

                                                            <b>
                                                                {
                                                                    sala.kapacitet
                                                                }
                                                            </b>
                                                        </div>
                                                    ),
                                                )}

                                            </div>
                                        )}

                                    </div>

                                    <div className="usluge-blok">

                                        <div className="subsection-heading">

                                            <div>
                                                <h3>
                                                    Dodatne
                                                    usluge
                                                </h3>

                                                <p>
                                                    Izaberite
                                                    kategoriju
                                                    i pogledajte
                                                    dostupne
                                                    pružaoce
                                                    usluga.
                                                </p>
                                            </div>

                                            <span className="subsection-count">
                                                {
                                                    uslugeAktivnogPaketa.length
                                                }
                                            </span>

                                        </div>

                                        {uslugeAktivnogPaketa.length ===
                                            0 ? (
                                            <div className="empty-inline">
                                                Paket
                                                trenutno nema
                                                dodatnih
                                                usluga.
                                            </div>
                                        ) : (
                                            <>
                                                <div className="usluge-tabs">

                                                    {tipoviSaUslugama.map(
                                                        (
                                                            tip,
                                                        ) => (
                                                            <button
                                                                key={
                                                                    tip
                                                                }
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

                                                                <span>
                                                                    {
                                                                        grupisaneUsluge[
                                                                            tip
                                                                        ]
                                                                            .length
                                                                    }
                                                                </span>
                                                            </button>
                                                        ),
                                                    )}

                                                </div>

                                                <div className="usluge-lista-nova">

                                                    {uslugeZaPrikaz.map(
                                                        (
                                                            usluga,
                                                        ) => (
                                                            <article
                                                                className="usluga-red"
                                                                key={
                                                                    usluga.uslugaId
                                                                }
                                                            >

                                                                <div className="usluga-red-main">

                                                                    <div className="usluga-tekst">

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

                                                                    {usluga.portfolio && (
                                                                        <a
                                                                            href={
                                                                                usluga.portfolio
                                                                            }
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="portfolio-link"
                                                                        >
                                                                            <span>
                                                                                {getLinkTekst(
                                                                                    usluga.tipUsluge,
                                                                                )}
                                                                            </span>

                                                                            <span className="portfolio-link-icon">
                                                                                ↗
                                                                            </span>
                                                                        </a>
                                                                    )}

                                                                </div>

                                                                <div className="usluga-meta">

                                                                    {usluga.telefon && (
                                                                        <div>
                                                                            <span>
                                                                                Telefon
                                                                            </span>

                                                                            <strong>
                                                                                {
                                                                                    usluga.telefon
                                                                                }
                                                                            </strong>
                                                                        </div>
                                                                    )}

                                                                    {usluga.tipFoto && (
                                                                        <div>
                                                                            <span>
                                                                                Vrsta
                                                                                usluge
                                                                            </span>

                                                                            <strong>
                                                                                {formatEnumValue(
                                                                                    usluga.tipFoto,
                                                                                )}
                                                                            </strong>
                                                                        </div>
                                                                    )}

                                                                    {usluga.cenaFoto !=
                                                                        null && (
                                                                            <div>
                                                                                <span>
                                                                                    Cena
                                                                                </span>

                                                                                <strong>
                                                                                    {
                                                                                        usluga.cenaFoto
                                                                                    }
                                                                                </strong>
                                                                            </div>
                                                                        )}

                                                                    {usluga.tipMuzicara && (
                                                                        <div>
                                                                            <span>
                                                                                Vrsta
                                                                                izvođača
                                                                            </span>

                                                                            <strong>
                                                                                {formatEnumValue(
                                                                                    usluga.tipMuzicara,
                                                                                )}
                                                                            </strong>
                                                                        </div>
                                                                    )}

                                                                </div>

                                                            </article>
                                                        ),
                                                    )}

                                                </div>
                                            </>
                                        )}

                                    </div>
                                </>
                            )}

                    </section>
                )}

            </main>
        </div>
    );
}

export default RestoranDetaljiPage;