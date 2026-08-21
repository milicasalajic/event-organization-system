using EventOrganization.Api.DTOs.Fotografi;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class FotografService
{
    private readonly FotografRepository _fotografRepository;

    public FotografService(
        FotografRepository fotografRepository)
    {
        _fotografRepository =
            fotografRepository;
    }

    public async Task<List<FotografDto>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var usluge =
            await _fotografRepository.GetByRestoranId(
                restoranId,
                cancellationToken);

        return usluge
            .Select(usluga =>
                MapToDto(
                    usluga,
                    restoranId))
            .ToList();
    }

    public async Task<FotografDto> Add(
        decimal restoranId,
        DodavanjeFotografaDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(
                request.Naziv))
        {
            throw new ArgumentException(
                "Naziv fotografa je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Telefon))
        {
            throw new ArgumentException(
                "Telefon fotografa je obavezan.");
        }

        if (request.CenaFoto <= 0)
        {
            throw new ArgumentException(
                "Cena fotografisanja mora biti veća od nule.");
        }

        if (!Enum.TryParse<TipFoto>(
                request.TipFoto,
                true,
                out var tipFoto))
        {
            throw new ArgumentException(
                "Tip fotografije nije ispravan.");
        }

        var paketIds =
            request.PaketIds
                .Distinct()
                .ToList();

        if (paketIds.Count == 0)
        {
            throw new ArgumentException(
                "Fotograf mora biti povezan sa najmanje jednim paketom.");
        }

        var naziv =
            request.Naziv.Trim();

        var nazivPostoji =
            await _fotografRepository.NazivPostoji(
                restoranId,
                naziv,
                null,
                cancellationToken);

        if (nazivPostoji)
        {
            throw new ArgumentException(
                "Fotograf sa ovim nazivom već postoji u ponudi restorana.");
        }

        var paketi =
            await _fotografRepository.GetPaketiZaRestoran(
                restoranId,
                paketIds,
                cancellationToken);

        if (paketi.Count != paketIds.Count)
        {
            throw new ArgumentException(
                "Jedan ili više izabranih paketa ne pripada ovom restoranu.");
        }

        var uslugaId =
            await _fotografRepository.GetNextUslugaId(
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
                    TipUsluge.FOTOGRAF,

                Status =
                    Status.AKTIVNO,

                Fotograf =
                    new Fotograf
                    {
                        UslugaId =
                            uslugaId,

                        CenaFoto =
                            request.CenaFoto,

                        TipFoto =
                            tipFoto
                    }
            };

        foreach (var paket in paketi)
        {
            usluga.Paketi.Add(
                paket);
        }

        await _fotografRepository.Add(
            usluga,
            cancellationToken);

        return MapToDto(
            usluga,
            restoranId);
    }

    public async Task<FotografDto?> Update(
        decimal restoranId,
        decimal uslugaId,
        IzmenaFotografaDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(
                request.Naziv))
        {
            throw new ArgumentException(
                "Naziv fotografa je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Telefon))
        {
            throw new ArgumentException(
                "Telefon fotografa je obavezan.");
        }

        if (request.CenaFoto <= 0)
        {
            throw new ArgumentException(
                "Cena fotografisanja mora biti veća od nule.");
        }

        if (!Enum.TryParse<TipFoto>(
                request.TipFoto,
                true,
                out var tipFoto))
        {
            throw new ArgumentException(
                "Tip fotografije nije ispravan.");
        }

        var usluga =
            await _fotografRepository.GetForUpdate(
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
                "Neaktivnog fotografa nije moguće menjati.");
        }

        var naziv =
            request.Naziv.Trim();

        var nazivPostoji =
            await _fotografRepository.NazivPostoji(
                restoranId,
                naziv,
                uslugaId,
                cancellationToken);

        if (nazivPostoji)
        {
            throw new ArgumentException(
                "Fotograf sa ovim nazivom već postoji u ponudi restorana.");
        }

        var paketIds =
            request.PaketIds
                .Distinct()
                .ToList();

        if (paketIds.Count == 0)
        {
            throw new ArgumentException(
                "Fotograf mora biti povezan sa najmanje jednim paketom.");
        }

        var noviPaketi =
            await _fotografRepository.GetPaketiZaRestoran(
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

        if (usluga.Fotograf is null)
        {
            throw new InvalidOperationException(
                "Podaci fotografa nisu pronađeni.");
        }

        usluga.Fotograf.CenaFoto =
            request.CenaFoto;

        usluga.Fotograf.TipFoto =
            tipFoto;

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

        await _fotografRepository.SaveChanges(
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
            await _fotografRepository.GetForUpdate(
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

        await _fotografRepository.SaveChanges(
            cancellationToken);

        return true;
    }

    private static FotografDto MapToDto(
        Usluga usluga,
        decimal restoranId)
    {
        return new FotografDto
        {
            UslugaId =
                usluga.UslugaId,

            Naziv =
                usluga.NazivU,

            Telefon =
                usluga.Telefon,

            Portfolio =
                usluga.Portfolio,

            CenaFoto =
                usluga.Fotograf!.CenaFoto,

            TipFoto =
                usluga.Fotograf.TipFoto.ToString(),

            PaketIds =
                usluga.Paketi
                    .Where(paket =>
                        paket.RestoranId ==
                        restoranId)
                    .Select(paket =>
                        paket.PaketId)
                    .ToList()
        };
    }
}