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
export async function addPaket(
    restoranId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Paket/restoran/${restoranId}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    );

    if (response.status === 401) {
        throw new Error('Niste prijavljeni.');
    }

    if (response.status === 403) {
        throw new Error(
            'Nemate dozvolu za dodavanje paketa.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci paketa nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom dodavanja paketa.',
        );
    }

    return response.json();
}
export async function updatePaket(
    restoranId,
    paketId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Paket/restoran/${restoranId}/${paketId}`,
        {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    );

    if (response.status === 401) {
        throw new Error('Niste prijavljeni.');
    }

    if (response.status === 403) {
        throw new Error(
            'Nemate dozvolu za izmenu paketa.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Paket nije pronađen.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci paketa nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom izmene paketa.',
        );
    }

    return response.json();
}
export async function deletePaket(
    restoranId,
    paketId,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Paket/restoran/${restoranId}/${paketId}`,
        {
            method: 'DELETE',
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
            'Nemate dozvolu za brisanje paketa.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Paket nije pronađen.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom brisanja paketa.',
        );
    }
}