import { useEffect, useState } from 'react';
import { getAllRestorani } from '../api/restoranApi';
import './RestoraniPage.css';
import { useNavigate } from 'react-router-dom';
function RestoraniPage() {
    const [restorani, setRestorani] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function loadRestorani() {
            try {
                const result = await getAllRestorani();
                setRestorani(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadRestorani();
    }, []);

    if (isLoading) {
        return (
            <p className="restorani-loading">
                Učitavanje restorana...
            </p>
        );
    }

    if (error) {
        return (
            <p className="restorani-error">
                {error}
            </p>
        );
    }

    return (
        <div className="restorani-page">
            <div className="restorani-container">

                <div className="restorani-header">
                    <h1>Restorani</h1>

                    <p>
                        Izaberite restoran i pogledajte njegovu ponudu.
                    </p>
                </div>

                {restorani.length === 0 ? (
                    <p className="restorani-empty">
                        Trenutno nema restorana u sistemu.
                    </p>
                ) : (
                        <div className="restorani-lista">
                            {restorani.map((restoran) => (
                                <div
                                    className="restoran-card"
                                    key={restoran.restoranId}
                                    onClick={() =>
                                        navigate(`/restorani/${restoran.restoranId}`)
                                    }
                                >
                                    <div className="restoran-sadrzaj">
                                        <h2>{restoran.naziv}</h2>

                                        <div className="restoran-info">
                                            <p>
                                                <strong>Adresa:</strong>{' '}
                                                {restoran.adresa}
                                            </p>

                                            <p>
                                                <strong>Grad:</strong>{' '}
                                                {restoran.grad}
                                            </p>

                                            <p>
                                                <strong>Telefon:</strong>{' '}
                                                {restoran.telefon}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="restoran-detalji">
                                        Pogledaj detalje →
                                    </span>
                                </div>
                            ))}
                        </div>
                )}

            </div>
        </div>
    );
}

export default RestoraniPage;