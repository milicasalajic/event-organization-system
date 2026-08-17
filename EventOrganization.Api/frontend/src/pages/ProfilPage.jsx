import { useEffect, useState } from 'react';
import {
    getProfil,
    updateProfil,
} from '../api/korisnikApi';
import './ProfilPage.css';

function ProfilPage() {
    const [profil, setProfil] = useState(null);

    const [formData, setFormData] = useState({
        ime: '',
        prezime: '',
        email: '',
        telefon: '',
    });

    const [editMode, setEditMode] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        async function loadProfil() {
            try {
                const result =
                    await getProfil();

                setProfil(result);

                setFormData({
                    ime: result.ime,
                    prezime: result.prezime,
                    email: result.email,
                    telefon:
                        result.telefon ?? '',
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadProfil();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleEdit() {
        setError('');
        setSuccess('');
        setEditMode(true);
    }

    function handleCancel() {
        setFormData({
            ime: profil.ime,
            prezime: profil.prezime,
            email: profil.email,
            telefon: profil.telefon ?? '',
        });

        setError('');
        setEditMode(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            const result =
                await updateProfil(formData);

            setProfil(result);

            setFormData({
                ime: result.ime,
                prezime: result.prezime,
                email: result.email,
                telefon:
                    result.telefon ?? '',
            });

            const korisnikJson =
                localStorage.getItem(
                    'korisnik',
                );

            if (korisnikJson) {
                const korisnik =
                    JSON.parse(
                        korisnikJson,
                    );

                localStorage.setItem(
                    'korisnik',
                    JSON.stringify({
                        ...korisnik,
                        ime: result.ime,
                        prezime:
                            result.prezime,
                        email: result.email,
                    }),
                );
            }

            setEditMode(false);

            setSuccess(
                'Podaci su uspešno izmenjeni.',
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="profil-page">
                <div className="profil-state">
                    Učitavanje profila...
                </div>
            </div>
        );
    }

    return (
        <div className="profil-page">
            <main className="profil-container">
                <div className="profil-heading">
                    <div>
                        <span>
                            Korisnički nalog
                        </span>

                        <h1>
                            {profil.ime} {profil.prezime}
                        </h1>

                        <p>
                            Pregledajte i izmenite
                            podatke svog naloga.
                        </p>
                    </div>

                    {!editMode && (
                        <button
                            type="button"
                            className="profil-edit-button"
                            onClick={handleEdit}
                        >
                            Izmeni podatke
                        </button>
                    )}
                </div>

                {error && (
                    <div className="profil-message profil-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="profil-message profil-success">
                        {success}
                    </div>
                )}

                <form
                    className="profil-card"
                    onSubmit={handleSubmit}
                >
                    <div className="profil-form-grid">

                        <div className="profil-field">
                            <label htmlFor="ime">
                                Ime
                            </label>

                            {editMode ? (
                                <input
                                    id="ime"
                                    name="ime"
                                    value={
                                        formData.ime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            ) : (
                                <div className="profil-value">
                                    {profil.ime}
                                </div>
                            )}
                        </div>

                        <div className="profil-field">
                            <label htmlFor="prezime">
                                Prezime
                            </label>

                            {editMode ? (
                                <input
                                    id="prezime"
                                    name="prezime"
                                    value={
                                        formData.prezime
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            ) : (
                                <div className="profil-value">
                                    {
                                        profil.prezime
                                    }
                                </div>
                            )}
                        </div>

                        <div className="profil-field">
                            <label htmlFor="email">
                                Email adresa
                            </label>

                            {editMode ? (
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            ) : (
                                <div className="profil-value">
                                    {profil.email}
                                </div>
                            )}
                        </div>

                        <div className="profil-field">
                            <label htmlFor="telefon">
                                Broj telefona
                            </label>

                            {editMode ? (
                                <input
                                    id="telefon"
                                    name="telefon"
                                    value={
                                        formData.telefon
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            ) : (
                                <div className="profil-value">
                                    {profil.telefon ||
                                        'Nije unet'}
                                </div>
                            )}
                        </div>
                    </div>

                    {editMode && (
                        <div className="profil-actions">
                            <button
                                type="button"
                                className="profil-cancel-button"
                                onClick={handleCancel}
                                disabled={isSaving}
                            >
                                Odustani
                            </button>

                            <button
                                type="submit"
                                className="profil-save-button"
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? 'Čuvanje...'
                                    : 'Sačuvaj izmene'}
                            </button>
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
}

export default ProfilPage;