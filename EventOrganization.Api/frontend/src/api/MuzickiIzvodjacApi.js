const API_URL = import.meta.env.VITE_API_URL;

export async function getMuzickiIzvodjaciByRestoranId(restoranId) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/MuzickiIzvodjac/restoran/${restoranId}`,
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
            'Nemate dozvolu za pregled muzičkih izvođača.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja muzičkih izvođača.',
        );
    }

    return response.json();
}

export async function addMuzickiIzvodjac(
    restoranId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/MuzickiIzvodjac/restoran/${restoranId}`,
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
            'Nemate dozvolu za dodavanje muzičkog izvođača.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci muzičkog izvođača nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom dodavanja muzičkog izvođača.',
        );
    }

    return response.json();
}

export async function updateMuzickiIzvodjac(
    restoranId,
    uslugaId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/MuzickiIzvodjac/restoran/${restoranId}/${uslugaId}`,
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
            'Nemate dozvolu za izmenu muzičkog izvođača.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Muzički izvođač nije pronađen.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci muzičkog izvođača nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom izmene muzičkog izvođača.',
        );
    }

    return response.json();
}

export async function deleteMuzickiIzvodjac(
    restoranId,
    uslugaId,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/MuzickiIzvodjac/restoran/${restoranId}/${uslugaId}`,
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
            'Nemate dozvolu za brisanje muzičkog izvođača.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Muzički izvođač nije pronađen.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom brisanja muzičkog izvođača.',
        );
    }
}