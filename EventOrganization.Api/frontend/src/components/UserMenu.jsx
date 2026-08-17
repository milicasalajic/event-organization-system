import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css';

function UserMenu() {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);

    const menuRef = useRef(null);

    const korisnikJson = localStorage.getItem('korisnik');

    if (!korisnikJson) {
        return null;
    }

    const korisnik = JSON.parse(korisnikJson);

    const inicijali =
        `${korisnik.ime?.[0] ?? ''}${korisnik.prezime?.[0] ?? ''}`
            .toUpperCase();

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener(
            'mousedown',
            handleClickOutside,
        );

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside,
            );
        };
    }, []);

    function handleProfil() {
        setIsOpen(false);
        navigate('/profil');
    }

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('korisnik');

        navigate('/login');
    }

    return (
        <div
            className="user-menu"
            ref={menuRef}
        >
            <button
                className={
                    isOpen
                        ? 'user-avatar otvoren'
                        : 'user-avatar'
                }
                type="button"
                onClick={() =>
                    setIsOpen((prev) => !prev)
                }
                aria-label="Korisnički meni"
            >
                {inicijali}
            </button>

            {isOpen && (
                <div className="user-dropdown">
                    <div className="user-dropdown-header">
                        <strong>
                            {korisnik.ime}{' '}
                            {korisnik.prezime}
                        </strong>

                        <span>
                            {korisnik.email}
                        </span>
                    </div>

                    <div className="user-dropdown-actions">
                        <button
                            type="button"
                            onClick={handleProfil}
                        >
                      

                            Moj profil
                        </button>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            <span className="user-menu-icon">
                                ↪
                            </span>

                            Odjavi se
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
}

export default UserMenu;