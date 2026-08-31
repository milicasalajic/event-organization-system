import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    getProfil,
    updateProfil,
    izmeniLozinku,
} from '../api/korisnikApi';

import './ProfilPage.css';

function ProfilPage() {
    const navigate = useNavigate();

    const [profil, setProfil] = useState(null);

    const [formData, setFormData] = useState({
        ime: '',
        prezime: '',
        email: '',
        telefon: '',
    });

    const [lozinkaFormData, setLozinkaFormData] = useState({
        trenutnaLozinka: '',
        novaLozinka: '',
        ponovljenaLozinka: '',
    });

    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lozinkaSaving, setLozinkaSaving] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [lozinkaError, setLozinkaError] = useState('');
    const [lozinkaSuccess, setLozinkaSuccess] = useState('');

    const korisnikJson = localStorage.getItem('korisnik');
    const korisnik = korisnikJson ? JSON.parse(korisnikJson) : null;

    const jeRadnik =
        korisnik?.uloga === 'MENADZER' ||
        korisnik?.uloga === 'OPERATER';

    useEffect(() => {
        async function loadProfil() {
            try {
                const result = await getProfil();

                setProfil(result);

                setFormData({
                    ime: result.ime,
                    prezime: result.prezime,
                    email: result.email,
                    telefon: result.telefon ?? '',
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadProfil();
    }, []);

    function handleNazad() {
        const postojiPrethodnaStranica = window.history.state?.idx > 0;

        if (postojiPrethodnaStranica) {
            navigate(-1);
            return;
        }

        if (jeRadnik && korisnik?.restoranId) {
            navigate(`/restorani/${korisnik.restoranId}`);
            return;
        }

        navigate('/restorani');
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleLozinkaChange(event) {
        const { name, value } = event.target;

        setLozinkaFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setLozinkaError('');
        setLozinkaSuccess('');
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
            const result = await updateProfil(formData);

            setProfil(result);

            setFormData({
                ime: result.ime,
                prezime: result.prezime,
                email: result.email,
                telefon: result.telefon ?? '',
            });

            const korisnikJson = localStorage.getItem('korisnik');

            if (korisnikJson) {
                const korisnik = JSON.parse(korisnikJson);

                localStorage.setItem(
                    'korisnik',
                    JSON.stringify({
                        ...korisnik,
                        ime: result.ime,
                        prezime: result.prezime,
                        email: result.email,
                    }),
                );
            }

            setEditMode(false);
            setSuccess('Podaci su uspešno izmenjeni.');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleLozinkaSubmit(event) {
        event.preventDefault();

        setLozinkaError('');
        setLozinkaSuccess('');

        if (
            !lozinkaFormData.trenutnaLozinka ||
            !lozinkaFormData.novaLozinka ||
            !lozinkaFormData.ponovljenaLozinka
        ) {
            setLozinkaError('Popunite sva polja.');
            return;
        }

        if (
            lozinkaFormData.novaLozinka !==
            lozinkaFormData.ponovljenaLozinka
        ) {
            setLozinkaError(
                'Nova lozinka i ponovljena lozinka se ne podudaraju.',
            );
            return;
        }

        setLozinkaSaving(true);

        try {
            await izmeniLozinku(lozinkaFormData);

            setLozinkaFormData({
                trenutnaLozinka: '',
                novaLozinka: '',
                ponovljenaLozinka: '',
            });

            setLozinkaSuccess('Lozinka je uspešno promenjena.');
        } catch (error) {
            setLozinkaError(error.message);
        } finally {
            setLozinkaSaving(false);
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
                <button
                    type="button"
                    className="profil-nazad-button"
                    onClick={handleNazad}
                >
                    ← Nazad
                </button>

                <div className="profil-heading">
                    <div>
                        <span>Korisnički nalog</span>

                        <h1>
                            {profil.ime} {profil.prezime}
                        </h1>

                        <p>
                            Pregledajte i izmenite podatke svog naloga.
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
                                    value={formData.ime}
                                    onChange={handleChange}
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
                                    value={formData.prezime}
                                    onChange={handleChange}
                                    required
                                />
                            ) : (
                                <div className="profil-value">
                                    {profil.prezime}
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
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    value={formData.telefon}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="profil-value">
                                    {profil.telefon || 'Nije unet'}
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

                <section className="profil-password-section">
                    <div className="profil-section-heading">
                        <span className="profil-section-kicker">
                            Bezbednost naloga
                        </span>

                        <h2 className="profil-section-title">
                            Promena lozinke
                        </h2>

                        <p className="profil-section-description">
                            Unesite trenutnu lozinku i zatim novu lozinku.
                        </p>
                    </div>

                    {lozinkaError && (
                        <div className="profil-message profil-error">
                            {lozinkaError}
                        </div>
                    )}

                    {lozinkaSuccess && (
                        <div className="profil-message profil-success">
                            {lozinkaSuccess}
                        </div>
                    )}

                    <form
                        className="profil-card profil-password-card"
                        onSubmit={handleLozinkaSubmit}
                    >
                        <div className="profil-password-grid">
                            <div className="profil-field profil-password-current">
                                <label htmlFor="trenutnaLozinka">
                                    Trenutna lozinka
                                </label>

                                <input
                                    id="trenutnaLozinka"
                                    name="trenutnaLozinka"
                                    type="password"
                                    value={lozinkaFormData.trenutnaLozinka}
                                    onChange={handleLozinkaChange}
                                    required
                                />
                            </div>

                            <div className="profil-field">
                                <label htmlFor="novaLozinka">
                                    Nova lozinka
                                </label>

                                <input
                                    id="novaLozinka"
                                    name="novaLozinka"
                                    type="password"
                                    value={lozinkaFormData.novaLozinka}
                                    onChange={handleLozinkaChange}
                                    required
                                />
                            </div>

                            <div className="profil-field">
                                <label htmlFor="ponovljenaLozinka">
                                    Ponovite novu lozinku
                                </label>

                                <input
                                    id="ponovljenaLozinka"
                                    name="ponovljenaLozinka"
                                    type="password"
                                    value={lozinkaFormData.ponovljenaLozinka}
                                    onChange={handleLozinkaChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="profil-actions profil-password-actions">
                            <button
                                type="submit"
                                className="profil-save-button"
                                disabled={lozinkaSaving}
                            >
                                {lozinkaSaving
                                    ? 'Čuvanje...'
                                    : 'Promeni lozinku'}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default ProfilPage;