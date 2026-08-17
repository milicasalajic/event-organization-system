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
        return _context.Paketi
            .AsNoTracking()
            .Where(paket =>
                paket.PaketId == paketId &&
                paket.RestoranId == restoranId)
            .SelectMany(paket => paket.Sale)
            .ToListAsync(cancellationToken);
    }
}