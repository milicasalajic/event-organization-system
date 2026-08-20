import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    addRestoran,
    deleteRestoran,
    getAllRestorani,
} from '../api/restoranApi';
import './RestoraniPage.css';

function RestoraniPage() {
    const navigate = useNavigate();

    const [restorani, setRestorani] =
        useState([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState('');

    const [
        prikaziFormu,
        setPrikaziFormu,
    ] = useState(false);

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        dodavanjeError,
        setDodavanjeError,
    ] = useState('');

    const [
        deleteError,
        setDeleteError,
    ] = useState('');

    const [
        deletingId,
        setDeletingId,
    ] = useState(null);

    const [
        restoranZaBrisanje,
        setRestoranZaBrisanje,
    ] = useState(null);

    const [
        formData,
        setFormData,
    ] = useState({
        naziv: '',
        telefon: '',
        radnoVreme: '',
        adresa: '',
        grad: '',
    });

    const korisnikJson =
        localStorage.getItem('korisnik');

    const korisnik =
        korisnikJson
            ? JSON.parse(korisnikJson)
            : null;

    const jeAdministrator =
        korisnik?.uloga ===
        'ADMINISTRATOR';

    const aktivniRestorani =
        restorani.filter(
            (restoran) =>
                restoran.status === 'AKTIVNO',
        );

    const neaktivniRestorani =
        jeAdministrator
            ? restorani.filter(
                (restoran) =>
                    restoran.status ===
                    'NEAKTIVNO',
            )
            : [];

    useEffect(() => {
        async function loadRestorani() {
            try {
                const result =
                    await getAllRestorani();

                setRestorani(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadRestorani();
    }, []);

    function handleChange(event) {
        const { name, value } =
            event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleOdustani() {
        setPrikaziFormu(false);
        setDodavanjeError('');

        setFormData({
            naziv: '',
            telefon: '',
            radnoVreme: '',
            adresa: '',
            grad: '',
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsSaving(true);
        setDodavanjeError('');

        try {
            const noviRestoran =
                await addRestoran(
                    formData,
                );

            setRestorani(
                (prev) => [
                    ...prev,
                    {
                        ...noviRestoran,
                        status:
                            noviRestoran.status ??
                            'AKTIVNO',
                    },
                ],
            );

            setFormData({
                naziv: '',
                telefon: '',
                radnoVreme: '',
                adresa: '',
                grad: '',
            });

            setPrikaziFormu(false);
        } catch (error) {
            setDodavanjeError(
                error.message,
            );
        } finally {
            setIsSaving(false);
        }
    }

    function handleOtvoriBrisanje(
        event,
        restoran,
    ) {
        event.stopPropagation();

        setDeleteError('');
        setRestoranZaBrisanje(
            restoran,
        );
    }

    function handleOdustaniOdBrisanja() {
        if (deletingId !== null) {
            return;
        }

        setRestoranZaBrisanje(null);
        setDeleteError('');
    }

    async function handlePotvrdiBrisanje() {
        if (!restoranZaBrisanje) {
            return;
        }

        const restoranId =
            restoranZaBrisanje.restoranId;

        setDeletingId(restoranId);
        setDeleteError('');

        try {
            await deleteRestoran(
                restoranId,
            );

            setRestorani(
                (prev) =>
                    prev.map(
                        (restoran) =>
                            restoran.restoranId ===
                                restoranId
                                ? {
                                    ...restoran,
                                    status:
                                        'NEAKTIVNO',
                                }
                                : restoran,
                    ),
            );

            setRestoranZaBrisanje(null);
        } catch (error) {
            setDeleteError(
                error.message,
            );
        } finally {
            setDeletingId(null);
        }
    }

    if (isLoading) {
        return (
            <p className="restorani-loading">
                Učitavanje restorana...
            </p>
        );
    }

    if (error) {
        return (
            <p className="restorani-error">
                {error}
            </p>
        );
    }

    return (
        <div className="restorani-page">
            <div className="restorani-container">

                <div className="restorani-header">
                    <div>
                        <h1>
                            Restorani
                        </h1>

                        <p>
                            Izaberite restoran i
                            pogledajte njegovu ponudu.
                        </p>
                    </div>

                    {jeAdministrator && (
                        <button
                            type="button"
                            className="dodaj-restoran-button"
                            onClick={() =>
                                setPrikaziFormu(
                                    (prev) => !prev,
                                )
                            }
                        >
                            + Dodaj restoran
                        </button>
                    )}
                </div>

                {jeAdministrator &&
                    prikaziFormu && (
                        <form
                            className="dodaj-restoran-forma"
                            onSubmit={
                                handleSubmit
                            }
                        >
                            <div className="dodaj-restoran-forma-header">
                                <div>
                                    <span>
                                        Administracija
                                    </span>

                                    <h2>
                                        Novi restoran
                                    </h2>

                                    <p>
                                        Unesite osnovne
                                        podatke restorana.
                                    </p>
                                </div>
                            </div>

                            {dodavanjeError && (
                                <div className="dodaj-restoran-error">
                                    {
                                        dodavanjeError
                                    }
                                </div>
                            )}

                            <div className="dodaj-restoran-grid">

                                <div className="restoran-form-field">
                                    <label htmlFor="naziv">
                                        Naziv
                                    </label>

                                    <input
                                        id="naziv"
                                        name="naziv"
                                        value={
                                            formData.naziv
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>

                                <div className="restoran-form-field">
                                    <label htmlFor="telefon">
                                        Telefon
                                    </label>

                                    <input
                                        id="telefon"
                                        name="telefon"
                                        value={
                                            formData.telefon
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>

                                <div className="restoran-form-field">
                                    <label htmlFor="radnoVreme">
                                        Radno vreme
                                    </label>

                                    <input
                                        id="radnoVreme"
                                        name="radnoVreme"
                                        value={
                                            formData.radnoVreme
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="08:00-23:00"
                                        required
                                    />
                                </div>

                                <div className="restoran-form-field">
                                    <label htmlFor="grad">
                                        Grad
                                    </label>

                                    <input
                                        id="grad"
                                        name="grad"
                                        value={
                                            formData.grad
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>

                                <div className="restoran-form-field restoran-adresa-field">
                                    <label htmlFor="adresa">
                                        Adresa
                                    </label>

                                    <input
                                        id="adresa"
                                        name="adresa"
                                        value={
                                            formData.adresa
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="dodaj-restoran-actions">
                                <button
                                    type="button"
                                    className="odustani-restoran-button"
                                    onClick={
                                        handleOdustani
                                    }
                                    disabled={
                                        isSaving
                                    }
                                >
                                    Odustani
                                </button>

                                <button
                                    type="submit"
                                    className="sacuvaj-restoran-button"
                                    disabled={
                                        isSaving
                                    }
                                >
                                    {isSaving
                                        ? 'Čuvanje...'
                                        : 'Dodaj restoran'}
                                </button>
                            </div>
                        </form>
                    )}

                {aktivniRestorani.length ===
                    0 ? (
                    <p className="restorani-empty">
                        Trenutno nema aktivnih
                        restorana u sistemu.
                    </p>
                ) : (
                    <div className="restorani-lista">
                        {aktivniRestorani.map(
                            (restoran) => (
                                <div
                                    className="restoran-card"
                                    key={
                                        restoran.restoranId
                                    }
                                    onClick={() =>
                                        navigate(
                                            `/restorani/${restoran.restoranId}`,
                                        )
                                    }
                                >
                                    <div className="restoran-sadrzaj">
                                        <h2>
                                            {
                                                restoran.naziv
                                            }
                                        </h2>

                                        <div className="restoran-info">
                                            <p>
                                                <strong>
                                                    Adresa:
                                                </strong>{' '}
                                                {
                                                    restoran.adresa
                                                }
                                            </p>

                                            <p>
                                                <strong>
                                                    Grad:
                                                </strong>{' '}
                                                {
                                                    restoran.grad
                                                }
                                            </p>

                                            <p>
                                                <strong>
                                                    Telefon:
                                                </strong>{' '}
                                                {
                                                    restoran.telefon
                                                }
                                            </p>

                                            {restoran.radnoVreme && (
                                                <p>
                                                    <strong>
                                                        Radno vreme:
                                                    </strong>{' '}
                                                    {
                                                        restoran.radnoVreme
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="restoran-card-akcije">
                                        <span className="restoran-detalji">
                                            Pogledaj detalje →
                                        </span>

                                        {jeAdministrator && (
                                            <button
                                                type="button"
                                                className="obrisi-restoran-button"
                                                onClick={(
                                                    event,
                                                ) =>
                                                    handleOtvoriBrisanje(
                                                        event,
                                                        restoran,
                                                    )
                                                }
                                            >
                                                Obriši
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                )}

                {jeAdministrator &&
                    neaktivniRestorani.length >
                    0 && (
                        <div className="neaktivni-restorani-sekcija">


                            <div className="restorani-lista">
                                {neaktivniRestorani.map(
                                    (
                                        restoran,
                                    ) => (
                                        <div
                                            className="restoran-card restoran-card-neaktivan"
                                            key={
                                                restoran.restoranId
                                            }
                                        >
                                            <div className="restoran-sadrzaj">

                                                <div className="neaktivan-naslov">
                                                    <h2>
                                                        {
                                                            restoran.naziv
                                                        }
                                                    </h2>

                                                    <span className="neaktivan-badge">
                                                        Neaktivan
                                                    </span>
                                                </div>

                                                <div className="restoran-info">
                                                    <p>
                                                        <strong>
                                                            Adresa:
                                                        </strong>{' '}
                                                        {
                                                            restoran.adresa
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Grad:
                                                        </strong>{' '}
                                                        {
                                                            restoran.grad
                                                        }
                                                    </p>

                                                    <p>
                                                        <strong>
                                                            Telefon:
                                                        </strong>{' '}
                                                        {
                                                            restoran.telefon
                                                        }
                                                    </p>

                                                    {restoran.radnoVreme && (
                                                        <p>
                                                            <strong>
                                                                Radno vreme:
                                                            </strong>{' '}
                                                            {
                                                                restoran.radnoVreme
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    )}
            </div>

            {restoranZaBrisanje && (
                <div className="brisanje-modal-overlay">
                    <div className="brisanje-modal">

                        <div className="brisanje-modal-icon">
                            !
                        </div>

                        <h2>
                            Brisanje restorana
                        </h2>

                        <p>
                            Da li ste sigurni da želite
                            da obrišete restoran
                            <strong>
                                {' '}
                                {
                                    restoranZaBrisanje.naziv
                                }
                            </strong>
                            ?
                        </p>

                        <span className="brisanje-modal-napomena">
                            Restoran će biti označen
                            kao neaktivan i više neće
                            biti dostupan klijentima.
                        </span>

                        {deleteError && (
                            <div className="brisanje-restorana-error">
                                {deleteError}
                            </div>
                        )}

                        <div className="brisanje-modal-actions">
                            <button
                                type="button"
                                className="brisanje-modal-odustani"
                                disabled={
                                    deletingId !== null
                                }
                                onClick={
                                    handleOdustaniOdBrisanja
                                }
                            >
                                Odustani
                            </button>

                            <button
                                type="button"
                                className="brisanje-modal-potvrdi"
                                disabled={
                                    deletingId !== null
                                }
                                onClick={
                                    handlePotvrdiBrisanje
                                }
                            >
                                {deletingId !== null
                                    ? 'Brisanje...'
                                    : 'Obriši restoran'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RestoraniPage;