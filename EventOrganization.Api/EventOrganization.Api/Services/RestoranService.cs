using EventOrganization.Api.DTOs.Restorani;
using EventOrganization.Api.Enums;
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
            Telefon = restoran.Telefon,
            Status = restoran.Status.ToString()
        };
    }
    public async Task<RestoranDto> Add(
    DodavanjeRestoranaDto request,
    CancellationToken cancellationToken = default)
    {
        var restoran = new Restoran
        {
            Naziv = request.Naziv,
            Telefon = request.Telefon,
            RadnoVreme = request.RadnoVreme,
            Adresa = request.Adresa,
            Grad = request.Grad,

            Status = Status.AKTIVNO
        };

        await _restoranRepository.Add(
            restoran,
            cancellationToken);

        return new RestoranDto
        {
            RestoranId = restoran.RestoranId,
            Naziv = restoran.Naziv,
            Telefon = restoran.Telefon,
            RadnoVreme = restoran.RadnoVreme,
            Adresa = restoran.Adresa,
            Grad = restoran.Grad
        };
    }
    public async Task<bool> Delete(
    decimal restoranId,
    CancellationToken cancellationToken = default)
    {
        var restoran =
            await _restoranRepository.GetForUpdate(
                restoranId,
                cancellationToken);

        if (restoran is null)
        {
            return false;
        }

        restoran.Status =
            Status.NEAKTIVNO;

        await _restoranRepository.SaveChanges(
            cancellationToken);

        return true;
    }
}