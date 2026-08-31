const API_URL = import.meta.env.VITE_API_URL;

export async function getRezervacijeByRestoranId(
    restoranId,
) {
    const token =
        localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Rezervacija/restoran/${restoranId}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (response.status === 401) {
        throw new Error(
            'Niste prijavljeni.',
        );
    }

    if (response.status === 403) {
        throw new Error(
            'Nemate dozvolu za pregled rezervacija ovog restorana.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja rezervacija.',
        );
    }

    return response.json();
}

export async function getRezervacijaDetalji(
    restoranId,
    rezervacijaId,
) {
    const token =
        localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Rezervacija/restoran/${restoranId}/${rezervacijaId}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (response.status === 401) {
        throw new Error(
            'Niste prijavljeni.',
        );
    }

    if (response.status === 403) {
        throw new Error(
            'Nemate dozvolu za pregled ove rezervacije.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Rezervacija nije pronađena.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja detalja rezervacije.',
        );
    }

    return response.json();
}
export async function obradiRezervaciju(
    restoranId,
    rezervacijaId,
    status,
) {
    const token =
        localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Rezervacija/restoran/${restoranId}/${rezervacijaId}/obrada?noviStatus=${status}`,
        {
            method: 'PATCH',
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        },
    );

    if (response.status === 401) {
        throw new Error(
            'Niste prijavljeni.',
        );
    }

    if (response.status === 403) {
        throw new Error(
            'Nemate dozvolu za obradu ove rezervacije.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Rezervacija nije pronađena.',
        );
    }

    if (response.status === 400) {
        const message =
            await response.text();

        throw new Error(
            message ||
            'Promena statusa rezervacije nije dozvoljena.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom obrade rezervacije.',
        );
    }

    return response.json();
}
export async function zameniUslugu(
    restoranId,
    rezervacijaId,
    stavkaId,
    novaUslugaId,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Rezervacija/restoran/${restoranId}/${rezervacijaId}/usluge/${stavkaId}?novaUslugaId=${novaUslugaId}`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (response.status === 400) {
        const message = await response.text();
        throw new Error(message);
    }

    if (response.status === 401) {
        throw new Error('Niste prijavljeni.');
    }

    if (response.status === 403) {
        throw new Error('Nemate pravo da menjate ovu rezervaciju.');
    }

    if (response.status === 404) {
        const message = await response.text();
        throw new Error(message);
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom zamene usluge.',
        );
    }

    return response.json();
}