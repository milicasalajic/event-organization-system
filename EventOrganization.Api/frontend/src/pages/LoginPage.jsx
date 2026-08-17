import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/AuthApi';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [lozinka, setLozinka] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');
        setIsLoading(true);

        try {
            const result = await login(email, lozinka);

            localStorage.setItem('token', result.token);

            localStorage.setItem(
                'korisnik',
                JSON.stringify({
                    korisnikId: result.korisnikId,
                    ime: result.ime,
                    prezime: result.prezime,
                    email: result.email,
                    uloga: result.uloga,
                    restoranId: result.restoranId,
                }),
            );
            navigate('/');
        }  catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Prijava</h1>

                <div className="form-group">
                    <label htmlFor="email">
                        Email adresa
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="lozinka">
                        Lozinka
                    </label>

                    <input
                        id="lozinka"
                        type="password"
                        value={lozinka}
                        onChange={(event) => setLozinka(event.target.value)}
                        required
                    />
                </div>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Prijavljivanje...' : 'Prijavi se'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;