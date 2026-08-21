const API_URL = import.meta.env.VITE_API_URL;

export async function getSaleByPaketId(restoranId, paketId) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Sala/restoran/${restoranId}/paket/${paketId}`,
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
            'Nemate dozvolu za pregled sala ovog paketa.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja sala.',
        );
    }

    return response.json();
}

export async function getSaleByRestoranId(restoranId) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Sala/restoran/${restoranId}`,
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
            'Nemate dozvolu za pregled sala.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom učitavanja sala.',
        );
    }

    return response.json();
}

export async function addSala(
    restoranId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Sala/restoran/${restoranId}`,
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
            'Nemate dozvolu za dodavanje sale.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci sale nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom dodavanja sale.',
        );
    }

    return response.json();
}

export async function updateSala(
    restoranId,
    salaId,
    data,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Sala/restoran/${restoranId}/${salaId}`,
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
            'Nemate dozvolu za izmenu sale.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Sala nije pronađena.',
        );
    }

    if (response.status === 400) {
        const message = await response.text();

        throw new Error(
            message ||
            'Podaci sale nisu ispravni.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom izmene sale.',
        );
    }

    return response.json();
}

export async function deleteSala(
    restoranId,
    salaId,
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/api/Sala/restoran/${restoranId}/${salaId}`,
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
            'Nemate dozvolu za brisanje sale.',
        );
    }

    if (response.status === 404) {
        throw new Error(
            'Sala nije pronađena.',
        );
    }

    if (!response.ok) {
        throw new Error(
            'Došlo je do greške prilikom brisanja sale.',
        );
    }
}