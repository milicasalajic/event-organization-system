import { useEffect, useState } from 'react';
import { getMojRestoran } from '../api/restoranApi';

function MojRestoranPage() {
    const [restoran, setRestoran] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadRestoran() {
            try {
                const result = await getMojRestoran();

                setRestoran(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadRestoran();
    }, []);

    if (isLoading) {
        return <p>Učitavanje restorana...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>{restoran.naziv}</h1>

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

            {restoran.opis && (
                <p>
                    <strong>Opis:</strong>{' '}
                    {restoran.opis}
                </p>
            )}
        </div>
    );
}

export default MojRestoranPage;