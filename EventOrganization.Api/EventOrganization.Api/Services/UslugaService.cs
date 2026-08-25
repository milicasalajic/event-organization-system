using EventOrganization.Api.DTOs.Usluge;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class UslugaService
{
    private readonly UslugaRepository _uslugaRepository;
    private readonly CenovnikRepository _cenovnikRepository;

    public UslugaService(
        UslugaRepository uslugaRepository,
        CenovnikRepository cenovnikRepository)
    {
        _uslugaRepository =
            uslugaRepository;

        _cenovnikRepository =
            cenovnikRepository;
    }

    public async Task<List<UslugaDto>> GetByPaketId(
        decimal restoranId,
        decimal paketId,
        CancellationToken cancellationToken = default)
    {
        var usluge =
            await _uslugaRepository.GetByPaketId(
                restoranId,
                paketId,
                cancellationToken);

        var trenutnoVreme =
            DateTime.Now;

        var rezultat =
            new List<UslugaDto>();

        foreach (var usluga in usluge)
        {
            var dto =
                await MapToDto(
                    usluga,
                    trenutnoVreme,
                    cancellationToken);

            rezultat.Add(dto);
        }

        return rezultat;
    }

    private async Task<UslugaDto> MapToDto(
        Usluga usluga,
        DateTime trenutnoVreme,
        CancellationToken cancellationToken)
    {
        var vazecaCena =
            await _cenovnikRepository.GetVazecaCenaUsluge(
                usluga.UslugaId,
                trenutnoVreme,
                cancellationToken);

        return new UslugaDto
        {
            UslugaId =
                usluga.UslugaId,

            Naziv =
                usluga.NazivU,

            Telefon =
                usluga.Telefon,

            Portfolio =
                usluga.Portfolio,

            TipUsluge =
                usluga.TipUsluge.ToString(),

            Opis =
                usluga.KeteringFirma?.Opis ??
                usluga.DekoraterskaFirma?.Opis,

            CenaFoto =
                usluga.Fotograf?.CenaFoto,

            TipFoto =
                usluga.Fotograf?
                    .TipFoto.ToString(),

            TipMuzicara =
                usluga.MuzickiIzvodjac?
                    .TipMuzicara.ToString(),

            Cena =
                vazecaCena?.Iznos
        };
    }
}