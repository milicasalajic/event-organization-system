import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMojeRezervacije } from '../api/rezervacijaApi';
import './MojeRezervacijePage.css';

const naziviStatusa = {
    POSLATA: 'Poslata',
    POTVRDJENA: 'Potvrđena',
    REALIZOVANA: 'Realizovana',
    OTKAZANA: 'Otkazana',
    ODBIJENA: 'Odbijena',
};

function formatDatumVreme(value) {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleString('sr-RS', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

function formatTermin(vremePocetka, vremeZavrsetka) {
    if (!vremePocetka || !vremeZavrsetka) {
        return '-';
    }

    const pocetak = new Date(vremePocetka);
    const zavrsetak = new Date(vremeZavrsetka);

    const istiDan =
        pocetak.toDateString() === zavrsetak.toDateString();

    if (istiDan) {
        const datum = pocetak.toLocaleDateString('sr-RS', {
            dateStyle: 'medium',
        });

        const od = pocetak.toLocaleTimeString('sr-RS', {
            hour: '2-digit',
            minute: '2-digit',
        });

        const doVreme = zavrsetak.toLocaleTimeString('sr-RS', {
            hour: '2-digit',
            minute: '2-digit',
        });

        return `${datum} ${od} – ${doVreme}`;
    }

    return `${formatDatumVreme(vremePocetka)} – ${formatDatumVreme(vremeZavrsetka)}`;
}

function formatCena(value) {
    if (value == null) {
        return 'Nije dostupna';
    }

    return `${Number(value).toLocaleString('sr-RS')} EUR`;
}

function formatTipDogadjaja(value) {
    const nazivi = {
        VENCANJE: 'Venčanje',
        KRSTENJE: 'Krštenje',
        RODJENDAN: 'Rođendan',
        POSLOVNI_DOGADJAJ: 'Poslovni događaj',
    };

    return nazivi[value] ?? value;
}

function MojeRezervacijePage() {
    const navigate = useNavigate();

    const [rezervacije, setRezervacije] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadRezervacije() {
            setIsLoading(true);
            setError('');

            try {
                const result = await getMojeRezervacije();
                setRezervacije(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadRezervacije();
    }, []);

    if (isLoading) {
        return (
            <div className="moje-rezervacije-page">
                <div className="moje-rezervacije-state">
                    Učitavanje rezervacija...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="moje-rezervacije-page">
                <div className="moje-rezervacije-state moje-rezervacije-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="moje-rezervacije-page">
            <main className="moje-rezervacije-container">
                <button
                    type="button"
                    className="moje-rezervacije-nazad"
                    onClick={() => navigate('/restorani')}
                >
                    ← Nazad na restorane
                </button>

                <div className="moje-rezervacije-heading">
                    <span>Korisnički nalog</span>

                    <h1>Kreirane rezervacije</h1>

                    <p>Pregled rezervacija koje ste kreirali.</p>
                </div>

                {rezervacije.length === 0 ? (
                    <div className="moje-rezervacije-empty">
                        Trenutno nemate kreiranih rezervacija.
                    </div>
                ) : (
                    <div className="moje-rezervacije-lista">
                        {rezervacije.map((rezervacija) => (
                            <article
                                className="moja-rezervacija-card"
                                key={rezervacija.rezervacijaId}
                            >
                                <div className="moja-rezervacija-header">
                                    <div>
                                        <span className="moja-rezervacija-kicker">
                                            Rezervacija
                                        </span>

                                        <button
                                            type="button"
                                            className="moja-rezervacija-restoran-link"
                                            onClick={() =>
                                                navigate(
                                                    `/restorani/${rezervacija.restoranId}`,
                                                )
                                            }
                                        >
                                            {rezervacija.nazivRestorana}
                                        </button>
                                    </div>

                                    <span
                                        className={`moja-rezervacija-status status-${rezervacija.status?.toLowerCase()}`}
                                    >
                                        {naziviStatusa[rezervacija.status] ??
                                            rezervacija.status}
                                    </span>
                                </div>

                                <div className="moja-rezervacija-grid">
                                    <div className="moja-rezervacija-podatak">
                                        <span>Paket</span>

                                        <strong>
                                            {rezervacija.nazivPaketa
                                                ? `Paket ${rezervacija.nazivPaketa}`
                                                : '-'}
                                        </strong>
                                    </div>

                                    <div className="moja-rezervacija-podatak">
                                        <span>Sala</span>

                                        <strong>
                                            {rezervacija.rbrSSale != null
                                                ? `Sala ${rezervacija.rbrSSale}`
                                                : '-'}
                                        </strong>
                                    </div>

                                    <div className="moja-rezervacija-podatak">
                                        <span>Broj gostiju</span>

                                        <strong>
                                            {rezervacija.brGostiju}
                                        </strong>
                                    </div>

                                    <div className="moja-rezervacija-podatak">
                                        <span>Termin</span>

                                        <strong>
                                            {formatTermin(
                                                rezervacija.vremePocetka,
                                                rezervacija.vremeZavrsetka,
                                            )}
                                        </strong>
                                    </div>

                                    <div className="moja-rezervacija-podatak">
                                        <span>Tip događaja</span>

                                        <strong>
                                            {rezervacija.tipoviDogadjaja
                                                ?.map(formatTipDogadjaja)
                                                .join(', ') || '-'}
                                        </strong>
                                    </div>

                                    <div className="moja-rezervacija-podatak">
                                        <span>Ukupna cena</span>

                                        <strong className="moja-rezervacija-cena">
                                            {formatCena(
                                                rezervacija.ukupnaCena,
                                            )}
                                        </strong>
                                    </div>
                                </div>

                                <div className="moja-rezervacija-detalji">
                                    <div>
                                        <span>Dodatne usluge</span>

                                        <p>
                                            {rezervacija.dodatneUsluge?.length >
                                                0
                                                ? rezervacija.dodatneUsluge.join(
                                                    ', ',
                                                )
                                                : 'Nema dodatnih usluga'}
                                        </p>
                                    </div>

                                    {rezervacija.opis && (
                                        <div>
                                            <span>Opis</span>
                                            <p>{rezervacija.opis}</p>
                                        </div>
                                    )}

                                    {rezervacija.napomena && (
                                        <div>
                                            <span>Napomena</span>
                                            <p>{rezervacija.napomena}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="moja-rezervacija-footer">
                                    Kreirana:{' '}
                                    {formatDatumVreme(
                                        rezervacija.vremeKreiranja,
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MojeRezervacijePage;