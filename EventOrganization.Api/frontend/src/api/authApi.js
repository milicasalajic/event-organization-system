const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, lozinka) {
    const response = await fetch(`${API_URL}/api/Auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            lozinka,
        }),
    });

    if (response.status === 401) {
        throw new Error('Email adresa ili lozinka nisu ispravni.');
    }

    if (!response.ok) {
        const errorText = await response.text();

        console.error('Login error:', response.status, errorText);

        throw new Error(
            `Greška pri prijavljivanju. Status: ${response.status}`,
        );
    }

    return response.json();
}