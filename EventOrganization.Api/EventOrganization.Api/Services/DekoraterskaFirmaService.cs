using EventOrganization.Api.DTOs.DekoraterskeFirme;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class DekoraterskaFirmaService
{
    private readonly DekoraterskaFirmaRepository
        _dekoraterskaFirmaRepository;

    private readonly CenovnikRepository
        _cenovnikRepository;

    public DekoraterskaFirmaService(
        DekoraterskaFirmaRepository dekoraterskaFirmaRepository,
        CenovnikRepository cenovnikRepository)
    {
        _dekoraterskaFirmaRepository =
            dekoraterskaFirmaRepository;

        _cenovnikRepository =
            cenovnikRepository;
    }

    public async Task<List<DekoraterskaFirmaDto>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var usluge =
            await _dekoraterskaFirmaRepository.GetByRestoranId(
                restoranId,
                cancellationToken);

        var rezultat =
            new List<DekoraterskaFirmaDto>();

        foreach (var usluga in usluge)
        {
            rezultat.Add(
                await MapToDto(
                    usluga,
                    restoranId,
                    cancellationToken));
        }

        return rezultat;
    }

    public async Task<DekoraterskaFirmaDto> Add(
        decimal restoranId,
        DodavanjeDekoraterskeFirmeDto request,
        CancellationToken cancellationToken = default)
    {
        ValidirajPodatke(
            request);

        var paketIds =
            request.PaketIds
                .Distinct()
                .ToList();

        var naziv =
            request.Naziv.Trim();

        await ValidirajNaziv(
            restoranId,
            naziv,
            null,
            cancellationToken);

        var paketi =
            await UcitajIValidirajPakete(
                restoranId,
                paketIds,
                cancellationToken);

        var uslugaId =
            await _dekoraterskaFirmaRepository.GetNextUslugaId(
                cancellationToken);

        var cenovnikId =
            await _cenovnikRepository.GetNextCenovnikId(
                cancellationToken);

        var usluga =
            KreirajDekoraterskuFirmu(
                uslugaId,
                cenovnikId,
                naziv,
                request);

        PoveziPakete(
            usluga,
            paketi);

        await _dekoraterskaFirmaRepository.Add(
            usluga,
            cancellationToken);

        return await MapToDto(
            usluga,
            restoranId,
            cancellationToken);
    }

    public async Task<DekoraterskaFirmaDto?> Update(
        decimal restoranId,
        decimal uslugaId,
        IzmenaDekoraterskeFirmeDto request,
        CancellationToken cancellationToken = default)
    {
        ValidirajPodatkeIzmene(
            request);

        var usluga =
            await _dekoraterskaFirmaRepository.GetForUpdate(
                restoranId,
                uslugaId,
                cancellationToken);

        if (usluga is null)
        {
            return null;
        }

        ValidirajDekoraterskuFirmuZaIzmenu(
            usluga);

        var naziv =
            request.Naziv.Trim();

        await ValidirajNaziv(
            restoranId,
            naziv,
            uslugaId,
            cancellationToken);

        var paketIds =
            request.PaketIds
                .Distinct()
                .ToList();

        var noviPaketi =
            await UcitajIValidirajPakete(
                restoranId,
                paketIds,
                cancellationToken);

        IzmeniPodatkeDekoraterskeFirme(
            usluga,
            request,
            naziv);

        IzmeniPakete(
            usluga,
            noviPaketi,
            restoranId);

        await _dekoraterskaFirmaRepository.SaveChanges(
            cancellationToken);

        return await MapToDto(
            usluga,
            restoranId,
            cancellationToken);
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

        UkloniPaketeRestorana(
            usluga,
            restoranId);

        if (usluga.Paketi.Count == 0)
        {
            usluga.Status =
                Status.NEAKTIVNO;
        }

        await _dekoraterskaFirmaRepository.SaveChanges(
            cancellationToken);

        return true;
    }

    private static void ValidirajPodatke(
        DodavanjeDekoraterskeFirmeDto request)
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

        if (request.Cena <= 0)
        {
            throw new ArgumentException(
                "Cena dekoraterske usluge mora biti veća od nule.");
        }

        if (request.Cena > 99999)
        {
            throw new ArgumentException(
                "Cena dekoraterske usluge ne može biti veća od 99999.");
        }

        if (request.PaketIds.Count == 0)
        {
            throw new ArgumentException(
                "Dekoraterska firma mora biti povezana sa najmanje jednim paketom.");
        }
    }

    private static void ValidirajPodatkeIzmene(
        IzmenaDekoraterskeFirmeDto request)
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

        if (request.PaketIds.Count == 0)
        {
            throw new ArgumentException(
                "Dekoraterska firma mora biti povezana sa najmanje jednim paketom.");
        }
    }

    private async Task ValidirajNaziv(
        decimal restoranId,
        string naziv,
        decimal? izuzmiUslugaId,
        CancellationToken cancellationToken)
    {
        var nazivPostoji =
            await _dekoraterskaFirmaRepository.NazivPostoji(
                restoranId,
                naziv,
                izuzmiUslugaId,
                cancellationToken);

        if (nazivPostoji)
        {
            throw new ArgumentException(
                "Dekoraterska firma sa ovim nazivom već postoji u ponudi restorana.");
        }
    }

    private async Task<List<Paket>> UcitajIValidirajPakete(
        decimal restoranId,
        List<decimal> paketIds,
        CancellationToken cancellationToken)
    {
        var paketi =
            await _dekoraterskaFirmaRepository.GetPaketiZaRestoran(
                restoranId,
                paketIds,
                cancellationToken);

        if (paketi.Count !=
            paketIds.Count)
        {
            throw new ArgumentException(
                "Jedan ili više izabranih paketa ne pripada ovom restoranu.");
        }

        return paketi;
    }

    private static void ValidirajDekoraterskuFirmuZaIzmenu(
        Usluga usluga)
    {
        if (usluga.Status ==
            Status.NEAKTIVNO)
        {
            throw new InvalidOperationException(
                "Neaktivnu dekoratersku firmu nije moguće menjati.");
        }

        if (usluga.DekoraterskaFirma is null)
        {
            throw new InvalidOperationException(
                "Podaci dekoraterske firme nisu pronađeni.");
        }
    }

    private static Usluga KreirajDekoraterskuFirmu(
        decimal uslugaId,
        decimal cenovnikId,
        string naziv,
        DodavanjeDekoraterskeFirmeDto request)
    {
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

        usluga.Cenovnici.Add(
            new Cenovnik
            {
                CenovnikId =
                    cenovnikId,

                Iznos =
                    request.Cena,

                DatumIzmene =
                    DateTime.Now,

                UslugaId =
                    uslugaId,

                SalaId =
                    null
            });

        return usluga;
    }

    private static void IzmeniPodatkeDekoraterskeFirme(
        Usluga usluga,
        IzmenaDekoraterskeFirmeDto request,
        string naziv)
    {
        usluga.NazivU =
            naziv;

        usluga.Telefon =
            request.Telefon.Trim();

        usluga.Portfolio =
            string.IsNullOrWhiteSpace(
                request.Portfolio)
                ? null
                : request.Portfolio.Trim();

        usluga.DekoraterskaFirma!.Opis =
            string.IsNullOrWhiteSpace(
                request.Opis)
                ? null
                : request.Opis.Trim();
    }

    private static void PoveziPakete(
        Usluga usluga,
        List<Paket> paketi)
    {
        foreach (var paket in paketi)
        {
            usluga.Paketi.Add(
                paket);
        }
    }

    private static void IzmeniPakete(
        Usluga usluga,
        List<Paket> noviPaketi,
        decimal restoranId)
    {
        UkloniPaketeRestorana(
            usluga,
            restoranId);

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
    }

    private static void UkloniPaketeRestorana(
        Usluga usluga,
        decimal restoranId)
    {
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
    }

    private async Task<DekoraterskaFirmaDto> MapToDto(
        Usluga usluga,
        decimal restoranId,
        CancellationToken cancellationToken)
    {
        var vazecaCena =
            await _cenovnikRepository.GetVazecaCenaUsluge(
                usluga.UslugaId,
                DateTime.Now,
                cancellationToken);

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