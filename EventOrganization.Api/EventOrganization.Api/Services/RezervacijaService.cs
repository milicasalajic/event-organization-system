using EventOrganization.Api.DTOs.Rezervacije;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class RezervacijaService
{
    private readonly RezervacijaRepository _rezervacijaRepository;
    private readonly SalaRepository _salaRepository;
    private readonly UslugaRepository _uslugaRepository;
    private readonly CenovnikRepository _cenovnikRepository;

    public RezervacijaService(
        RezervacijaRepository rezervacijaRepository,
        SalaRepository salaRepository,
        UslugaRepository uslugaRepository,
        CenovnikRepository cenovnikRepository)
    {
        _rezervacijaRepository = rezervacijaRepository;
        _salaRepository = salaRepository;
        _uslugaRepository = uslugaRepository;
        _cenovnikRepository = cenovnikRepository;
    }

    public async Task<List<RezervacijaPregledDto>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        await RealizujIstekleRezervacije(cancellationToken);

        var rezervacije = await _rezervacijaRepository.GetByRestoranId(
            restoranId,
            cancellationToken);

        return rezervacije
            .Select(rezervacija => new RezervacijaPregledDto
            {
                RezervacijaId = rezervacija.RezervacijaId,
                VremePocetka = rezervacija.VremePocetka,
                VremeZavrsetka = rezervacija.VremeZavrsetka,
                BrGostiju = Convert.ToInt32(rezervacija.BrGostiju),
                Status = rezervacija.StatusRez.ToString(),
                TipoviDogadjaja = rezervacija.TipoviDogadjaja
                    .Select(tip => tip.Tip.ToString())
                    .ToList()
            })
            .ToList();
    }

    public async Task<RezervacijaDetaljiDto?> GetDetalji(
        decimal restoranId,
        decimal rezervacijaId,
        CancellationToken cancellationToken = default)
    {
        var rezervacija = await _rezervacijaRepository.GetDetalji(
            restoranId,
            rezervacijaId,
            cancellationToken);

        if (rezervacija is null)
        {
            return null;
        }

        return new RezervacijaDetaljiDto
        {
            RezervacijaId = rezervacija.RezervacijaId,
            ImeKlijenta = rezervacija.Korisnik.Korisnik.Ime,
            PrezimeKlijenta = rezervacija.Korisnik.Korisnik.Prezime,
            EmailKlijenta = rezervacija.Korisnik.Korisnik.Email,
            TelefonKlijenta = rezervacija.Korisnik.Korisnik.Telefon,
            PaketId = rezervacija.PaketId,
            NazivPaketa = rezervacija.Paket.Naziv,
            TipoviDogadjaja = rezervacija.TipoviDogadjaja
                .Select(tip => tip.Tip.ToString())
                .ToList(),
            BrGostiju = rezervacija.BrGostiju,
            Opis = rezervacija.Opis,
            Napomena = rezervacija.Napomena,
            VremePocetka = rezervacija.VremePocetka,
            VremeZavrsetka = rezervacija.VremeZavrsetka,
            VremeKreiranja = rezervacija.VremeKreiranja,
            Status = rezervacija.StatusRez.ToString(),
            DodatneUsluge = rezervacija.StavkeRezervacije
                .Select(stavka => stavka.Usluga.NazivU)
                .ToList(),
            SalaId = rezervacija.SalaId,
            RbrSSale = rezervacija.Sala?.RbrS
        };
    }

    public async Task<RezervacijaDetaljiDto?> ObradiRezervaciju(
        decimal restoranId,
        decimal rezervacijaId,
        StatusRez noviStatus,
        CancellationToken cancellationToken = default)
    {
        await RealizujIstekleRezervacije(cancellationToken);

        var rezervacija = await _rezervacijaRepository.GetForUpdate(
            restoranId,
            rezervacijaId,
            cancellationToken);

        if (rezervacija is null)
        {
            return null;
        }

        var dozvoljenaPromena = false;

        if (rezervacija.StatusRez == StatusRez.POSLATA)
        {
            // Promena je dozvoljena ako je novi status jedan od ova tri
            dozvoljenaPromena =
                noviStatus == StatusRez.POTVRDJENA ||
                noviStatus == StatusRez.ODBIJENA ||
                noviStatus == StatusRez.OTKAZANA;
        }

        if (rezervacija.StatusRez == StatusRez.POTVRDJENA)
        {
            dozvoljenaPromena = noviStatus == StatusRez.OTKAZANA;
        }

        if (!dozvoljenaPromena)
        {
            throw new InvalidOperationException(
                "Promena statusa rezervacije nije dozvoljena.");
        }

        if (noviStatus == StatusRez.POTVRDJENA && rezervacija.SalaId.HasValue)
        {
            var salaJeZauzeta = await _rezervacijaRepository.SalaJeZauzeta(
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

        rezervacija.StatusRez = noviStatus;

        await _rezervacijaRepository.SaveChanges(cancellationToken);

        return await GetDetalji(
            restoranId,
            rezervacijaId,
            cancellationToken);
    }

    public async Task RealizujIstekleRezervacije(
        CancellationToken cancellationToken = default)
    {
        var trenutnoVreme = DateTime.Now;

        // EF Core prati entitete ako nije korišćen AsNoTracking,
        // pa SaveChanges zna koje promene treba da sačuva
        var rezervacije = await _rezervacijaRepository.GetPotvrdjeneIstekle(
            trenutnoVreme,
            cancellationToken);

        if (rezervacije.Count == 0)
        {
            return;
        }

        foreach (var rezervacija in rezervacije)
        {
            rezervacija.StatusRez = StatusRez.REALIZOVANA;
        }

        await _rezervacijaRepository.SaveChanges(cancellationToken);
    }

    public async Task<List<DostupnaSalaDto>> GetDostupneSale(
        decimal restoranId,
        PretragaDostupnihSalaDto request,
        CancellationToken cancellationToken = default)
    {
        if (request.BrGostiju <= 0)
        {
            throw new ArgumentException("Broj gostiju mora biti veći od nule.");
        }

        if (request.VremePocetka >= request.VremeZavrsetka)
        {
            throw new ArgumentException(
                "Vreme završetka mora biti nakon vremena početka.");
        }

        if (request.VremePocetka <= DateTime.Now)
        {
            throw new ArgumentException(
                "Termin rezervacije mora biti u budućnosti.");
        }

        var sale = await _rezervacijaRepository.GetDostupneSale(
            restoranId,
            request.BrGostiju,
            request.VremePocetka,
            request.VremeZavrsetka,
            cancellationToken);

        var trenutnoVreme = DateTime.Now;
        var rezultat = new List<DostupnaSalaDto>();

        foreach (var sala in sale)
        {
            var cenaStolice = await _cenovnikRepository.GetVazecaCenaSale(
                sala.SalaId,
                trenutnoVreme,
                cancellationToken);

            rezultat.Add(new DostupnaSalaDto
            {
                SalaId = sala.SalaId,
                RbrS = sala.RbrS,
                Kapacitet = sala.Kapacitet,
                CenaStolice = cenaStolice?.Iznos
            });
        }

        return rezultat;
    }

    public async Task<decimal> Obracun(
        KreiranjeRezervacijeDto request,
        CancellationToken cancellationToken = default)
    {
        var trenutnoVreme = DateTime.Now;

        var podaci = await ValidirajIUcitajPodatke(
            request,
            trenutnoVreme,
            cancellationToken);

        return await IzracunajCenu(
            podaci.Sala,
            podaci.Usluge,
            request.BrGostiju,
            trenutnoVreme,
            cancellationToken);
    }

    public async Task<KreiranjeRezervacijeResponseDto> KreirajRezervaciju(
        decimal korisnikId,
        KreiranjeRezervacijeDto request,
        CancellationToken cancellationToken = default)
    {
        var vremeKreiranja = DateTime.Now;

        var podaci = await ValidirajIUcitajPodatke(
            request,
            vremeKreiranja,
            cancellationToken);

        var ukupnaCena = await IzracunajCenu(
            podaci.Sala,
            podaci.Usluge,
            request.BrGostiju,
            vremeKreiranja,
            cancellationToken);

        var rezervacijaId = await _rezervacijaRepository.GetNextRezervacijaId(
            cancellationToken);

        var rezervacija = KreirajRezervacijuEntitet(
            rezervacijaId,
            korisnikId,
            request,
            vremeKreiranja);

        rezervacija.TipoviDogadjaja.Add(podaci.TipDogadjaja);

        await DodajStavkeRezervacije(
            rezervacija,
            podaci.Usluge,
            cancellationToken);

        await _rezervacijaRepository.Add(
            rezervacija,
            cancellationToken);

        return new KreiranjeRezervacijeResponseDto
        {
            RezervacijaId = rezervacija.RezervacijaId,
            Status = rezervacija.StatusRez.ToString(),
            VremeKreiranja = rezervacija.VremeKreiranja,
            UkupnaCena = ukupnaCena
        };
    }

    private static Rezervacija KreirajRezervacijuEntitet(
        decimal rezervacijaId,
        decimal korisnikId,
        KreiranjeRezervacijeDto request,
        DateTime vremeKreiranja)
    {
        return new Rezervacija
        {
            RezervacijaId = rezervacijaId,
            BrGostiju = request.BrGostiju,
            Opis = string.IsNullOrWhiteSpace(request.Opis)
                ? null
                : request.Opis.Trim(),
            Napomena = string.IsNullOrWhiteSpace(request.Napomena)
                ? null
                : request.Napomena.Trim(),
            VremePocetka = request.VremePocetka,
            VremeZavrsetka = request.VremeZavrsetka,
            VremeKreiranja = vremeKreiranja,
            StatusRez = StatusRez.POSLATA,
            KorisnikId = korisnikId,
            PaketId = request.PaketId,
            SalaId = request.SalaId
        };
    }

    private async Task DodajStavkeRezervacije(
        Rezervacija rezervacija,
        List<Usluga> usluge,
        CancellationToken cancellationToken)
    {
        if (usluge.Count == 0)
        {
            return;
        }

        var sledeciStavkaId = await _rezervacijaRepository.GetNextStavkaId(
            cancellationToken);

        foreach (var usluga in usluge)
        {
            rezervacija.StavkeRezervacije.Add(new StavkaRezervacije
            {
                StavkaId = sledeciStavkaId,
                RezervacijaId = rezervacija.RezervacijaId,
                UslugaId = usluga.UslugaId,
                TipStavke = usluga.TipUsluge
            });

            sledeciStavkaId++;
        }
    }

    private async Task<PodaciZaRezervaciju> ValidirajIUcitajPodatke(
        KreiranjeRezervacijeDto request,
        DateTime trenutnoVreme,
        CancellationToken cancellationToken)
    {
        ValidirajOsnovnePodatke(request, trenutnoVreme);

        var sala = await UcitajIValidirajSalu(
            request,
            cancellationToken);

        await ValidirajDostupnostSale(
            request,
            cancellationToken);

        var tipDogadjaja = await UcitajTipDogadjaja(
            request.TipDogadjaja,
            cancellationToken);

        var usluge = await UcitajIValidirajUsluge(
            request,
            cancellationToken);

        return new PodaciZaRezervaciju
        {
            Sala = sala,
            Usluge = usluge,
            TipDogadjaja = tipDogadjaja
        };
    }

    private static void ValidirajOsnovnePodatke(
        KreiranjeRezervacijeDto request,
        DateTime trenutnoVreme)
    {
        if (request.BrGostiju <= 0)
        {
            throw new ArgumentException("Broj gostiju mora biti veći od nule.");
        }

        if (request.VremePocetka >= request.VremeZavrsetka)
        {
            throw new ArgumentException(
                "Vreme završetka mora biti nakon vremena početka.");
        }

        if (request.VremePocetka <= trenutnoVreme)
        {
            throw new ArgumentException(
                "Termin rezervacije mora biti u budućnosti.");
        }
    }

    private async Task<Sala> UcitajIValidirajSalu(
        KreiranjeRezervacijeDto request,
        CancellationToken cancellationToken)
    {
        var sala = await _salaRepository.GetZaRezervaciju(
            request.RestoranId,
            request.SalaId,
            request.PaketId,
            cancellationToken);

        if (sala is null)
        {
            throw new ArgumentException(
                "Izabrana sala ili paket nisu dostupni.");
        }

        if (request.BrGostiju > sala.Kapacitet)
        {
            throw new ArgumentException(
                "Broj gostiju je veći od kapaciteta izabrane sale.");
        }

        return sala;
    }

    private async Task ValidirajDostupnostSale(
        KreiranjeRezervacijeDto request,
        CancellationToken cancellationToken)
    {
        var salaJeZauzeta = await _rezervacijaRepository.SalaJeZauzeta(
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
    }

    private async Task<TipDogadjaja> UcitajTipDogadjaja(
        Dogadjaj tip,
        CancellationToken cancellationToken)
    {
        var tipDogadjaja = await _rezervacijaRepository.GetTipDogadjaja(
            tip,
            cancellationToken);

        if (tipDogadjaja is null)
        {
            throw new ArgumentException(
                "Izabrani tip događaja ne postoji.");
        }

        return tipDogadjaja;
    }

    private async Task<List<Usluga>> UcitajIValidirajUsluge(
        KreiranjeRezervacijeDto request,
        CancellationToken cancellationToken)
    {
        var uslugaIds = request.UslugaIds
            .Distinct()
            .ToList();

        var usluge = await _uslugaRepository.GetZaRezervaciju(
            request.RestoranId,
            request.PaketId,
            uslugaIds,
            cancellationToken);

        if (usluge.Count != uslugaIds.Count)
        {
            throw new ArgumentException(
                "Jedna ili više izabranih usluga ne pripadaju izabranom paketu.");
        }

        return usluge;
    }

    private async Task<decimal> IzracunajCenu(
        Sala sala,
        List<Usluga> usluge,
        decimal brGostiju,
        DateTime trenutnoVreme,
        CancellationToken cancellationToken)
    {
        var cenaStolice = await _cenovnikRepository.GetVazecaCenaSale(
            sala.SalaId,
            trenutnoVreme,
            cancellationToken);

        if (cenaStolice is null)
        {
            throw new InvalidOperationException(
                "Za izabranu salu nije definisana cena.");
        }

        var ukupnaCena = brGostiju * cenaStolice.Iznos;

        foreach (var usluga in usluge)
        {
            var cenaUsluge = await _cenovnikRepository.GetVazecaCenaUsluge(
                usluga.UslugaId,
                trenutnoVreme,
                cancellationToken);

            if (cenaUsluge is null)
            {
                throw new InvalidOperationException(
                    $"Za uslugu '{usluga.NazivU}' nije definisana cena.");
            }

            ukupnaCena += cenaUsluge.Iznos;
        }

        return ukupnaCena;
    }

    public async Task<List<MojaRezervacijaDto>> GetMojeRezervacije(
        decimal korisnikId,
        CancellationToken cancellationToken = default)
    {
        await RealizujIstekleRezervacije(cancellationToken);

        var rezervacije = await _rezervacijaRepository.GetByKorisnikId(
            korisnikId,
            cancellationToken);

        var rezultat = new List<MojaRezervacijaDto>();

        foreach (var rezervacija in rezervacije)
        {
            var ukupnaCena = await IzracunajCenuRezervacije(
                rezervacija,
                cancellationToken);

            rezultat.Add(
                MapToMojaRezervacijaDto(
                    rezervacija,
                    ukupnaCena));
        }

        return rezultat;
    }

    private async Task<decimal?> IzracunajCenuRezervacije(
        Rezervacija rezervacija,
        CancellationToken cancellationToken)
    {
        if (rezervacija.Sala is null)
        {
            return null;
        }

        var usluge = rezervacija.StavkeRezervacije
            .Select(stavka => stavka.Usluga)
            .ToList();

        return await IzracunajCenu(
            rezervacija.Sala,
            usluge,
            rezervacija.BrGostiju,
            rezervacija.VremeKreiranja,
            cancellationToken);
    }

    private static MojaRezervacijaDto MapToMojaRezervacijaDto(
        Rezervacija rezervacija,
        decimal? ukupnaCena)
    {
        return new MojaRezervacijaDto
        {
            RezervacijaId = rezervacija.RezervacijaId,
            RestoranId = rezervacija.Paket.RestoranId,
            NazivRestorana = rezervacija.Paket.Restoran.Naziv,
            PaketId = rezervacija.PaketId,
            NazivPaketa = rezervacija.Paket.Naziv,
            SalaId = rezervacija.SalaId,
            RbrSSale = rezervacija.Sala?.RbrS,
            TipoviDogadjaja = rezervacija.TipoviDogadjaja
                .Select(tip => tip.Tip.ToString())
                .ToList(),
            BrGostiju = rezervacija.BrGostiju,
            Opis = rezervacija.Opis,
            Napomena = rezervacija.Napomena,
            VremePocetka = rezervacija.VremePocetka,
            VremeZavrsetka = rezervacija.VremeZavrsetka,
            VremeKreiranja = rezervacija.VremeKreiranja,
            Status = rezervacija.StatusRez.ToString(),
            DodatneUsluge = rezervacija.StavkeRezervacije
                .Select(stavka => stavka.Usluga.NazivU)
                .ToList(),
            UkupnaCena = ukupnaCena
        };
    }

    private class PodaciZaRezervaciju
    {
        public Sala Sala { get; set; } = null!;
        public List<Usluga> Usluge { get; set; } = [];
        public TipDogadjaja TipDogadjaja { get; set; } = null!;
    }
}