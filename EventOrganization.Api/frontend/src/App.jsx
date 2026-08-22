import { Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import RestoraniPage from './pages/RestoraniPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RestoranDetaljiPage from './pages/RestoranDetaljiPage.jsx';
import ProfilPage from './pages/ProfilPage';
import RezervacijeRestoranaPage from './pages/RezervacijeRestoranaPage.jsx';
import UpravljanjePonudomPage from './pages/UpravljanjePonudomPage';
import CenovnikPage from './pages/CenovnikPage';
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
                path="*"
                element={<Navigate to="/" replace />}
            />
            <Route
                path="/restorani/:restoranId"
                element={
                    <ProtectedRoute>
                        <RestoranDetaljiPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profil"
                element={
                    <ProtectedRoute>
                        <ProfilPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/restorani/:restoranId/rezervacije"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            'MENADZER',
                            'OPERATER',
                        ]}
                    >
                        <RezervacijeRestoranaPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/restorani/:restoranId/upravljanje-ponudom"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            'MENADZER',
                        ]}
                    >
                        <UpravljanjePonudomPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/restorani/:restoranId/cenovnik"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            'MENADZER',
                            'OPERATER',
                        ]}
                    >
                        <CenovnikPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;