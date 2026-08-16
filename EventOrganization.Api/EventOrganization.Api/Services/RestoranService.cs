using EventOrganization.Api.DTOs.Restorani;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class RestoranService
{
    private readonly RestoranRepository _restoranRepository;

    public RestoranService(
        RestoranRepository restoranRepository)
    {
        _restoranRepository = restoranRepository;
    }

    public async Task<List<RestoranDto>> GetAll(
        CancellationToken cancellationToken = default)
    {
        var restorani = await _restoranRepository.GetAll(
            cancellationToken);

        return restorani
            .Select(restoran => new RestoranDto
            {
                RestoranId = restoran.RestoranId,
                Naziv = restoran.Naziv,
                Adresa = restoran.Adresa,
                Grad = restoran.Grad,
                Telefon = restoran.Telefon
            })
            .ToList();
    }
}