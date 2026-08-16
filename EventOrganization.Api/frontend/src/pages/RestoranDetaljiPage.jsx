import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestoranById } from '../api/restoranApi';

function RestoranDetaljiPage() {
    const { restoranId } = useParams();

    const [restoran, setRestoran] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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

        </div>
    );
}

export default RestoranDetaljiPage;