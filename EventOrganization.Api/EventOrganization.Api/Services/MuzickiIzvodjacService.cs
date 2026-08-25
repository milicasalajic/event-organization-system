using EventOrganization.Api.DTOs.MuzickiIzvodjaci;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class MuzickiIzvodjacService
{
    private readonly MuzickiIzvodjacRepository
        _muzickiIzvodjacRepository;

    private readonly CenovnikRepository
        _cenovnikRepository;

    public MuzickiIzvodjacService(
        MuzickiIzvodjacRepository muzickiIzvodjacRepository,
        CenovnikRepository cenovnikRepository)
    {
        _muzickiIzvodjacRepository =
            muzickiIzvodjacRepository;

        _cenovnikRepository =
            cenovnikRepository;
    }

    public async Task<List<MuzickiIzvodjacDto>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var usluge =
            await _muzickiIzvodjacRepository.GetByRestoranId(
                restoranId,
                cancellationToken);

        var rezultat =
            new List<MuzickiIzvodjacDto>();

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

    public async Task<MuzickiIzvodjacDto> Add(
        decimal restoranId,
        DodavanjeMuzickogIzvodjacaDto request,
        CancellationToken cancellationToken = default)
    {
        ValidirajPodatke(
            request);

        var tipMuzicara =
            ParseTipMuzicara(
                request.TipMuzicara);

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
            await _muzickiIzvodjacRepository.GetNextUslugaId(
                cancellationToken);

        var cenovnikId =
            await _cenovnikRepository.GetNextCenovnikId(
                cancellationToken);

        var usluga =
            KreirajMuzickogIzvodjaca(
                uslugaId,
                cenovnikId,
                naziv,
                request,
                tipMuzicara);

        PoveziPakete(
            usluga,
            paketi);

        await _muzickiIzvodjacRepository.Add(
            usluga,
            cancellationToken);

        return await MapToDto(
            usluga,
            restoranId,
            cancellationToken);
    }

    public async Task<MuzickiIzvodjacDto?> Update(
        decimal restoranId,
        decimal uslugaId,
        IzmenaMuzickogIzvodjacaDto request,
        CancellationToken cancellationToken = default)
    {
        ValidirajPodatkeIzmene(
            request);

        var tipMuzicara =
            ParseTipMuzicara(
                request.TipMuzicara);

        var usluga =
            await _muzickiIzvodjacRepository.GetForUpdate(
                restoranId,
                uslugaId,
                cancellationToken);

        if (usluga is null)
        {
            return null;
        }

        ValidirajMuzickogIzvodjacaZaIzmenu(
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

        IzmeniPodatkeMuzickogIzvodjaca(
            usluga,
            request,
            naziv,
            tipMuzicara);

        IzmeniPakete(
            usluga,
            noviPaketi,
            restoranId);

        await _muzickiIzvodjacRepository.SaveChanges(
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
            await _muzickiIzvodjacRepository.GetForUpdate(
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

        await _muzickiIzvodjacRepository.SaveChanges(
            cancellationToken);

        return true;
    }

    private static void ValidirajPodatke(
        DodavanjeMuzickogIzvodjacaDto request)
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

        if (request.PaketIds.Count == 0)
        {
            throw new ArgumentException(
                "Muzički izvođač mora biti povezan sa najmanje jednim paketom.");
        }
    }

    private static void ValidirajPodatkeIzmene(
        IzmenaMuzickogIzvodjacaDto request)
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

        if (request.PaketIds.Count == 0)
        {
            throw new ArgumentException(
                "Muzički izvođač mora biti povezan sa najmanje jednim paketom.");
        }
    }

    private static TipMuzicara ParseTipMuzicara(
        string tipMuzicara)
    {
        if (!Enum.TryParse<TipMuzicara>(
                tipMuzicara,
                true,
                out var rezultat))
        {
            throw new ArgumentException(
                "Tip muzičkog izvođača nije ispravan.");
        }

        return rezultat;
    }

    private async Task ValidirajNaziv(
        decimal restoranId,
        string naziv,
        decimal? izuzmiUslugaId,
        CancellationToken cancellationToken)
    {
        var nazivPostoji =
            await _muzickiIzvodjacRepository.NazivPostoji(
                restoranId,
                naziv,
                izuzmiUslugaId,
                cancellationToken);

        if (nazivPostoji)
        {
            throw new ArgumentException(
                "Muzički izvođač sa ovim nazivom već postoji u ponudi restorana.");
        }
    }

    private async Task<List<Paket>> UcitajIValidirajPakete(
        decimal restoranId,
        List<decimal> paketIds,
        CancellationToken cancellationToken)
    {
        var paketi =
            await _muzickiIzvodjacRepository.GetPaketiZaRestoran(
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

    private static void ValidirajMuzickogIzvodjacaZaIzmenu(
        Usluga usluga)
    {
        if (usluga.Status ==
            Status.NEAKTIVNO)
        {
            throw new InvalidOperationException(
                "Neaktivnog muzičkog izvođača nije moguće menjati.");
        }

        if (usluga.MuzickiIzvodjac is null)
        {
            throw new InvalidOperationException(
                "Podaci muzičkog izvođača nisu pronađeni.");
        }
    }

    private static Usluga KreirajMuzickogIzvodjaca(
        decimal uslugaId,
        decimal cenovnikId,
        string naziv,
        DodavanjeMuzickogIzvodjacaDto request,
        TipMuzicara tipMuzicara)
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

    private static void IzmeniPodatkeMuzickogIzvodjaca(
        Usluga usluga,
        IzmenaMuzickogIzvodjacaDto request,
        string naziv,
        TipMuzicara tipMuzicara)
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

        usluga.MuzickiIzvodjac!.TipMuzicara =
            tipMuzicara;
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

    private async Task<MuzickiIzvodjacDto> MapToDto(
        Usluga usluga,
        decimal restoranId,
        CancellationToken cancellationToken)
    {
        var vazecaCena =
            await _cenovnikRepository.GetVazecaCenaUsluge(
                usluga.UslugaId,
                DateTime.Now,
                cancellationToken);

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