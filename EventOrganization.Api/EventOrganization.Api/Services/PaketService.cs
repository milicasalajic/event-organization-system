using EventOrganization.Api.DTOs.Paketi;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
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
                Opis = paket.Opis,
                Status = paket.Status.ToString()
            })
            .ToList();
    }
    private static PaketDto MapToDto(
        Paket paket)
    {
        return new PaketDto
        {
            PaketId =
                paket.PaketId,

            Naziv =
                paket.Naziv,

            Opis =
                paket.Opis,

            Status =
                paket.Status.ToString()
        };
    }
    public async Task<PaketDto> Add(
    decimal restoranId,
    DodavanjePaketaDto request,
    CancellationToken cancellationToken = default)
    {

        var paket = new Paket
        {
            Naziv = request.Naziv.Trim(),
            Opis = request.Opis?.Trim(),
            RestoranId = restoranId,
            Status = Status.AKTIVNO
        };

        await _paketRepository.Add(
            paket,
            cancellationToken);

        return MapToDto(paket);
    }
    public async Task<bool> Delete(
       decimal restoranId,
       decimal paketId,
       CancellationToken cancellationToken = default)
    {
        var paket =
            await _paketRepository.GetForUpdate(
                restoranId,
                paketId,
                cancellationToken);

        if (paket is null)
        {
            return false;
        }

        if (paket.Status == Status.NEAKTIVNO)
        {
            return true;
        }

        paket.Status =
            Status.NEAKTIVNO;

        await _paketRepository.SaveChanges(
            cancellationToken);

        return true;
    }
    public async Task<PaketDto?> Update(
      decimal restoranId,
      decimal paketId,
      IzmenaPaketaDto request,
      CancellationToken cancellationToken = default)
    {
        var paket =
            await _paketRepository.GetForUpdate(
                restoranId,
                paketId,
                cancellationToken);

        if (paket is null)
        {
            return null;
        }

        if (paket.Status == Status.NEAKTIVNO)
        {
            throw new InvalidOperationException(
                "Neaktivan paket nije moguće menjati.");
        }


        paket.Naziv =
            request.Naziv.Trim();

        paket.Opis =
            request.Opis?.Trim();

        await _paketRepository.SaveChanges(
            cancellationToken);

        return MapToDto(paket);
    }
}