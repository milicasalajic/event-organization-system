using EventOrganization.Api.DTOs.Restorani;
using EventOrganization.Api.Models;
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
            .Select(MapToDto)
            .ToList();
    }

    public async Task<RestoranDto?> GetById(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var restoran = await _restoranRepository.GetById(
            restoranId,
            cancellationToken);

        if (restoran is null)
        {
            return null;
        }

        return MapToDto(restoran);
    }

    public Task<bool> KorisnikRadiURestoranu(
        decimal korisnikId,
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        return _restoranRepository.KorisnikRadiURestoranu(
            korisnikId,
            restoranId,
            cancellationToken);
    }

    private static RestoranDto MapToDto(Restoran restoran)
    {
        return new RestoranDto
        {
            RestoranId = restoran.RestoranId,
            Naziv = restoran.Naziv,
            Adresa = restoran.Adresa,
            Grad = restoran.Grad,
            Telefon = restoran.Telefon
        };
    }
}