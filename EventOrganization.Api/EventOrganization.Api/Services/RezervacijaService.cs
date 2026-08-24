using EventOrganization.Api.DTOs.Rezervacije;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class RezervacijaService
{
    private readonly RezervacijaRepository
        _rezervacijaRepository;

    public RezervacijaService(
        RezervacijaRepository rezervacijaRepository)
    {
        _rezervacijaRepository =
            rezervacijaRepository;
    }

    public async Task<List<RezervacijaPregledDto>>
        GetByRestoranId(
            decimal restoranId,
            CancellationToken cancellationToken = default)
    {
        await RealizujIstekleRezervacije(
            cancellationToken);

        var rezervacije =
            await _rezervacijaRepository
                .GetByRestoranId(
                    restoranId,
                    cancellationToken);

        return rezervacije
            .Select(rezervacija =>
                new RezervacijaPregledDto
                {
                    RezervacijaId =
                        rezervacija.RezervacijaId,

                    VremePocetka =
                        rezervacija.VremePocetka,

                    VremeZavrsetka =
                        rezervacija.VremeZavrsetka,

                    BrGostiju =
                        Convert.ToInt32(
                            rezervacija.BrGostiju),

                    Status =
                        rezervacija.StatusRez
                            .ToString(),

                    TipoviDogadjaja =
                        rezervacija.TipoviDogadjaja
                            .Select(tip =>
                                tip.Tip.ToString())
                            .ToList()
                })
            .ToList();
    }

    public async Task<RezervacijaDetaljiDto?>
        GetDetalji(
            decimal restoranId,
            decimal rezervacijaId,
            CancellationToken cancellationToken = default)
    {
        var rezervacija =
            await _rezervacijaRepository
                .GetDetalji(
                    restoranId,
                    rezervacijaId,
                    cancellationToken);

        if (rezervacija is null)
        {
            return null;
        }

        return new RezervacijaDetaljiDto
        {
            RezervacijaId =
                rezervacija.RezervacijaId,

            ImeKlijenta =
                rezervacija.Korisnik
                    .Korisnik.Ime,

            PrezimeKlijenta =
                rezervacija.Korisnik
                    .Korisnik.Prezime,

            EmailKlijenta =
                rezervacija.Korisnik
                    .Korisnik.Email,

            TelefonKlijenta =
                rezervacija.Korisnik
                    .Korisnik.Telefon,

            PaketId =
                rezervacija.PaketId,

            NazivPaketa =
                rezervacija.Paket.Naziv,

            TipoviDogadjaja =
                rezervacija.TipoviDogadjaja
                    .Select(tip =>
                        tip.Tip.ToString())
                    .ToList(),

            BrGostiju =
                rezervacija.BrGostiju,

            Opis =
                rezervacija.Opis,

            Napomena =
                rezervacija.Napomena,

            VremePocetka =
                rezervacija.VremePocetka,

            VremeZavrsetka =
                rezervacija.VremeZavrsetka,

            VremeKreiranja =
                rezervacija.VremeKreiranja,

            Status =
                rezervacija.StatusRez
                    .ToString(),

            DodatneUsluge =
                rezervacija.StavkeRezervacije
                    .Select(stavka =>
                        stavka.Usluga.NazivU)
                    .ToList(),

            SalaId =
                rezervacija.SalaId,

            RbrSSale =
                rezervacija.Sala?.RbrS
        };
    }

    public async Task<RezervacijaDetaljiDto?>
        ObradiRezervaciju(
            decimal restoranId,
            decimal rezervacijaId,
            StatusRez noviStatus,
            CancellationToken cancellationToken = default)
    {
        await RealizujIstekleRezervacije(
            cancellationToken);

        var rezervacija =
            await _rezervacijaRepository
                .GetForUpdate(
                    restoranId,
                    rezervacijaId,
                    cancellationToken);

        if (rezervacija is null)
        {
            return null;
        }

        var dozvoljenaPromena =
            false;

        if (rezervacija.StatusRez ==
            StatusRez.POSLATA)
        {
            dozvoljenaPromena =
                noviStatus ==
                    StatusRez.POTVRDJENA ||
                noviStatus ==
                    StatusRez.ODBIJENA ||
                noviStatus ==
                    StatusRez.OTKAZANA;
        }

        if (rezervacija.StatusRez ==
            StatusRez.POTVRDJENA)
        {
            dozvoljenaPromena =
                noviStatus ==
                    StatusRez.OTKAZANA;
        }

        if (!dozvoljenaPromena)
        {
            throw new InvalidOperationException(
                "Promena statusa rezervacije nije dozvoljena.");
        }

        if (noviStatus ==
                StatusRez.POTVRDJENA &&
            rezervacija.SalaId.HasValue)
        {
            var salaJeZauzeta =
                await _rezervacijaRepository
                    .SalaJeZauzeta(
                        rezervacija.SalaId.Value,
                        rezervacija.VremePocetka,
                        rezervacija.VremeZavrsetka,
                        rezervacija.RezervacijaId,
                        cancellationToken);

            if (salaJeZauzeta)
            {
                throw new InvalidOperationException(
                    "Salu nije moguće rezervisati jer je u međuvremenu potvrđena druga rezervacija za isti termin.");
            }
        }

        rezervacija.StatusRez =
            noviStatus;

        await _rezervacijaRepository
            .SaveChanges(
                cancellationToken);

        return await GetDetalji(
            restoranId,
            rezervacijaId,
            cancellationToken);
    }

    public async Task RealizujIstekleRezervacije(
        CancellationToken cancellationToken = default)
    {
        var trenutnoVreme =
            DateTime.Now;

        var rezervacije =
            await _rezervacijaRepository
                .GetPotvrdjeneIstekle(
                    trenutnoVreme,
                    cancellationToken);

        if (rezervacije.Count == 0)
        {
            return;
        }

        foreach (var rezervacija in rezervacije)
        {
            rezervacija.StatusRez =
                StatusRez.REALIZOVANA;
        }

        await _rezervacijaRepository
            .SaveChanges(
                cancellationToken);
    }

    public async Task<List<DostupnaSalaDto>>
    GetDostupneSale(
        decimal restoranId,
        PretragaDostupnihSalaDto request,
        CancellationToken cancellationToken = default)
    {
        if (request.BrGostiju <= 0)
        {
            throw new ArgumentException(
                "Broj gostiju mora biti veći od nule.");
        }

        if (request.VremePocetka >=
            request.VremeZavrsetka)
        {
            throw new ArgumentException(
                "Vreme završetka mora biti nakon vremena početka.");
        }

        if (request.VremePocetka <=
            DateTime.Now)
        {
            throw new ArgumentException(
                "Termin rezervacije mora biti u budućnosti.");
        }

        var sale =
            await _rezervacijaRepository
                .GetDostupneSale(
                    restoranId,
                    request.BrGostiju,
                    request.VremePocetka,
                    request.VremeZavrsetka,
                    cancellationToken);

        var trenutnoVreme =
            DateTime.Now;

        return sale
            .Select(sala =>
            {
                var cenaStolice =
                    sala.Cenovnici
                        .Where(cena =>
                            cena.DatumIzmene <=
                                trenutnoVreme)
                        .OrderByDescending(cena =>
                            cena.DatumIzmene)
                        .ThenByDescending(cena =>
                            cena.CenovnikId)
                        .FirstOrDefault();

                return new DostupnaSalaDto
                {
                    SalaId =
                        sala.SalaId,

                    RbrS =
                        sala.RbrS,

                    Kapacitet =
                        sala.Kapacitet,

                    CenaStolice =
                        cenaStolice?.Iznos
                };
            })
            .ToList();
    }

    public async Task<decimal> Obracun(
        KreiranjeRezervacijeDto request,
        CancellationToken cancellationToken = default)
    {
        var trenutnoVreme =
            DateTime.Now;

        var podaci =
            await ValidirajIUcitajPodatke(
                request,
                trenutnoVreme,
                cancellationToken);

        return IzracunajCenu(
            podaci.Sala,
            podaci.Usluge,
            request.BrGostiju,
            trenutnoVreme);
    }

    public async Task<KreiranjeRezervacijeResponseDto>
        KreirajRezervaciju(
            decimal korisnikId,
            KreiranjeRezervacijeDto request,
            CancellationToken cancellationToken = default)
    {
        var vremeKreiranja =
            DateTime.Now;

        var klijentPostoji =
            await _rezervacijaRepository
                .KlijentPostoji(
                    korisnikId,
                    cancellationToken);

        if (!klijentPostoji)
        {
            throw new InvalidOperationException(
                "Prijavljeni korisnik nije klijent.");
        }

        var podaci =
            await ValidirajIUcitajPodatke(
                request,
                vremeKreiranja,
                cancellationToken);

        var ukupnaCena =
            IzracunajCenu(
                podaci.Sala,
                podaci.Usluge,
                request.BrGostiju,
                vremeKreiranja);

        var rezervacijaId =
            await _rezervacijaRepository
                .GetNextRezervacijaId(
                    cancellationToken);

        var rezervacija =
            new Rezervacija
            {
                RezervacijaId =
                    rezervacijaId,

                BrGostiju =
                    request.BrGostiju,

                Opis =
                    string.IsNullOrWhiteSpace(
                        request.Opis)
                        ? null
                        : request.Opis.Trim(),

                Napomena =
                    string.IsNullOrWhiteSpace(
                        request.Napomena)
                        ? null
                        : request.Napomena.Trim(),

                VremePocetka =
                    request.VremePocetka,

                VremeZavrsetka =
                    request.VremeZavrsetka,

                VremeKreiranja =
                    vremeKreiranja,

                StatusRez =
                    StatusRez.POSLATA,

                KorisnikId =
                    korisnikId,

                PaketId =
                    request.PaketId,

                SalaId =
                    request.SalaId
            };

        rezervacija.TipoviDogadjaja.Add(
            podaci.TipDogadjaja);

        if (podaci.Usluge.Count > 0)
        {
            var sledeciStavkaId =
                await _rezervacijaRepository
                    .GetNextStavkaId(
                        cancellationToken);

            foreach (var usluga in podaci.Usluge)
            {
                rezervacija.StavkeRezervacije.Add(
                    new StavkaRezervacije
                    {
                        StavkaId =
                            sledeciStavkaId,

                        RezervacijaId =
                            rezervacijaId,

                        UslugaId =
                            usluga.UslugaId,

                        TipStavke =
                            usluga.TipUsluge
                    });

                sledeciStavkaId++;
            }
        }

        await _rezervacijaRepository
            .Add(
                rezervacija,
                cancellationToken);

        return new KreiranjeRezervacijeResponseDto
        {
            RezervacijaId =
                rezervacija.RezervacijaId,

            Status =
                rezervacija.StatusRez
                    .ToString(),

            VremeKreiranja =
                rezervacija.VremeKreiranja,

            UkupnaCena =
                ukupnaCena
        };
    }

    private async Task<PodaciZaRezervaciju>
        ValidirajIUcitajPodatke(
            KreiranjeRezervacijeDto request,
            DateTime trenutnoVreme,
            CancellationToken cancellationToken)
    {
        if (request.RestoranId <= 0)
        {
            throw new ArgumentException(
                "Restoran nije ispravno izabran.");
        }

        if (request.SalaId <= 0)
        {
            throw new ArgumentException(
                "Sala nije ispravno izabrana.");
        }

        if (request.PaketId <= 0)
        {
            throw new ArgumentException(
                "Paket nije ispravno izabran.");
        }

        if (request.BrGostiju <= 0)
        {
            throw new ArgumentException(
                "Broj gostiju mora biti veći od nule.");
        }

        if (request.VremePocetka >=
            request.VremeZavrsetka)
        {
            throw new ArgumentException(
                "Vreme završetka mora biti nakon vremena početka.");
        }

        if (request.VremePocetka <=
            trenutnoVreme)
        {
            throw new ArgumentException(
                "Termin rezervacije mora biti u budućnosti.");
        }

        var paket =
            await _rezervacijaRepository
                .GetPaketZaRezervaciju(
                    request.RestoranId,
                    request.PaketId,
                    cancellationToken);

        if (paket is null)
        {
            throw new ArgumentException(
                "Izabrani paket ne postoji.");
        }

        var sala =
            paket.Sale
                .FirstOrDefault(sala =>
                    sala.SalaId ==
                        request.SalaId &&
                    sala.RestoranId ==
                        request.RestoranId &&
                    sala.Status ==
                        Status.AKTIVNO);

        if (sala is null)
        {
            throw new ArgumentException(
                "Izabrani paket nije dostupan u izabranoj sali.");
        }

        if (request.BrGostiju >
            sala.Kapacitet)
        {
            throw new ArgumentException(
                "Broj gostiju je veći od kapaciteta izabrane sale.");
        }

        var salaJeZauzeta =
            await _rezervacijaRepository
                .SalaJeZauzeta(
                    request.SalaId,
                    request.VremePocetka,
                    request.VremeZavrsetka,
                    null,
                    cancellationToken);

        if (salaJeZauzeta)
        {
            throw new InvalidOperationException(
                "Izabrana sala je zauzeta u izabranom terminu.");
        }

        var tipDogadjaja =
            await _rezervacijaRepository
                .GetTipDogadjaja(
                    request.TipDogadjaja,
                    cancellationToken);

        if (tipDogadjaja is null)
        {
            throw new ArgumentException(
                "Izabrani tip događaja ne postoji.");
        }

        var uslugaIds =
            request.UslugaIds
                .Distinct()
                .ToList();

        var usluge =
            paket.Usluge
                .Where(usluga =>
                    uslugaIds.Contains(
                        usluga.UslugaId) &&
                    usluga.Status ==
                        Status.AKTIVNO)
                .ToList();

        if (usluge.Count !=
            uslugaIds.Count)
        {
            throw new ArgumentException(
                "Jedna ili više izabranih usluga ne pripadaju izabranom paketu.");
        }

        return new PodaciZaRezervaciju
        {
            Sala =
                sala,

            Usluge =
                usluge,

            TipDogadjaja =
                tipDogadjaja
        };
    }

    private static decimal IzracunajCenu(
        Sala sala,
        List<Usluga> usluge,
        decimal brGostiju,
        DateTime trenutnoVreme)
    {
        var cenaStolice =
            sala.Cenovnici
                .Where(cena =>
                    cena.DatumIzmene <=
                        trenutnoVreme)
                .OrderByDescending(cena =>
                    cena.DatumIzmene)
                .ThenByDescending(cena =>
                    cena.CenovnikId)
                .FirstOrDefault();

        if (cenaStolice is null)
        {
            throw new InvalidOperationException(
                "Za izabranu salu nije definisana cena.");
        }

        var ukupnaCena =
            brGostiju *
            cenaStolice.Iznos;

        foreach (var usluga in usluge)
        {
            var cenaUsluge =
                usluga.Cenovnici
                    .Where(cena =>
                        cena.DatumIzmene <=
                            trenutnoVreme)
                    .OrderByDescending(cena =>
                        cena.DatumIzmene)
                    .ThenByDescending(cena =>
                        cena.CenovnikId)
                    .FirstOrDefault();

            if (cenaUsluge is null)
            {
                throw new InvalidOperationException(
                    $"Za uslugu '{usluga.NazivU}' nije definisana cena.");
            }

            ukupnaCena +=
                cenaUsluge.Iznos;
        }

        return ukupnaCena;
    }

    private class PodaciZaRezervaciju
    {
        public Sala Sala { get; set; } =
            null!;

        public List<Usluga> Usluge { get; set; } =
            [];

        public TipDogadjaja TipDogadjaja { get; set; } =
            null!;
    }
}