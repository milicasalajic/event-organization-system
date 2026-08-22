import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getRestoranById } from '../api/restoranApi';

import {
    addSala,
    deleteSala,
    getSaleByRestoranId,
    updateSala,
} from '../api/salaApi';

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
    addDekoraterskaFirma,
    deleteDekoraterskaFirma,
    getDekoraterskeFirmeByRestoranId,
    updateDekoraterskaFirma,
} from '../api/dekoraterskaFirmaApi';

import {
    addFotograf,
    deleteFotograf,
    getFotografiByRestoranId,
    updateFotograf,
} from '../api/fotografApi';

import {
    addMuzickiIzvodjac,
    deleteMuzickiIzvodjac,
    getMuzickiIzvodjaciByRestoranId,
    updateMuzickiIzvodjac,
} from '../api/muzickiIzvodjacApi';

import './UpravljanjePonudomPage.css';

function UpravljanjePonudomPage() {
    const { restoranId } = useParams();
    const navigate = useNavigate();

    const [restoran, setRestoran] = useState(null);

    const [sale, setSale] = useState([]);
    const [paketi, setPaketi] = useState([]);
    const [keteringFirme, setKeteringFirme] = useState([]);
    const [dekoraterskeFirme, setDekoraterskeFirme] = useState([]);
    const [fotografi, setFotografi] = useState([]);
    const [muzickiIzvodjaci, setMuzickiIzvodjaci] = useState([]);

    const [aktivnaSekcija, setAktivnaSekcija] = useState('SALE');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // =========================
    // SALA
    // =========================

    const [prikaziSalaFormu, setPrikaziSalaFormu] =
        useState(false);

    const [salaZaIzmenu, setSalaZaIzmenu] =
        useState(null);

    const [salaZaBrisanje, setSalaZaBrisanje] =
        useState(null);

    const [salaFormData, setSalaFormData] = useState({
        rbrS: '',
        kapacitet: '',
    });

    // =========================
    // PAKET
    // =========================

    const [prikaziPaketFormu, setPrikaziPaketFormu] =
        useState(false);

    const [paketZaIzmenu, setPaketZaIzmenu] =
        useState(null);

    const [paketZaBrisanje, setPaketZaBrisanje] =
        useState(null);

    const [paketFormData, setPaketFormData] = useState({
        naziv: '',
        opis: '',
    });

    // =========================
    // KETERING
    // =========================

    const [prikaziKeteringFormu, setPrikaziKeteringFormu] =
        useState(false);

    const [keteringZaIzmenu, setKeteringZaIzmenu] =
        useState(null);

    const [keteringZaBrisanje, setKeteringZaBrisanje] =
        useState(null);

    const [keteringFormData, setKeteringFormData] = useState({
        naziv: '',
        telefon: '',
        portfolio: '',
        opis: '',
        paketIds: [],
    });

    // =========================
    // DEKORATERSKA FIRMA
    // =========================

    const [
        prikaziDekoraterskaFirmaFormu,
        setPrikaziDekoraterskaFirmaFormu,
    ] = useState(false);

    const [
        dekoraterskaFirmaZaIzmenu,
        setDekoraterskaFirmaZaIzmenu,
    ] = useState(null);

    const [
        dekoraterskaFirmaZaBrisanje,
        setDekoraterskaFirmaZaBrisanje,
    ] = useState(null);

    const [
        dekoraterskaFirmaFormData,
        setDekoraterskaFirmaFormData,
    ] = useState({
        naziv: '',
        telefon: '',
        portfolio: '',
        opis: '',
        paketIds: [],
    });

    // =========================
    // FOTOGRAF
    // =========================

    const [prikaziFotografFormu, setPrikaziFotografFormu] =
        useState(false);

    const [fotografZaIzmenu, setFotografZaIzmenu] =
        useState(null);

    const [fotografZaBrisanje, setFotografZaBrisanje] =
        useState(null);

    const [fotografFormData, setFotografFormData] = useState({
        naziv: '',
        telefon: '',
        portfolio: '',
        cenaFoto: '',
        tipFoto: 'FOTOGRAFIJA',
        paketIds: [],
    });

    // =========================
    // MUZIČKI IZVOĐAČ
    // =========================

    const [
        prikaziMuzickiIzvodjacFormu,
        setPrikaziMuzickiIzvodjacFormu,
    ] = useState(false);

    const [
        muzickiIzvodjacZaIzmenu,
        setMuzickiIzvodjacZaIzmenu,
    ] = useState(null);

    const [
        muzickiIzvodjacZaBrisanje,
        setMuzickiIzvodjacZaBrisanje,
    ] = useState(null);

    const [
        muzickiIzvodjacFormData,
        setMuzickiIzvodjacFormData,
    ] = useState({
        naziv: '',
        telefon: '',
        portfolio: '',
        tipMuzicara: '',
        paketIds: [],
    });

    // =========================
    // UČITAVANJE
    // =========================

    useEffect(() => {
        async function loadPage() {
            setIsLoading(true);
            setError('');

            try {
                const [
                    restoranResult,
                    saleResult,
                    paketiResult,
                    keteringResult,
                    dekoraterskeFirmeResult,
                    fotografiResult,
                    muzickiIzvodjaciResult,
                ] = await Promise.all([
                    getRestoranById(restoranId),
                    getSaleByRestoranId(restoranId),
                    getPaketiByRestoranId(restoranId),
                    getKeteringByRestoranId(restoranId),
                    getDekoraterskeFirmeByRestoranId(restoranId),
                    getFotografiByRestoranId(restoranId),
                    getMuzickiIzvodjaciByRestoranId(restoranId),
                ]);

                setRestoran(restoranResult);
                setSale(saleResult);
                setPaketi(paketiResult);
                setKeteringFirme(keteringResult);
                setDekoraterskeFirme(dekoraterskeFirmeResult);
                setFotografi(fotografiResult);
                setMuzickiIzvodjaci(muzickiIzvodjaciResult);
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
                        (paket) =>
                            paket.paketId === paketId,
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
    // SALE
    // =========================

    function handleSalaChange(event) {
        const { name, value } = event.target;

        setSalaFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleDodajSalu() {
        setActionError('');
        setSalaZaIzmenu(null);

        setSalaFormData({
            rbrS: '',
            kapacitet: '',
        });

        setPrikaziSalaFormu(true);
    }

    function handleIzmeniSalu(sala) {
        setActionError('');
        setSalaZaIzmenu(sala);

        setSalaFormData({
            rbrS: sala.rbrS ?? '',
            kapacitet: sala.kapacitet ?? '',
        });

        setPrikaziSalaFormu(true);
    }

    function handleOdustaniSala() {
        if (isSaving) {
            return;
        }

        setPrikaziSalaFormu(false);
        setSalaZaIzmenu(null);
        setActionError('');
    }

    async function handleSalaSubmit(event) {
        event.preventDefault();

        const data = {
            rbrS: Number(salaFormData.rbrS),
            kapacitet: Number(salaFormData.kapacitet),
        };

        setIsSaving(true);
        setActionError('');

        try {
            if (salaZaIzmenu) {
                const izmenjenaSala =
                    await updateSala(
                        restoranId,
                        salaZaIzmenu.salaId,
                        data,
                    );

                setSale((prev) =>
                    prev.map((sala) =>
                        sala.salaId === izmenjenaSala.salaId
                            ? izmenjenaSala
                            : sala,
                    ),
                );
            } else {
                const novaSala =
                    await addSala(
                        restoranId,
                        data,
                    );

                setSale((prev) => [
                    ...prev,
                    novaSala,
                ]);
            }

            setPrikaziSalaFormu(false);
            setSalaZaIzmenu(null);
        } catch (error) {
            setActionError(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleObrisiSalu() {
        if (!salaZaBrisanje) {
            return;
        }

        setDeleteLoading(true);
        setActionError('');

        try {
            await deleteSala(
                restoranId,
                salaZaBrisanje.salaId,
            );

            setSale((prev) =>
                prev.filter(
                    (sala) =>
                        sala.salaId !==
                        salaZaBrisanje.salaId,
                ),
            );

            setSalaZaBrisanje(null);
        } catch (error) {
            setActionError(error.message);
        } finally {
            setDeleteLoading(false);
        }
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
                const izmenjenPaket =
                    await updatePaket(
                        restoranId,
                        paketZaIzmenu.paketId,
                        paketFormData,
                    );

                setPaketi((prev) =>
                    prev.map((paket) =>
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
                        paket.paketId !==
                        obrisaniPaketId,
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

            setDekoraterskeFirme((prev) =>
                prev.map((firma) => ({
                    ...firma,
                    paketIds:
                        firma.paketIds?.filter(
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

            setMuzickiIzvodjaci((prev) =>
                prev.map((izvodjac) => ({
                    ...izvodjac,
                    paketIds:
                        izvodjac.paketIds?.filter(
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
    // DEKORATERSKE FIRME
    // =========================

    function handleDekoraterskaFirmaChange(event) {
        const { name, value } = event.target;

        setDekoraterskaFirmaFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleDekoraterskaFirmaPaketCheckbox(paketId) {
        setDekoraterskaFirmaFormData((prev) => {
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

    function handleDodajDekoraterskuFirmu() {
        setActionError('');
        setDekoraterskaFirmaZaIzmenu(null);

        setDekoraterskaFirmaFormData({
            naziv: '',
            telefon: '',
            portfolio: '',
            opis: '',
            paketIds: [],
        });

        setPrikaziDekoraterskaFirmaFormu(true);
    }

    function handleIzmeniDekoraterskuFirmu(firma) {
        setActionError('');
        setDekoraterskaFirmaZaIzmenu(firma);

        setDekoraterskaFirmaFormData({
            naziv: firma.naziv ?? '',
            telefon: firma.telefon ?? '',
            portfolio: firma.portfolio ?? '',
            opis: firma.opis ?? '',
            paketIds: firma.paketIds ?? [],
        });

        setPrikaziDekoraterskaFirmaFormu(true);
    }

    function handleOdustaniDekoraterskaFirma() {
        if (isSaving) {
            return;
        }

        setPrikaziDekoraterskaFirmaFormu(false);
        setDekoraterskaFirmaZaIzmenu(null);
        setActionError('');
    }

    async function handleDekoraterskaFirmaSubmit(event) {
        event.preventDefault();

        if (
            dekoraterskaFirmaFormData.paketIds.length === 0
        ) {
            setActionError(
                'Izaberite najmanje jedan paket.',
            );
            return;
        }

        setIsSaving(true);
        setActionError('');

        try {
            if (dekoraterskaFirmaZaIzmenu) {
                const izmenjenaFirma =
                    await updateDekoraterskaFirma(
                        restoranId,
                        dekoraterskaFirmaZaIzmenu.uslugaId,
                        dekoraterskaFirmaFormData,
                    );

                setDekoraterskeFirme((prev) =>
                    prev.map((firma) =>
                        firma.uslugaId ===
                            izmenjenaFirma.uslugaId
                            ? izmenjenaFirma
                            : firma,
                    ),
                );
            } else {
                const novaFirma =
                    await addDekoraterskaFirma(
                        restoranId,
                        dekoraterskaFirmaFormData,
                    );

                setDekoraterskeFirme((prev) => [
                    ...prev,
                    novaFirma,
                ]);
            }

            setPrikaziDekoraterskaFirmaFormu(false);
            setDekoraterskaFirmaZaIzmenu(null);
        } catch (error) {
            setActionError(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleObrisiDekoraterskuFirmu() {
        if (!dekoraterskaFirmaZaBrisanje) {
            return;
        }

        setDeleteLoading(true);
        setActionError('');

        try {
            await deleteDekoraterskaFirma(
                restoranId,
                dekoraterskaFirmaZaBrisanje.uslugaId,
            );

            setDekoraterskeFirme((prev) =>
                prev.filter(
                    (firma) =>
                        firma.uslugaId !==
                        dekoraterskaFirmaZaBrisanje.uslugaId,
                ),
            );

            setDekoraterskaFirmaZaBrisanje(null);
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
    // MUZIČKI IZVOĐAČI
    // =========================

    function handleMuzickiIzvodjacChange(event) {
        const { name, value } = event.target;

        setMuzickiIzvodjacFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleMuzickiIzvodjacPaketCheckbox(paketId) {
        setMuzickiIzvodjacFormData((prev) => {
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

    function handleDodajMuzickogIzvodjaca() {
        setActionError('');
        setMuzickiIzvodjacZaIzmenu(null);

        setMuzickiIzvodjacFormData({
            naziv: '',
            telefon: '',
            portfolio: '',
            tipMuzicara: '',
            paketIds: [],
        });

        setPrikaziMuzickiIzvodjacFormu(true);
    }

    function handleIzmeniMuzickogIzvodjaca(izvodjac) {
        setActionError('');
        setMuzickiIzvodjacZaIzmenu(izvodjac);

        setMuzickiIzvodjacFormData({
            naziv: izvodjac.naziv ?? '',
            telefon: izvodjac.telefon ?? '',
            portfolio: izvodjac.portfolio ?? '',
            tipMuzicara: izvodjac.tipMuzicara ?? '',
            paketIds: izvodjac.paketIds ?? [],
        });

        setPrikaziMuzickiIzvodjacFormu(true);
    }

    function handleOdustaniMuzickiIzvodjac() {
        if (isSaving) {
            return;
        }

        setPrikaziMuzickiIzvodjacFormu(false);
        setMuzickiIzvodjacZaIzmenu(null);
        setActionError('');
    }

    async function handleMuzickiIzvodjacSubmit(event) {
        event.preventDefault();

        if (
            muzickiIzvodjacFormData.paketIds.length === 0
        ) {
            setActionError(
                'Izaberite najmanje jedan paket.',
            );
            return;
        }

        setIsSaving(true);
        setActionError('');

        try {
            if (muzickiIzvodjacZaIzmenu) {
                const izmenjenIzvodjac =
                    await updateMuzickiIzvodjac(
                        restoranId,
                        muzickiIzvodjacZaIzmenu.uslugaId,
                        muzickiIzvodjacFormData,
                    );

                setMuzickiIzvodjaci((prev) =>
                    prev.map((izvodjac) =>
                        izvodjac.uslugaId ===
                            izmenjenIzvodjac.uslugaId
                            ? izmenjenIzvodjac
                            : izvodjac,
                    ),
                );
            } else {
                const noviIzvodjac =
                    await addMuzickiIzvodjac(
                        restoranId,
                        muzickiIzvodjacFormData,
                    );

                setMuzickiIzvodjaci((prev) => [
                    ...prev,
                    noviIzvodjac,
                ]);
            }

            setPrikaziMuzickiIzvodjacFormu(false);
            setMuzickiIzvodjacZaIzmenu(null);
        } catch (error) {
            setActionError(error.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleObrisiMuzickogIzvodjaca() {
        if (!muzickiIzvodjacZaBrisanje) {
            return;
        }

        setDeleteLoading(true);
        setActionError('');

        try {
            await deleteMuzickiIzvodjac(
                restoranId,
                muzickiIzvodjacZaBrisanje.uslugaId,
            );

            setMuzickiIzvodjaci((prev) =>
                prev.filter(
                    (izvodjac) =>
                        izvodjac.uslugaId !==
                        muzickiIzvodjacZaBrisanje.uslugaId,
                ),
            );

            setMuzickiIzvodjacZaBrisanje(null);
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
                        <button
                            type="button"
                            className={
                                aktivnaSekcija === 'SALE'
                                    ? 'upravljanje-nav-item aktivan'
                                    : 'upravljanje-nav-item'
                            }
                            onClick={() =>
                                promeniSekciju('SALE')
                            }
                        >
                            <div>
                                <strong>
                                    Sale
                                </strong>

                                <small>
                                    Upravljanje salama
                                </small>
                            </div>
                        </button>

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

                        <button
                            type="button"
                            className={
                                aktivnaSekcija === 'DEKORATERI'
                                    ? 'upravljanje-nav-item aktivan'
                                    : 'upravljanje-nav-item'
                            }
                            onClick={() =>
                                promeniSekciju('DEKORATERI')
                            }
                        >
                            <div>
                                <strong>
                                    Dekoraterske firme
                                </strong>

                                <small>
                                    Upravljanje dekoraterskim firmama
                                </small>
                            </div>
                        </button>

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

                        <button
                            type="button"
                            className={
                                aktivnaSekcija === 'MUZICKI_IZVODJACI'
                                    ? 'upravljanje-nav-item aktivan'
                                    : 'upravljanje-nav-item'
                            }
                            onClick={() =>
                                promeniSekciju(
                                    'MUZICKI_IZVODJACI',
                                )
                            }
                        >
                            <div>
                                <strong>
                                    Muzički izvođači
                                </strong>

                                <small>
                                    Upravljanje izvođačima
                                </small>
                            </div>
                        </button>
                    </aside>

                    <section className="upravljanje-content">

                        {/* =========================
                            SALE
                        ========================= */}

                        {aktivnaSekcija === 'SALE' && (
                            <>
                                <div className="management-section-header">
                                    <div>
                                        <span>
                                            Ponuda restorana
                                        </span>

                                        <h2>
                                            Sale
                                        </h2>

                                        <p>
                                            Dodavanje, izmena i brisanje
                                            sala koje pripadaju restoranu.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="management-primary-button"
                                        onClick={handleDodajSalu}
                                    >
                                        + Dodaj salu
                                    </button>
                                </div>

                                {sale.length === 0 ? (
                                    <div className="management-empty">
                                        <h3>
                                            Nema sala
                                        </h3>

                                        <p>
                                            Ovaj restoran trenutno nema
                                            evidentirane sale.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="management-table-wrapper">
                                        <table className="management-table">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        Redni broj sale
                                                    </th>

                                                    <th>
                                                        Kapacitet
                                                    </th>

                                                    <th>
                                                        Akcije
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {sale.map((sala) => (
                                                    <tr
                                                        key={
                                                            sala.salaId
                                                        }
                                                    >
                                                        <td>
                                                            <strong>
                                                                Sala{' '}
                                                                {
                                                                    sala.rbrS
                                                                }
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {
                                                                sala.kapacitet
                                                            }{' '}
                                                            osoba
                                                        </td>

                                                        <td>
                                                            <div className="management-row-actions">
                                                                <button
                                                                    type="button"
                                                                    className="management-edit-button"
                                                                    onClick={() =>
                                                                        handleIzmeniSalu(
                                                                            sala,
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

                                                                        setSalaZaBrisanje(
                                                                            sala,
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

                        {/* =========================
                            PAKETI
                        ========================= */}

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
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}

                        {/* =========================
                            KETERING
                        ========================= */}

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

                        {/* =========================
                            DEKORATERSKE FIRME
                        ========================= */}

                        {aktivnaSekcija === 'DEKORATERI' && (
                            <>
                                <div className="management-section-header">
                                    <div>
                                        <span>
                                            Ponuda restorana
                                        </span>

                                        <h2>
                                            Dekoraterske firme
                                        </h2>

                                        <p>
                                            Dodavanje, izmena i brisanje
                                            dekoraterskih firmi koje mogu
                                            biti deo ponude restorana.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="management-primary-button"
                                        onClick={
                                            handleDodajDekoraterskuFirmu
                                        }
                                    >
                                        + Dodaj dekoratersku firmu
                                    </button>
                                </div>

                                {dekoraterskeFirme.length === 0 ? (
                                    <div className="management-empty">
                                        <h3>
                                            Nema dekoraterskih firmi
                                        </h3>

                                        <p>
                                            Ovaj restoran trenutno nema
                                            dekoraterske firme u ponudi.
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
                                                {dekoraterskeFirme.map(
                                                    (firma) => (
                                                        <tr
                                                            key={
                                                                firma.uslugaId
                                                            }
                                                        >
                                                            <td>
                                                                <strong>
                                                                    {
                                                                        firma.naziv
                                                                    }
                                                                </strong>

                                                                {firma.portfolio && (
                                                                    <div>
                                                                        <a
                                                                            href={
                                                                                firma.portfolio
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
                                                                    firma.telefon
                                                                }
                                                            </td>

                                                            <td className="management-description-cell">
                                                                {firma.opis ||
                                                                    '-'}
                                                            </td>

                                                            <td>
                                                                {getNaziviPaketa(
                                                                    firma.paketIds ??
                                                                    [],
                                                                ) || '-'}
                                                            </td>

                                                            <td>
                                                                <div className="management-row-actions">
                                                                    <button
                                                                        type="button"
                                                                        className="management-edit-button"
                                                                        onClick={() =>
                                                                            handleIzmeniDekoraterskuFirmu(
                                                                                firma,
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

                                                                            setDekoraterskaFirmaZaBrisanje(
                                                                                firma,
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

                        {/* =========================
                            FOTOGRAFI
                        ========================= */}

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

                        {/* =========================
                            MUZIČKI IZVOĐAČI
                        ========================= */}

                        {aktivnaSekcija ===
                            'MUZICKI_IZVODJACI' && (
                                <>
                                    <div className="management-section-header">
                                        <div>
                                            <span>
                                                Ponuda restorana
                                            </span>

                                            <h2>
                                                Muzički izvođači
                                            </h2>

                                            <p>
                                                Dodavanje, izmena i brisanje
                                                muzičkih izvođača koji se mogu
                                                angažovati prilikom organizacije
                                                događaja.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="management-primary-button"
                                            onClick={
                                                handleDodajMuzickogIzvodjaca
                                            }
                                        >
                                            + Dodaj izvođača
                                        </button>
                                    </div>

                                    {muzickiIzvodjaci.length === 0 ? (
                                        <div className="management-empty">
                                            <h3>
                                                Nema muzičkih izvođača
                                            </h3>

                                            <p>
                                                Ovaj restoran trenutno nema
                                                muzičke izvođače u ponudi.
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
                                                        <th>Paketi</th>
                                                        <th>Akcije</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {muzickiIzvodjaci.map(
                                                        (izvodjac) => (
                                                            <tr
                                                                key={
                                                                    izvodjac.uslugaId
                                                                }
                                                            >
                                                                <td>
                                                                    <strong>
                                                                        {
                                                                            izvodjac.naziv
                                                                        }
                                                                    </strong>

                                                                    {izvodjac.portfolio && (
                                                                        <div>
                                                                            <a
                                                                                href={
                                                                                    izvodjac.portfolio
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
                                                                        izvodjac.telefon
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        izvodjac.tipMuzicara
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {getNaziviPaketa(
                                                                        izvodjac.paketIds ??
                                                                        [],
                                                                    ) || '-'}
                                                                </td>

                                                                <td>
                                                                    <div className="management-row-actions">
                                                                        <button
                                                                            type="button"
                                                                            className="management-edit-button"
                                                                            onClick={() =>
                                                                                handleIzmeniMuzickogIzvodjaca(
                                                                                    izvodjac,
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

                                                                                setMuzickiIzvodjacZaBrisanje(
                                                                                    izvodjac,
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
                            !prikaziSalaFormu &&
                            !prikaziPaketFormu &&
                            !prikaziKeteringFormu &&
                            !prikaziDekoraterskaFirmaFormu &&
                            !prikaziFotografFormu &&
                            !prikaziMuzickiIzvodjacFormu &&
                            !salaZaBrisanje &&
                            !paketZaBrisanje &&
                            !keteringZaBrisanje &&
                            !dekoraterskaFirmaZaBrisanje &&
                            !fotografZaBrisanje &&
                            !muzickiIzvodjacZaBrisanje && (
                                <div className="management-error management-error-bottom">
                                    {actionError}
                                </div>
                            )}
                    </section>
                </div>
            </main>

            {/* =========================
                MODAL - SALA
            ========================= */}

            {prikaziSalaFormu && (
                <div className="management-modal-overlay">
                    <form
                        className="management-form-modal"
                        onSubmit={handleSalaSubmit}
                    >
                        <div className="management-form-header">
                            <span>
                                {salaZaIzmenu
                                    ? 'Izmena'
                                    : 'Dodavanje'}
                            </span>

                            <h2>
                                {salaZaIzmenu
                                    ? 'Izmena sale'
                                    : 'Nova sala'}
                            </h2>

                            <p>
                                Unesite redni broj i kapacitet sale.
                            </p>
                        </div>

                        {actionError && (
                            <div className="management-error">
                                {actionError}
                            </div>
                        )}

                        <div className="management-form-grid">
                            <div className="management-field">
                                <label htmlFor="rbrS">
                                    Redni broj sale
                                </label>

                                <input
                                    id="rbrS"
                                    name="rbrS"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={
                                        salaFormData.rbrS
                                    }
                                    onChange={
                                        handleSalaChange
                                    }
                                    required
                                />
                            </div>

                            <div className="management-field">
                                <label htmlFor="kapacitet">
                                    Kapacitet
                                </label>

                                <input
                                    id="kapacitet"
                                    name="kapacitet"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={
                                        salaFormData.kapacitet
                                    }
                                    onChange={
                                        handleSalaChange
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="management-form-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={isSaving}
                                onClick={
                                    handleOdustaniSala
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
                                    : salaZaIzmenu
                                        ? 'Sačuvaj izmene'
                                        : 'Dodaj salu'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                                    value={
                                        paketFormData.naziv
                                    }
                                    onChange={
                                        handlePaketChange
                                    }
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
                                    value={
                                        paketFormData.opis
                                    }
                                    onChange={
                                        handlePaketChange
                                    }
                                />
                            </div>
                        </div>

                        <div className="management-form-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={isSaving}
                                onClick={
                                    handleOdustaniPaket
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
                MODAL - DEKORATERSKA FIRMA
            ========================= */}

            {prikaziDekoraterskaFirmaFormu && (
                <div className="management-modal-overlay">
                    <form
                        className="management-form-modal"
                        onSubmit={
                            handleDekoraterskaFirmaSubmit
                        }
                    >
                        <div className="management-form-header">
                            <span>
                                {dekoraterskaFirmaZaIzmenu
                                    ? 'Izmena'
                                    : 'Dodavanje'}
                            </span>

                            <h2>
                                {dekoraterskaFirmaZaIzmenu
                                    ? 'Izmena dekoraterske firme'
                                    : 'Nova dekoraterska firma'}
                            </h2>

                            <p>
                                Unesite podatke o dekoraterskoj
                                firmi i izaberite pakete u kojima
                                će biti dostupna.
                            </p>
                        </div>

                        {actionError && (
                            <div className="management-error">
                                {actionError}
                            </div>
                        )}

                        <div className="management-form-grid">
                            <div className="management-field">
                                <label htmlFor="dekoraterNaziv">
                                    Naziv
                                </label>

                                <input
                                    id="dekoraterNaziv"
                                    name="naziv"
                                    value={
                                        dekoraterskaFirmaFormData.naziv
                                    }
                                    onChange={
                                        handleDekoraterskaFirmaChange
                                    }
                                    required
                                />
                            </div>

                            <div className="management-field">
                                <label htmlFor="dekoraterTelefon">
                                    Telefon
                                </label>

                                <input
                                    id="dekoraterTelefon"
                                    name="telefon"
                                    value={
                                        dekoraterskaFirmaFormData.telefon
                                    }
                                    onChange={
                                        handleDekoraterskaFirmaChange
                                    }
                                    required
                                />
                            </div>

                            <div className="management-field management-full-field">
                                <label htmlFor="dekoraterPortfolio">
                                    Portfolio
                                </label>

                                <input
                                    id="dekoraterPortfolio"
                                    name="portfolio"
                                    value={
                                        dekoraterskaFirmaFormData.portfolio
                                    }
                                    onChange={
                                        handleDekoraterskaFirmaChange
                                    }
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="management-field management-full-field">
                                <label htmlFor="dekoraterOpis">
                                    Opis
                                </label>

                                <textarea
                                    id="dekoraterOpis"
                                    name="opis"
                                    rows="4"
                                    value={
                                        dekoraterskaFirmaFormData.opis
                                    }
                                    onChange={
                                        handleDekoraterskaFirmaChange
                                    }
                                />
                            </div>

                            <div className="management-field management-full-field">
                                <label>
                                    Paketi
                                </label>

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
                                                    dekoraterskaFirmaFormData.paketIds.includes(
                                                        paket.paketId,
                                                    )
                                                }
                                                onChange={() =>
                                                    handleDekoraterskaFirmaPaketCheckbox(
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
                            </div>
                        </div>

                        <div className="management-form-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={isSaving}
                                onClick={
                                    handleOdustaniDekoraterskaFirma
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
                                    : dekoraterskaFirmaZaIzmenu
                                        ? 'Sačuvaj izmene'
                                        : 'Dodaj dekoratersku firmu'}
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

            {/* =========================
                MODAL - MUZIČKI IZVOĐAČ
            ========================= */}

            {prikaziMuzickiIzvodjacFormu && (
                <div className="management-modal-overlay">
                    <form
                        className="management-form-modal"
                        onSubmit={
                            handleMuzickiIzvodjacSubmit
                        }
                    >
                        <div className="management-form-header">
                            <span>
                                {muzickiIzvodjacZaIzmenu
                                    ? 'Izmena'
                                    : 'Dodavanje'}
                            </span>

                            <h2>
                                {muzickiIzvodjacZaIzmenu
                                    ? 'Izmena muzičkog izvođača'
                                    : 'Novi muzički izvođač'}
                            </h2>

                            <p>
                                Unesite podatke o muzičkom izvođaču
                                i izaberite pakete u kojima će biti
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
                                <label htmlFor="muzicarNaziv">
                                    Naziv
                                </label>

                                <input
                                    id="muzicarNaziv"
                                    name="naziv"
                                    value={
                                        muzickiIzvodjacFormData.naziv
                                    }
                                    onChange={
                                        handleMuzickiIzvodjacChange
                                    }
                                    required
                                />
                            </div>

                            <div className="management-field">
                                <label htmlFor="muzicarTelefon">
                                    Telefon
                                </label>

                                <input
                                    id="muzicarTelefon"
                                    name="telefon"
                                    value={
                                        muzickiIzvodjacFormData.telefon
                                    }
                                    onChange={
                                        handleMuzickiIzvodjacChange
                                    }
                                    required
                                />
                            </div>

                            <div className="management-field management-full-field">
                                <label htmlFor="muzicarPortfolio">
                                    Portfolio
                                </label>

                                <input
                                    id="muzicarPortfolio"
                                    name="portfolio"
                                    value={
                                        muzickiIzvodjacFormData.portfolio
                                    }
                                    onChange={
                                        handleMuzickiIzvodjacChange
                                    }
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="management-field management-full-field">
                                <label htmlFor="tipMuzicara">
                                    Tip izvođača
                                </label>

                                <input
                                    id="tipMuzicara"
                                    name="tipMuzicara"
                                    value={
                                        muzickiIzvodjacFormData.tipMuzicara
                                    }
                                    onChange={
                                        handleMuzickiIzvodjacChange
                                    }
                                    required
                                />
                            </div>

                            <div className="management-field management-full-field">
                                <label>
                                    Paketi
                                </label>

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
                                                    muzickiIzvodjacFormData.paketIds.includes(
                                                        paket.paketId,
                                                    )
                                                }
                                                onChange={() =>
                                                    handleMuzickiIzvodjacPaketCheckbox(
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
                            </div>
                        </div>

                        <div className="management-form-actions">
                            <button
                                type="button"
                                className="management-secondary-button"
                                disabled={isSaving}
                                onClick={
                                    handleOdustaniMuzickiIzvodjac
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
                                    : muzickiIzvodjacZaIzmenu
                                        ? 'Sačuvaj izmene'
                                        : 'Dodaj izvođača'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* =========================
                BRISANJE SALE
            ========================= */}

            {salaZaBrisanje && (
                <div className="management-modal-overlay">
                    <div className="management-confirm-modal">
                        <div className="management-confirm-icon">
                            !
                        </div>

                        <h2>
                            Brisanje sale
                        </h2>

                        <p>
                            Da li ste sigurni da želite da obrišete{' '}
                            <strong>
                                Salu {salaZaBrisanje.rbrS}
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
                                    setSalaZaBrisanje(null);
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
                                    handleObrisiSalu
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

            {/* =========================
                BRISANJE PAKETA
            ========================= */}

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
                            Da li ste sigurni da želite da obrišete
                            paket{' '}
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
                                onClick={
                                    handleObrisiPaket
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

            {/* =========================
                BRISANJE KETERING FIRME
            ========================= */}

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
                            Da li ste sigurni da želite da uklonite{' '}
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

            {/* =========================
                BRISANJE DEKORATERSKE FIRME
            ========================= */}

            {dekoraterskaFirmaZaBrisanje && (
                <div className="management-modal-overlay">
                    <div className="management-confirm-modal">
                        <div className="management-confirm-icon">
                            !
                        </div>

                        <h2>
                            Brisanje dekoraterske firme
                        </h2>

                        <p>
                            Da li ste sigurni da želite da uklonite{' '}
                            <strong>
                                {
                                    dekoraterskaFirmaZaBrisanje.naziv
                                }
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
                                    setDekoraterskaFirmaZaBrisanje(
                                        null,
                                    );
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
                                    handleObrisiDekoraterskuFirmu
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

            {/* =========================
                BRISANJE FOTOGRAFA
            ========================= */}

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
                            Da li ste sigurni da želite da uklonite{' '}
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

            {/* =========================
                BRISANJE MUZIČKOG IZVOĐAČA
            ========================= */}

            {muzickiIzvodjacZaBrisanje && (
                <div className="management-modal-overlay">
                    <div className="management-confirm-modal">
                        <div className="management-confirm-icon">
                            !
                        </div>

                        <h2>
                            Brisanje muzičkog izvođača
                        </h2>

                        <p>
                            Da li ste sigurni da želite da uklonite{' '}
                            <strong>
                                {
                                    muzickiIzvodjacZaBrisanje.naziv
                                }
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
                                    setMuzickiIzvodjacZaBrisanje(
                                        null,
                                    );
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
                                    handleObrisiMuzickogIzvodjaca
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