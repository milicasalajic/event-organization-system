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
            .Where(usluga =>
                usluga.Paketi.Any(paket =>
                    paket.PaketId == paketId &&
                    paket.RestoranId == restoranId))
            .ToListAsync(cancellationToken);
    }
}