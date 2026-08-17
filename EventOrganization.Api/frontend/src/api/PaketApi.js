const API_URL = import.meta.env.VITE_API_URL;

export async function getPaketiByRestoranId(restoranId) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Paket/restoran/${restoranId}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (response.status === 401) {
        throw new Error('Niste prijavljeni.');
    }

    if (response.status === 403) {
        throw new Error(
            'Nemate dozvolu za pregled paketa ovog restorana.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja paketa.',
        );
    }

    return response.json();
}