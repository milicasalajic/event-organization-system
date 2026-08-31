using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EventOrganization.Api.Repositories;

public class RezervacijaRepository
{
    private readonly EventOrganizationDbContext _context;

    public RezervacijaRepository(
        EventOrganizationDbContext context)
    {
        _context = context;
    }

    public Task<List<Rezervacija>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        return _context.Rezervacije
            .AsNoTracking()
            .Include(rezervacija =>
                rezervacija.TipoviDogadjaja)
            .Where(rezervacija =>
                rezervacija.Paket.RestoranId ==
                    restoranId)
            .OrderBy(rezervacija =>
                rezervacija.VremePocetka)
            .ToListAsync(
                cancellationToken);
    }

    public Task<Rezervacija?> GetDetalji(
        decimal restoranId,
        decimal rezervacijaId,
        CancellationToken cancellationToken = default)
    {
        return _context.Rezervacije
            .AsNoTracking()
            .Include(rezervacija =>
                rezervacija.Korisnik)
                .ThenInclude(klijent =>
                    klijent.Korisnik)
            .Include(rezervacija =>
                rezervacija.Paket)
            .Include(rezervacija =>
                rezervacija.Sala)
            .Include(rezervacija =>
                rezervacija.TipoviDogadjaja)
            .Include(rezervacija =>
                rezervacija.StavkeRezervacije)
                .ThenInclude(stavka =>
                    stavka.Usluga)
            .FirstOrDefaultAsync(
                rezervacija =>
                    rezervacija.RezervacijaId ==
                        rezervacijaId &&
                    rezervacija.Paket.RestoranId ==
                        restoranId,
                cancellationToken);
    }

    public Task<Rezervacija?> GetForUpdate(
        decimal restoranId,
        decimal rezervacijaId,
        CancellationToken cancellationToken = default)
    {
        return _context.Rezervacije
            .FirstOrDefaultAsync(
                rezervacija =>
                    rezervacija.RezervacijaId ==
                        rezervacijaId &&
                    rezervacija.Paket.RestoranId ==
                        restoranId,
                cancellationToken);
    }

    public Task<List<Rezervacija>> GetPotvrdjeneIstekle(
        DateTime trenutnoVreme,
        CancellationToken cancellationToken = default)
    {
        return _context.Rezervacije
            .Where(rezervacija =>
                rezervacija.StatusRez ==
                    StatusRez.POTVRDJENA &&
                rezervacija.VremeZavrsetka <
                    trenutnoVreme)
            .ToListAsync(
                cancellationToken);
    }

    public async Task<List<Sala>> GetDostupneSale(
    decimal restoranId,
    decimal paketId,
    decimal brGostiju,
    DateTime vremePocetka,
    DateTime vremeZavrsetka,
    CancellationToken cancellationToken = default)
    {
        var zauzeteSalaIds = await _context.Rezervacije
            .AsNoTracking()
            .Where(rezervacija =>
                rezervacija.SalaId != null &&
                rezervacija.StatusRez == StatusRez.POTVRDJENA &&
                rezervacija.VremePocetka < vremeZavrsetka &&
                rezervacija.VremeZavrsetka > vremePocetka)
            .Select(rezervacija => rezervacija.SalaId!.Value)
            .Distinct()
            .ToListAsync(cancellationToken);

        return await _context.Paketi
            .AsNoTracking()
            .Where(paket =>
                paket.PaketId == paketId &&
                paket.RestoranId == restoranId &&
                paket.Status == Status.AKTIVNO)
            .SelectMany(paket => paket.Sale)
            .Where(sala =>
                sala.Status == Status.AKTIVNO &&
                sala.Kapacitet >= brGostiju &&
                !zauzeteSalaIds.Contains(sala.SalaId))
            .OrderBy(sala => sala.RbrS)
            .ToListAsync(cancellationToken);
    }

    public Task<Paket?> GetPaketZaRezervaciju(
        decimal restoranId,
        decimal paketId,
        CancellationToken cancellationToken = default)
    {
        return _context.Paketi
            .AsNoTracking()
            .Include(paket =>
                paket.Sale)
                .ThenInclude(sala =>
                    sala.Cenovnici)
            .Include(paket =>
                paket.Usluge)
                .ThenInclude(usluga =>
                    usluga.Cenovnici)
            .FirstOrDefaultAsync(
                paket =>
                    paket.PaketId ==
                        paketId &&
                    paket.RestoranId ==
                        restoranId &&
                    paket.Status ==
                        Status.AKTIVNO &&
                    paket.Restoran.Status ==
                        Status.AKTIVNO,
                cancellationToken);
    }

    public Task<TipDogadjaja?> GetTipDogadjaja(
        Dogadjaj tipDogadjaja,
        CancellationToken cancellationToken = default)
    {
        return _context.TipoviDogadjaja
            .FirstOrDefaultAsync(
                tip =>
                    tip.Tip ==
                        tipDogadjaja,
                cancellationToken);
    }

    public async Task<bool> KlijentPostoji(
        decimal korisnikId,
        CancellationToken cancellationToken = default)
    {
        var korisnik =
            await _context.Klijenti
                .AsNoTracking()
                .Where(klijent =>
                    klijent.KorisnikId ==
                        korisnikId)
                .Select(klijent =>
                    (decimal?)klijent.KorisnikId)
                .FirstOrDefaultAsync(
                    cancellationToken);

        return korisnik.HasValue;
    }

    public async Task<bool> SalaJeZauzeta(
        decimal salaId,
        DateTime vremePocetka,
        DateTime vremeZavrsetka,
        decimal? izuzmiRezervacijaId = null,
        CancellationToken cancellationToken = default)
    {
        var query =
            _context.Rezervacije
                .AsNoTracking()
                .Where(rezervacija =>
                    rezervacija.SalaId ==
                        salaId &&
                    rezervacija.StatusRez ==
                        StatusRez.POTVRDJENA &&
                    rezervacija.VremePocetka <
                        vremeZavrsetka &&
                    rezervacija.VremeZavrsetka >
                        vremePocetka);

        if (izuzmiRezervacijaId.HasValue)
        {
            query =
                query.Where(rezervacija =>
                    rezervacija.RezervacijaId !=
                        izuzmiRezervacijaId.Value);
        }

        var rezervacijaId =
            await query
                .Select(rezervacija =>
                    (decimal?)rezervacija.RezervacijaId)
                .FirstOrDefaultAsync(
                    cancellationToken);

        return rezervacijaId.HasValue;
    }

    public async Task<decimal> GetNextRezervacijaId(
        CancellationToken cancellationToken = default)
    {
        var maxId =
            await _context.Rezervacije
                .Select(rezervacija =>
                    (decimal?)rezervacija.RezervacijaId)
                .MaxAsync(
                    cancellationToken);

        return (maxId ?? 0) + 1;
    }

    public async Task<decimal> GetNextStavkaId(
        CancellationToken cancellationToken = default)
    {
        var maxId =
            await _context.StavkeRezervacije
                .Select(stavka =>
                    (decimal?)stavka.StavkaId)
                .MaxAsync(
                    cancellationToken);

        return (maxId ?? 0) + 1;
    }

    public async Task Add(
        Rezervacija rezervacija,
        CancellationToken cancellationToken = default)
    {
        await _context.Rezervacije.AddAsync(
            rezervacija,
            cancellationToken);

        await _context.SaveChangesAsync(
            cancellationToken);
    }

    public Task SaveChanges(
        CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(
            cancellationToken);
    }
    public Task<List<Rezervacija>> GetByKorisnikId(
    decimal korisnikId,
    CancellationToken cancellationToken = default)
    {
        return _context.Rezervacije
            .AsNoTracking()
            .Include(rezervacija =>
                rezervacija.Paket)
                .ThenInclude(paket =>
                    paket.Restoran)
            .Include(rezervacija =>
                rezervacija.Sala)
            .Include(rezervacija =>
                rezervacija.TipoviDogadjaja)
            .Include(rezervacija =>
                rezervacija.StavkeRezervacije)
                .ThenInclude(stavka =>
                    stavka.Usluga)
            .Where(rezervacija =>
                rezervacija.KorisnikId ==
                    korisnikId)
            .OrderByDescending(rezervacija =>
                rezervacija.VremeKreiranja)
            .ToListAsync(
                cancellationToken);
    }
    public Task<Rezervacija?> GetForUpdateSaUslugama(
    decimal restoranId,
    decimal rezervacijaId,
    CancellationToken cancellationToken = default)
    {
        return _context.Rezervacije
            .Include(rezervacija => rezervacija.Paket)
            .Include(rezervacija => rezervacija.StavkeRezervacije)
                .ThenInclude(stavka => stavka.Usluga)
            .FirstOrDefaultAsync(
                rezervacija =>
                    rezervacija.RezervacijaId == rezervacijaId &&
                    rezervacija.Paket.RestoranId == restoranId,
                cancellationToken);
    }
}