using EventOrganization.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EventOrganization.Api.Repositories;

public class RestoranRepository
{
    private readonly EventOrganizationDbContext _context;

    public RestoranRepository(
        EventOrganizationDbContext context)
    {
        _context = context;
    }

    public Task<List<Restoran>> GetAll(
        CancellationToken cancellationToken = default)
    {
        return _context.Restorani
            .AsNoTracking()//planira smao da cita restorane
            .ToListAsync(cancellationToken);
    }
}