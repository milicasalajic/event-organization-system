using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EventOrganization.Api.Repositories;

public class FotografRepository
{
    private readonly EventOrganizationDbContext _context;

    public FotografRepository(
        EventOrganizationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Usluga>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var uslugaIds = await _context.Paketi
            .AsNoTracking()
            .Where(paket =>
                paket.RestoranId == restoranId)
            .SelectMany(paket =>
                paket.Usluge)
            .Where(usluga =>
                usluga.TipUsluge == TipUsluge.FOTOGRAF &&
                usluga.Status == Status.AKTIVNO)
            .Select(usluga =>
                usluga.UslugaId)
            .Distinct()
            .ToListAsync(cancellationToken);

        return await _context.Usluge
            .AsNoTracking()
            .Include(usluga =>
                usluga.Fotograf)
            .Include(usluga =>
                usluga.Paketi)
            .Where(usluga =>
                uslugaIds.Contains(
                    usluga.UslugaId))
            .OrderBy(usluga =>
                usluga.NazivU)
            .ToListAsync(cancellationToken);
    }

    public async Task<Usluga?> GetForUpdate(
        decimal restoranId,
        decimal uslugaId,
        CancellationToken cancellationToken = default)
    {
        var pronadjenaUslugaId =
            await _context.Paketi
                .Where(paket =>
                    paket.RestoranId == restoranId)
                .SelectMany(paket =>
                    paket.Usluge)
                .Where(usluga =>
                    usluga.UslugaId == uslugaId &&
                    usluga.TipUsluge ==
                        TipUsluge.FOTOGRAF)
                .Select(usluga =>
                    (decimal?)usluga.UslugaId)
                .FirstOrDefaultAsync(
                    cancellationToken);

        if (!pronadjenaUslugaId.HasValue)
        {
            return null;
        }

        return await _context.Usluge
            .Include(usluga =>
                usluga.Fotograf)
            .Include(usluga =>
                usluga.Paketi)
            .FirstOrDefaultAsync(
                usluga =>
                    usluga.UslugaId ==
                    uslugaId,
                cancellationToken);
    }

    public Task<List<Paket>> GetPaketiZaRestoran(
        decimal restoranId,
        List<decimal> paketIds,
        CancellationToken cancellationToken = default)
    {
        return _context.Paketi
            .Where(paket =>
                paket.RestoranId == restoranId &&
                paket.Status == Status.AKTIVNO &&
                paketIds.Contains(
                    paket.PaketId))
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> NazivPostoji(
        decimal restoranId,
        string naziv,
        decimal? izuzmiUslugaId = null,
        CancellationToken cancellationToken = default)
    {
        var uslugaId =
            await _context.Paketi
                .Where(paket =>
                    paket.RestoranId == restoranId)
                .SelectMany(paket =>
                    paket.Usluge)
                .Where(usluga =>
                    usluga.TipUsluge ==
                        TipUsluge.FOTOGRAF &&
                    usluga.Status ==
                        Status.AKTIVNO &&
                    usluga.NazivU == naziv &&
                    (!izuzmiUslugaId.HasValue ||
                     usluga.UslugaId !=
                        izuzmiUslugaId.Value))
                .Select(usluga =>
                    (decimal?)usluga.UslugaId)
                .FirstOrDefaultAsync(
                    cancellationToken);

        return uslugaId.HasValue;
    }

    public async Task<decimal> GetNextUslugaId(
        CancellationToken cancellationToken = default)
    {
        var maxId = await _context.Usluge
            .Select(usluga =>
                (decimal?)usluga.UslugaId)
            .MaxAsync(cancellationToken);

        return (maxId ?? 0) + 1;
    }

    public async Task Add(
        Usluga usluga,
        CancellationToken cancellationToken = default)
    {
        await _context.Usluge.AddAsync(
            usluga,
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