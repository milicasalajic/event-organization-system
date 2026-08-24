using EventOrganization.Api.DTOs.MuzickiIzvodjaci;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class MuzickiIzvodjacService
{
    private readonly MuzickiIzvodjacRepository
        _muzickiIzvodjacRepository;

    public MuzickiIzvodjacService(
        MuzickiIzvodjacRepository muzickiIzvodjacRepository)
    {
        _muzickiIzvodjacRepository =
            muzickiIzvodjacRepository;
    }

    public async Task<List<MuzickiIzvodjacDto>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var usluge =
            await _muzickiIzvodjacRepository.GetByRestoranId(
                restoranId,
                cancellationToken);

        return usluge
            .Select(usluga =>
                MapToDto(
                    usluga,
                    restoranId))
            .ToList();
    }

    public async Task<MuzickiIzvodjacDto> Add(
        decimal restoranId,
        DodavanjeMuzickogIzvodjacaDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(
                request.Naziv))
        {
            throw new ArgumentException(
                "Naziv muzičkog izvođača je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Telefon))
        {
            throw new ArgumentException(
                "Telefon muzičkog izvođača je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(
                request.TipMuzicara))
        {
            throw new ArgumentException(
                "Tip muzičkog izvođača je obavezan.");
        }

        if (request.Cena <= 0)
        {
            throw new ArgumentException(
                "Cena muzičkog izvođača mora biti veća od nule.");
        }

        if (request.Cena > 99999)
        {
            throw new ArgumentException(
                "Cena muzičkog izvođača ne može biti veća od 99999.");
        }

        if (!Enum.TryParse<TipMuzicara>(
                request.TipMuzicara,
                true,
                out var tipMuzicara))
        {
            throw new ArgumentException(
                "Tip muzičkog izvođača nije ispravan.");
        }

        var paketIds =
            request.PaketIds
                .Distinct()
                .ToList();

        if (paketIds.Count == 0)
        {
            throw new ArgumentException(
                "Muzički izvođač mora biti povezan sa najmanje jednim paketom.");
        }

        var naziv =
            request.Naziv.Trim();

        var nazivPostoji =
            await _muzickiIzvodjacRepository.NazivPostoji(
                restoranId,
                naziv,
                null,
                cancellationToken);

        if (nazivPostoji)
        {
            throw new ArgumentException(
                "Muzički izvođač sa ovim nazivom već postoji u ponudi restorana.");
        }

        var paketi =
            await _muzickiIzvodjacRepository.GetPaketiZaRestoran(
                restoranId,
                paketIds,
                cancellationToken);

        if (paketi.Count != paketIds.Count)
        {
            throw new ArgumentException(
                "Jedan ili više izabranih paketa ne pripada ovom restoranu.");
        }

        var uslugaId =
            await _muzickiIzvodjacRepository.GetNextUslugaId(
                cancellationToken);

        var cenovnikId =
            await _muzickiIzvodjacRepository.GetNextCenovnikId(
                cancellationToken);

        var usluga =
            new Usluga
            {
                UslugaId =
                    uslugaId,

                NazivU =
                    naziv,

                Telefon =
                    request.Telefon.Trim(),

                Portfolio =
                    string.IsNullOrWhiteSpace(
                        request.Portfolio)
                        ? null
                        : request.Portfolio.Trim(),

                TipUsluge =
                    TipUsluge.MUZICKI_IZVODJAC,

                Status =
                    Status.AKTIVNO,

                MuzickiIzvodjac =
                    new MuzickiIzvodjac
                    {
                        UslugaId =
                            uslugaId,

                        TipMuzicara =
                            tipMuzicara
                    }
            };

        foreach (var paket in paketi)
        {
            usluga.Paketi.Add(
                paket);
        }

        usluga.Cenovnici.Add(
            new Cenovnik
            {
                CenovnikId =
                    cenovnikId,

                Iznos =
                    request.Cena,

                DatumIzmene =
                    DateTime.Today,

                UslugaId =
                    uslugaId,

                SalaId =
                    null
            });

        await _muzickiIzvodjacRepository.Add(
            usluga,
            cancellationToken);

        return MapToDto(
            usluga,
            restoranId);
    }

    public async Task<MuzickiIzvodjacDto?> Update(
        decimal restoranId,
        decimal uslugaId,
        IzmenaMuzickogIzvodjacaDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(
                request.Naziv))
        {
            throw new ArgumentException(
                "Naziv muzičkog izvođača je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Telefon))
        {
            throw new ArgumentException(
                "Telefon muzičkog izvođača je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(
                request.TipMuzicara))
        {
            throw new ArgumentException(
                "Tip muzičkog izvođača je obavezan.");
        }

        if (!Enum.TryParse<TipMuzicara>(
                request.TipMuzicara,
                true,
                out var tipMuzicara))
        {
            throw new ArgumentException(
                "Tip muzičkog izvođača nije ispravan.");
        }

        var usluga =
            await _muzickiIzvodjacRepository.GetForUpdate(
                restoranId,
                uslugaId,
                cancellationToken);

        if (usluga is null)
        {
            return null;
        }

        if (usluga.Status ==
            Status.NEAKTIVNO)
        {
            throw new InvalidOperationException(
                "Neaktivnog muzičkog izvođača nije moguće menjati.");
        }

        var naziv =
            request.Naziv.Trim();

        var nazivPostoji =
            await _muzickiIzvodjacRepository.NazivPostoji(
                restoranId,
                naziv,
                uslugaId,
                cancellationToken);

        if (nazivPostoji)
        {
            throw new ArgumentException(
                "Muzički izvođač sa ovim nazivom već postoji u ponudi restorana.");
        }

        var paketIds =
            request.PaketIds
                .Distinct()
                .ToList();

        if (paketIds.Count == 0)
        {
            throw new ArgumentException(
                "Muzički izvođač mora biti povezan sa najmanje jednim paketom.");
        }

        var noviPaketi =
            await _muzickiIzvodjacRepository.GetPaketiZaRestoran(
                restoranId,
                paketIds,
                cancellationToken);

        if (noviPaketi.Count != paketIds.Count)
        {
            throw new ArgumentException(
                "Jedan ili više izabranih paketa ne pripada ovom restoranu.");
        }

        usluga.NazivU =
            naziv;

        usluga.Telefon =
            request.Telefon.Trim();

        usluga.Portfolio =
            string.IsNullOrWhiteSpace(
                request.Portfolio)
                ? null
                : request.Portfolio.Trim();

        if (usluga.MuzickiIzvodjac is null)
        {
            throw new InvalidOperationException(
                "Podaci muzičkog izvođača nisu pronađeni.");
        }

        usluga.MuzickiIzvodjac.TipMuzicara =
            tipMuzicara;

        var stariPaketiRestorana =
            usluga.Paketi
                .Where(paket =>
                    paket.RestoranId ==
                    restoranId)
                .ToList();

        foreach (var paket in stariPaketiRestorana)
        {
            usluga.Paketi.Remove(
                paket);
        }

        foreach (var paket in noviPaketi)
        {
            if (!usluga.Paketi.Any(
                    postojeci =>
                        postojeci.PaketId ==
                        paket.PaketId))
            {
                usluga.Paketi.Add(
                    paket);
            }
        }

        await _muzickiIzvodjacRepository.SaveChanges(
            cancellationToken);

        return MapToDto(
            usluga,
            restoranId);
    }

    public async Task<bool> Delete(
        decimal restoranId,
        decimal uslugaId,
        CancellationToken cancellationToken = default)
    {
        var usluga =
            await _muzickiIzvodjacRepository.GetForUpdate(
                restoranId,
                uslugaId,
                cancellationToken);

        if (usluga is null)
        {
            return false;
        }

        var paketiRestorana =
            usluga.Paketi
                .Where(paket =>
                    paket.RestoranId ==
                    restoranId)
                .ToList();

        foreach (var paket in paketiRestorana)
        {
            usluga.Paketi.Remove(
                paket);
        }

        if (usluga.Paketi.Count == 0)
        {
            usluga.Status =
                Status.NEAKTIVNO;
        }

        await _muzickiIzvodjacRepository.SaveChanges(
            cancellationToken);

        return true;
    }

    private static MuzickiIzvodjacDto MapToDto(
        Usluga usluga,
        decimal restoranId)
    {
        var danas =
            DateTime.Today;

        var vazecaCena =
            usluga.Cenovnici
                .Where(cena =>
                    cena.DatumIzmene.Date <=
                    danas)
                .OrderByDescending(cena =>
                    cena.DatumIzmene)
                .ThenByDescending(cena =>
                    cena.CenovnikId)
                .FirstOrDefault();

        return new MuzickiIzvodjacDto
        {
            UslugaId =
                usluga.UslugaId,

            Naziv =
                usluga.NazivU,

            Telefon =
                usluga.Telefon,

            Portfolio =
                usluga.Portfolio,

            TipMuzicara =
                usluga.MuzickiIzvodjac!
                    .TipMuzicara.ToString(),

            Cena =
                vazecaCena?.Iznos,

            PaketIds =
                usluga.Paketi
                    .Where(paket =>
                        paket.RestoranId ==
                            restoranId &&
                        paket.Status ==
                            Status.AKTIVNO)
                    .Select(paket =>
                        paket.PaketId)
                    .ToList()
        };
    }
}