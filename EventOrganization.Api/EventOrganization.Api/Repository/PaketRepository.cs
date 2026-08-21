using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EventOrganization.Api.Repositories;

public class PaketRepository
{
    private readonly EventOrganizationDbContext _context;

    public PaketRepository(
        EventOrganizationDbContext context)
    {
        _context = context;
    }

    public Task<List<Paket>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        return _context.Paketi
            .AsNoTracking()
            .Where(paket =>
                paket.RestoranId == restoranId &&
                paket.Status == Status.AKTIVNO)
            .OrderBy(paket =>
                paket.Naziv)
            .ToListAsync(cancellationToken);
    }

    public Task<Paket?> GetForUpdate(
        decimal restoranId,
        decimal paketId,
        CancellationToken cancellationToken = default)
    {
        return _context.Paketi
            .FirstOrDefaultAsync(
                paket =>
                    paket.PaketId == paketId &&
                    paket.RestoranId == restoranId,
                cancellationToken);
    }

    public async Task Add(
        Paket paket,
        CancellationToken cancellationToken = default)
    {
        await _context.Paketi.AddAsync(
            paket,
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