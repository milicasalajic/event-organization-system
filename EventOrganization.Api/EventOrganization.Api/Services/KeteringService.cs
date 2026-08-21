using EventOrganization.Api.DTOs.Usluge;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class KeteringService
{
    private readonly KeteringRepository _keteringRepository;

    public KeteringService(
        KeteringRepository keteringRepository)
    {
        _keteringRepository = keteringRepository;
    }

    public async Task<List<KeteringFirmaDto>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var usluge =
            await _keteringRepository.GetByRestoranId(
                restoranId,
                cancellationToken);

        return usluge
            .Select(usluga =>
                MapToDto(
                    usluga,
                    restoranId))
            .ToList();
    }

    public async Task<KeteringFirmaDto> Add(
        decimal restoranId,
        DodavanjeKeteringFirmeDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(
                request.Naziv))
        {
            throw new ArgumentException(
                "Naziv ketering firme je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Telefon))
        {
            throw new ArgumentException(
                "Telefon ketering firme je obavezan.");
        }

        var paketIds =
            request.PaketIds
                .Distinct()
                .ToList();

        if (paketIds.Count == 0)
        {
            throw new ArgumentException(
                "Ketering firma mora biti povezana sa najmanje jednim paketom.");
        }

        var naziv =
            request.Naziv.Trim();

        var nazivPostoji =
            await _keteringRepository.NazivPostoji(
                restoranId,
                naziv,
                null,
                cancellationToken);

        if (nazivPostoji)
        {
            throw new ArgumentException(
                "Ketering firma sa ovim nazivom već postoji u ponudi restorana.");
        }

        var paketi =
            await _keteringRepository.GetPaketiZaRestoran(
                restoranId,
                paketIds,
                cancellationToken);

        if (paketi.Count != paketIds.Count)
        {
            throw new ArgumentException(
                "Jedan ili više izabranih paketa ne pripada ovom restoranu.");
        }

        var uslugaId =
            await _keteringRepository.GetNextUslugaId(
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
                    TipUsluge.KETERING,

                Status =
                    Status.AKTIVNO,

                KeteringFirma =
                    new KeteringFirma
                    {
                        UslugaId =
                            uslugaId,

                        Opis =
                            string.IsNullOrWhiteSpace(
                                request.Opis)
                                ? null
                                : request.Opis.Trim()
                    }
            };

        foreach (var paket in paketi)
        {
            usluga.Paketi.Add(
                paket);
        }

        await _keteringRepository.Add(
            usluga,
            cancellationToken);

        return MapToDto(
            usluga,
            restoranId);
    }

    public async Task<KeteringFirmaDto?> Update(
        decimal restoranId,
        decimal uslugaId,
        IzmenaKeteringFirmeDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(
                request.Naziv))
        {
            throw new ArgumentException(
                "Naziv ketering firme je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Telefon))
        {
            throw new ArgumentException(
                "Telefon ketering firme je obavezan.");
        }

        var usluga =
            await _keteringRepository.GetForUpdate(
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
                "Neaktivnu ketering firmu nije moguće menjati.");
        }

        var naziv =
            request.Naziv.Trim();

        var nazivPostoji =
            await _keteringRepository.NazivPostoji(
                restoranId,
                naziv,
                uslugaId,
                cancellationToken);

        if (nazivPostoji)
        {
            throw new ArgumentException(
                "Ketering firma sa ovim nazivom već postoji u ponudi restorana.");
        }

        var paketIds =
            request.PaketIds
                .Distinct()
                .ToList();

        if (paketIds.Count == 0)
        {
            throw new ArgumentException(
                "Ketering firma mora biti povezana sa najmanje jednim paketom.");
        }

        var noviPaketi =
            await _keteringRepository.GetPaketiZaRestoran(
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

        if (usluga.KeteringFirma is null)
        {
            throw new InvalidOperationException(
                "Podaci ketering firme nisu pronađeni.");
        }

        usluga.KeteringFirma.Opis =
            string.IsNullOrWhiteSpace(
                request.Opis)
                ? null
                : request.Opis.Trim();

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

        await _keteringRepository.SaveChanges(
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
            await _keteringRepository.GetForUpdate(
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

        await _keteringRepository.SaveChanges(
            cancellationToken);

        return true;
    }

    private static KeteringFirmaDto MapToDto(
        Usluga usluga,
        decimal restoranId)
    {
        return new KeteringFirmaDto
        {
            UslugaId =
                usluga.UslugaId,

            Naziv =
                usluga.NazivU,

            Telefon =
                usluga.Telefon,

            Portfolio =
                usluga.Portfolio,

            Opis =
                usluga.KeteringFirma?.Opis,

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