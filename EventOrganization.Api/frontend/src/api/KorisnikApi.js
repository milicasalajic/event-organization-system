const API_URL = import.meta.env.VITE_API_URL;

export async function getProfil() {
    const token =
        localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Korisnik/profil`,
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

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja profila.',
        );
    }

    return response.json();
}

export async function updateProfil(data) {
    const token =
        localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Korisnik/profil`,
        {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        },
    );

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(message);
    }

    if (response.status === 401) {
        throw new Error('Niste prijavljeni.');
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom izmene profila.',
        );
    }

    return response.json();
}
export async function getKlijenti() {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Korisnik/klijenti`,
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
        throw new Error('Nemate pravo pristupa klijentima.');
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja klijenata.',
        );
    }

    return response.json();
} export async function kreirajKlijenta(data) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Korisnik/klijenti`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
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
        throw new Error('Nemate pravo da registrujete klijenta.');
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom registracije klijenta.',
        );
    }

    return response.json();
}