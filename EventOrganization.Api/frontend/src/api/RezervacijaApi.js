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