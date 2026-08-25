import { useEffect, useState } from 'react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';

import { getRestoranById } from '../api/restoranApi';
import { getPaketiByRestoranId } from '../api/paketApi';
import { getSaleByPaketId } from '../api/salaApi';
import { getUslugeByPaketId } from '../api/uslugaApi';

import {
    getDostupneSale,
    kreirajRezervaciju,
    obracunajRezervaciju,
} from '../api/rezervacijaApi';

import './KreiranjeRezervacijePage.css';

const tipoviDogadjaja = [
    {
        value: 0,
        naziv: 'Venčanje',
    },
    {
        value: 1,
        naziv: 'Krštenje',
    },
    {
        value: 2,
        naziv: 'Rođendan',
    },
    {
        value: 3,
        naziv: 'Poslovni događaj',
    },
];

const sati = Array.from(
    { length: 24 },
    (_, sat) => ({
        value: sat,
        naziv: `${String(sat).padStart(2, '0')}:00`,
    }),
);

const naziviTipovaUsluga = {
    FOTOGRAF: 'Fotografi',
    KETERING: 'Ketering',
    DEKORATER: 'Dekorateri',
    MUZICKI_IZVODJAC: 'Muzički izvođači',
};

const redosledTipovaUsluga = [
    'FOTOGRAF',
    'KETERING',
    'DEKORATER',
    'MUZICKI_IZVODJAC',
];

function formatCena(value) {
    if (value == null) {
        return '-';
    }

    return `${Number(value).toLocaleString('sr-RS')} €`;
}

function napraviDatumVreme(
    datum,
    sat,
) {
    return `${datum}T${String(sat).padStart(2, '0')}:00:00`;
}

function grupisiUsluge(usluge) {
    const grupe = {
        FOTOGRAF: [],
        KETERING: [],
        DEKORATER: [],
        MUZICKI_IZVODJAC: [],
    };

    usluge.forEach((usluga) => {
        if (grupe[usluga.tipUsluge]) {
            grupe[usluga.tipUsluge]
                .push(usluga);
        }
    });

    return grupe;
}

function KreiranjeRezervacijePage() {
    const { restoranId } = useParams();
    const navigate = useNavigate();

    const [restoran, setRestoran] =
        useState(null);

    const [dostupneSale, setDostupneSale] =
        useState([]);

    const [paketi, setPaketi] =
        useState([]);

    const [usluge, setUsluge] =
        useState([]);

    const [ukupnaCena, setUkupnaCena] =
        useState(null);

    const [formData, setFormData] =
        useState({
            tipDogadjaja: '',
            brGostiju: '',

            datumPocetka: '',
            satPocetka: '',

            datumZavrsetka: '',
            satZavrsetka: '',

            salaId: '',
            paketId: '',
            uslugaIds: [],
            opis: '',
            napomena: '',
        });

    const [isLoading, setIsLoading] =
        useState(true);

    const [saleLoading, setSaleLoading] =
        useState(false);

    const [saleProverene, setSaleProverene] =
        useState(false);

    const [paketiLoading, setPaketiLoading] =
        useState(false);

    const [uslugeLoading, setUslugeLoading] =
        useState(false);

    const [obracunLoading, setObracunLoading] =
        useState(false);

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState('');

    const [success, setSuccess] =
        useState(false);

    useEffect(() => {
        async function loadPage() {
            setIsLoading(true);
            setError('');

            try {
                const restoranResult =
                    await getRestoranById(
                        restoranId,
                    );

                setRestoran(
                    restoranResult,
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

    function handleOsnovniPodatakChange(
        event,
    ) {
        const { name, value } =
            event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            salaId: '',
            paketId: '',
            uslugaIds: [],
        }));

        setDostupneSale([]);
        setPaketi([]);
        setUsluge([]);
        setUkupnaCena(null);
        setSaleProverene(false);
        setError('');
    }

    function handleTekstChange(
        event,
    ) {
        const { name, value } =
            event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError('');
    }

    function osnovniPodaciPopunjeni() {
        return Boolean(
            formData.tipDogadjaja !== '' &&
            Number(formData.brGostiju) > 0 &&
            formData.datumPocetka &&
            formData.satPocetka !== '' &&
            formData.datumZavrsetka &&
            formData.satZavrsetka !== '',
        );
    }

    async function handlePronadjiSale(
        event,
    ) {
        event.preventDefault();

        if (!osnovniPodaciPopunjeni()) {
            setError(
                'Popunite sva obavezna polja.',
            );
            return;
        }

        const vremePocetka =
            napraviDatumVreme(
                formData.datumPocetka,
                formData.satPocetka,
            );

        const vremeZavrsetka =
            napraviDatumVreme(
                formData.datumZavrsetka,
                formData.satZavrsetka,
            );

        setSaleLoading(true);
        setSaleProverene(false);
        setError('');

        setDostupneSale([]);
        setPaketi([]);
        setUsluge([]);
        setUkupnaCena(null);

        setFormData((prev) => ({
            ...prev,
            salaId: '',
            paketId: '',
            uslugaIds: [],
        }));

        try {
            const saleResult =
                await getDostupneSale(
                    restoranId,
                    {
                        tipDogadjaja:
                            Number(
                                formData.tipDogadjaja,
                            ),

                        brGostiju:
                            Number(
                                formData.brGostiju,
                            ),

                        vremePocetka,

                        vremeZavrsetka,
                    },
                );

            setDostupneSale(
                saleResult,
            );

            setSaleProverene(true);
        } catch (error) {
            setError(
                error.message,
            );
        } finally {
            setSaleLoading(false);
        }
    }

    async function handleSalaChange(
        event,
    ) {
        const salaId =
            event.target.value;

        setFormData((prev) => ({
            ...prev,
            salaId,
            paketId: '',
            uslugaIds: [],
        }));

        setPaketi([]);
        setUsluge([]);
        setUkupnaCena(null);
        setError('');

        if (!salaId) {
            return;
        }

        setPaketiLoading(true);

        try {
            const sviPaketi =
                await getPaketiByRestoranId(
                    restoranId,
                );

            const proverePaketa =
                await Promise.all(
                    sviPaketi.map(
                        async (paket) => {
                            const salePaketa =
                                await getSaleByPaketId(
                                    restoranId,
                                    paket.paketId,
                                );

                            const paketJeDostupan =
                                salePaketa.some(
                                    (sala) =>
                                        Number(
                                            sala.salaId,
                                        ) ===
                                        Number(
                                            salaId,
                                        ),
                                );

                            return paketJeDostupan
                                ? paket
                                : null;
                        },
                    ),
                );

            setPaketi(
                proverePaketa.filter(
                    (paket) =>
                        paket !== null,
                ),
            );
        } catch (error) {
            setError(
                error.message,
            );
        } finally {
            setPaketiLoading(false);
        }
    }

    async function handlePaketChange(
        event,
    ) {
        const paketId =
            event.target.value;

        setFormData((prev) => ({
            ...prev,
            paketId,
            uslugaIds: [],
        }));

        setUsluge([]);
        setUkupnaCena(null);
        setError('');

        if (!paketId) {
            return;
        }

        setUslugeLoading(true);

        try {
            const uslugeResult =
                await getUslugeByPaketId(
                    restoranId,
                    paketId,
                );

            setUsluge(
                uslugeResult,
            );
        } catch (error) {
            setError(
                error.message,
            );
        } finally {
            setUslugeLoading(false);
        }
    }

    function handleUslugaChange(
        uslugaId,
    ) {
        setFormData((prev) => {
            const izabrana =
                prev.uslugaIds.includes(
                    uslugaId,
                );

            return {
                ...prev,

                uslugaIds:
                    izabrana
                        ? prev.uslugaIds.filter(
                            (id) =>
                                id !==
                                uslugaId,
                        )
                        : [
                            ...prev.uslugaIds,
                            uslugaId,
                        ],
            };
        });

        setUkupnaCena(null);
        setError('');
    }

    function napraviRequest() {
        return {
            restoranId:
                Number(restoranId),

            tipDogadjaja:
                Number(
                    formData.tipDogadjaja,
                ),

            brGostiju:
                Number(
                    formData.brGostiju,
                ),

            vremePocetka:
                napraviDatumVreme(
                    formData.datumPocetka,
                    formData.satPocetka,
                ),

            vremeZavrsetka:
                napraviDatumVreme(
                    formData.datumZavrsetka,
                    formData.satZavrsetka,
                ),

            salaId:
                Number(
                    formData.salaId,
                ),

            paketId:
                Number(
                    formData.paketId,
                ),

            uslugaIds:
                formData.uslugaIds,

            opis:
                formData.opis.trim() ||
                null,

            napomena:
                formData.napomena.trim() ||
                null,
        };
    }

    async function handleObracun() {
        if (!formData.salaId) {
            setError(
                'Izaberite salu.',
            );
            return;
        }

        if (!formData.paketId) {
            setError(
                'Izaberite paket.',
            );
            return;
        }

        setObracunLoading(true);
        setError('');

        try {
            const rezultat =
                await obracunajRezervaciju(
                    napraviRequest(),
                );

            setUkupnaCena(
                rezultat,
            );
        } catch (error) {
            setError(
                error.message,
            );
        } finally {
            setObracunLoading(false);
        }
    }

    async function handleSubmit() {
        if (ukupnaCena === null) {
            setError(
                'Pre slanja zahteva potrebno je izvršiti obračun.',
            );
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            await kreirajRezervaciju(
                napraviRequest(),
            );

            setSuccess(true);
        } catch (error) {
            setError(
                error.message,
            );

            setUkupnaCena(null);
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="kreiranje-rezervacije-page">
                <div className="rezervacija-page-state">
                    Učitavanje...
                </div>
            </div>
        );
    }

    const grupisaneUsluge =
        grupisiUsluge(
            usluge,
        );

    return (
        <div className="kreiranje-rezervacije-page">
            <main className="kreiranje-rezervacije-container">

                <button
                    type="button"
                    className="rezervacija-nazad-button"
                    onClick={() =>
                        navigate(
                            `/restorani/${restoranId}`,
                        )
                    }
                >
                    ← Nazad na restoran
                </button>

                <header className="kreiranje-rezervacije-header">
                    <span>
                        Novi zahtev
                    </span>

                    <h1>
                        Rezervacija događaja
                    </h1>

                    <p>
                        {restoran?.naziv}
                    </p>
                </header>

                {success ? (
                    <section className="rezervacija-success">
                        <h2>
                            Zahtev je uspešno poslat
                        </h2>

                        <p>
                            Zahtev za rezervaciju je
                            uspešno kreiran.
                        </p>

                        <button
                            type="button"
                            className="rezervacija-primary-button"
                            onClick={() =>
                                navigate(
                                    `/restorani/${restoranId}`,
                                )
                            }
                        >
                            Nazad na restoran
                        </button>
                    </section>
                ) : (
                    <>
                        {error && (
                            <div className="rezervacija-error">
                                {error}
                            </div>
                        )}

                        <form
                            className="rezervacija-card"
                            onSubmit={
                                handlePronadjiSale
                            }
                            noValidate
                        >
                            <div className="rezervacija-card-heading">
                                <span>
                                    Korak 1
                                </span>

                                <h2>
                                    Podaci o događaju
                                </h2>

                                <p>
                                    Unesite podatke kako bi
                                    sistem pronašao dostupne sale.
                                </p>
                            </div>

                            <div className="rezervacija-osnovni-podaci">

                                <div className="rezervacija-field">
                                    <label htmlFor="tipDogadjaja">
                                        Tip događaja{' '}
                                        <span className="obavezno">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        id="tipDogadjaja"
                                        name="tipDogadjaja"
                                        value={
                                            formData.tipDogadjaja
                                        }
                                        onChange={
                                            handleOsnovniPodatakChange
                                        }
                                    >
                                        <option value="">
                                            Izaberite tip događaja
                                        </option>

                                        {tipoviDogadjaja.map(
                                            (tip) => (
                                                <option
                                                    key={
                                                        tip.value
                                                    }
                                                    value={
                                                        tip.value
                                                    }
                                                >
                                                    {
                                                        tip.naziv
                                                    }
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>

                                <div className="rezervacija-field">
                                    <label htmlFor="brGostiju">
                                        Broj gostiju{' '}
                                        <span className="obavezno">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="brGostiju"
                                        name="brGostiju"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={
                                            formData.brGostiju
                                        }
                                        onChange={
                                            handleOsnovniPodatakChange
                                        }
                                        placeholder="npr. 120"
                                    />
                                </div>

                            </div>

                            <div className="rezervacija-termini">

                                <div className="rezervacija-termin-card">

                                    <div className="rezervacija-termin-naslov">
                                 

                                        <h3>
                                            Početak događaja
                                        </h3>
                                    </div>

                                    <div className="rezervacija-field">
                                        <label htmlFor="datumPocetka">
                                            Datum{' '}
                                            <span className="obavezno">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="datumPocetka"
                                            name="datumPocetka"
                                            type="date"
                                            value={
                                                formData.datumPocetka
                                            }
                                            onChange={
                                                handleOsnovniPodatakChange
                                            }
                                        />
                                    </div>

                                    <div className="rezervacija-field">
                                        <label htmlFor="satPocetka">
                                            Vreme{' '}
                                            <span className="obavezno">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            id="satPocetka"
                                            name="satPocetka"
                                            value={
                                                formData.satPocetka
                                            }
                                            onChange={
                                                handleOsnovniPodatakChange
                                            }
                                        >
                                            <option value="">
                                                Izaberite vreme
                                            </option>

                                            {sati.map(
                                                (sat) => (
                                                    <option
                                                        key={
                                                            sat.value
                                                        }
                                                        value={
                                                            sat.value
                                                        }
                                                    >
                                                        {
                                                            sat.naziv
                                                        }
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>

                                </div>

                                <div className="rezervacija-termin-card">

                                    <div className="rezervacija-termin-naslov">
                                       

                                        <h3>
                                            Završetak događaja
                                        </h3>
                                    </div>

                                    <div className="rezervacija-field">
                                        <label htmlFor="datumZavrsetka">
                                            Datum{' '}
                                            <span className="obavezno">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="datumZavrsetka"
                                            name="datumZavrsetka"
                                            type="date"
                                            value={
                                                formData.datumZavrsetka
                                            }
                                            onChange={
                                                handleOsnovniPodatakChange
                                            }
                                        />
                                    </div>

                                    <div className="rezervacija-field">
                                        <label htmlFor="satZavrsetka">
                                            Vreme{' '}
                                            <span className="obavezno">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            id="satZavrsetka"
                                            name="satZavrsetka"
                                            value={
                                                formData.satZavrsetka
                                            }
                                            onChange={
                                                handleOsnovniPodatakChange
                                            }
                                        >
                                            <option value="">
                                                Izaberite vreme
                                            </option>

                                            {sati.map(
                                                (sat) => (
                                                    <option
                                                        key={
                                                            sat.value
                                                        }
                                                        value={
                                                            sat.value
                                                        }
                                                    >
                                                        {
                                                            sat.naziv
                                                        }
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>

                                </div>

                            </div>

                            <div className="rezervacija-form-actions">
                                <button
                                    type="submit"
                                    className="rezervacija-primary-button"
                                    disabled={
                                        saleLoading
                                    }
                                >
                                    {saleLoading
                                        ? 'Provera dostupnosti...'
                                        : 'Prikaži dostupne sale'}
                                </button>
                            </div>
                        </form>

                        {saleProverene &&
                            dostupneSale.length ===
                            0 && (
                                <div className="rezervacija-info">
                                    Za izabrani broj gostiju i termin
                                    trenutno nema dostupnih sala.
                                </div>
                            )}

                        {dostupneSale.length >
                            0 && (
                                <section className="rezervacija-card">
                                    <div className="rezervacija-card-heading">
                                        <span>
                                            Korak 2
                                        </span>

                                        <h2>
                                            Izaberite salu{' '}
                                            <span className="obavezno">
                                                *
                                            </span>
                                        </h2>

                                        <p>
                                            Prikazane su samo sale dovoljnog
                                            kapaciteta koje nisu zauzete u
                                            izabranom terminu.
                                        </p>
                                    </div>

                                    <div className="rezervacija-sale-grid">
                                        {dostupneSale.map(
                                            (sala) => {
                                                const izabrana =
                                                    Number(
                                                        formData.salaId,
                                                    ) ===
                                                    Number(
                                                        sala.salaId,
                                                    );

                                                return (
                                                    <label
                                                        key={
                                                            sala.salaId
                                                        }
                                                        className={
                                                            izabrana
                                                                ? 'rezervacija-sala-card aktivna'
                                                                : 'rezervacija-sala-card'
                                                        }
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="salaId"
                                                            value={
                                                                sala.salaId
                                                            }
                                                            checked={
                                                                izabrana
                                                            }
                                                            onChange={
                                                                handleSalaChange
                                                            }
                                                        />

                                                        <strong>
                                                            Sala{' '}
                                                            {
                                                                sala.rbrS
                                                            }
                                                        </strong>

                                                        <span>
                                                            Kapacitet:{' '}
                                                            {
                                                                sala.kapacitet
                                                            }
                                                        </span>

                                                        <span>
                                                            Cena stolice:{' '}
                                                            {formatCena(
                                                                sala.cenaStolice,
                                                            )}
                                                        </span>
                                                    </label>
                                                );
                                            },
                                        )}
                                    </div>
                                </section>
                            )}

                        {formData.salaId && (
                            <section className="rezervacija-card">
                                <div className="rezervacija-card-heading">
                                    <span>
                                        Korak 3
                                    </span>

                                    <h2>
                                        Izaberite paket
                                    </h2>

                                    <p>
                                        Prikazani su paketi
                                        dostupni za izabranu salu.
                                    </p>
                                </div>

                                {paketiLoading ? (
                                    <div className="rezervacija-info">
                                        Učitavanje paketa...
                                    </div>
                                ) : paketi.length ===
                                    0 ? (
                                    <div className="rezervacija-info">
                                        Za izabranu salu
                                        nema dostupnih paketa.
                                    </div>
                                ) : (
                                    <div className="rezervacija-field rezervacija-full-field">
                                        <label htmlFor="paketId">
                                            Paket{' '}
                                            <span className="obavezno">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            id="paketId"
                                            name="paketId"
                                            value={
                                                formData.paketId
                                            }
                                            onChange={
                                                handlePaketChange
                                            }
                                        >
                                            <option value="">
                                                Izaberite paket
                                            </option>

                                            {paketi.map(
                                                (paket) => (
                                                    <option
                                                        key={
                                                            paket.paketId
                                                        }
                                                        value={
                                                            paket.paketId
                                                        }
                                                    >
                                                        {
                                                            paket.naziv
                                                        }
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
                                )}
                            </section>
                        )}

                        {formData.paketId && (
                            <section className="rezervacija-card">
                                <div className="rezervacija-card-heading">
                                    <span>
                                        Korak 4
                                    </span>

                                    <h2>
                                        Dodatne usluge
                                    </h2>

                                    <p>
                                        Izaberite usluge
                                        izabranog paketa.
                                        Usluge nisu obavezne.
                                    </p>
                                </div>

                                {uslugeLoading ? (
                                    <div className="rezervacija-info">
                                        Učitavanje dodatnih
                                        usluga...
                                    </div>
                                ) : usluge.length ===
                                    0 ? (
                                    <div className="rezervacija-info">
                                        Izabrani paket nema
                                        dodatnih usluga.
                                    </div>
                                ) : (
                                    <div className="rezervacija-usluge">
                                        {redosledTipovaUsluga.map(
                                            (tip) => {
                                                const uslugeTipa =
                                                    grupisaneUsluge[
                                                    tip
                                                    ];

                                                if (
                                                    uslugeTipa.length ===
                                                    0
                                                ) {
                                                    return null;
                                                }

                                                return (
                                                    <div
                                                        key={
                                                            tip
                                                        }
                                                        className="rezervacija-usluge-grupa"
                                                    >
                                                        <h3>
                                                            {
                                                                naziviTipovaUsluga[
                                                                tip
                                                                ]
                                                            }
                                                        </h3>

                                                        <div className="rezervacija-usluge-lista">
                                                            {uslugeTipa.map(
                                                                (
                                                                    usluga,
                                                                ) => {
                                                                    const izabrana =
                                                                        formData.uslugaIds.includes(
                                                                            usluga.uslugaId,
                                                                        );

                                                                    return (
                                                                        <label
                                                                            key={
                                                                                usluga.uslugaId
                                                                            }
                                                                            className={
                                                                                izabrana
                                                                                    ? 'rezervacija-usluga-card aktivna'
                                                                                    : 'rezervacija-usluga-card'
                                                                            }
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={
                                                                                    izabrana
                                                                                }
                                                                                onChange={() =>
                                                                                    handleUslugaChange(
                                                                                        usluga.uslugaId,
                                                                                    )
                                                                                }
                                                                            />

                                                                            <div>
                                                                                <strong>
                                                                                    {
                                                                                        usluga.naziv
                                                                                    }
                                                                                </strong>

                                                                                {usluga.opis && (
                                                                                    <p>
                                                                                        {
                                                                                            usluga.opis
                                                                                        }
                                                                                    </p>
                                                                                )}

                                                                                {usluga.cena !=
                                                                                    null && (
                                                                                        <span>
                                                                                            {formatCena(
                                                                                                usluga.cena,
                                                                                            )}
                                                                                        </span>
                                                                                    )}
                                                                            </div>
                                                                        </label>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                )}
                            </section>
                        )}

                        {formData.paketId && (
                            <section className="rezervacija-card">
                                <div className="rezervacija-card-heading">
                                    <span>
                                        Korak 5
                                    </span>

                                    <h2>
                                        Opis i napomena
                                    </h2>

                                    <p>
                                        Oba polja su opciona.
                                    </p>
                                </div>

                                <div className="rezervacija-form-grid">
                                    <div className="rezervacija-field rezervacija-full-field">
                                        <label htmlFor="opis">
                                            Opis
                                        </label>

                                        <textarea
                                            id="opis"
                                            name="opis"
                                            rows="4"
                                            value={
                                                formData.opis
                                            }
                                            onChange={
                                                handleTekstChange
                                            }
                                            placeholder="Kratak opis događaja..."
                                        />
                                    </div>

                                    <div className="rezervacija-field rezervacija-full-field">
                                        <label htmlFor="napomena">
                                            Napomena
                                        </label>

                                        <textarea
                                            id="napomena"
                                            name="napomena"
                                            rows="5"
                                            value={
                                                formData.napomena
                                            }
                                            onChange={
                                                handleTekstChange
                                            }
                                            placeholder="Dodatni zahtevi..."
                                        />
                                    </div>
                                </div>

                                <div className="rezervacija-form-actions">
                                    <button
                                        type="button"
                                        className="rezervacija-primary-button"
                                        disabled={
                                            obracunLoading
                                        }
                                        onClick={
                                            handleObracun
                                        }
                                    >
                                        {obracunLoading
                                            ? 'Računanje...'
                                            : 'Prikaži ukupnu cenu'}
                                    </button>
                                </div>
                            </section>
                        )}

                        {ukupnaCena !== null && (
                            <section className="rezervacija-card rezervacija-obracun">
                                <div className="rezervacija-card-heading">
                                    <span>
                                        Korak 6
                                    </span>

                                    <h2>
                                        Ukupna cena
                                    </h2>
                                </div>

                                <div className="obracun-ukupno">
                                    <span>
                                        Ukupna cena rezervacije
                                    </span>

                                    <strong>
                                        {formatCena(
                                            ukupnaCena,
                                        )}
                                    </strong>
                                </div>

                                <div className="rezervacija-form-actions">
                                    <button
                                        type="button"
                                        className="rezervacija-primary-button"
                                        disabled={
                                            isSaving
                                        }
                                        onClick={
                                            handleSubmit
                                        }
                                    >
                                        {isSaving
                                            ? 'Slanje zahteva...'
                                            : 'Pošalji zahtev za rezervaciju'}
                                    </button>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default KreiranjeRezervacijePage;