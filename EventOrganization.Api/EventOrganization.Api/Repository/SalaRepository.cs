using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EventOrganization.Api.Repositories;

public class SalaRepository
{
    private readonly EventOrganizationDbContext _context;

    public SalaRepository(
        EventOrganizationDbContext context)
    {
        _context = context;
    }

    public Task<List<Sala>> GetByPaketId(
        decimal restoranId,
        decimal paketId,
        CancellationToken cancellationToken = default)
    {
        return _context.Sale
            .AsNoTracking()
            .Include(sala =>
                sala.Cenovnici)
            .Where(sala =>
                sala.RestoranId == restoranId &&
                sala.Paketi.Any(paket =>
                    paket.PaketId == paketId &&
                    paket.RestoranId == restoranId))
            .ToListAsync(cancellationToken);
    }

    public Task<List<Sala>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        return _context.Sale
            .AsNoTracking()
            .Include(sala =>
                sala.Cenovnici)
            .Where(sala =>
                sala.RestoranId == restoranId &&
                sala.Status == Status.AKTIVNO)
            .OrderBy(sala =>
                sala.RbrS)
            .ToListAsync(cancellationToken);
    }

    public Task<Sala?> GetZaRezervaciju(
        decimal restoranId,
        decimal salaId,
        decimal paketId,
        CancellationToken cancellationToken = default)
    {
        return _context.Sale
            .AsNoTracking()
            .Include(sala =>
                sala.Cenovnici)
            .FirstOrDefaultAsync(
                sala =>
                    sala.SalaId == salaId &&
                    sala.RestoranId == restoranId &&
                    sala.Status == Status.AKTIVNO &&
                    sala.Paketi.Any(paket =>
                        paket.PaketId == paketId &&
                        paket.RestoranId == restoranId &&
                        paket.Status == Status.AKTIVNO),
                cancellationToken);
    }

    public Task<Sala?> GetForUpdate(
        decimal restoranId,
        decimal salaId,
        CancellationToken cancellationToken = default)
    {
        return _context.Sale
            .Include(sala =>
                sala.Cenovnici)
            .FirstOrDefaultAsync(
                sala =>
                    sala.SalaId == salaId &&
                    sala.RestoranId == restoranId,
                cancellationToken);
    }

    public async Task<bool> RbrSPostoji(
        decimal restoranId,
        decimal RbrS,
        decimal? izuzmiSalaId = null,
        CancellationToken cancellationToken = default)
    {
        var salaId =
            await _context.Sale
                .Where(sala =>
                    sala.RestoranId == restoranId &&
                    sala.RbrS == RbrS &&
                    sala.Status == Status.AKTIVNO &&
                    (!izuzmiSalaId.HasValue ||
                     sala.SalaId != izuzmiSalaId.Value))
                .Select(sala =>
                    (decimal?)sala.SalaId)
                .FirstOrDefaultAsync(
                    cancellationToken);

        return salaId.HasValue;
    }

    public async Task<decimal> GetNextSalaId(
        CancellationToken cancellationToken = default)
    {
        var maxId =
            await _context.Sale
                .Select(sala =>
                    (decimal?)sala.SalaId)
                .MaxAsync(cancellationToken);

        return (maxId ?? 0) + 1;
    }

    public async Task<decimal> GetNextCenovnikId(
        CancellationToken cancellationToken = default)
    {
        var maxId =
            await _context.Cenovnici
                .Select(cenovnik =>
                    (decimal?)cenovnik.CenovnikId)
                .MaxAsync(cancellationToken);

        return (maxId ?? 0) + 1;
    }

    public async Task Add(
        Sala sala,
        CancellationToken cancellationToken = default)
    {
        await _context.Sale.AddAsync(
            sala,
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
}