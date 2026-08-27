import { useState } from 'react'; //komponenta pomocu koje pamtimo stanje neko i  mozemo ga menjati
import { useNavigate } from 'react-router-dom'; //navigacija izmedju stranica
import { login } from '../api/AuthApi';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] =
        useState('');

    const [lozinka, setLozinka] =
        useState('');

    const [error, setError] =
        useState('');

    const [fieldErrors, setFieldErrors] =
        useState({
            email: '',
            lozinka: '',
        });

    const [isLoading, setIsLoading] =
        useState(false);

    async function handleSubmit(event) {
        event.preventDefault();//html sam kad se stisne dugme hoce da osvezi a u reactu to necemo, jer rucno hoce
                                // da obavi sta je potrebno

        setError('');

        const errors = {
            email: '',
            lozinka: '',
        };

        if (!email.trim()) {
            errors.email =
                'Email adresa je obavezna.';
        }

        if (!lozinka.trim()) {
            errors.lozinka =
                'Lozinka je obavezna.';
        }

        setFieldErrors(errors);

        if (
            errors.email ||
            errors.lozinka
        ) {
            return;
        }

        setIsLoading(true);

        try {
            const result =
                await login(
                    email,
                    lozinka,
                );

            localStorage.setItem( //localStorage-memorija browsera
                'token',
                result.token,
            );

            localStorage.setItem(
                'korisnik',
                JSON.stringify({
                    korisnikId:
                        result.korisnikId,
                    ime:
                        result.ime,
                    prezime:
                        result.prezime,
                    email:
                        result.email,
                    uloga:
                        result.uloga,
                    restoranId:
                        result.restoranId,
                }),
            );

            navigate('/');
        } catch (error) {
            setError(
                error.message,
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-container">

                <section className="auth-visual">

                    <div className="auth-image auth-image-drinks">
                        <img
                            src="/images/log1.jpg"
                            alt="Proslava"
                        />
                    </div>

                    <div className="auth-image auth-image-wedding">
                        <img
                            src="/images/log2.jpg"
                            alt="Venčanje"
                        />
                    </div>

                    <div className="auth-image auth-image-dessert">
                        <img
                            src="/images/log3.jpg"
                            alt="Poslastice"
                        />
                    </div>

                </section>

                <section className="auth-login-section">

                    <form
                        className="auth-form"
                        onSubmit={
                            handleSubmit
                        }
                        noValidate
                    >
                        <div className="auth-form-header">

                            <span className="auth-kicker">
                                Organizacija događaja
                            </span>

                            <h1>
                                Dobro došli
                            </h1>

                            <p>
                                Prijavite se kako biste
                                nastavili sa korišćenjem
                                sistema.
                            </p>

                        </div>

                        <div className="form-group">

                            <label htmlFor="email">
                                Email adresa
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={
                                    email
                                }
                                onChange={(
                                    event,
                                ) => {
                                    setEmail(
                                        event
                                            .target
                                            .value,
                                    );

                                    setFieldErrors(
                                        (prev) => ({
                                            ...prev,
                                            email: '',
                                        }),
                                    );
                                }}
                                placeholder="Unesite email adresu"
                            />

                            {fieldErrors.email && (
                                <span className="field-error">
                                    {
                                        fieldErrors.email
                                    }
                                </span>
                            )}

                        </div>

                        <div className="form-group">

                            <label htmlFor="lozinka">
                                Lozinka
                            </label>

                            <input
                                id="lozinka"
                                type="password"
                                value={
                                    lozinka
                                }
                                onChange={(
                                    event,
                                ) => {
                                    setLozinka(
                                        event
                                            .target
                                            .value,
                                    );

                                    setFieldErrors(
                                        (prev) => ({
                                            ...prev,
                                            lozinka: '',
                                        }),
                                    );
                                }}
                                placeholder="Unesite lozinku"
                            />

                            {fieldErrors.lozinka && (
                                <span className="field-error">
                                    {
                                        fieldErrors.lozinka
                                    }
                                </span>
                            )}

                        </div>

                        {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="auth-submit-button"
                            disabled={
                                isLoading
                            }
                        >
                            {isLoading
                                ? 'Prijavljivanje...'
                                : 'Prijava'}
                        </button>

                    </form>

                </section>

            </div>

        </div>
    );
}

export default LoginPage;