using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EventOrganization.Api.Repositories;

public class CenovnikRepository
{
    private readonly EventOrganizationDbContext _context;

    public CenovnikRepository(
        EventOrganizationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Cenovnik>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var salaIds = await _context.Sale
            .AsNoTracking()
            .Where(sala =>
                sala.RestoranId == restoranId &&
                sala.Status == Status.AKTIVNO)
            .Select(sala => sala.SalaId)
            .ToListAsync(cancellationToken);

        var uslugaIds = await _context.Paketi
            .AsNoTracking()
            .Where(paket =>
                paket.RestoranId == restoranId &&
                paket.Status == Status.AKTIVNO)
            .SelectMany(paket => paket.Usluge)
            .Where(usluga =>
                usluga.Status == Status.AKTIVNO)
            .Select(usluga => usluga.UslugaId)
            .Distinct()
            .ToListAsync(cancellationToken);

        return await _context.Cenovnici
            .AsNoTracking()
            .Include(cenovnik => cenovnik.Sala)
            .Include(cenovnik => cenovnik.Usluga)
            .Where(cenovnik =>
                (cenovnik.SalaId.HasValue &&
                 salaIds.Contains(cenovnik.SalaId.Value))
                ||
                (cenovnik.UslugaId.HasValue &&
                 uslugaIds.Contains(cenovnik.UslugaId.Value)))
            .OrderByDescending(cenovnik =>
                cenovnik.DatumIzmene)
            .ToListAsync(cancellationToken);
    }

    public Task<Sala?> GetSalaRestorana(
        decimal restoranId,
        decimal salaId,
        CancellationToken cancellationToken = default)
    {
        return _context.Sale
            .AsNoTracking()
            .FirstOrDefaultAsync(
                sala =>
                    sala.SalaId == salaId &&
                    sala.RestoranId == restoranId &&
                    sala.Status == Status.AKTIVNO,
                cancellationToken);
    }

    public async Task<Usluga?> GetUslugaRestorana(
        decimal restoranId,
        decimal uslugaId,
        CancellationToken cancellationToken = default)
    {
        var pronadjenaUslugaId = await _context.Paketi
            .AsNoTracking()
            .Where(paket =>
                paket.RestoranId == restoranId &&
                paket.Status == Status.AKTIVNO)
            .SelectMany(paket => paket.Usluge)
            .Where(usluga =>
                usluga.UslugaId == uslugaId &&
                usluga.Status == Status.AKTIVNO)
            .Select(usluga =>
                (decimal?)usluga.UslugaId)
            .FirstOrDefaultAsync(cancellationToken);

        if (!pronadjenaUslugaId.HasValue)
        {
            return null;
        }

        return await _context.Usluge
            .AsNoTracking()
            .FirstOrDefaultAsync(
                usluga =>
                    usluga.UslugaId == uslugaId,
                cancellationToken);
    }

    public async Task<bool> CenaSaleZaDatumPostoji(
        decimal salaId,
        DateTime datum,
        CancellationToken cancellationToken = default)
    {
        var pocetakDana = datum.Date;
        var krajDana = pocetakDana.AddDays(1);

        var cenovnikId = await _context.Cenovnici
            .Where(cenovnik =>
                cenovnik.SalaId == salaId &&
                cenovnik.DatumIzmene >= pocetakDana &&
                cenovnik.DatumIzmene < krajDana)
            .Select(cenovnik =>
                (decimal?)cenovnik.CenovnikId)
            .FirstOrDefaultAsync(cancellationToken);

        return cenovnikId.HasValue;
    }

    public async Task<bool> CenaUslugeZaDatumPostoji(
        decimal uslugaId,
        DateTime datum,
        CancellationToken cancellationToken = default)
    {
        var pocetakDana = datum.Date;
        var krajDana = pocetakDana.AddDays(1);

        var cenovnikId = await _context.Cenovnici
            .Where(cenovnik =>
                cenovnik.UslugaId == uslugaId &&
                cenovnik.DatumIzmene >= pocetakDana &&
                cenovnik.DatumIzmene < krajDana)
            .Select(cenovnik =>
                (decimal?)cenovnik.CenovnikId)
            .FirstOrDefaultAsync(cancellationToken);

        return cenovnikId.HasValue;
    }

    public async Task<decimal> GetNextCenovnikId(
        CancellationToken cancellationToken = default)
    {
        var maxId = await _context.Cenovnici
            .Select(cenovnik =>
                (decimal?)cenovnik.CenovnikId)
            .MaxAsync(cancellationToken);

        return (maxId ?? 0) + 1;
    }

    public async Task Add(
        Cenovnik cenovnik,
        CancellationToken cancellationToken = default)
    {
        await _context.Cenovnici.AddAsync(
            cenovnik,
            cancellationToken);

        await _context.SaveChangesAsync(
            cancellationToken);
    }
}