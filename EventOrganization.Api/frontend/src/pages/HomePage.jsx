import { Navigate } from 'react-router-dom';

function HomePage() {
    const korisnikJson = localStorage.getItem('korisnik');

    if (!korisnikJson) {
        return <Navigate to="/login" replace />;
    }

    const korisnik = JSON.parse(korisnikJson);

    if (
        korisnik.uloga === 'ADMINISTRATOR' ||
        korisnik.uloga === 'KLIJENT'
    ) {
        return <Navigate to="/restorani" replace />;
    }

    if (
        korisnik.uloga === 'MENADZER' ||
        korisnik.uloga === 'OPERATER'
    ) {
        return (
            <Navigate
                to={`/restorani/${korisnik.restoranId}`}
                replace
            />
        );
    }

    return <Navigate to="/login" replace />;
}

export default HomePage;