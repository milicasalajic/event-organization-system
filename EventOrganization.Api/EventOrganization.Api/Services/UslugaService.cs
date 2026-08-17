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
        var usluge = await _uslugaRepository.GetByPaketId(
            restoranId,
            paketId,
            cancellationToken);

        return usluge
            .Select(usluga => new UslugaDto
            {
                UslugaId = usluga.UslugaId,
                Naziv = usluga.NazivU,
                Telefon = usluga.Telefon,
                Portfolio = usluga.Portfolio,
                TipUsluge = usluga.TipUsluge.ToString(),

                Opis =
                    usluga.KeteringFirma?.Opis ?? //?? ako je ta vrednost null onda uzmi donju
                    usluga.DekoraterskaFirma?.Opis,

                CenaFoto = usluga.Fotograf?.CenaFoto,

                TipFoto = usluga.Fotograf?.TipFoto.ToString(),

                TipMuzicara =
                    usluga.MuzickiIzvodjac?
                        .TipMuzicara.ToString()
            })
            .ToList();
    }
}