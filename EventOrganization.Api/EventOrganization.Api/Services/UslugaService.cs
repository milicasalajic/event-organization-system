using EventOrganization.Api.DTOs.Usluge;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class UslugaService
{
    private readonly UslugaRepository _uslugaRepository;

    public UslugaService(
        UslugaRepository uslugaRepository)
    {
        _uslugaRepository = uslugaRepository;
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

        var danas = DateTime.Today;

        return usluge
            .Select(usluga =>
            {
                var vazecaCena =
                    usluga.Cenovnici
                        .Where(cena =>
                            cena.DatumIzmene.Date <= danas)
                        .OrderByDescending(cena =>
                            cena.DatumIzmene)
                        .ThenByDescending(cena =>
                            cena.CenovnikId)
                        .FirstOrDefault();

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
            })
            .ToList();
    }
}