using EventOrganization.Api.Enums;
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
    public async Task<List<Klijent>> GetKlijenti(
      CancellationToken cancellationToken = default)
    {
        return await _context.Klijenti
            .AsNoTracking()
            .Include(klijent => klijent.Korisnik)
            .OrderBy(klijent => klijent.Korisnik.Prezime)
            .ThenBy(klijent => klijent.Korisnik.Ime)
            .ToListAsync(cancellationToken);
    }
    public async Task<bool> EmailPostoji(
    string email,
    CancellationToken cancellationToken = default)
    {
        var pronadjenKorisnikId = await _context.Korisnici
            .AsNoTracking()
            .Where(korisnik => korisnik.Email == email)
            .Select(korisnik => (decimal?)korisnik.KorisnikId)
            .FirstOrDefaultAsync(cancellationToken);

        return pronadjenKorisnikId.HasValue;
    }

    public async Task<decimal?> GetKlijentUlogaId(
        CancellationToken cancellationToken = default)
    {
        return await _context.Uloge
            .AsNoTracking()
            .Where(uloga => uloga.TipUloge == TipUloge.KLIJENT)
            .Select(uloga => (decimal?)uloga.UlogaId)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<decimal> GetNextKorisnikId(
        CancellationToken cancellationToken = default)
    {
        var poslednjiKorisnikId = await _context.Korisnici
            .AsNoTracking()
            .OrderByDescending(korisnik => korisnik.KorisnikId)
            .Select(korisnik => (decimal?)korisnik.KorisnikId)
            .FirstOrDefaultAsync(cancellationToken);

        return (poslednjiKorisnikId ?? 0) + 1;
    }

    public void AddKlijent(
        Korisnik korisnik,
        Klijent klijent)
    {
        _context.Korisnici.Add(korisnik);
        _context.Klijenti.Add(klijent);
    }
}