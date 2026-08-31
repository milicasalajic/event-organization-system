import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { kreirajKlijenta } from '../api/korisnikApi';

import './RegistracijaKlijentaPage.css';

function RegistracijaKlijentaPage() {
    const { restoranId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ime: '',
        prezime: '',
        email: '',
        telefon: '',
        lozinka: '',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError('');
    }

    function podaciValidni() {
        if (
            !formData.ime.trim() ||
            !formData.prezime.trim() ||
            !formData.email.trim() ||
            !formData.lozinka
        ) {
            setError('Popunite sva obavezna polja.');
            return false;
        }

        return true;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!podaciValidni()) {
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const noviKlijent = await kreirajKlijenta({
                ime: formData.ime.trim(),
                prezime: formData.prezime.trim(),
                email: formData.email.trim(),
                telefon: formData.telefon.trim() || null,
                lozinka: formData.lozinka,
            });

            navigate(
                `/restorani/${restoranId}/nova-rezervacija?klijentId=${noviKlijent.korisnikId}`,
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="registracija-klijenta-page">
            <main className="registracija-klijenta-container">
                <button
                    type="button"
                    className="registracija-klijenta-nazad"
                    onClick={() =>
                        navigate(`/restorani/${restoranId}/nova-rezervacija`)
                    }
                >
                    ← Nazad na rezervaciju
                </button>

                <header className="registracija-klijenta-header">
                    <span>Novi klijent</span>
                    <h1>Registracija klijenta</h1>
                    <p>
                        Unesite podatke klijenta za kog želite da kreirate
                        rezervaciju.
                    </p>
                </header>

                {error && (
                    <div className="registracija-klijenta-error">
                        {error}
                    </div>
                )}

                <form
                    className="registracija-klijenta-card"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="registracija-klijenta-grid">
                        <div className="registracija-klijenta-field">
                            <label htmlFor="ime">
                                Ime <span className="obavezno">*</span>
                            </label>

                            <input
                                id="ime"
                                name="ime"
                                type="text"
                                value={formData.ime}
                                onChange={handleChange}
                                placeholder="Unesite ime"
                            />
                        </div>

                        <div className="registracija-klijenta-field">
                            <label htmlFor="prezime">
                                Prezime <span className="obavezno">*</span>
                            </label>

                            <input
                                id="prezime"
                                name="prezime"
                                type="text"
                                value={formData.prezime}
                                onChange={handleChange}
                                placeholder="Unesite prezime"
                            />
                        </div>

                        <div className="registracija-klijenta-field registracija-klijenta-full">
                            <label htmlFor="email">
                                Email <span className="obavezno">*</span>
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="primer@gmail.com"
                            />
                        </div>

                        <div className="registracija-klijenta-field registracija-klijenta-full">
                            <label htmlFor="telefon">
                                Telefon
                            </label>

                            <input
                                id="telefon"
                                name="telefon"
                                type="text"
                                value={formData.telefon}
                                onChange={handleChange}
                                placeholder="0611234567"
                            />
                        </div>

                        <div className="registracija-klijenta-field registracija-klijenta-full">
                            <label htmlFor="lozinka">
                                Lozinka <span className="obavezno">*</span>
                            </label>

                            <input
                                id="lozinka"
                                name="lozinka"
                                type="password"
                                value={formData.lozinka}
                                onChange={handleChange}
                                placeholder="Unesite lozinku"
                            />
                        </div>
                    </div>

                    <div className="registracija-klijenta-actions">
                        <button
                            type="submit"
                            disabled={isSaving}
                        >
                            {isSaving
                                ? 'Registracija...'
                                : 'Registruj klijenta'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default RegistracijaKlijentaPage;