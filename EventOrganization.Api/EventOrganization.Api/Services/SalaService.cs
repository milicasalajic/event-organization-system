using EventOrganization.Api.DTOs.Sale;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class SalaService
{
    private readonly SalaRepository _salaRepository;

    public SalaService(SalaRepository salaRepository)
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

        return sale.Select(MapToDto).ToList();
    }

    public async Task<List<SalaDto>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var sale = await _salaRepository.GetByRestoranId(
            restoranId,
            cancellationToken);

        return sale.Select(MapToDto).ToList();
    }
    private static void ValidateAddRequest(DodavanjeSaleDto request)
    {
        if (request.RbrS <= 0)
        {
            throw new ArgumentException("Redni broj sale mora biti veći od nule.");
        }

        if (request.Kapacitet <= 0)
        {
            throw new ArgumentException("Kapacitet sale mora biti veći od nule.");
        }

        if (request.CenaStolice <= 0)
        {
            throw new ArgumentException("Cena stolice mora biti veća od nule.");
        }

        if (request.CenaStolice > 99999)
        {
            throw new ArgumentException("Cena stolice ne može biti veća od 99999.");
        }
    }

    public async Task<SalaDto> Add(
    decimal restoranId,
    DodavanjeSaleDto request,
    CancellationToken cancellationToken = default)
    {
        ValidateAddRequest(request);

        var rbrSPostoji = await _salaRepository.RbrSPostoji(
            restoranId,
            request.RbrS,
            null,
            cancellationToken);

        if (rbrSPostoji)
        {
            throw new ArgumentException(
                "Sala sa ovim rednim brojem već postoji u restoranu.");
        }

        var salaId = await _salaRepository.GetNextSalaId(cancellationToken);
        var cenovnikId = await _salaRepository.GetNextCenovnikId(cancellationToken);

        var sala = new Sala
        {
            SalaId = salaId,
            RbrS = request.RbrS,
            Kapacitet = request.Kapacitet,
            RestoranId = restoranId,
            Status = Status.AKTIVNO
        };

        sala.Cenovnici.Add(new Cenovnik
        {
            CenovnikId = cenovnikId,
            Iznos = request.CenaStolice,
            DatumIzmene = DateTime.Today,
            SalaId = salaId,
            UslugaId = null
        });

        await _salaRepository.Add(sala, cancellationToken);

        return MapToDto(sala);
    }

    public async Task<SalaDto?> Update(
        decimal restoranId,
        decimal salaId,
        IzmenaSaleDto request,
        CancellationToken cancellationToken = default)
    {
        if (request.RbrS <= 0)
        {
            throw new ArgumentException("Redni broj sale mora biti veći od nule.");
        }

        if (request.Kapacitet <= 0)
        {
            throw new ArgumentException("Kapacitet sale mora biti veći od nule.");
        }

        var sala = await _salaRepository.GetForUpdate(
            restoranId,
            salaId,
            cancellationToken);

        if (sala is null)
        {
            return null;
        }

        if (sala.Status == Status.NEAKTIVNO)
        {
            throw new InvalidOperationException("Neaktivnu salu nije moguće menjati.");
        }

        var rbrSPostoji = await _salaRepository.RbrSPostoji(
            restoranId,
            request.RbrS,
            salaId,
            cancellationToken);

        if (rbrSPostoji)
        {
            throw new ArgumentException(
                "Sala sa ovim rednim brojem već postoji u restoranu.");
        }

        sala.RbrS = request.RbrS;
        sala.Kapacitet = request.Kapacitet;

        await _salaRepository.SaveChanges(cancellationToken);

        return MapToDto(sala);
    }

    public async Task<bool> Delete(
        decimal restoranId,
        decimal salaId,
        CancellationToken cancellationToken = default)
    {
        var sala = await _salaRepository.GetForUpdate(
            restoranId,
            salaId,
            cancellationToken);

        if (sala is null)
        {
            return false;
        }

        if (sala.Status == Status.NEAKTIVNO)
        {
            return false;
        }

        sala.Status = Status.NEAKTIVNO;

        await _salaRepository.SaveChanges(cancellationToken);

        return true;
    }

    private static SalaDto MapToDto(Sala sala)
    {
        var danas = DateTime.Today;

        var vazecaCena = sala.Cenovnici
            .Where(cena => cena.DatumIzmene.Date <= danas)
            .OrderByDescending(cena => cena.DatumIzmene)
            .ThenByDescending(cena => cena.CenovnikId)
            .FirstOrDefault();

        return new SalaDto
        {
            SalaId = sala.SalaId,
            RbrS = sala.RbrS,
            Kapacitet = sala.Kapacitet,
            CenaStolice = vazecaCena?.Iznos
        };
    }
}