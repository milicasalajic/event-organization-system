using EventOrganization.Api.DTOs.Paketi;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class PaketService
{
    private readonly PaketRepository _paketRepository;

    public PaketService(
        PaketRepository paketRepository)
    {
        _paketRepository = paketRepository;
    }

    public async Task<List<PaketDto>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var paketi = await _paketRepository.GetByRestoranId(
            restoranId,
            cancellationToken);

        return paketi
            .Select(paket => new PaketDto
            {
                PaketId = paket.PaketId,
                Naziv = paket.Naziv,
                Opis = paket.Opis
            })
            .ToList();
    }
}