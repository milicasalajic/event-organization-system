import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getRestoranById } from '../api/restoranApi';

import {
    addCenaSale,
    addCenaUsluge,
    getCenovnikByRestoranId,
} from '../api/cenovnikApi';

import {
    getSaleByRestoranId,
} from '../api/salaApi';

import {
    getKeteringByRestoranId,
} from '../api/keteringApi';

import {
    getDekoraterskeFirmeByRestoranId,
} from '../api/dekoraterskaFirmaApi';

import {
    getFotografiByRestoranId,
} from '../api/fotografApi';

import {
    getMuzickiIzvodjaciByRestoranId,
} from '../api/muzickiIzvodjacApi';

import './CenovnikPage.css';

function getDanasnjiDatum() {
    const datum = new Date();

    const godina = datum.getFullYear();

    const mesec = String(
        datum.getMonth() + 1,
    ).padStart(2, '0');

    const dan = String(
        datum.getDate(),
    ).padStart(2, '0');

    return `${godina}-${mesec}-${dan}`;
}

function CenovnikPage() {
    const { restoranId } = useParams();
    const navigate = useNavigate();

    const korisnikJson =
        localStorage.getItem('korisnik');

    const korisnik = korisnikJson
        ? JSON.parse(korisnikJson)
        : null;

    const jeMenadzer =
        korisnik?.uloga === 'MENADZER';

    const [restoran, setRestoran] =
        useState(null);

    const [cenovnik, setCenovnik] =
        useState([]);

    const [sale, setSale] =
        useState([]);

    const [keteringFirme, setKeteringFirme] =
        useState([]);

    const [
        dekoraterskeFirme,
        setDekoraterskeFirme,
    ] = useState([]);

    const [fotografi, setFotografi] =
        useState([]);

    const [
        muzickiIzvodjaci,
        setMuzickiIzvodjaci,
    ] = useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState('');

    const [actionError, setActionError] =
        useState('');

    // =========================
    // PRVA CENA
    // =========================

    const [
        prikaziNovaCenaFormu,
        setPrikaziNovaCenaFormu,
    ] = useState(false);

    const [
        novaCenaFormData,
        setNovaCenaFormData,
    ] = useState({
        tipStavke: 'SALA',
        stavkaId: '',
        iznos: '',
        datumIzmene: '',
    });

    // =========================
    // PROMENA POSTOJEĆE CENE
    // =========================

    const [
        stavkaZaPromenu,
        setStavkaZaPromenu,
    ] = useState(null);

    const [
        promenaCenaFormData,
        setPromenaCenaFormData,
    ] = useState({
        iznos: '',
        datumIzmene: '',
    });

    // =========================
    // UČITAVANJE
    // =========================

    useEffect(() => {
        async function loadPage() {
            setIsLoading(true);
            setError('');

            try {
                if (jeMenadzer) {
                    const [
                        restoranResult,
                        cenovnikResult,
                        saleResult,
                        keteringResult,
                        dekoraterskeResult,
                        fotografiResult,
                        muzickiIzvodjaciResult,
                    ] = await Promise.all([
                        getRestoranById(
                            restoranId,
                        ),

                        getCenovnikByRestoranId(
                            restoranId,
                        ),

                        getSaleByRestoranId(
                            restoranId,
                        ),

                        getKeteringByRestoranId(
                            restoranId,
                        ),

                        getDekoraterskeFirmeByRestoranId(
                            restoranId,
                        ),

                        getFotografiByRestoranId(
                            restoranId,
                        ),

                        getMuzickiIzvodjaciByRestoranId(
                            restoranId,
                        ),
                    ]);

                    setRestoran(
                        restoranResult,
                    );

                    setCenovnik(
                        cenovnikResult,
                    );

                    setSale(
                        saleResult,
                    );

                    setKeteringFirme(
                        keteringResult,
                    );

                    setDekoraterskeFirme(
                        dekoraterskeResult,
                    );

                    setFotografi(
                        fotografiResult,
                    );

                    setMuzickiIzvodjaci(
                        muzickiIzvodjaciResult,
                    );
                } else {
                    const [
                        restoranResult,
                        cenovnikResult,
                    ] = await Promise.all([
                        getRestoranById(
                            restoranId,
                        ),

                        getCenovnikByRestoranId(
                            restoranId,
                        ),
                    ]);

                    setRestoran(
                        restoranResult,
                    );

                    setCenovnik(
                        cenovnikResult,
                    );
                }
            } catch (error) {
                setError(
                    error.message,
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadPage();
    }, [
        restoranId,
        jeMenadzer,
    ]);

    // =========================
    // POMOĆNE FUNKCIJE
    // =========================

    async function refreshCenovnik() {
        const result =
            await getCenovnikByRestoranId(
                restoranId,
            );

        setCenovnik(result);
    }

    function formatDatum(datum) {
        if (!datum) {
            return '-';
        }

        return new Date(
            datum,
        ).toLocaleDateString(
            'sr-RS',
        );
    }

    function formatVrsta(vrsta) {
        switch (vrsta) {
            case 'FOTOGRAF':
                return 'Fotograf';

            case 'KETERING':
                return 'Ketering';

            case 'DEKORATER':
            case 'DEKORATERSKA_FIRMA':
                return 'Dekoracija';

            case 'MUZICKI_IZVODJAC':
                return 'Muzički izvođač';

            case 'Cena stolice':
                return 'Cena stolice';

            default:
                return vrsta;
        }
    }

    function cenaJeBuduca(stavka) {
        if (stavka.vazeca) {
            return false;
        }

        const datumCene =
            new Date(
                stavka.datumIzmene,
            );

        const danas =
            new Date();

        danas.setHours(
            0,
            0,
            0,
            0,
        );

        return datumCene > danas;
    }

    // =========================
    // STAVKE ZA PRVU CENU
    // =========================

    const uslugeZaCenovnik = [
        ...keteringFirme.map(
            (usluga) => ({
                uslugaId:
                    usluga.uslugaId,

                naziv:
                    usluga.naziv,

                vrsta:
                    'Ketering',
            }),
        ),

        ...dekoraterskeFirme.map(
            (usluga) => ({
                uslugaId:
                    usluga.uslugaId,

                naziv:
                    usluga.naziv,

                vrsta:
                    'Dekoracija',
            }),
        ),

        ...fotografi.map(
            (usluga) => ({
                uslugaId:
                    usluga.uslugaId,

                naziv:
                    usluga.naziv,

                vrsta:
                    'Fotograf',
            }),
        ),

        ...muzickiIzvodjaci.map(
            (usluga) => ({
                uslugaId:
                    usluga.uslugaId,

                naziv:
                    usluga.naziv,

                vrsta:
                    'Muzički izvođač',
            }),
        ),
    ];

    const saleBezCene =
        sale.filter(
            (sala) =>
                !cenovnik.some(
                    (stavka) =>
                        Number(
                            stavka.salaId,
                        ) ===
                        Number(
                            sala.salaId,
                        ),
                ),
        );

    const uslugeBezCene =
        uslugeZaCenovnik.filter(
            (usluga) =>
                !cenovnik.some(
                    (stavka) =>
                        Number(
                            stavka.uslugaId,
                        ) ===
                        Number(
                            usluga.uslugaId,
                        ),
                ),
        );

    const postojeStavkeBezCene =
        saleBezCene.length > 0 ||
        uslugeBezCene.length > 0;

    // =========================
    // EVIDENTIRANJE PRVE CENE
    // =========================

    function handleEvidentirajCenu() {
        setActionError('');

        if (!postojeStavkeBezCene) {
            setActionError(
                'Sve sale i dodatne usluge već imaju evidentiranu cenu.',
            );

            return;
        }

        const pocetniTip =
            saleBezCene.length > 0
                ? 'SALA'
                : 'USLUGA';

        setNovaCenaFormData({
            tipStavke:
                pocetniTip,

            stavkaId:
                '',

            iznos:
                '',

            datumIzmene:
                getDanasnjiDatum(),
        });

        setPrikaziNovaCenaFormu(
            true,
        );
    }

    function handleNovaCenaChange(
        event,
    ) {
        const {
            name,
            value,
        } = event.target;

        setNovaCenaFormData(
            (prev) => ({
                ...prev,

                [name]:
                    value,

                ...(name ===
                    'tipStavke'
                    ? {
                        stavkaId:
                            '',
                    }
                    : {}),
            }),
        );
    }

    function handleOdustaniNovaCena() {
        if (isSaving) {
            return;
        }

        setPrikaziNovaCenaFormu(
            false,
        );

        setActionError('');
    }

    async function handleNovaCenaSubmit(
        event,
    ) {
        event.preventDefault();

        if (
            !novaCenaFormData.stavkaId
        ) {
            setActionError(
                'Izaberite salu ili dodatnu uslugu.',
            );

            return;
        }

        const data = {
            iznos:
                Number(
                    novaCenaFormData.iznos,
                ),

            datumIzmene:
                novaCenaFormData.datumIzmene,
        };

        setIsSaving(true);
        setActionError('');

        try {
            if (
                novaCenaFormData
                    .tipStavke ===
                'SALA'
            ) {
                await addCenaSale(
                    restoranId,

                    Number(
                        novaCenaFormData
                            .stavkaId,
                    ),

                    data,
                );
            } else {
                await addCenaUsluge(
                    restoranId,

                    Number(
                        novaCenaFormData
                            .stavkaId,
                    ),

                    data,
                );
            }

            await refreshCenovnik();

            setPrikaziNovaCenaFormu(
                false,
            );
        } catch (error) {
            setActionError(
                error.message,
            );
        } finally {
            setIsSaving(false);
        }
    }

    // =========================
    // PROMENA CENE
    // =========================

    function handlePromeniCenu(
        stavka,
    ) {
        setActionError('');

        setStavkaZaPromenu(
            stavka,
        );

        setPromenaCenaFormData({
            iznos:
                '',

            datumIzmene:
                getDanasnjiDatum(),
        });
    }

    function handlePromenaCenaChange(
        event,
    ) {
        const {
            name,
            value,
        } = event.target;

        setPromenaCenaFormData(
            (prev) => ({
                ...prev,
                [name]:
                    value,
            }),
        );
    }

    function handleOdustaniPromenaCena() {
        if (isSaving) {
            return;
        }

        setStavkaZaPromenu(
            null,
        );

        setActionError('');
    }

    async function handlePromenaCenaSubmit(
        event,
    ) {
        event.preventDefault();

        if (!stavkaZaPromenu) {
            return;
        }

        const data = {
            iznos:
                Number(
                    promenaCenaFormData.iznos,
                ),

            datumIzmene:
                promenaCenaFormData.datumIzmene,
        };

        setIsSaving(true);
        setActionError('');

        try {
            if (
                stavkaZaPromenu.salaId
            ) {
                await addCenaSale(
                    restoranId,

                    stavkaZaPromenu.salaId,

                    data,
                );
            } else {
                await addCenaUsluge(
                    restoranId,

                    stavkaZaPromenu.uslugaId,

                    data,
                );
            }

            await refreshCenovnik();

            setStavkaZaPromenu(
                null,
            );
        } catch (error) {
            setActionError(
                error.message,
            );
        } finally {
            setIsSaving(false);
        }
    }

    // =========================
    // LOADING / ERROR
    // =========================

    if (isLoading) {
        return (
            <div className="cenovnik-page">
                <div className="cenovnik-state">
                    Učitavanje cenovnika...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cenovnik-page">
                <div className="cenovnik-state cenovnik-state-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="cenovnik-page">
            <main className="cenovnik-container">
                <button
                    type="button"
                    className="cenovnik-nazad-button"
                    onClick={() =>
                        navigate(
                            `/restorani/${restoranId}`,
                        )
                    }
                >
                    ← Nazad na restoran
                </button>

                <div className="cenovnik-header-row">
                    <div className="cenovnik-header">
                        <span>
                            Cenovnik restorana
                        </span>

                        <h1>
                            {restoran?.naziv}
                        </h1>

                        <p>
                            Pregled trenutnih i
                            prethodnih cena sala i
                            dodatnih usluga.
                        </p>
                    </div>

                    {jeMenadzer && (
                        <button
                            type="button"
                            className="cenovnik-primary-button"
                            onClick={
                                handleEvidentirajCenu
                            }
                        >
                            + Evidentiraj cenu
                        </button>
                    )}
                </div>

                {actionError &&
                    !prikaziNovaCenaFormu &&
                    !stavkaZaPromenu && (
                        <div className="cenovnik-action-error">
                            {actionError}
                        </div>
                    )}

                {cenovnik.length === 0 ? (
                    <div className="cenovnik-empty">
                        <h2>
                            Cenovnik je prazan
                        </h2>

                        <p>
                            Trenutno nema
                            evidentiranih cena za
                            ovaj restoran.
                        </p>
                    </div>
                ) : (
                    <div className="cenovnik-table-wrapper">
                        <table className="cenovnik-table">
                            <thead>
                                <tr>
                                    <th>
                                        Stavka
                                    </th>

                                    <th>
                                        Vrsta
                                    </th>

                                    <th>
                                        Cena
                                    </th>

                                    <th>
                                        Datum početka
                                        važenja
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    {jeMenadzer && (
                                        <th>
                                            Akcija
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {cenovnik.map(
                                    (stavka) => {
                                        const buduca =
                                            cenaJeBuduca(
                                                stavka,
                                            );

                                        return (
                                            <tr
                                                key={
                                                    stavka.cenovnikId
                                                }
                                                className={
                                                    stavka.vazeca
                                                        ? 'cenovnik-vazeca-row'
                                                        : buduca
                                                            ? 'cenovnik-buduca-row'
                                                            : ''
                                                }
                                            >
                                                <td>
                                                    <strong>
                                                        {
                                                            stavka.naziv
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {formatVrsta(
                                                        stavka.vrsta,
                                                    )}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {Number(
                                                            stavka.iznos,
                                                        ).toLocaleString(
                                                            'sr-RS',
                                                        )}{' '}
                                                        RSD
                                                    </strong>
                                                </td>

                                                <td>
                                                    {formatDatum(
                                                        stavka.datumIzmene,
                                                    )}
                                                </td>

                                                <td>
                                                    {stavka.vazeca ? (
                                                        <span className="cenovnik-vazeca-badge">
                                                            Važeća
                                                        </span>
                                                    ) : buduca ? (
                                                        <span className="cenovnik-buduca-badge">
                                                            Buduća
                                                        </span>
                                                    ) : (
                                                        <span className="cenovnik-istorijska-label">
                                                            Istorijska
                                                        </span>
                                                    )}
                                                </td>

                                                {jeMenadzer && (
                                                    <td>
                                                        {stavka.vazeca && (
                                                            <button
                                                                type="button"
                                                                className="cenovnik-promeni-button"
                                                                onClick={() =>
                                                                    handlePromeniCenu(
                                                                        stavka,
                                                                    )
                                                                }
                                                            >
                                                                Promeni cenu
                                                            </button>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* =========================
                MODAL - PRVA CENA
            ========================= */}

            {prikaziNovaCenaFormu && (
                <div className="cenovnik-modal-overlay">
                    <form
                        className="cenovnik-modal"
                        onSubmit={
                            handleNovaCenaSubmit
                        }
                    >
                        <div className="cenovnik-modal-header">
                            <span>
                                Cenovnik
                            </span>

                            <h2>
                                Evidentiranje cene
                            </h2>

                            <p>
                                Izaberite salu ili
                                dodatnu uslugu za koju
                                cena još nije
                                evidentirana.
                            </p>
                        </div>

                        {actionError && (
                            <div className="cenovnik-action-error">
                                {actionError}
                            </div>
                        )}

                        <div className="cenovnik-field">
                            <label htmlFor="tipStavke">
                                Vrsta stavke
                            </label>

                            <select
                                id="tipStavke"
                                name="tipStavke"
                                value={
                                    novaCenaFormData.tipStavke
                                }
                                onChange={
                                    handleNovaCenaChange
                                }
                            >
                                {saleBezCene.length >
                                    0 && (
                                        <option value="SALA">
                                            Sala
                                        </option>
                                    )}

                                {uslugeBezCene.length >
                                    0 && (
                                        <option value="USLUGA">
                                            Dodatna usluga
                                        </option>
                                    )}
                            </select>
                        </div>

                        <div className="cenovnik-field">
                            <label htmlFor="stavkaId">
                                {novaCenaFormData
                                    .tipStavke ===
                                    'SALA'
                                    ? 'Sala'
                                    : 'Dodatna usluga'}
                            </label>

                            <select
                                id="stavkaId"
                                name="stavkaId"
                                value={
                                    novaCenaFormData.stavkaId
                                }
                                onChange={
                                    handleNovaCenaChange
                                }
                                required
                            >
                                <option value="">
                                    Izaberite
                                </option>

                                {novaCenaFormData
                                    .tipStavke ===
                                    'SALA'
                                    ? saleBezCene.map(
                                        (
                                            sala,
                                        ) => (
                                            <option
                                                key={
                                                    sala.salaId
                                                }
                                                value={
                                                    sala.salaId
                                                }
                                            >
                                                Sala{' '}
                                                {
                                                    sala.rbrS
                                                }
                                            </option>
                                        ),
                                    )
                                    : uslugeBezCene.map(
                                        (
                                            usluga,
                                        ) => (
                                            <option
                                                key={
                                                    usluga.uslugaId
                                                }
                                                value={
                                                    usluga.uslugaId
                                                }
                                            >
                                                {
                                                    usluga.naziv
                                                }{' '}
                                                -{' '}
                                                {
                                                    usluga.vrsta
                                                }
                                            </option>
                                        ),
                                    )}
                            </select>
                        </div>

                        <div className="cenovnik-field">
                            <label htmlFor="novaCenaIznos">
                                Cena
                            </label>

                            <input
                                id="novaCenaIznos"
                                name="iznos"
                                type="number"
                                min="1"
                                max="99999"
                                step="1"
                                value={
                                    novaCenaFormData.iznos
                                }
                                onChange={
                                    handleNovaCenaChange
                                }
                                required
                            />
                        </div>

                        <div className="cenovnik-field">
                            <label htmlFor="novaCenaDatum">
                                Datum početka
                                važenja
                            </label>

                            <input
                                id="novaCenaDatum"
                                name="datumIzmene"
                                type="date"
                                value={
                                    novaCenaFormData.datumIzmene
                                }
                                onChange={
                                    handleNovaCenaChange
                                }
                                required
                            />
                        </div>

                        <div className="cenovnik-modal-actions">
                            <button
                                type="button"
                                className="cenovnik-secondary-button"
                                disabled={
                                    isSaving
                                }
                                onClick={
                                    handleOdustaniNovaCena
                                }
                            >
                                Odustani
                            </button>

                            <button
                                type="submit"
                                className="cenovnik-primary-button"
                                disabled={
                                    isSaving
                                }
                            >
                                {isSaving
                                    ? 'Čuvanje...'
                                    : 'Evidentiraj cenu'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* =========================
                MODAL - PROMENA CENE
            ========================= */}

            {stavkaZaPromenu && (
                <div className="cenovnik-modal-overlay">
                    <form
                        className="cenovnik-modal"
                        onSubmit={
                            handlePromenaCenaSubmit
                        }
                    >
                        <div className="cenovnik-modal-header">
                            <span>
                                Promena cene
                            </span>

                            <h2>
                                {
                                    stavkaZaPromenu.naziv
                                }
                            </h2>

                            <p>
                                Evidentiranjem nove
                                cene prethodna cena
                                ostaje sačuvana u
                                istoriji.
                            </p>
                        </div>

                        <div className="cenovnik-trenutna-cena">
                            <span>
                                Trenutna cena
                            </span>

                            <strong>
                                {Number(
                                    stavkaZaPromenu.iznos,
                                ).toLocaleString(
                                    'sr-RS',
                                )}{' '}
                                RSD
                            </strong>
                        </div>

                        {actionError && (
                            <div className="cenovnik-action-error">
                                {actionError}
                            </div>
                        )}

                        <div className="cenovnik-field">
                            <label htmlFor="promenaCenaIznos">
                                Nova cena
                            </label>

                            <input
                                id="promenaCenaIznos"
                                name="iznos"
                                type="number"
                                min="1"
                                max="99999"
                                step="1"
                                value={
                                    promenaCenaFormData.iznos
                                }
                                onChange={
                                    handlePromenaCenaChange
                                }
                                required
                            />
                        </div>

                        <div className="cenovnik-field">
                            <label htmlFor="promenaCenaDatum">
                                Datum početka
                                važenja
                            </label>

                            <input
                                id="promenaCenaDatum"
                                name="datumIzmene"
                                type="date"
                                value={
                                    promenaCenaFormData.datumIzmene
                                }
                                onChange={
                                    handlePromenaCenaChange
                                }
                                required
                            />
                        </div>

                        <div className="cenovnik-modal-actions">
                            <button
                                type="button"
                                className="cenovnik-secondary-button"
                                disabled={
                                    isSaving
                                }
                                onClick={
                                    handleOdustaniPromenaCena
                                }
                            >
                                Odustani
                            </button>

                            <button
                                type="submit"
                                className="cenovnik-primary-button"
                                disabled={
                                    isSaving
                                }
                            >
                                {isSaving
                                    ? 'Čuvanje...'
                                    : 'Sačuvaj novu cenu'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default CenovnikPage;