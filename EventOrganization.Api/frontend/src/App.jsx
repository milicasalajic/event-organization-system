import { Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import RestoraniPage from './pages/RestoraniPage.jsx';
import MojRestoranPage from './pages/MojRestoranPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/restorani"
                element={
                    <ProtectedRoute
                        allowedRoles={['ADMINISTRATOR', 'KLIJENT']}
                    >
                        <RestoraniPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/moj-restoran"
                element={
                    <ProtectedRoute
                        allowedRoles={['MENADZER', 'OPERATER']}
                    >
                        <MojRestoranPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}

export default App;