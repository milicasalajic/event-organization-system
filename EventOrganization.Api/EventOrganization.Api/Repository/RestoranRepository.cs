using EventOrganization.Api.Enums;
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
            .AsNoTracking()
            .OrderBy(restoran =>
                restoran.Naziv)
            .ToListAsync(cancellationToken);
    }
    public Task<Restoran?> GetById(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        return _context.Restorani
            .AsNoTracking()
            .FirstOrDefaultAsync(
                restoran => restoran.RestoranId == restoranId,
                cancellationToken);
    }

    public async Task<bool> KorisnikRadiURestoranu(
    decimal korisnikId,
    decimal restoranId,
    CancellationToken cancellationToken = default)
    {
        var pronadjenKorisnikId = await _context.Radnici
            .Where(radnik =>
                radnik.KorisnikId == korisnikId &&
                radnik.RestoranId == restoranId)
            .Select(radnik => (decimal?)radnik.KorisnikId)
            .FirstOrDefaultAsync(cancellationToken);

        return pronadjenKorisnikId.HasValue;
    }
    public async Task Add(
    Restoran restoran,
    CancellationToken cancellationToken = default)
    {
        await _context.Restorani.AddAsync(
            restoran,
            cancellationToken);

        await _context.SaveChangesAsync(
            cancellationToken);
    }
    public Task<Restoran?> GetForUpdate(
    decimal restoranId,
    CancellationToken cancellationToken = default)
    {
        return _context.Restorani
            .FirstOrDefaultAsync(
                restoran =>
                    restoran.RestoranId == restoranId,
                cancellationToken);
    }

    public Task SaveChanges(
        CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(
            cancellationToken);
    }
}