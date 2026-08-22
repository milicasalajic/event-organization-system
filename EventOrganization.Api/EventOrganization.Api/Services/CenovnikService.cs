using EventOrganization.Api.DTOs.Cenovnik;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class CenovnikService
{
    private readonly CenovnikRepository _cenovnikRepository;

    public CenovnikService(
        CenovnikRepository cenovnikRepository)
    {
        _cenovnikRepository = cenovnikRepository;
    }

    public async Task<List<CenovnikStavkaDto>> GetByRestoranId(
        decimal restoranId,
        DateTime datum,
        CancellationToken cancellationToken = default)
    {
        var cenovnik = await _cenovnikRepository.GetByRestoranId(
            restoranId,
            cancellationToken);

        var rezultat = new List<CenovnikStavkaDto>();

        var ceneSala = cenovnik
            .Where(cena => cena.SalaId.HasValue)
            .GroupBy(cena => cena.SalaId!.Value);

        foreach (var grupa in ceneSala)
        {
            var vazecaCena = grupa
                .Where(cena =>
                    cena.DatumIzmene.Date <= datum.Date)
                .OrderByDescending(cena =>
                    cena.DatumIzmene)
                .ThenByDescending(cena =>
                    cena.CenovnikId)
                .FirstOrDefault();

            foreach (var cena in grupa)
            {
                rezultat.Add(new CenovnikStavkaDto
                {
                    CenovnikId = cena.CenovnikId,
                    SalaId = cena.SalaId,
                    UslugaId = null,

                    Naziv =
                        $"Sala {cena.Sala!.RbrS}",

                    Vrsta =
                        "Cena stolice",

                    Iznos =
                        cena.Iznos,

                    DatumIzmene =
                        cena.DatumIzmene,

                    Vazeca =
                        vazecaCena is not null &&
                        vazecaCena.CenovnikId ==
                        cena.CenovnikId
                });
            }
        }

        var ceneUsluga = cenovnik
            .Where(cena => cena.UslugaId.HasValue)
            .GroupBy(cena => cena.UslugaId!.Value);

        foreach (var grupa in ceneUsluga)
        {
            var vazecaCena = grupa
                .Where(cena =>
                    cena.DatumIzmene.Date <= datum.Date)
                .OrderByDescending(cena =>
                    cena.DatumIzmene)
                .ThenByDescending(cena =>
                    cena.CenovnikId)
                .FirstOrDefault();

            foreach (var cena in grupa)
            {
                rezultat.Add(new CenovnikStavkaDto
                {
                    CenovnikId = cena.CenovnikId,
                    SalaId = null,
                    UslugaId = cena.UslugaId,

                    Naziv =
                        cena.Usluga!.NazivU,

                    Vrsta =
                        cena.Usluga.TipUsluge.ToString(),

                    Iznos =
                        cena.Iznos,

                    DatumIzmene =
                        cena.DatumIzmene,

                    Vazeca =
                        vazecaCena is not null &&
                        vazecaCena.CenovnikId ==
                        cena.CenovnikId
                });
            }
        }

        return rezultat
            .OrderBy(stavka => stavka.Naziv)
            .ThenByDescending(stavka =>
                stavka.DatumIzmene)
            .ToList();
    }

    public async Task<CenovnikStavkaDto> AddCenaSale(
        decimal restoranId,
        decimal salaId,
        NovaCenaDto request,
        CancellationToken cancellationToken = default)
    {
        ValidirajCenu(request);

        var sala = await _cenovnikRepository.GetSalaRestorana(
            restoranId,
            salaId,
            cancellationToken);

        if (sala is null)
        {
            throw new ArgumentException(
                "Sala nije pronađena u ovom restoranu.");
        }

        var datum = request.DatumIzmene.Date;

        var postojiCena =
            await _cenovnikRepository.CenaSaleZaDatumPostoji(
                salaId,
                datum,
                cancellationToken);

        if (postojiCena)
        {
            throw new ArgumentException(
                "Za ovu salu već postoji cena sa istim datumom početka važenja.");
        }

        var cenovnikId =
            await _cenovnikRepository.GetNextCenovnikId(
                cancellationToken);

        var cenovnik = new Cenovnik
        {
            CenovnikId = cenovnikId,
            Iznos = request.Iznos,
            DatumIzmene = datum,

            SalaId = salaId,
            UslugaId = null
        };

        await _cenovnikRepository.Add(
            cenovnik,
            cancellationToken);

        return new CenovnikStavkaDto
        {
            CenovnikId = cenovnik.CenovnikId,
            SalaId = sala.SalaId,
            UslugaId = null,

            Naziv =
                $"Sala {sala.RbrS}",

            Vrsta =
                "Cena stolice",

            Iznos =
                cenovnik.Iznos,

            DatumIzmene =
                cenovnik.DatumIzmene,

            Vazeca = false
        };
    }

    public async Task<CenovnikStavkaDto> AddCenaUsluge(
        decimal restoranId,
        decimal uslugaId,
        NovaCenaDto request,
        CancellationToken cancellationToken = default)
    {
        ValidirajCenu(request);

        var usluga =
            await _cenovnikRepository.GetUslugaRestorana(
                restoranId,
                uslugaId,
                cancellationToken);

        if (usluga is null)
        {
            throw new ArgumentException(
                "Usluga nije pronađena u ponudi ovog restorana.");
        }

        var datum = request.DatumIzmene.Date;

        var postojiCena =
            await _cenovnikRepository.CenaUslugeZaDatumPostoji(
                uslugaId,
                datum,
                cancellationToken);

        if (postojiCena)
        {
            throw new ArgumentException(
                "Za ovu uslugu već postoji cena sa istim datumom početka važenja.");
        }

        var cenovnikId =
            await _cenovnikRepository.GetNextCenovnikId(
                cancellationToken);

        var cenovnik = new Cenovnik
        {
            CenovnikId = cenovnikId,
            Iznos = request.Iznos,
            DatumIzmene = datum,

            SalaId = null,
            UslugaId = uslugaId
        };

        await _cenovnikRepository.Add(
            cenovnik,
            cancellationToken);

        return new CenovnikStavkaDto
        {
            CenovnikId = cenovnik.CenovnikId,
            SalaId = null,
            UslugaId = usluga.UslugaId,

            Naziv =
                usluga.NazivU,

            Vrsta =
                usluga.TipUsluge.ToString(),

            Iznos =
                cenovnik.Iznos,

            DatumIzmene =
                cenovnik.DatumIzmene,

            Vazeca = false
        };
    }

    private static void ValidirajCenu(
         NovaCenaDto request)
    {
        if (request.Iznos <= 0)
        {
            throw new ArgumentException(
                "Iznos mora biti veći od nule.");
        }

        if (request.Iznos > 99999)
        {
            throw new ArgumentException(
                "Iznos ne može biti veći od 99999.");
        }

        if (request.DatumIzmene == default)
        {
            throw new ArgumentException(
                "Datum početka važenja cene je obavezan.");
        }
    }
}