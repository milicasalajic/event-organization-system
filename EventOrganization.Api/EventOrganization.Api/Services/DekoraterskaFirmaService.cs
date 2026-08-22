using EventOrganization.Api.DTOs.DekoraterskeFirme;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class DekoraterskaFirmaService
{
    private readonly DekoraterskaFirmaRepository
        _dekoraterskaFirmaRepository;

    public DekoraterskaFirmaService(
        DekoraterskaFirmaRepository dekoraterskaFirmaRepository)
    {
        _dekoraterskaFirmaRepository =
            dekoraterskaFirmaRepository;
    }

    public async Task<List<DekoraterskaFirmaDto>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var usluge =
            await _dekoraterskaFirmaRepository.GetByRestoranId(
                restoranId,
                cancellationToken);

        return usluge
            .Select(usluga =>
                MapToDto(
                    usluga,
                    restoranId))
            .ToList();
    }

    public async Task<DekoraterskaFirmaDto> Add(
        decimal restoranId,
        DodavanjeDekoraterskeFirmeDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(
                request.Naziv))
        {
            throw new ArgumentException(
                "Naziv dekoraterske firme je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Telefon))
        {
            throw new ArgumentException(
                "Telefon dekoraterske firme je obavezan.");
        }

        var paketIds =
            request.PaketIds
                .Distinct()
                .ToList();

        if (paketIds.Count == 0)
        {
            throw new ArgumentException(
                "Dekoraterska firma mora biti povezana sa najmanje jednim paketom.");
        }

        var naziv =
            request.Naziv.Trim();

        var nazivPostoji =
            await _dekoraterskaFirmaRepository.NazivPostoji(
                restoranId,
                naziv,
                null,
                cancellationToken);

        if (nazivPostoji)
        {
            throw new ArgumentException(
                "Dekoraterska firma sa ovim nazivom već postoji u ponudi restorana.");
        }

        var paketi =
            await _dekoraterskaFirmaRepository.GetPaketiZaRestoran(
                restoranId,
                paketIds,
                cancellationToken);

        if (paketi.Count != paketIds.Count)
        {
            throw new ArgumentException(
                "Jedan ili više izabranih paketa ne pripada ovom restoranu.");
        }

        var uslugaId =
            await _dekoraterskaFirmaRepository.GetNextUslugaId(
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
                    TipUsluge.DEKORATER,

                Status =
                    Status.AKTIVNO,

                DekoraterskaFirma =
                    new DekoraterskaFirma
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

        await _dekoraterskaFirmaRepository.Add(
            usluga,
            cancellationToken);

        return MapToDto(
            usluga,
            restoranId);
    }

    public async Task<DekoraterskaFirmaDto?> Update(
        decimal restoranId,
        decimal uslugaId,
        IzmenaDekoraterskeFirmeDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(
                request.Naziv))
        {
            throw new ArgumentException(
                "Naziv dekoraterske firme je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(
                request.Telefon))
        {
            throw new ArgumentException(
                "Telefon dekoraterske firme je obavezan.");
        }

        var usluga =
            await _dekoraterskaFirmaRepository.GetForUpdate(
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
                "Neaktivnu dekoratersku firmu nije moguće menjati.");
        }

        var naziv =
            request.Naziv.Trim();

        var nazivPostoji =
            await _dekoraterskaFirmaRepository.NazivPostoji(
                restoranId,
                naziv,
                uslugaId,
                cancellationToken);

        if (nazivPostoji)
        {
            throw new ArgumentException(
                "Dekoraterska firma sa ovim nazivom već postoji u ponudi restorana.");
        }

        var paketIds =
            request.PaketIds
                .Distinct()
                .ToList();

        if (paketIds.Count == 0)
        {
            throw new ArgumentException(
                "Dekoraterska firma mora biti povezana sa najmanje jednim paketom.");
        }

        var noviPaketi =
            await _dekoraterskaFirmaRepository.GetPaketiZaRestoran(
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

        if (usluga.DekoraterskaFirma is null)
        {
            throw new InvalidOperationException(
                "Podaci dekoraterske firme nisu pronađeni.");
        }

        usluga.DekoraterskaFirma.Opis =
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

        await _dekoraterskaFirmaRepository.SaveChanges(
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
            await _dekoraterskaFirmaRepository.GetForUpdate(
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

        await _dekoraterskaFirmaRepository.SaveChanges(
            cancellationToken);

        return true;
    }

    private static DekoraterskaFirmaDto MapToDto(
        Usluga usluga,
        decimal restoranId)
    {
        return new DekoraterskaFirmaDto
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
                usluga.DekoraterskaFirma?.Opis,

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