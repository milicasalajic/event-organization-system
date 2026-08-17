const API_URL = import.meta.env.VITE_API_URL;

export async function getAllRestorani() {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/api/Restoran`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error('Niste prijavljeni.');
    }

    if (response.status === 403) {
        throw new Error('Nemate dozvolu za pregled restorana.');
    }

    if (!response.ok) {
        throw new Error('Došlo je do greške prilikom učitavanja restorana.');
    }

    return response.json();
}

export async function getRestoranById(restoranId) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Restoran/${restoranId}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (response.status === 404) {
        throw new Error('Restoran nije pronađen.');
    }

    if (response.status === 401) {
        throw new Error('Niste prijavljeni.');
    }

    if (response.status === 403) {
        throw new Error(
            'Nemate dozvolu za pregled ovog restorana.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja restorana.',
        );
    }

    return response.json();
}