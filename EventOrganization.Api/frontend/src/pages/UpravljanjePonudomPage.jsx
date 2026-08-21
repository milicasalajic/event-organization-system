import {
    useEffect,
    useState,
} from 'react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
import { getRestoranById } from '../api/restoranApi';
import {
    addPaket,
    deletePaket,
    getPaketiByRestoranId,
    updatePaket,
} from '../api/paketApi';
import './UpravljanjePonudomPage.css';

function UpravljanjePonudomPage() {
    const { restoranId } = useParams();
    const navigate = useNavigate();

    const [restoran, setRestoran] =
        useState(null);

    const [paketi, setPaketi] =
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
        paketZaIzmenu,
        setPaketZaIzmenu,
    ] = useState(null);

    const [
        paketZaBrisanje,
        setPaketZaBrisanje,
    ] = useState(null);

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        deleteLoading,
        setDeleteLoading,
    ] = useState(false);

    const [
        actionError,
        setActionError,
    ] = useState('');

    const [formData, setFormData] =
        useState({
            naziv: '',
            opis: '',
        });

    useEffect(() => {
        async function loadPage() {
            setIsLoading(true);
            setError('');

            try {
                const [
                    restoranResult,
                    paketiResult,
                ] = await Promise.all([
                    getRestoranById(
                        restoranId,
                    ),
                    getPaketiByRestoranId(
                        restoranId,
                    ),
                ]);

                setRestoran(
                    restoranResult,
                );

                setPaketi(
                    paketiResult,
                );
            } catch (error) {
                setError(
                    error.message,
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadPage();
    }, [restoranId]);

    function handleChange(event) {
        const { name, value } =
            event.target;

        setFormData(
            (prev) => ({
                ...prev,
                [name]: value,
            }),
        );
    }

    function handleDodajPaket() {
        setActionError('');
        setPaketZaIzmenu(null);

        setFormData({
            naziv: '',
            opis: '',
        });

        setPrikaziFormu(true);
    }

    function handleIzmeniPaket(paket) {
        setActionError('');

        setPaketZaIzmenu(
            paket,
        );

        setFormData({
            naziv:
                paket.naziv ?? '',
            opis:
                paket.opis ?? '',
        });

        setPrikaziFormu(true);
    }

    function handleOdustani() {
        if (isSaving) {
            return;
        }

        setPrikaziFormu(false);
        setPaketZaIzmenu(null);
        setActionError('');
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIsSaving(true);
        setActionError('');

        try {
            if (paketZaIzmenu) {
                const izmenjenPaket =
                    await updatePaket(
                        restoranId,
                        paketZaIzmenu.paketId,
                        formData,
                    );

                setPaketi(
                    (prev) =>
                        prev.map(
                            (paket) =>
                                paket.paketId ===
                                    izmenjenPaket.paketId
                                    ? izmenjenPaket
                                    : paket,
                        ),
                );
            } else {
                const noviPaket =
                    await addPaket(
                        restoranId,
                        formData,
                    );

                setPaketi(
                    (prev) => [
                        ...prev,
                        noviPaket,
                    ],
                );
            }

            setPrikaziFormu(false);
            setPaketZaIzmenu(null);
        } catch (error) {
            setActionError(
                error.message,
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function handlePotvrdiBrisanje() {
        if (!paketZaBrisanje) {
            return;
        }

        setDeleteLoading(true);
        setActionError('');

        try {
            await deletePaket(
                restoranId,
                paketZaBrisanje.paketId,
            );

            setPaketi(
                (prev) =>
                    prev.filter(
                        (paket) =>
                            paket.paketId !==
                            paketZaBrisanje.paketId,
                    ),
            );

            setPaketZaBrisanje(null);
        } catch (error) {
            setActionError(
                error.message,
            );
        } finally {
            setDeleteLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="upravljanje-ponudom-page">
                <div className="upravljanje-state">
                    Učitavanje ponude...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="upravljanje-ponudom-page">
                <div className="upravljanje-state upravljanje-state-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="upravljanje-ponudom-page">
            <main className="upravljanje-ponudom-container">

                <button
                    type="button"
                    className="upravljanje-nazad-button"
                    onClick={() =>
                        navigate(
                            `/restorani/${restoranId}`,
                        )
                    }
                >
                    ← Nazad na restoran
                </button>

                <div className="upravljanje-page-header">
                    <span>
                        Upravljanje ponudom
                    </span>

                    <h1>
                        {restoran?.naziv}
                    </h1>

                    <p>
                        Upravljanje ponudom
                        restorana.
                    </p>
                </div>

                <div className="upravljanje-layout">

                    <aside className="upravljanje-sidebar">

                        <div className="upravljanje-nav-item disabled">
                            <div>
                                <strong>
                                    Sale
                                </strong>

                                <small>
                                    Upravljanje salama
                                </small>
                            </div>
                        </div>

                        <div className="upravljanje-nav-item aktivan">
                            <div>
                                <strong>
                                    Paketi
                                </strong>

                                <small>
                                    Upravljanje paketima
                                </small>
                            </div>
                        </div>

                        <div className="upravljanje-nav-item disabled">
                            <div>
                                <strong>
                                    Cenovnik
                                </strong>

                                <small>
                                    Upravljanje cenama
                                </small>
                            </div>
                        </div>

                        <div className="upravljanje-nav-item disabled">
                            <div>
                                <strong>
                                    Dodatne usluge
                                </strong>

                                <small>
                                    Partneri i izvođači
                                </small>
                            </div>
                        </div>

                    </aside>

                    <section className="upravljanje-content">

                        <div className="management-section-header">
                            <div>
                                <span>
                                    Ponuda restorana
                                </span>

                                <h2>
                                    Paketi
                                </h2>

                                <p>
                                    Dodavanje, izmena i
                                    brisanje paketa koji
                                    pripadaju restoranu.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="management-primary-button"
                                onClick={
                                    handleDodajPaket
                                }
                            >
                                + Dodaj paket
                            </button>
                        </div>

                        {actionError &&
                            !prikaziFormu &&
                            !paketZaBrisanje && (
                                <div className="management-error">
                                    {actionError}
                                </div>
                            )}

                        {paketi.length === 0 ? (
                            <div className="management-empty">
                                <h3>
                                    Nema paketa
                                </h3>

                                <p>
                                    Ovaj restoran trenutno
                                    nema evidentirane
                                    pakete.
                                </p>
                            </div>
                        ) : (
                            <div className="management-table-wrapper">
                                <table className="management-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                Naziv
                                            </th>

                                            <th>
                                                Opis
                                            </th>

                                            <th>
                                                Akcije
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {paketi.map(
                                            (paket) => (
                                                <tr
                                                    key={
                                                        paket.paketId
                                                    }
                                                >
                                                    <td>
                                                        <strong>
                                                            {
                                                                paket.naziv
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td className="management-description-cell">
                                                        {paket.opis ||
                                                            '-'}
                                                    </td>

                                                    <td>
                                                        <div className="management-row-actions">
                                                            <button
                                                                type="button"
                                                                className="management-edit-button"
                                                                onClick={() =>
                                                                    handleIzmeniPaket(
                                                                        paket,
                                                                    )
                                                                }
                                                            >
                                                                Izmeni
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="management-delete-button"
                                                                onClick={() => {
                                                                    setActionError(
                                                                        '',
                                                                    );

                                                                    setPaketZaBrisanje(
                                                                        paket,
                                                                    );
                                                                }}
                                                            >
                                                                Obriši
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {prikaziFormu && (
                <div className="management-modal-overlay">
                    <form
                        className="management-form-modal"
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <div className="management-form-header">
                            <span>
                                {paketZaIzmenu
                                    ? 'Izmena'
                                    : 'Dodavanje'}
                            </span>

                            <h2>
                                {paketZaIzmenu
                                    ? 'Izmena paketa'
                                    : 'Novi paket'}
                            </h2>

                            <p>
                                Unesite osnovne
                                podatke o paketu.
                            </p>
                        </div>

                        {actionError && (
                            <div className="management-error">
                                {actionError}
                            </div>
                        )}

                        <div className="management-form-grid">

                            <div className="management-field management-full-field">
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

                            <div className="management-field management-full-field">
                                <label htmlFor="opis">
                                    Opis
                                </label>

                                <textarea
                                    id="opis"
                                    name="opis"
                                    rows="5"
                                    value={
                                        formData.opis
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>

                        <div className="management-form-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={
                                    isSaving
                                }
                                onClick={
                                    handleOdustani
                                }
                            >
                                Odustani
                            </button>

                            <button
                                type="submit"
                                className="management-primary-button"
                                disabled={
                                    isSaving
                                }
                            >
                                {isSaving
                                    ? 'Čuvanje...'
                                    : paketZaIzmenu
                                        ? 'Sačuvaj izmene'
                                        : 'Dodaj paket'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {paketZaBrisanje && (
                <div className="management-modal-overlay">
                    <div className="management-confirm-modal">

                        <div className="management-confirm-icon">
                            !
                        </div>

                        <h2>
                            Brisanje paketa
                        </h2>

                        <p>
                            Da li ste sigurni da
                            želite da obrišete paket{' '}
                            <strong>
                                {
                                    paketZaBrisanje.naziv
                                }
                            </strong>
                            ?
                        </p>

                        <span className="management-confirm-note">
                            Paket će biti uklonjen iz
                            aktivne ponude restorana.
                        </span>

                        {actionError && (
                            <div className="management-error">
                                {actionError}
                            </div>
                        )}

                        <div className="management-confirm-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={
                                    deleteLoading
                                }
                                onClick={() => {
                                    setPaketZaBrisanje(
                                        null,
                                    );

                                    setActionError(
                                        '',
                                    );
                                }}
                            >
                                Odustani
                            </button>

                            <button
                                type="button"
                                className="management-danger-button"
                                disabled={
                                    deleteLoading
                                }
                                onClick={
                                    handlePotvrdiBrisanje
                                }
                            >
                                {deleteLoading
                                    ? 'Brisanje...'
                                    : 'Obriši paket'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpravljanjePonudomPage;