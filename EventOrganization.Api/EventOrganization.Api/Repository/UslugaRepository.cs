using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EventOrganization.Api.Repositories;

public class UslugaRepository
{
    private readonly EventOrganizationDbContext _context;

    public UslugaRepository(
        EventOrganizationDbContext context)
    {
        _context = context;
    }

    public Task<List<Usluga>> GetByPaketId(
        decimal restoranId,
        decimal paketId,
        CancellationToken cancellationToken = default)
    {
        return _context.Usluge
            .AsNoTracking()
            .Include(usluga =>
                usluga.Fotograf)
            .Include(usluga =>
                usluga.KeteringFirma)
            .Include(usluga =>
                usluga.DekoraterskaFirma)
            .Include(usluga =>
                usluga.MuzickiIzvodjac)
            .Include(usluga =>
                usluga.Cenovnici)
            .Where(usluga =>
                usluga.Paketi.Any(paket =>
                    paket.PaketId == paketId &&
                    paket.RestoranId == restoranId))
            .ToListAsync(cancellationToken);
    }

    public Task<List<Usluga>> GetZaRezervaciju(
        decimal restoranId,
        decimal paketId,
        List<decimal> uslugaIds,
        CancellationToken cancellationToken = default)
    {
        if (uslugaIds.Count == 0)
        {
            return Task.FromResult(
                new List<Usluga>());
        }

        return _context.Usluge
            .AsNoTracking()
            .Include(usluga =>
                usluga.Cenovnici)
            .Where(usluga =>
                uslugaIds.Contains(
                    usluga.UslugaId) &&
                usluga.Status ==
                    Status.AKTIVNO &&
                usluga.Paketi.Any(paket =>
                    paket.PaketId ==
                        paketId &&
                    paket.RestoranId ==
                        restoranId &&
                    paket.Status ==
                        Status.AKTIVNO))
            .ToListAsync(
                cancellationToken);
    }
}