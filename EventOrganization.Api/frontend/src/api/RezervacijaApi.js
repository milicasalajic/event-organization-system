const API_URL = import.meta.env.VITE_API_URL;

export async function getDostupneSale( 
    restoranId,
    data,
) {
    const token =
        localStorage.getItem('token');

    const response =
        await fetch(
            `${API_URL}/api/Rezervacija/restoran/${restoranId}/dostupne-sale`,
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json',
                    Authorization:
                        `Bearer ${token}`,
                },
                body:
                    JSON.stringify(data), // pretvaras u json string da bi bekend razumeo, ne mozes slati javascript obj
            },
        );

    if (!response.ok) {
        const message =
            await response.text();

        throw new Error(
            message ||
            `Greška. Status: ${response.status}`,
        );
    }

    return response.json(); //pretvara json odgovor nazad u javas objekat
}

export async function obracunajRezervaciju(
    data,
) {
    const token =
        localStorage.getItem('token');

    const response =
        await fetch(
            `${API_URL}/api/Rezervacija/obracun`,
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json',
                    Authorization:
                        `Bearer ${token}`,
                },
                body:
                    JSON.stringify(data),
            },
        );

    if (!response.ok) {
        const message =
            await response.text();

        throw new Error(
            message ||
            `Greška. Status: ${response.status}`,
        );
    }

    return response.json();
}

export async function kreirajRezervaciju(
    data,
) {
    const token =
        localStorage.getItem('token');

    const response =
        await fetch(
            `${API_URL}/api/Rezervacija`,
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json',
                    Authorization:
                        `Bearer ${token}`,
                },
                body:
                    JSON.stringify(data),
            },
        );

    if (!response.ok) {
        const message =
            await response.text();

        throw new Error(
            message ||
            `Greška. Status: ${response.status}`,
        );
    }

    return response.json();
}
export async function getMojeRezervacije() {
    const token =
        localStorage.getItem("token");

    const response =
        await fetch(
            `${API_URL}/api/Rezervacija/moje`,
            {
                method: "GET",
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            });

    if (!response.ok) {
        const message =
            await response.text();

        throw new Error(
            message ||
            `Greška. Status: ${response.status}`);
    }

    return response.json();
}
export async function kreirajRezervacijuZaKlijenta(
    restoranId,
    klijentId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Rezervacija/restoran/${restoranId}/za-klijenta/${klijentId}`,
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
        throw new Error('Nemate pravo da kreirate rezervaciju za ovog restorana.');
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom kreiranja rezervacije.',
        );
    }

    return response.json();
}