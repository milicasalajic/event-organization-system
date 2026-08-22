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
                rezervacija.Paket.RestoranId == restoranId)
            .OrderBy(rezervacija =>
                rezervacija.VremePocetka)
            .ToListAsync(cancellationToken);
    }
    public Task<Rezervacija?> GetDetalji(
        decimal restoranId,
        decimal rezervacijaId,
        CancellationToken cancellationToken = default)
    {
        return _context.Rezervacije
            .AsNoTracking()
            .Include(rezervacija => rezervacija.Korisnik)
                .ThenInclude(klijent => klijent.Korisnik)
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
            .ToListAsync(cancellationToken);
    }
    public Task SaveChanges(
        CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(
            cancellationToken);
    }
}