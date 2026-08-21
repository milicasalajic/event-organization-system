const API_URL = import.meta.env.VITE_API_URL;

export async function getDekoraterskeFirmeByRestoranId(restoranId) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/DekoraterskaFirma/restoran/${restoranId}`,
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
            'Nemate dozvolu za pregled dekoraterskih firmi.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja dekoraterskih firmi.',
        );
    }

    return response.json();
}

export async function addDekoraterskaFirma(
    restoranId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/DekoraterskaFirma/restoran/${restoranId}`,
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
            'Nemate dozvolu za dodavanje dekoraterske firme.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci dekoraterske firme nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom dodavanja dekoraterske firme.',
        );
    }

    return response.json();
}

export async function updateDekoraterskaFirma(
    restoranId,
    uslugaId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/DekoraterskaFirma/restoran/${restoranId}/${uslugaId}`,
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
            'Nemate dozvolu za izmenu dekoraterske firme.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Dekoraterska firma nije pronađena.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci dekoraterske firme nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom izmene dekoraterske firme.',
        );
    }

    return response.json();
}

export async function deleteDekoraterskaFirma(
    restoranId,
    uslugaId,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/DekoraterskaFirma/restoran/${restoranId}/${uslugaId}`,
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
            'Nemate dozvolu za brisanje dekoraterske firme.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Dekoraterska firma nije pronađena.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom brisanja dekoraterske firme.',
        );
    }
}