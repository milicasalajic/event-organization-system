using EventOrganization.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EventOrganization.Api.Repositories;

public class KorisnikRepository
{
    private readonly EventOrganizationDbContext _context;

    public KorisnikRepository(
        EventOrganizationDbContext context)
    {
        _context = context;
    }

    public Task<Korisnik?> GetById(
        decimal korisnikId,
        CancellationToken cancellationToken = default)
    {
        return _context.Korisnici
            .FirstOrDefaultAsync(
                korisnik =>
                    korisnik.KorisnikId == korisnikId,
                cancellationToken);
    }

    public async Task<bool> EmailPostojiZaDrugogKorisnika(
    string email,
    decimal korisnikId,
    CancellationToken cancellationToken = default)
    {
        var pronadjenKorisnikId = await _context.Korisnici
            .Where(korisnik =>
                korisnik.Email == email &&
                korisnik.KorisnikId != korisnikId)
            .Select(korisnik => (decimal?)korisnik.KorisnikId)
            .FirstOrDefaultAsync(cancellationToken);

        return pronadjenKorisnikId.HasValue;
    }

    public Task SaveChanges(
        CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(
            cancellationToken);
    }
}