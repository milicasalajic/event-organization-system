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
            .Where(p => p.RestoranId == restoranId)
            .ToListAsync(cancellationToken);
    }
}