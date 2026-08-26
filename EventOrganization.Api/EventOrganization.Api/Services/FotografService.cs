using EventOrganization.Api.DTOs.Fotografi;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class FotografService
{
    private readonly FotografRepository _fotografRepository;
    private readonly CenovnikRepository _cenovnikRepository;

    public FotografService(
        FotografRepository fotografRepository,
        CenovnikRepository cenovnikRepository)
    {
        _fotografRepository = fotografRepository;
        _cenovnikRepository = cenovnikRepository;
    }

    public async Task<List<FotografDto>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken = default)
    {
        var usluge = await _fotografRepository.GetByRestoranId(
            restoranId,
            cancellationToken);

        var rezultat = new List<FotografDto>();

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

    public async Task<FotografDto> Add(
        decimal restoranId,
        DodavanjeFotografaDto request,
        CancellationToken cancellationToken = default)
    {
        ValidirajPodatke(request);

        var tipFoto = ParseTipFoto(request.TipFoto);

        var paketIds = request.PaketIds
            .Distinct()
            .ToList();

        var naziv = request.Naziv.Trim();

        await ValidirajNaziv(
            restoranId,
            naziv,
            null,
            cancellationToken);

        var paketi = await UcitajIValidirajPakete(
            restoranId,
            paketIds,
            cancellationToken);

        var uslugaId = await _fotografRepository.GetNextUslugaId(
            cancellationToken);

        var cenovnikId = await _cenovnikRepository.GetNextCenovnikId(
            cancellationToken);

        var usluga = KreirajFotografa(
            uslugaId,
            cenovnikId,
            naziv,
            request,
            tipFoto);

        PoveziPakete(usluga, paketi);

        await _fotografRepository.Add(
            usluga,
            cancellationToken);

        return await MapToDto(
            usluga,
            restoranId,
            cancellationToken);
    }

    public async Task<FotografDto?> Update(
        decimal restoranId,
        decimal uslugaId,
        IzmenaFotografaDto request,
        CancellationToken cancellationToken = default)
    {
        ValidirajPodatkeIzmene(request);

        var tipFoto = ParseTipFoto(request.TipFoto);

        var usluga = await _fotografRepository.GetForUpdate(
            restoranId,
            uslugaId,
            cancellationToken);

        if (usluga is null)
        {
            return null;
        }

        ValidirajFotografaZaIzmenu(usluga);

        var naziv = request.Naziv.Trim();

        await ValidirajNaziv(
            restoranId,
            naziv,
            uslugaId,
            cancellationToken);

        var paketIds = request.PaketIds
            .Distinct()
            .ToList();

        var noviPaketi = await UcitajIValidirajPakete(
            restoranId,
            paketIds,
            cancellationToken);

        IzmeniPodatkeFotografa(
            usluga,
            request,
            naziv,
            tipFoto);

        IzmeniPakete(
            usluga,
            noviPaketi,
            restoranId);

        await _fotografRepository.SaveChanges(cancellationToken);

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
        var usluga = await _fotografRepository.GetForUpdate(
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
            usluga.Status = Status.NEAKTIVNO;
        }

        await _fotografRepository.SaveChanges(cancellationToken);

        return true;
    }

    private static void ValidirajPodatke(DodavanjeFotografaDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Naziv))
        {
            throw new ArgumentException(
                "Naziv fotografa je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(request.Telefon))
        {
            throw new ArgumentException(
                "Telefon fotografa je obavezan.");
        }

        if (request.CenaFoto <= 0)
        {
            throw new ArgumentException(
                "Cena fotografije mora biti veća od nule.");
        }

        if (request.Cena <= 0)
        {
            throw new ArgumentException(
                "Cena usluge fotografa mora biti veća od nule.");
        }

        if (request.Cena > 99999)
        {
            throw new ArgumentException(
                "Cena usluge fotografa ne može biti veća od 99999.");
        }

        if (request.PaketIds.Count == 0)
        {
            throw new ArgumentException(
                "Fotograf mora biti povezan sa najmanje jednim paketom.");
        }
    }

    private static void ValidirajPodatkeIzmene(IzmenaFotografaDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Naziv))
        {
            throw new ArgumentException(
                "Naziv fotografa je obavezan.");
        }

        if (string.IsNullOrWhiteSpace(request.Telefon))
        {
            throw new ArgumentException(
                "Telefon fotografa je obavezan.");
        }

        if (request.CenaFoto <= 0)
        {
            throw new ArgumentException(
                "Cena fotografije mora biti veća od nule.");
        }

        if (request.PaketIds.Count == 0)
        {
            throw new ArgumentException(
                "Fotograf mora biti povezan sa najmanje jednim paketom.");
        }
    }

    private static TipFoto ParseTipFoto(string tipFoto)
    {
        if (!Enum.TryParse<TipFoto>(
                tipFoto,
                true,
                out var rezultat))
        {
            throw new ArgumentException(
                "Tip fotografije nije ispravan.");
        }

        return rezultat;
    }

    private async Task ValidirajNaziv(
        decimal restoranId,
        string naziv,
        decimal? izuzmiUslugaId,
        CancellationToken cancellationToken)
    {
        var nazivPostoji = await _fotografRepository.NazivPostoji(
            restoranId,
            naziv,
            izuzmiUslugaId,
            cancellationToken);

        if (nazivPostoji)
        {
            throw new ArgumentException(
                "Fotograf sa ovim nazivom već postoji u ponudi restorana.");
        }
    }

    private async Task<List<Paket>> UcitajIValidirajPakete(
        decimal restoranId,
        List<decimal> paketIds,
        CancellationToken cancellationToken)
    {
        var paketi = await _fotografRepository.GetPaketiZaRestoran(
            restoranId,
            paketIds,
            cancellationToken);

        if (paketi.Count != paketIds.Count)
        {
            throw new ArgumentException(
                "Jedan ili više izabranih paketa ne pripada ovom restoranu.");
        }

        return paketi;
    }

    private static void ValidirajFotografaZaIzmenu(Usluga usluga)
    {
        if (usluga.Status == Status.NEAKTIVNO)
        {
            throw new InvalidOperationException(
                "Neaktivnog fotografa nije moguće menjati.");
        }

        if (usluga.Fotograf is null)
        {
            throw new InvalidOperationException(
                "Podaci fotografa nisu pronađeni.");
        }
    }

    private static Usluga KreirajFotografa(
        decimal uslugaId,
        decimal cenovnikId,
        string naziv,
        DodavanjeFotografaDto request,
        TipFoto tipFoto)
    {
        var usluga = new Usluga
        {
            UslugaId = uslugaId,
            NazivU = naziv,
            Telefon = request.Telefon.Trim(),
            Portfolio = string.IsNullOrWhiteSpace(request.Portfolio)
                ? null
                : request.Portfolio.Trim(),
            TipUsluge = TipUsluge.FOTOGRAF,
            Status = Status.AKTIVNO,
            Fotograf = new Fotograf
            {
                UslugaId = uslugaId,
                CenaFoto = request.CenaFoto,
                TipFoto = tipFoto
            }
        };

        usluga.Cenovnici.Add(new Cenovnik
        {
            CenovnikId = cenovnikId,
            Iznos = request.Cena,
            DatumIzmene = DateTime.Now,
            UslugaId = uslugaId,
            SalaId = null
        });

        return usluga;
    }

    private static void IzmeniPodatkeFotografa(
        Usluga usluga,
        IzmenaFotografaDto request,
        string naziv,
        TipFoto tipFoto)
    {
        usluga.NazivU = naziv;
        usluga.Telefon = request.Telefon.Trim();

        usluga.Portfolio = string.IsNullOrWhiteSpace(request.Portfolio)
            ? null
            : request.Portfolio.Trim();

        usluga.Fotograf!.CenaFoto = request.CenaFoto;
        usluga.Fotograf.TipFoto = tipFoto;
    }

    private static void PoveziPakete(
        Usluga usluga,
        List<Paket> paketi)
    {
        foreach (var paket in paketi)
        {
            usluga.Paketi.Add(paket);
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
                    postojeci => postojeci.PaketId == paket.PaketId))
            {
                usluga.Paketi.Add(paket);
            }
        }
    }

    private static void UkloniPaketeRestorana(
        Usluga usluga,
        decimal restoranId)
    {
        var paketiRestorana = usluga.Paketi
            .Where(paket => paket.RestoranId == restoranId)
            .ToList();

        foreach (var paket in paketiRestorana)
        {
            usluga.Paketi.Remove(paket);
        }
    }

    private async Task<FotografDto> MapToDto(
        Usluga usluga,
        decimal restoranId,
        CancellationToken cancellationToken)
    {
        var vazecaCena = await _cenovnikRepository.GetVazecaCenaUsluge(
            usluga.UslugaId,
            DateTime.Now,
            cancellationToken);

        return new FotografDto
        {
            UslugaId = usluga.UslugaId,
            Naziv = usluga.NazivU,
            Telefon = usluga.Telefon,
            Portfolio = usluga.Portfolio,
            CenaFoto = usluga.Fotograf!.CenaFoto,
            TipFoto = usluga.Fotograf.TipFoto.ToString(),
            Cena = vazecaCena?.Iznos,
            PaketIds = usluga.Paketi
                .Where(paket =>
                    paket.RestoranId == restoranId &&
                    paket.Status == Status.AKTIVNO)
                .Select(paket => paket.PaketId)
                .ToList()
        };
    }
}