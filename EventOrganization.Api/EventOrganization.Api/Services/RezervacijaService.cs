using EventOrganization.Api.DTOs.Rezervacije;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class RezervacijaService
{
    private readonly RezervacijaRepository _rezervacijaRepository;

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
            await _rezervacijaRepository.GetByRestoranId(
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
                        rezervacija.StatusRez.ToString(),

                    TipoviDogadjaja =
                        rezervacija.TipoviDogadjaja
                            .Select(tip =>
                                tip.Tip.ToString())
                            .ToList()
                })
            .ToList();
    }

    public async Task<RezervacijaDetaljiDto?> GetDetalji(
        decimal restoranId,
        decimal rezervacijaId,
        CancellationToken cancellationToken = default)
    {
        var rezervacija =
            await _rezervacijaRepository.GetDetalji(
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
                rezervacija.Korisnik.Korisnik.Ime,

            PrezimeKlijenta =
                rezervacija.Korisnik.Korisnik.Prezime,

            EmailKlijenta =
                rezervacija.Korisnik.Korisnik.Email,

            TelefonKlijenta =
                rezervacija.Korisnik.Korisnik.Telefon,

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
                rezervacija.StatusRez.ToString(),

            DodatneUsluge =
                rezervacija.StavkeRezervacije
                    .Select(stavka =>
                        stavka.Usluga.NazivU)
                    .ToList(),
            SalaId =
                rezervacija.SalaId,

            RbrSSale =
                rezervacija.Sala?.RbrS,
        };
    }

    public async Task<RezervacijaDetaljiDto?>
        ObradiRezervaciju(
            decimal restoranId,
            decimal rezervacijaId,
            ObradaRezervacijeDto request,
            CancellationToken cancellationToken = default)
    {
       
        await RealizujIstekleRezervacije(
            cancellationToken);

        var rezervacija =
            await _rezervacijaRepository.GetForUpdate(
                restoranId,
                rezervacijaId,
                cancellationToken);

        if (rezervacija is null)
        {
            return null;
        }

        if (!Enum.TryParse<StatusRez>(
                request.Status,
                true,
                out var noviStatus))
        {
            throw new ArgumentException(
                "Prosleđen status rezervacije nije ispravan.");
        }

        var dozvoljenaPromena = false;

        if (rezervacija.StatusRez == StatusRez.POSLATA)
        {
            dozvoljenaPromena =
                noviStatus == StatusRez.POTVRDJENA ||
                noviStatus == StatusRez.ODBIJENA ||
                noviStatus == StatusRez.OTKAZANA;
        }

        if (rezervacija.StatusRez == StatusRez.POTVRDJENA)
        {
            dozvoljenaPromena =
                noviStatus == StatusRez.OTKAZANA;
        }

        if (!dozvoljenaPromena)
        {
            throw new InvalidOperationException(
                "Promena statusa rezervacije nije dozvoljena.");
        }

        rezervacija.StatusRez =
            noviStatus;

        await _rezervacijaRepository.SaveChanges(
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

        await _rezervacijaRepository.SaveChanges(
            cancellationToken);
    }
}