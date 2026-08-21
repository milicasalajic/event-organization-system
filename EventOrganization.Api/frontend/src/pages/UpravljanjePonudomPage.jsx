import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getRestoranById } from '../api/restoranApi';

import {
    addPaket,
    deletePaket,
    getPaketiByRestoranId,
    updatePaket,
} from '../api/paketApi';

import {
    addKetering,
    deleteKetering,
    getKeteringByRestoranId,
    updateKetering,
} from '../api/keteringApi';

import {
    addFotograf,
    deleteFotograf,
    getFotografiByRestoranId,
    updateFotograf,
} from '../api/fotografApi';

import './UpravljanjePonudomPage.css';

function UpravljanjePonudomPage() {
    const { restoranId } = useParams();
    const navigate = useNavigate();

    const [restoran, setRestoran] = useState(null);
    const [paketi, setPaketi] = useState([]);
    const [keteringFirme, setKeteringFirme] = useState([]);
    const [fotografi, setFotografi] = useState([]);

    const [aktivnaSekcija, setAktivnaSekcija] = useState('PAKETI');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // PAKET

    const [prikaziPaketFormu, setPrikaziPaketFormu] = useState(false);
    const [paketZaIzmenu, setPaketZaIzmenu] = useState(null);
    const [paketZaBrisanje, setPaketZaBrisanje] = useState(null);

    const [paketFormData, setPaketFormData] = useState({
        naziv: '',
        opis: '',
    });

    // KETERING

    const [prikaziKeteringFormu, setPrikaziKeteringFormu] =
        useState(false);

    const [keteringZaIzmenu, setKeteringZaIzmenu] = useState(null);
    const [keteringZaBrisanje, setKeteringZaBrisanje] = useState(null);

    const [keteringFormData, setKeteringFormData] = useState({
        naziv: '',
        telefon: '',
        portfolio: '',
        opis: '',
        paketIds: [],
    });

    // FOTOGRAF

    const [prikaziFotografFormu, setPrikaziFotografFormu] =
        useState(false);

    const [fotografZaIzmenu, setFotografZaIzmenu] = useState(null);
    const [fotografZaBrisanje, setFotografZaBrisanje] = useState(null);

    const [fotografFormData, setFotografFormData] = useState({
        naziv: '',
        telefon: '',
        portfolio: '',
        cenaFoto: '',
        tipFoto: 'FOTOGRAFIJA',
        paketIds: [],
    });

    useEffect(() => {
        async function loadPage() {
            setIsLoading(true);
            setError('');

            try {
                const [
                    restoranResult,
                    paketiResult,
                    keteringResult,
                    fotografiResult,
                ] = await Promise.all([
                    getRestoranById(restoranId),
                    getPaketiByRestoranId(restoranId),
                    getKeteringByRestoranId(restoranId),
                    getFotografiByRestoranId(restoranId),
                ]);

                setRestoran(restoranResult);
                setPaketi(paketiResult);
                setKeteringFirme(keteringResult);
                setFotografi(fotografiResult);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadPage();
    }, [restoranId]);

    function promeniSekciju(sekcija) {
        setAktivnaSekcija(sekcija);
        setActionError('');
    }

    function getNaziviPaketa(paketIds) {
        return paketIds
            .map(
                (paketId) =>
                    paketi.find(
                        (paket) => paket.paketId === paketId,
                    )?.naziv,
            )
            .filter(Boolean)
            .join(', ');
    }

    function formatTipFoto(tipFoto) {
        if (tipFoto === 'FOTOGRAFIJA_SNIMANJE') {
            return 'Fotografija i snimanje';
        }

        if (tipFoto === 'FOTOGRAFIJA') {
            return 'Fotografija';
        }

        return tipFoto;
    }

    // =========================
    // PAKETI
    // =========================

    function handlePaketChange(event) {
        const { name, value } = event.target;

        setPaketFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleDodajPaket() {
        setActionError('');
        setPaketZaIzmenu(null);

        setPaketFormData({
            naziv: '',
            opis: '',
        });

        setPrikaziPaketFormu(true);
    }

    function handleIzmeniPaket(paket) {
        setActionError('');
        setPaketZaIzmenu(paket);

        setPaketFormData({
            naziv: paket.naziv ?? '',
            opis: paket.opis ?? '',
        });

        setPrikaziPaketFormu(true);
    }

    function handleOdustaniPaket() {
        if (isSaving) {
            return;
        }

        setPrikaziPaketFormu(false);
        setPaketZaIzmenu(null);
        setActionError('');
    }

    async function handlePaketSubmit(event) {
        event.preventDefault();

        setIsSaving(true);
        setActionError('');

        try {
            if (paketZaIzmenu) {
                const izmenjenPaket = await updatePaket(
                    restoranId,
                    paketZaIzmenu.paketId,
                    paketFormData,
                );

                setPaketi((prev) =>
                    prev.map((paket) =>
                        paket.paketId === izmenjenPaket.paketId
                            ? izmenjenPaket
                            : paket,
                    ),
                );
            } else {
                const noviPaket = await addPaket(
                    restoranId,
                    paketFormData,
                );

                setPaketi((prev) => [
                    ...prev,
                    noviPaket,
                ]);
            }

            setPrikaziPaketFormu(false);
            setPaketZaIzmenu(null);
        } catch (error) {
            setActionError(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleObrisiPaket() {
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

            const obrisaniPaketId =
                paketZaBrisanje.paketId;

            setPaketi((prev) =>
                prev.filter(
                    (paket) =>
                        paket.paketId !== obrisaniPaketId,
                ),
            );

            setKeteringFirme((prev) =>
                prev.map((ketering) => ({
                    ...ketering,
                    paketIds:
                        ketering.paketIds?.filter(
                            (id) =>
                                id !== obrisaniPaketId,
                        ) ?? [],
                })),
            );

            setFotografi((prev) =>
                prev.map((fotograf) => ({
                    ...fotograf,
                    paketIds:
                        fotograf.paketIds?.filter(
                            (id) =>
                                id !== obrisaniPaketId,
                        ) ?? [],
                })),
            );

            setPaketZaBrisanje(null);
        } catch (error) {
            setActionError(error.message);
        } finally {
            setDeleteLoading(false);
        }
    }

    // =========================
    // KETERING
    // =========================

    function handleKeteringChange(event) {
        const { name, value } = event.target;

        setKeteringFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleKeteringPaketCheckbox(paketId) {
        setKeteringFormData((prev) => {
            const izabran =
                prev.paketIds.includes(paketId);

            return {
                ...prev,
                paketIds: izabran
                    ? prev.paketIds.filter(
                        (id) => id !== paketId,
                    )
                    : [
                        ...prev.paketIds,
                        paketId,
                    ],
            };
        });
    }

    function handleDodajKetering() {
        setActionError('');
        setKeteringZaIzmenu(null);

        setKeteringFormData({
            naziv: '',
            telefon: '',
            portfolio: '',
            opis: '',
            paketIds: [],
        });

        setPrikaziKeteringFormu(true);
    }

    function handleIzmeniKetering(ketering) {
        setActionError('');
        setKeteringZaIzmenu(ketering);

        setKeteringFormData({
            naziv: ketering.naziv ?? '',
            telefon: ketering.telefon ?? '',
            portfolio: ketering.portfolio ?? '',
            opis: ketering.opis ?? '',
            paketIds: ketering.paketIds ?? [],
        });

        setPrikaziKeteringFormu(true);
    }

    function handleOdustaniKetering() {
        if (isSaving) {
            return;
        }

        setPrikaziKeteringFormu(false);
        setKeteringZaIzmenu(null);
        setActionError('');
    }

    async function handleKeteringSubmit(event) {
        event.preventDefault();

        if (keteringFormData.paketIds.length === 0) {
            setActionError(
                'Izaberite najmanje jedan paket.',
            );
            return;
        }

        setIsSaving(true);
        setActionError('');

        try {
            if (keteringZaIzmenu) {
                const izmenjenKetering =
                    await updateKetering(
                        restoranId,
                        keteringZaIzmenu.uslugaId,
                        keteringFormData,
                    );

                setKeteringFirme((prev) =>
                    prev.map((ketering) =>
                        ketering.uslugaId ===
                            izmenjenKetering.uslugaId
                            ? izmenjenKetering
                            : ketering,
                    ),
                );
            } else {
                const noviKetering =
                    await addKetering(
                        restoranId,
                        keteringFormData,
                    );

                setKeteringFirme((prev) => [
                    ...prev,
                    noviKetering,
                ]);
            }

            setPrikaziKeteringFormu(false);
            setKeteringZaIzmenu(null);
        } catch (error) {
            setActionError(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleObrisiKetering() {
        if (!keteringZaBrisanje) {
            return;
        }

        setDeleteLoading(true);
        setActionError('');

        try {
            await deleteKetering(
                restoranId,
                keteringZaBrisanje.uslugaId,
            );

            setKeteringFirme((prev) =>
                prev.filter(
                    (ketering) =>
                        ketering.uslugaId !==
                        keteringZaBrisanje.uslugaId,
                ),
            );

            setKeteringZaBrisanje(null);
        } catch (error) {
            setActionError(error.message);
        } finally {
            setDeleteLoading(false);
        }
    }

    // =========================
    // FOTOGRAFI
    // =========================

    function handleFotografChange(event) {
        const { name, value } = event.target;

        setFotografFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleFotografPaketCheckbox(paketId) {
        setFotografFormData((prev) => {
            const izabran =
                prev.paketIds.includes(paketId);

            return {
                ...prev,
                paketIds: izabran
                    ? prev.paketIds.filter(
                        (id) => id !== paketId,
                    )
                    : [
                        ...prev.paketIds,
                        paketId,
                    ],
            };
        });
    }

    function handleDodajFotograf() {
        setActionError('');
        setFotografZaIzmenu(null);

        setFotografFormData({
            naziv: '',
            telefon: '',
            portfolio: '',
            cenaFoto: '',
            tipFoto: 'FOTOGRAFIJA',
            paketIds: [],
        });

        setPrikaziFotografFormu(true);
    }

    function handleIzmeniFotograf(fotograf) {
        setActionError('');
        setFotografZaIzmenu(fotograf);

        setFotografFormData({
            naziv: fotograf.naziv ?? '',
            telefon: fotograf.telefon ?? '',
            portfolio: fotograf.portfolio ?? '',
            cenaFoto: fotograf.cenaFoto ?? '',
            tipFoto:
                fotograf.tipFoto ??
                'FOTOGRAFIJA',
            paketIds: fotograf.paketIds ?? [],
        });

        setPrikaziFotografFormu(true);
    }

    function handleOdustaniFotograf() {
        if (isSaving) {
            return;
        }

        setPrikaziFotografFormu(false);
        setFotografZaIzmenu(null);
        setActionError('');
    }

    async function handleFotografSubmit(event) {
        event.preventDefault();

        if (fotografFormData.paketIds.length === 0) {
            setActionError(
                'Izaberite najmanje jedan paket.',
            );
            return;
        }

        const data = {
            ...fotografFormData,
            cenaFoto: Number(
                fotografFormData.cenaFoto,
            ),
        };

        setIsSaving(true);
        setActionError('');

        try {
            if (fotografZaIzmenu) {
                const izmenjenFotograf =
                    await updateFotograf(
                        restoranId,
                        fotografZaIzmenu.uslugaId,
                        data,
                    );

                setFotografi((prev) =>
                    prev.map((fotograf) =>
                        fotograf.uslugaId ===
                            izmenjenFotograf.uslugaId
                            ? izmenjenFotograf
                            : fotograf,
                    ),
                );
            } else {
                const noviFotograf =
                    await addFotograf(
                        restoranId,
                        data,
                    );

                setFotografi((prev) => [
                    ...prev,
                    noviFotograf,
                ]);
            }

            setPrikaziFotografFormu(false);
            setFotografZaIzmenu(null);
        } catch (error) {
            setActionError(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleObrisiFotograf() {
        if (!fotografZaBrisanje) {
            return;
        }

        setDeleteLoading(true);
        setActionError('');

        try {
            await deleteFotograf(
                restoranId,
                fotografZaBrisanje.uslugaId,
            );

            setFotografi((prev) =>
                prev.filter(
                    (fotograf) =>
                        fotograf.uslugaId !==
                        fotografZaBrisanje.uslugaId,
                ),
            );

            setFotografZaBrisanje(null);
        } catch (error) {
            setActionError(error.message);
        } finally {
            setDeleteLoading(false);
        }
    }

    // =========================
    // LOADING / ERROR
    // =========================

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
                        Upravljanje ponudom restorana.
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

                        <button
                            type="button"
                            className={
                                aktivnaSekcija === 'PAKETI'
                                    ? 'upravljanje-nav-item aktivan'
                                    : 'upravljanje-nav-item'
                            }
                            onClick={() =>
                                promeniSekciju('PAKETI')
                            }
                        >
                            <div>
                                <strong>
                                    Paketi
                                </strong>

                                <small>
                                    Upravljanje paketima
                                </small>
                            </div>
                        </button>

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

                        <button
                            type="button"
                            className={
                                aktivnaSekcija === 'KETERING'
                                    ? 'upravljanje-nav-item aktivan'
                                    : 'upravljanje-nav-item'
                            }
                            onClick={() =>
                                promeniSekciju('KETERING')
                            }
                        >
                            <div>
                                <strong>
                                    Ketering firme
                                </strong>

                                <small>
                                    Upravljanje ketering firmama
                                </small>
                            </div>
                        </button>

                        <div className="upravljanje-nav-item disabled">
                            <div>
                                <strong>
                                    Dekoraterske firme
                                </strong>

                                <small>
                                    Upravljanje dekoraterskim firmama
                                </small>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={
                                aktivnaSekcija === 'FOTOGRAFI'
                                    ? 'upravljanje-nav-item aktivan'
                                    : 'upravljanje-nav-item'
                            }
                            onClick={() =>
                                promeniSekciju('FOTOGRAFI')
                            }
                        >
                            <div>
                                <strong>
                                    Fotografi
                                </strong>

                                <small>
                                    Upravljanje fotografima
                                </small>
                            </div>
                        </button>

                        <div className="upravljanje-nav-item disabled">
                            <div>
                                <strong>
                                    Muzički izvođači
                                </strong>

                                <small>
                                    Upravljanje izvođačima
                                </small>
                            </div>
                        </div>
                    </aside>

                    <section className="upravljanje-content">

                        {/* PAKETI */}

                        {aktivnaSekcija === 'PAKETI' && (
                            <>
                                <div className="management-section-header">
                                    <div>
                                        <span>
                                            Ponuda restorana
                                        </span>

                                        <h2>
                                            Paketi
                                        </h2>

                                        <p>
                                            Dodavanje, izmena i brisanje
                                            paketa koji pripadaju restoranu.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="management-primary-button"
                                        onClick={handleDodajPaket}
                                    >
                                        + Dodaj paket
                                    </button>
                                </div>

                                {paketi.length === 0 ? (
                                    <div className="management-empty">
                                        <h3>
                                            Nema paketa
                                        </h3>

                                        <p>
                                            Ovaj restoran trenutno nema
                                            evidentirane pakete.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="management-table-wrapper">
                                        <table className="management-table">
                                            <thead>
                                                <tr>
                                                    <th>Naziv</th>
                                                    <th>Opis</th>
                                                    <th>Akcije</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {paketi.map((paket) => (
                                                    <tr key={paket.paketId}>
                                                        <td>
                                                            <strong>
                                                                {paket.naziv}
                                                            </strong>
                                                        </td>

                                                        <td className="management-description-cell">
                                                            {paket.opis || '-'}
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
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                        {/* KETERING */}

                        {aktivnaSekcija === 'KETERING' && (
                            <>
                                <div className="management-section-header">
                                    <div>
                                        <span>
                                            Ponuda restorana
                                        </span>

                                        <h2>
                                            Ketering firme
                                        </h2>

                                        <p>
                                            Dodavanje, izmena i brisanje
                                            ketering firmi koje mogu biti
                                            deo ponude restorana.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="management-primary-button"
                                        onClick={handleDodajKetering}
                                    >
                                        + Dodaj ketering firmu
                                    </button>
                                </div>

                                {keteringFirme.length === 0 ? (
                                    <div className="management-empty">
                                        <h3>
                                            Nema ketering firmi
                                        </h3>

                                        <p>
                                            Ovaj restoran trenutno nema
                                            ketering firme u ponudi.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="management-table-wrapper">
                                        <table className="management-table">
                                            <thead>
                                                <tr>
                                                    <th>Naziv</th>
                                                    <th>Telefon</th>
                                                    <th>Opis</th>
                                                    <th>Paketi</th>
                                                    <th>Akcije</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {keteringFirme.map(
                                                    (ketering) => (
                                                        <tr
                                                            key={
                                                                ketering.uslugaId
                                                            }
                                                        >
                                                            <td>
                                                                <strong>
                                                                    {
                                                                        ketering.naziv
                                                                    }
                                                                </strong>

                                                                {ketering.portfolio && (
                                                                    <div>
                                                                        <a
                                                                            href={
                                                                                ketering.portfolio
                                                                            }
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            Portfolio
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </td>

                                                            <td>
                                                                {
                                                                    ketering.telefon
                                                                }
                                                            </td>

                                                            <td className="management-description-cell">
                                                                {ketering.opis ||
                                                                    '-'}
                                                            </td>

                                                            <td>
                                                                {getNaziviPaketa(
                                                                    ketering.paketIds ??
                                                                    [],
                                                                ) || '-'}
                                                            </td>

                                                            <td>
                                                                <div className="management-row-actions">
                                                                    <button
                                                                        type="button"
                                                                        className="management-edit-button"
                                                                        onClick={() =>
                                                                            handleIzmeniKetering(
                                                                                ketering,
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

                                                                            setKeteringZaBrisanje(
                                                                                ketering,
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
                            </>
                        )}

                        {/* FOTOGRAFI */}

                        {aktivnaSekcija === 'FOTOGRAFI' && (
                            <>
                                <div className="management-section-header">
                                    <div>
                                        <span>
                                            Ponuda restorana
                                        </span>

                                        <h2>
                                            Fotografi
                                        </h2>

                                        <p>
                                            Dodavanje, izmena i brisanje
                                            fotografa ili fotografskih
                                            firmi koje mogu biti deo ponude
                                            restorana.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="management-primary-button"
                                        onClick={handleDodajFotograf}
                                    >
                                        + Dodaj fotografa
                                    </button>
                                </div>

                                {fotografi.length === 0 ? (
                                    <div className="management-empty">
                                        <h3>
                                            Nema fotografa
                                        </h3>

                                        <p>
                                            Ovaj restoran trenutno nema
                                            fotografe u ponudi.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="management-table-wrapper">
                                        <table className="management-table">
                                            <thead>
                                                <tr>
                                                    <th>Naziv</th>
                                                    <th>Telefon</th>
                                                    <th>Tip</th>
                                                    <th>Cena</th>
                                                    <th>Paketi</th>
                                                    <th>Akcije</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {fotografi.map(
                                                    (fotograf) => (
                                                        <tr
                                                            key={
                                                                fotograf.uslugaId
                                                            }
                                                        >
                                                            <td>
                                                                <strong>
                                                                    {
                                                                        fotograf.naziv
                                                                    }
                                                                </strong>

                                                                {fotograf.portfolio && (
                                                                    <div>
                                                                        <a
                                                                            href={
                                                                                fotograf.portfolio
                                                                            }
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            Portfolio
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </td>

                                                            <td>
                                                                {
                                                                    fotograf.telefon
                                                                }
                                                            </td>

                                                            <td>
                                                                {formatTipFoto(
                                                                    fotograf.tipFoto,
                                                                )}
                                                            </td>

                                                            <td>
                                                                {
                                                                    fotograf.cenaFoto
                                                                }
                                                            </td>

                                                            <td>
                                                                {getNaziviPaketa(
                                                                    fotograf.paketIds ??
                                                                    [],
                                                                ) || '-'}
                                                            </td>

                                                            <td>
                                                                <div className="management-row-actions">
                                                                    <button
                                                                        type="button"
                                                                        className="management-edit-button"
                                                                        onClick={() =>
                                                                            handleIzmeniFotograf(
                                                                                fotograf,
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

                                                                            setFotografZaBrisanje(
                                                                                fotograf,
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
                            </>
                        )}

                        {actionError &&
                            !prikaziPaketFormu &&
                            !prikaziKeteringFormu &&
                            !prikaziFotografFormu &&
                            !paketZaBrisanje &&
                            !keteringZaBrisanje &&
                            !fotografZaBrisanje && (
                                <div className="management-error management-error-bottom">
                                    {actionError}
                                </div>
                            )}
                    </section>
                </div>
            </main>

            {/* =========================
                MODAL - PAKET
            ========================= */}

            {prikaziPaketFormu && (
                <div className="management-modal-overlay">
                    <form
                        className="management-form-modal"
                        onSubmit={handlePaketSubmit}
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
                                Unesite osnovne podatke o paketu.
                            </p>
                        </div>

                        {actionError && (
                            <div className="management-error">
                                {actionError}
                            </div>
                        )}

                        <div className="management-form-grid">
                            <div className="management-field management-full-field">
                                <label htmlFor="paketNaziv">
                                    Naziv
                                </label>

                                <input
                                    id="paketNaziv"
                                    name="naziv"
                                    value={paketFormData.naziv}
                                    onChange={handlePaketChange}
                                    required
                                />
                            </div>

                            <div className="management-field management-full-field">
                                <label htmlFor="paketOpis">
                                    Opis
                                </label>

                                <textarea
                                    id="paketOpis"
                                    name="opis"
                                    rows="5"
                                    value={paketFormData.opis}
                                    onChange={handlePaketChange}
                                />
                            </div>
                        </div>

                        <div className="management-form-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={isSaving}
                                onClick={handleOdustaniPaket}
                            >
                                Odustani
                            </button>

                            <button
                                type="submit"
                                className="management-primary-button"
                                disabled={isSaving}
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

            {/* =========================
                MODAL - KETERING
            ========================= */}

            {prikaziKeteringFormu && (
                <div className="management-modal-overlay">
                    <form
                        className="management-form-modal"
                        onSubmit={handleKeteringSubmit}
                    >
                        <div className="management-form-header">
                            <span>
                                {keteringZaIzmenu
                                    ? 'Izmena'
                                    : 'Dodavanje'}
                            </span>

                            <h2>
                                {keteringZaIzmenu
                                    ? 'Izmena ketering firme'
                                    : 'Nova ketering firma'}
                            </h2>

                            <p>
                                Unesite podatke o ketering firmi i
                                izaberite pakete u kojima će biti
                                dostupna.
                            </p>
                        </div>

                        {actionError && (
                            <div className="management-error">
                                {actionError}
                            </div>
                        )}

                        <div className="management-form-grid">
                            <div className="management-field">
                                <label htmlFor="keteringNaziv">
                                    Naziv
                                </label>

                                <input
                                    id="keteringNaziv"
                                    name="naziv"
                                    value={
                                        keteringFormData.naziv
                                    }
                                    onChange={
                                        handleKeteringChange
                                    }
                                    required
                                />
                            </div>

                            <div className="management-field">
                                <label htmlFor="keteringTelefon">
                                    Telefon
                                </label>

                                <input
                                    id="keteringTelefon"
                                    name="telefon"
                                    value={
                                        keteringFormData.telefon
                                    }
                                    onChange={
                                        handleKeteringChange
                                    }
                                    required
                                />
                            </div>

                            <div className="management-field management-full-field">
                                <label htmlFor="keteringPortfolio">
                                    Portfolio
                                </label>

                                <input
                                    id="keteringPortfolio"
                                    name="portfolio"
                                    value={
                                        keteringFormData.portfolio
                                    }
                                    onChange={
                                        handleKeteringChange
                                    }
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="management-field management-full-field">
                                <label htmlFor="keteringOpis">
                                    Opis
                                </label>

                                <textarea
                                    id="keteringOpis"
                                    name="opis"
                                    rows="4"
                                    value={
                                        keteringFormData.opis
                                    }
                                    onChange={
                                        handleKeteringChange
                                    }
                                />
                            </div>

                            <div className="management-field management-full-field">
                                <label>
                                    Paketi
                                </label>

                                {paketi.length === 0 ? (
                                    <div className="management-empty">
                                        Restoran nema dostupnih paketa.
                                    </div>
                                ) : (
                                    <div className="management-checkbox-list">
                                        {paketi.map((paket) => (
                                            <label
                                                key={
                                                    paket.paketId
                                                }
                                                className="management-checkbox-item"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        keteringFormData.paketIds.includes(
                                                            paket.paketId,
                                                        )
                                                    }
                                                    onChange={() =>
                                                        handleKeteringPaketCheckbox(
                                                            paket.paketId,
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {
                                                        paket.naziv
                                                    }
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="management-form-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={isSaving}
                                onClick={
                                    handleOdustaniKetering
                                }
                            >
                                Odustani
                            </button>

                            <button
                                type="submit"
                                className="management-primary-button"
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? 'Čuvanje...'
                                    : keteringZaIzmenu
                                        ? 'Sačuvaj izmene'
                                        : 'Dodaj ketering firmu'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* =========================
                MODAL - FOTOGRAF
            ========================= */}

            {prikaziFotografFormu && (
                <div className="management-modal-overlay">
                    <form
                        className="management-form-modal"
                        onSubmit={handleFotografSubmit}
                    >
                        <div className="management-form-header">
                            <span>
                                {fotografZaIzmenu
                                    ? 'Izmena'
                                    : 'Dodavanje'}
                            </span>

                            <h2>
                                {fotografZaIzmenu
                                    ? 'Izmena fotografa'
                                    : 'Novi fotograf'}
                            </h2>

                            <p>
                                Unesite podatke o fotografu i
                                izaberite pakete u kojima će biti
                                dostupan.
                            </p>
                        </div>

                        {actionError && (
                            <div className="management-error">
                                {actionError}
                            </div>
                        )}

                        <div className="management-form-grid">
                            <div className="management-field">
                                <label htmlFor="fotografNaziv">
                                    Naziv
                                </label>

                                <input
                                    id="fotografNaziv"
                                    name="naziv"
                                    value={
                                        fotografFormData.naziv
                                    }
                                    onChange={
                                        handleFotografChange
                                    }
                                    required
                                />
                            </div>

                            <div className="management-field">
                                <label htmlFor="fotografTelefon">
                                    Telefon
                                </label>

                                <input
                                    id="fotografTelefon"
                                    name="telefon"
                                    value={
                                        fotografFormData.telefon
                                    }
                                    onChange={
                                        handleFotografChange
                                    }
                                    required
                                />
                            </div>

                            <div className="management-field management-full-field">
                                <label htmlFor="fotografPortfolio">
                                    Portfolio
                                </label>

                                <input
                                    id="fotografPortfolio"
                                    name="portfolio"
                                    value={
                                        fotografFormData.portfolio
                                    }
                                    onChange={
                                        handleFotografChange
                                    }
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="management-field">
                                <label htmlFor="cenaFoto">
                                    Cena jedne fotografije
                                </label>

                                <input
                                    id="cenaFoto"
                                    name="cenaFoto"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={
                                        fotografFormData.cenaFoto
                                    }
                                    onChange={
                                        handleFotografChange
                                    }
                                    required
                                />
                            </div>

                            <div className="management-field">
                                <label htmlFor="tipFoto">
                                    Tip usluge
                                </label>

                                <select
                                    id="tipFoto"
                                    name="tipFoto"
                                    value={
                                        fotografFormData.tipFoto
                                    }
                                    onChange={
                                        handleFotografChange
                                    }
                                    required
                                >
                                    <option value="FOTOGRAFIJA">
                                        Fotografija
                                    </option>

                                    <option value="FOTOGRAFIJA_SNIMANJE">
                                        Fotografija i snimanje
                                    </option>
                                </select>
                            </div>

                            <div className="management-field management-full-field">
                                <label>
                                    Paketi
                                </label>

                                {paketi.length === 0 ? (
                                    <div className="management-empty">
                                        Restoran nema dostupnih paketa.
                                    </div>
                                ) : (
                                    <div className="management-checkbox-list">
                                        {paketi.map((paket) => (
                                            <label
                                                key={
                                                    paket.paketId
                                                }
                                                className="management-checkbox-item"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        fotografFormData.paketIds.includes(
                                                            paket.paketId,
                                                        )
                                                    }
                                                    onChange={() =>
                                                        handleFotografPaketCheckbox(
                                                            paket.paketId,
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {
                                                        paket.naziv
                                                    }
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="management-form-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={isSaving}
                                onClick={
                                    handleOdustaniFotograf
                                }
                            >
                                Odustani
                            </button>

                            <button
                                type="submit"
                                className="management-primary-button"
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? 'Čuvanje...'
                                    : fotografZaIzmenu
                                        ? 'Sačuvaj izmene'
                                        : 'Dodaj fotografa'}
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
                            Da li ste sigurni da želite da
                            obrišete paket{' '}
                            <strong>
                                {paketZaBrisanje.naziv}
                            </strong>
                            ?
                        </p>

                        {actionError && (
                            <div className="management-error">
                                {actionError}
                            </div>
                        )}

                        <div className="management-confirm-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={deleteLoading}
                                onClick={() => {
                                    setPaketZaBrisanje(null);
                                    setActionError('');
                                }}
                            >
                                Odustani
                            </button>

                            <button
                                type="button"
                                className="management-danger-button"
                                disabled={deleteLoading}
                                onClick={handleObrisiPaket}
                            >
                                {deleteLoading
                                    ? 'Brisanje...'
                                    : 'Obriši paket'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

   

            {keteringZaBrisanje && (
                <div className="management-modal-overlay">
                    <div className="management-confirm-modal">
                        <div className="management-confirm-icon">
                            !
                        </div>

                        <h2>
                            Brisanje ketering firme
                        </h2>

                        <p>
                            Da li ste sigurni da želite da
                            uklonite{' '}
                            <strong>
                                {keteringZaBrisanje.naziv}
                            </strong>{' '}
                            iz ponude restorana?
                        </p>

                        {actionError && (
                            <div className="management-error">
                                {actionError}
                            </div>
                        )}

                        <div className="management-confirm-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={deleteLoading}
                                onClick={() => {
                                    setKeteringZaBrisanje(null);
                                    setActionError('');
                                }}
                            >
                                Odustani
                            </button>

                            <button
                                type="button"
                                className="management-danger-button"
                                disabled={deleteLoading}
                                onClick={
                                    handleObrisiKetering
                                }
                            >
                                {deleteLoading
                                    ? 'Brisanje...'
                                    : 'Obriši'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            

            {fotografZaBrisanje && (
                <div className="management-modal-overlay">
                    <div className="management-confirm-modal">
                        <div className="management-confirm-icon">
                            !
                        </div>

                        <h2>
                            Brisanje fotografa
                        </h2>

                        <p>
                            Da li ste sigurni da želite da
                            uklonite{' '}
                            <strong>
                                {fotografZaBrisanje.naziv}
                            </strong>{' '}
                            iz ponude restorana?
                        </p>

                        {actionError && (
                            <div className="management-error">
                                {actionError}
                            </div>
                        )}

                        <div className="management-confirm-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={deleteLoading}
                                onClick={() => {
                                    setFotografZaBrisanje(null);
                                    setActionError('');
                                }}
                            >
                                Odustani
                            </button>

                            <button
                                type="button"
                                className="management-danger-button"
                                disabled={deleteLoading}
                                onClick={
                                    handleObrisiFotograf
                                }
                            >
                                {deleteLoading
                                    ? 'Brisanje...'
                                    : 'Obriši'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpravljanjePonudomPage;