import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestoranById } from '../api/restoranApi';
import { getPaketiByRestoranId } from '../api/paketApi';
import { getSaleByPaketId } from '../api/salaApi';
import './RestoranDetaljiPage.css';

function RestoranDetaljiPage() {
    const { restoranId } = useParams();

    const [restoran, setRestoran] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [paketi, setPaketi] = useState([]);
    const [prikaziPakete, setPrikaziPakete] = useState(false);
    const [paketiLoading, setPaketiLoading] = useState(false);
    const [paketiError, setPaketiError] = useState('');

    const [salePoPaketu, setSalePoPaketu] = useState({});
    const [prikazaneSale, setPrikazaneSale] = useState({});
    const [saleLoading, setSaleLoading] = useState({});
    const [saleError, setSaleError] = useState({});

    useEffect(() => {
        async function loadRestoran() {
            try {
                const result = await getRestoranById(restoranId);
                setRestoran(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadRestoran();
    }, [restoranId]);

    async function handlePaketiClick() {
        if (prikaziPakete) {
            setPrikaziPakete(false);
            return;
        }

        if (paketi.length === 0) {
            setPaketiLoading(true);
            setPaketiError('');

            try {
                const result = await getPaketiByRestoranId(restoranId);
                setPaketi(result);
            } catch (error) {
                setPaketiError(error.message);
            } finally {
                setPaketiLoading(false);
            }
        }

        setPrikaziPakete(true);
    }

    async function handleSaleClick(paketId) {
        if (prikazaneSale[paketId]) {
            setPrikazaneSale((prev) => ({
                ...prev,
                [paketId]: false,
            }));

            return;
        }

        if (salePoPaketu[paketId] === undefined) {
            setSaleLoading((prev) => ({
                ...prev,
                [paketId]: true,
            }));

            setSaleError((prev) => ({
                ...prev,
                [paketId]: '',
            }));

            try {
                const result = await getSaleByPaketId(
                    restoranId,
                    paketId,
                );

                setSalePoPaketu((prev) => ({
                    ...prev,
                    [paketId]: result,
                }));
            } catch (error) {
                setSaleError((prev) => ({
                    ...prev,
                    [paketId]: error.message,
                }));
            } finally {
                setSaleLoading((prev) => ({
                    ...prev,
                    [paketId]: false,
                }));
            }
        }

        setPrikazaneSale((prev) => ({
            ...prev,
            [paketId]: true,
        }));
    }

    if (isLoading) {
        return (
            <div className="restoran-detalji-page">
                <p className="restoran-detalji-loading">
                    Učitavanje restorana...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="restoran-detalji-page">
                <p className="restoran-detalji-error">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="restoran-detalji-page">
            <div className="restoran-detalji-container">

                <div className="restoran-detalji-card">
                    <div className="restoran-detalji-header">
                        <span className="restoran-label">
                            Restoran
                        </span>

                        <h1>{restoran.naziv}</h1>
                    </div>

                    <div className="restoran-detalji-info">
                        <div className="restoran-info-red">
                            <span>Adresa</span>
                            <strong>{restoran.adresa}</strong>
                        </div>

                        <div className="restoran-info-red">
                            <span>Grad</span>
                            <strong>{restoran.grad}</strong>
                        </div>

                        <div className="restoran-info-red">
                            <span>Telefon</span>
                            <strong>{restoran.telefon}</strong>
                        </div>
                    </div>

                    <button
                        className="paketi-toggle"
                        type="button"
                        onClick={handlePaketiClick}
                    >
                        <span>
                            {prikaziPakete
                                ? 'Sakrij pakete'
                                : 'Pogledaj pakete'}
                        </span>

                        <span
                            className={
                                prikaziPakete
                                    ? 'paketi-strelica otvorena'
                                    : 'paketi-strelica'
                            }
                        >
                            ↓
                        </span>
                    </button>
                </div>

                {paketiLoading && (
                    <p className="paketi-loading">
                        Učitavanje paketa...
                    </p>
                )}

                {paketiError && (
                    <p className="paketi-error">
                        {paketiError}
                    </p>
                )}

                {prikaziPakete &&
                    !paketiLoading &&
                    !paketiError && (
                        <div className="paketi-sekcija">
                            <div className="paketi-header">
                                <h2>Paketi u ponudi</h2>
                                <div className="paketi-header-linija" />
                            </div>

                            {paketi.length === 0 ? (
                                <p className="paketi-empty">
                                    Ovaj restoran trenutno nema pakete u ponudi.
                                </p>
                            ) : (
                                <div className="paketi-lista-detalji">
                                    {paketi.map((paket) => (
                                        <div
                                            className="paket-card"
                                            key={paket.paketId}
                                        >
                                            <h3>{paket.naziv}</h3>

                                            {paket.opis ? (
                                                <p>{paket.opis}</p>
                                            ) : (
                                                <p className="paket-bez-opisa">
                                                    Za ovaj paket trenutno nema dodatnog opisa.
                                                </p>
                                            )}

                                            <button
                                                className="sale-toggle"
                                                type="button"
                                                onClick={() =>
                                                    handleSaleClick(
                                                        paket.paketId,
                                                    )
                                                }
                                            >
                                                {prikazaneSale[paket.paketId]
                                                    ? 'Sakrij sale'
                                                    : 'Vidi sale'}

                                                <span
                                                    className={
                                                        prikazaneSale[paket.paketId]
                                                            ? 'sale-strelica otvorena'
                                                            : 'sale-strelica'
                                                    }
                                                >
                                                    ↓
                                                </span>
                                            </button>

                                            {saleLoading[paket.paketId] && (
                                                <p className="sale-loading">
                                                    Učitavanje sala...
                                                </p>
                                            )}

                                            {saleError[paket.paketId] && (
                                                <p className="sale-error">
                                                    {saleError[paket.paketId]}
                                                </p>
                                            )}

                                            {prikazaneSale[paket.paketId] &&
                                                !saleLoading[paket.paketId] &&
                                                !saleError[paket.paketId] && (
                                                    <div className="sale-sekcija">
                                                        {salePoPaketu[paket.paketId]
                                                            ?.length === 0 ? (
                                                            <p className="sale-empty">
                                                                Ovaj paket nema sale u ponudi.
                                                            </p>
                                                        ) : (
                                                            <div className="sale-lista">
                                                                {salePoPaketu[
                                                                    paket.paketId
                                                                ]?.map((sala) => (
                                                                    <div
                                                                        className="sala-card"
                                                                        key={sala.salaId}
                                                                    >
                                                                        <h4>
                                                                            Sala {sala.rbrS}
                                                                        </h4>

                                                                        <p>
                                                                            <strong>
                                                                                Kapacitet:
                                                                            </strong>{' '}
                                                                            {sala.kapacitet}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
}

export default RestoranDetaljiPage;