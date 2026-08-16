using EventOrganization.Api.DTOs.Sale;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class SalaService
{
    private readonly SalaRepository _salaRepository;

    public SalaService(
        SalaRepository salaRepository)
    {
        _salaRepository = salaRepository;
    }

    public async Task<List<SalaDto>> GetByPaketId(
        decimal restoranId,
        decimal paketId,
        CancellationToken cancellationToken = default)
    {
        var sale = await _salaRepository.GetByPaketId(
            restoranId,
            paketId,
            cancellationToken);

        return sale
            .Select(sala => new SalaDto
            {
                SalaId = sala.SalaId,
                RbrS = sala.RbrS,
                Kapacitet = sala.Kapacitet
            })
            .ToList();
    }
}