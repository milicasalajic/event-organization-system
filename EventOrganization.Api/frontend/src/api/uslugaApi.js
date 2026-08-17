const API_URL = import.meta.env.VITE_API_URL;

export async function getUslugeByPaketId(restoranId, paketId) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Usluga/restoran/${restoranId}/paket/${paketId}`,
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
            'Nemate dozvolu za pregled usluga ovog paketa.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja dodatnih usluga.',
        );
    }

    return response.json();
}