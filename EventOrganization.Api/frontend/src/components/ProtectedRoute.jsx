import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem('token');
    const korisnikJson = localStorage.getItem('korisnik');

    if (!token || !korisnikJson) {
        return <Navigate to="/login" replace />;
    }

    const korisnik = JSON.parse(korisnikJson);

    if (
        allowedRoles &&
        !allowedRoles.includes(korisnik.uloga)
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;