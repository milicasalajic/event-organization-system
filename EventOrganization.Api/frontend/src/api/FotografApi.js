const API_URL = import.meta.env.VITE_API_URL;

export async function getFotografiByRestoranId(restoranId) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Fotograf/restoran/${restoranId}`,
        {
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
            'Nemate dozvolu za pregled fotografa.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja fotografa.',
        );
    }

    return response.json();
}

export async function addFotograf(
    restoranId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Fotograf/restoran/${restoranId}`,
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
            'Nemate dozvolu za dodavanje fotografa.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci fotografa nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom dodavanja fotografa.',
        );
    }

    return response.json();
}

export async function updateFotograf(
    restoranId,
    uslugaId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Fotograf/restoran/${restoranId}/${uslugaId}`,
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
            'Nemate dozvolu za izmenu fotografa.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Fotograf nije pronađen.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci fotografa nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom izmene fotografa.',
        );
    }

    return response.json();
}

export async function deleteFotograf(
    restoranId,
    uslugaId,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Fotograf/restoran/${restoranId}/${uslugaId}`,
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
            'Nemate dozvolu za brisanje fotografa.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Fotograf nije pronađen.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom brisanja fotografa.',
        );
    }
}