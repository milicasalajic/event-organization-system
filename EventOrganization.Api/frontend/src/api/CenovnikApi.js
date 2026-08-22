const API_URL = import.meta.env.VITE_API_URL;

export async function getCenovnikByRestoranId(
    restoranId,
    datum = null,
) {
    const token = localStorage.getItem('token');

    const query = datum
        ? `?datum=${encodeURIComponent(datum)}`
        : '';

    const response = await fetch(
        `${API_URL}/api/Cenovnik/restoran/${restoranId}${query}`,
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
            'Nemate dozvolu za pregled cenovnika ovog restorana.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja cenovnika.',
        );
    }

    return response.json();
}

export async function addCenaSale(
    restoranId,
    salaId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Cenovnik/restoran/${restoranId}/sala/${salaId}`,
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
            'Nemate dozvolu za evidentiranje cene.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci o ceni nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom evidentiranja cene.',
        );
    }
}

export async function addCenaUsluge(
    restoranId,
    uslugaId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Cenovnik/restoran/${restoranId}/usluga/${uslugaId}`,
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
            'Nemate dozvolu za evidentiranje cene.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci o ceni nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom evidentiranja cene.',
        );
    }
}