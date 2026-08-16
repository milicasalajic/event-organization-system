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
    public async Task<Restoran?> GetByKorisnikId(
    decimal korisnikId,
    CancellationToken cancellationToken = default)
    {
        return await _context.Radnici
            .AsNoTracking()
            .Where(r => r.KorisnikId == korisnikId)
            .Select(r => r.Restoran)
            .FirstOrDefaultAsync(cancellationToken);
    }
    public Task<Restoran?> GetById(
    decimal restoranId,
    CancellationToken cancellationToken = default)
    {
        return _context.Restorani
            .AsNoTracking()
            .FirstOrDefaultAsync(
                r => r.RestoranId == restoranId,
                cancellationToken);
    }
}