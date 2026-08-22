const API_URL = import.meta.env.VITE_API_URL;

export async function getKeteringByRestoranId(restoranId) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Ketering/restoran/${restoranId}`,
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
            'Nemate dozvolu za pregled ketering firmi.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja ketering firmi.',
        );
    }

    return response.json();
}

export async function addKetering(
    restoranId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Ketering/restoran/${restoranId}`,
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
            'Nemate dozvolu za dodavanje ketering firme.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci ketering firme nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom dodavanja ketering firme.',
        );
    }

    return response.json();
}

export async function updateKetering(
    restoranId,
    uslugaId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Ketering/restoran/${restoranId}/${uslugaId}`,
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
            'Nemate dozvolu za izmenu ketering firme.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Ketering firma nije pronađena.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci ketering firme nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom izmene ketering firme.',
        );
    }

    return response.json();
}

export async function deleteKetering(
    restoranId,
    uslugaId,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Ketering/restoran/${restoranId}/${uslugaId}`,
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
            'Nemate dozvolu za brisanje ketering firme.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Ketering firma nije pronađena.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom brisanja ketering firme.',
        );
    }
}