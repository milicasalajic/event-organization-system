import {
    Fragment,
    useEffect,
    useState,
} from 'react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
import { getRestoranById } from '../api/restoranApi';
import {
    getRezervacijeByRestoranId,
    getRezervacijaDetalji,
    obradiRezervaciju,
} from '../api/PregledRezervacijaApi';
import './RezervacijeRestoranaPage.css';

function formatDatum(value) {
    if (!value) {
        return '-';
    }

    return new Date(value)
        .toLocaleDateString('sr-RS');
}

function formatVreme(value) {
    if (!value) {
        return '-';
    }

    return new Date(value)
        .toLocaleTimeString(
            'sr-RS',
            {
                hour: '2-digit',
                minute: '2-digit',
            },
        );
}

function formatDatumIVreme(value) {
    if (!value) {
        return '-';
    }

    const datum = new Date(value);

    return datum.toLocaleString(
        'sr-RS',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        },
    );
}

function formatEnumValue(value) {
    if (!value) {
        return '-';
    }

    return value
        .toLowerCase()
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (slovo) =>
            slovo.toUpperCase(),
        );
}

function getStatusClass(status) {
    if (!status) {
        return '';
    }

    return status
        .toLowerCase()
        .replaceAll('_', '-');
}

function PregledRezervacijaRestoranaPage() {
    const { restoranId } = useParams();
    const navigate = useNavigate();

    const [restoran, setRestoran] =
        useState(null);

    const [rezervacije, setRezervacije] =
        useState([]);

    const [
        aktivnaRezervacijaId,
        setAktivnaRezervacijaId,
    ] = useState(null);

    const [
        detaljiPoRezervaciji,
        setDetaljiPoRezervaciji,
    ] = useState({});

    const [
        detaljiLoading,
        setDetaljiLoading,
    ] = useState({});

    const [
        detaljiError,
        setDetaljiError,
    ] = useState({});

    const [
        otvorenaObradaId,
        setOtvorenaObradaId,
    ] = useState(null);

    const [
        obradaLoadingId,
        setObradaLoadingId,
    ] = useState(null);

    const [
        obradaError,
        setObradaError,
    ] = useState({});

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    useEffect(() => {
        async function loadPage() {
            setIsLoading(true);
            setError('');

            try {
                const [
                    restoranResult,
                    rezervacijeResult,
                ] = await Promise.all([
                    getRestoranById(
                        restoranId,
                    ),
                    getRezervacijeByRestoranId(
                        restoranId,
                    ),
                ]);

                setRestoran(
                    restoranResult,
                );

                setRezervacije(
                    rezervacijeResult,
                );
            } catch (error) {
                setError(
                    error.message,
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadPage();
    }, [restoranId]);

    async function handleRezervacijaClick(
        rezervacijaId,
    ) {
        if (
            aktivnaRezervacijaId ===
            rezervacijaId
        ) {
            setAktivnaRezervacijaId(null);
            setOtvorenaObradaId(null);
            return;
        }

        setAktivnaRezervacijaId(
            rezervacijaId,
        );

        setOtvorenaObradaId(null);

        if (
            detaljiPoRezervaciji[
            rezervacijaId
            ]
        ) {
            return;
        }

        setDetaljiLoading(
            (prev) => ({
                ...prev,
                [rezervacijaId]: true,
            }),
        );

        setDetaljiError(
            (prev) => ({
                ...prev,
                [rezervacijaId]: '',
            }),
        );

        try {
            const detalji =
                await getRezervacijaDetalji(
                    restoranId,
                    rezervacijaId,
                );

            setDetaljiPoRezervaciji(
                (prev) => ({
                    ...prev,
                    [rezervacijaId]:
                        detalji,
                }),
            );
        } catch (error) {
            setDetaljiError(
                (prev) => ({
                    ...prev,
                    [rezervacijaId]:
                        error.message,
                }),
            );
        } finally {
            setDetaljiLoading(
                (prev) => ({
                    ...prev,
                    [rezervacijaId]:
                        false,
                }),
            );
        }
    }

    async function handlePromenaStatusa(
        rezervacijaId,
        noviStatus,
    ) {
        setObradaLoadingId(
            rezervacijaId,
        );

        setObradaError(
            (prev) => ({
                ...prev,
                [rezervacijaId]: '',
            }),
        );

        try {
            const rezultat =
                await obradiRezervaciju(
                    restoranId,
                    rezervacijaId,
                    noviStatus,
                );

            setDetaljiPoRezervaciji(
                (prev) => ({
                    ...prev,
                    [rezervacijaId]:
                        rezultat,
                }),
            );

            setRezervacije(
                (prev) =>
                    prev.map(
                        (rezervacija) =>
                            rezervacija.rezervacijaId ===
                                rezervacijaId
                                ? {
                                    ...rezervacija,
                                    status:
                                        rezultat.status,
                                }
                                : rezervacija,
                    ),
            );

            setOtvorenaObradaId(null);
        } catch (error) {
            setObradaError(
                (prev) => ({
                    ...prev,
                    [rezervacijaId]:
                        error.message,
                }),
            );
        } finally {
            setObradaLoadingId(null);
        }
    }

    if (isLoading) {
        return (
            <div className="pregled-rezervacija-page">
                <div className="rezervacije-state">
                    Učitavanje rezervacija...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pregled-rezervacija-page">
                <div className="rezervacije-state rezervacije-state-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="pregled-rezervacija-page">
            <main className="pregled-rezervacija-container">

                <button
                    type="button"
                    className="nazad-button"
                    onClick={() =>
                        navigate(
                            `/restorani/${restoranId}`,
                        )
                    }
                >
                    ← Nazad na restoran
                </button>

                <div className="rezervacije-heading">
                    <div>
                        <span className="rezervacije-kicker">
                            Pregled rezervacija
                        </span>

                        <h1>
                            {restoran?.naziv}
                        </h1>

                        <p>
                            Pregled svih rezervacija
                            koje pripadaju ovom restoranu.
                        </p>
                    </div>
                </div>

                {rezervacije.length === 0 ? (
                    <div className="rezervacije-empty">
                        <h2>
                            Trenutno nema rezervacija
                        </h2>

                        <p>
                            Za ovaj restoran još uvek
                            nije evidentirana nijedna
                            rezervacija.
                        </p>
                    </div>
                ) : (
                    <div className="rezervacije-table-wrapper">
                        <table className="rezervacije-table">
                            <thead>
                                <tr>
                                    <th>Datum</th>
                                    <th>Vreme</th>
                                    <th>Tip događaja</th>
                                    <th>Broj gostiju</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rezervacije.map(
                                    (rezervacija) => {
                                        const jeOtvorena =
                                            aktivnaRezervacijaId ===
                                            rezervacija.rezervacijaId;

                                        const detalji =
                                            detaljiPoRezervaciji[
                                            rezervacija
                                                .rezervacijaId
                                            ];

                                        const obradaUToku =
                                            obradaLoadingId ===
                                            rezervacija.rezervacijaId;

                                        return (
                                            <Fragment
                                                key={
                                                    rezervacija.rezervacijaId
                                                }
                                            >
                                                <tr
                                                    className={
                                                        jeOtvorena
                                                            ? 'rezervacija-red aktivan'
                                                            : 'rezervacija-red'
                                                    }
                                                    onClick={() =>
                                                        handleRezervacijaClick(
                                                            rezervacija.rezervacijaId,
                                                        )
                                                    }
                                                >
                                                    <td
                                                        data-label="Datum"
                                                        className="datum-cell"
                                                    >
                                                        {formatDatum(
                                                            rezervacija.vremePocetka,
                                                        )}
                                                    </td>

                                                    <td data-label="Vreme">
                                                        <span className="vreme-rezervacije">
                                                            {formatVreme(
                                                                rezervacija.vremePocetka,
                                                            )}

                                                            <span>–</span>

                                                            {formatVreme(
                                                                rezervacija.vremeZavrsetka,
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td data-label="Tip događaja">
                                                        <div className="tipovi-dogadjaja">
                                                            {rezervacija
                                                                .tipoviDogadjaja
                                                                ?.length >
                                                                0 ? (
                                                                rezervacija.tipoviDogadjaja.map(
                                                                    (
                                                                        tip,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                tip
                                                                            }
                                                                            className="tip-dogadjaja"
                                                                        >
                                                                            {formatEnumValue(
                                                                                tip,
                                                                            )}
                                                                        </span>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <span>
                                                                    -
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td
                                                        data-label="Broj gostiju"
                                                        className="gosti-cell"
                                                    >
                                                        {
                                                            rezervacija.brGostiju
                                                        }
                                                    </td>

                                                    <td data-label="Status">
                                                        <div className="status-cell">
                                                            <span
                                                                className={`status-badge status-${getStatusClass(
                                                                    rezervacija.status,
                                                                )}`}
                                                            >
                                                                {formatEnumValue(
                                                                    rezervacija.status,
                                                                )}
                                                            </span>

                                                            <span className="rezervacija-toggle">
                                                                {jeOtvorena
                                                                    ? '▲'
                                                                    : '▼'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {jeOtvorena && (
                                                    <tr className="rezervacija-detalji-row">
                                                        <td
                                                            colSpan="5"
                                                            className="rezervacija-detalji-cell"
                                                        >
                                                            {detaljiLoading[
                                                                rezervacija
                                                                    .rezervacijaId
                                                            ] && (
                                                                    <div className="rezervacija-detalji-loading">
                                                                        Učitavanje detalja rezervacije...
                                                                    </div>
                                                                )}

                                                            {detaljiError[
                                                                rezervacija
                                                                    .rezervacijaId
                                                            ] && (
                                                                    <div className="rezervacija-detalji-error">
                                                                        {
                                                                            detaljiError[
                                                                            rezervacija
                                                                                .rezervacijaId
                                                                            ]
                                                                        }
                                                                    </div>
                                                                )}

                                                            {detalji &&
                                                                !detaljiLoading[
                                                                rezervacija
                                                                    .rezervacijaId
                                                                ] && (
                                                                    <div className="rezervacija-detalji">

                                                                        <div className="rezervacija-detalji-header">
                                                                            <div>
                                                                                <span className="rezervacija-detalji-kicker">
                                                                                    Detalji rezervacije
                                                                                </span>

                                                                                <h3>
                                                                                    Rezervacija #{detalji.rezervacijaId}
                                                                                </h3>
                                                                            </div>

                                                                            <div className="rezervacija-detalji-akcije">
                                                                                <span
                                                                                    className={`status-badge status-${getStatusClass(
                                                                                        detalji.status,
                                                                                    )}`}
                                                                                >
                                                                                    {formatEnumValue(
                                                                                        detalji.status,
                                                                                    )}
                                                                                </span>

                                                                                {detalji.status ===
                                                                                    'POSLATA' && (
                                                                                        <button
                                                                                            type="button"
                                                                                            className="obrada-rezervacije-button"
                                                                                            onClick={() =>
                                                                                                setOtvorenaObradaId(
                                                                                                    otvorenaObradaId ===
                                                                                                        detalji.rezervacijaId
                                                                                                        ? null
                                                                                                        : detalji.rezervacijaId,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Obrada rezervacije
                                                                                        </button>
                                                                                    )}

                                                                                {detalji.status ===
                                                                                    'POTVRDJENA' && (
                                                                                        <button
                                                                                            type="button"
                                                                                            className="otkazi-rezervaciju-button"
                                                                                            disabled={
                                                                                                obradaUToku
                                                                                            }
                                                                                            onClick={() =>
                                                                                                handlePromenaStatusa(
                                                                                                    detalji.rezervacijaId,
                                                                                                    'OTKAZANA',
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            {obradaUToku
                                                                                                ? 'Čuvanje...'
                                                                                                : 'Otkaži rezervaciju'}
                                                                                        </button>
                                                                                    )}
                                                                            </div>
                                                                        </div>

                                                                        {otvorenaObradaId ===
                                                                            detalji.rezervacijaId && (
                                                                                <div className="obrada-rezervacije-panel">
                                                                                    <div>
                                                                                        <h4>
                                                                                            Obrada zahteva
                                                                                        </h4>

                                                                                        <p>
                                                                                            Izaberite odluku za ovu rezervaciju.
                                                                                        </p>
                                                                                    </div>

                                                                                    <div className="obrada-rezervacije-akcije">
                                                                                        <button
                                                                                            type="button"
                                                                                            className="potvrdi-rezervaciju-button"
                                                                                            disabled={
                                                                                                obradaUToku
                                                                                            }
                                                                                            onClick={() =>
                                                                                                handlePromenaStatusa(
                                                                                                    detalji.rezervacijaId,
                                                                                                    'POTVRDJENA',
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Potvrdi
                                                                                        </button>

                                                                                        <button
                                                                                            type="button"
                                                                                            className="odbij-rezervaciju-button"
                                                                                            disabled={
                                                                                                obradaUToku
                                                                                            }
                                                                                            onClick={() =>
                                                                                                handlePromenaStatusa(
                                                                                                    detalji.rezervacijaId,
                                                                                                    'ODBIJENA',
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Odbij
                                                                                        </button>

                                                                                        <button
                                                                                            type="button"
                                                                                            className="otkazi-rezervaciju-button"
                                                                                            disabled={
                                                                                                obradaUToku
                                                                                            }
                                                                                            onClick={() =>
                                                                                                handlePromenaStatusa(
                                                                                                    detalji.rezervacijaId,
                                                                                                    'OTKAZANA',
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Otkaži
                                                                                        </button>
                                                                                    </div>

                                                                                    {obradaError[
                                                                                        detalji
                                                                                            .rezervacijaId
                                                                                    ] && (
                                                                                            <div className="obrada-rezervacije-error">
                                                                                                {
                                                                                                    obradaError[
                                                                                                    detalji
                                                                                                        .rezervacijaId
                                                                                                    ]
                                                                                                }
                                                                                            </div>
                                                                                        )}
                                                                                </div>
                                                                            )}

                                                                        <div className="rezervacija-detalji-grid">
                                                                            <div className="rezervacija-detalji-sekcija">
                                                                                <h4>
                                                                                    Klijent
                                                                                </h4>

                                                                                <div className="detalj-item">
                                                                                    <span>
                                                                                        Ime i prezime
                                                                                    </span>

                                                                                    <strong>
                                                                                        {detalji.imeKlijenta}{' '}
                                                                                        {detalji.prezimeKlijenta}
                                                                                    </strong>
                                                                                </div>

                                                                                <div className="detalj-item">
                                                                                    <span>
                                                                                        Email
                                                                                    </span>

                                                                                    <strong>
                                                                                        {
                                                                                            detalji.emailKlijenta
                                                                                        }
                                                                                    </strong>
                                                                                </div>

                                                                                <div className="detalj-item">
                                                                                    <span>
                                                                                        Telefon
                                                                                    </span>

                                                                                    <strong>
                                                                                        {detalji.telefonKlijenta ||
                                                                                            '-'}
                                                                                    </strong>
                                                                                </div>
                                                                            </div>

                                                                            <div className="rezervacija-detalji-sekcija">
                                                                                <h4>
                                                                                    Događaj
                                                                                </h4>

                                                                                <div className="detalj-item">
                                                                                    <span>
                                                                                        Paket
                                                                                    </span>

                                                                                    <strong>
                                                                                        {
                                                                                            detalji.nazivPaketa
                                                                                        }
                                                                                    </strong>
                                                                                </div>

                                                                                <div className="detalj-item">
                                                                                    <span>
                                                                                        Tip događaja
                                                                                    </span>

                                                                                    <strong>
                                                                                        {detalji
                                                                                            .tipoviDogadjaja
                                                                                            ?.length >
                                                                                            0
                                                                                            ? detalji.tipoviDogadjaja
                                                                                                .map(
                                                                                                    (
                                                                                                        tip,
                                                                                                    ) =>
                                                                                                        formatEnumValue(
                                                                                                            tip,
                                                                                                        ),
                                                                                                )
                                                                                                .join(
                                                                                                    ', ',
                                                                                                )
                                                                                            : '-'}
                                                                                    </strong>
                                                                                </div>

                                                                                <div className="detalj-item">
                                                                                    <span>
                                                                                        Broj gostiju
                                                                                    </span>

                                                                                    <strong>
                                                                                        {
                                                                                            detalji.brGostiju
                                                                                        }
                                                                                    </strong>
                                                                                </div>
                                                                            </div>

                                                                            <div className="rezervacija-detalji-sekcija">
                                                                                <h4>
                                                                                    Termin
                                                                                </h4>

                                                                                <div className="detalj-item">
                                                                                    <span>
                                                                                        Datum
                                                                                    </span>

                                                                                    <strong>
                                                                                        {formatDatum(
                                                                                            detalji.vremePocetka,
                                                                                        )}
                                                                                    </strong>
                                                                                </div>

                                                                                <div className="detalj-item">
                                                                                    <span>
                                                                                        Vreme
                                                                                    </span>

                                                                                    <strong>
                                                                                        {formatVreme(
                                                                                            detalji.vremePocetka,
                                                                                        )}
                                                                                        {' – '}
                                                                                        {formatVreme(
                                                                                            detalji.vremeZavrsetka,
                                                                                        )}
                                                                                    </strong>
                                                                                </div>

                                                                                <div className="detalj-item">
                                                                                    <span>
                                                                                        Kreirano
                                                                                    </span>

                                                                                    <strong>
                                                                                        {formatDatumIVreme(
                                                                                            detalji.vremeKreiranja,
                                                                                        )}
                                                                                    </strong>
                                                                                </div>
                                                                            </div>

                                                                            <div className="rezervacija-detalji-sekcija">
                                                                                <h4>
                                                                                    Dodatne usluge
                                                                                </h4>

                                                                                {detalji
                                                                                    .dodatneUsluge
                                                                                    ?.length >
                                                                                    0 ? (
                                                                                    <div className="dodatne-usluge-lista">
                                                                                        {detalji.dodatneUsluge.map(
                                                                                            (
                                                                                                usluga,
                                                                                            ) => (
                                                                                                <span
                                                                                                    key={
                                                                                                        usluga
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        usluga
                                                                                                    }
                                                                                                </span>
                                                                                            ),
                                                                                        )}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="nema-dodatnih-usluga">
                                                                                        Nema dodatnih usluga.
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div className="rezervacija-tekstualni-detalji">
                                                                            <div>
                                                                                <span>
                                                                                    Opis
                                                                                </span>

                                                                                <p>
                                                                                    {detalji.opis ||
                                                                                        'Nije unet.'}
                                                                                </p>
                                                                            </div>

                                                                            <div>
                                                                                <span>
                                                                                    Napomena
                                                                                </span>

                                                                                <p>
                                                                                    {detalji.napomena ||
                                                                                        'Nije uneta.'}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

export default PregledRezervacijaRestoranaPage;