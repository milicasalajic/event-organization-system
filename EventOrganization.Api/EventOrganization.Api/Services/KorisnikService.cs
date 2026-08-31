using EventOrganization.Api.DTOs.Korisnici;
using EventOrganization.Api.Enums;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;
using Microsoft.AspNetCore.Identity;

namespace EventOrganization.Api.Services;

public class KorisnikService
{
    private readonly KorisnikRepository _korisnikRepository;
    private readonly PasswordHasher<Korisnik> _passwordHasher;

    public KorisnikService(
        KorisnikRepository korisnikRepository)
    {
        _korisnikRepository = korisnikRepository;
        _passwordHasher = new PasswordHasher<Korisnik>();
    }

    public async Task<KorisnikProfilDto?> GetProfil(
        decimal korisnikId,
        CancellationToken cancellationToken = default)
    {
        var korisnik = await _korisnikRepository.GetById(
            korisnikId,
            cancellationToken);

        if (korisnik is null)
        {
            return null;
        }

        return new KorisnikProfilDto
        {
            KorisnikId = korisnik.KorisnikId,
            Ime = korisnik.Ime,
            Prezime = korisnik.Prezime,
            Email = korisnik.Email,
            Telefon = korisnik.Telefon
        };
    }

    public async Task<KorisnikProfilDto?> IzmeniProfil(
        decimal korisnikId,
        IzmenaKorisnikProfilDto request,
        CancellationToken cancellationToken = default)
    {
        var korisnik = await _korisnikRepository.GetById(
            korisnikId,
            cancellationToken);

        if (korisnik is null)
        {
            return null;
        }

        var emailPostoji = await _korisnikRepository.EmailPostojiZaDrugogKorisnika(
            request.Email,
            korisnikId,
            cancellationToken);

        if (emailPostoji)
        {
            throw new InvalidOperationException(
                "Korisnik sa ovom email adresom već postoji.");
        }

        korisnik.Ime = request.Ime;
        korisnik.Prezime = request.Prezime;
        korisnik.Email = request.Email;
        korisnik.Telefon = request.Telefon;

        await _korisnikRepository.SaveChanges(cancellationToken);

        return new KorisnikProfilDto
        {
            KorisnikId = korisnik.KorisnikId,
            Ime = korisnik.Ime,
            Prezime = korisnik.Prezime,
            Email = korisnik.Email,
            Telefon = korisnik.Telefon
        };
    }

    public async Task<List<KlijentPregledDto>> GetKlijenti(
        CancellationToken cancellationToken = default)
    {
        var klijenti = await _korisnikRepository.GetKlijenti(cancellationToken);

        return klijenti
            .Select(klijent => new KlijentPregledDto
            {
                KorisnikId = klijent.KorisnikId,
                Ime = klijent.Korisnik.Ime,
                Prezime = klijent.Korisnik.Prezime,
                Email = klijent.Korisnik.Email
            })
            .ToList();
    }

    public async Task<KreiranjeKlijentaResponseDto> KreirajKlijenta(
        KreiranjeKlijentaDto request,
        CancellationToken cancellationToken = default)
    {
        var ime = request.Ime.Trim();
        var prezime = request.Prezime.Trim();
        var email = request.Email.Trim().ToLowerInvariant();

        if (string.IsNullOrWhiteSpace(ime) ||
            string.IsNullOrWhiteSpace(prezime) ||
            string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(request.Lozinka))
        {
            throw new ArgumentException(
                "Ime, prezime, email i lozinka su obavezni.");
        }

        var emailPostoji = await _korisnikRepository.EmailPostoji(
            email,
            cancellationToken);

        if (emailPostoji)
        {
            throw new ArgumentException(
                "Korisnik sa ovom email adresom već postoji.");
        }

        var ulogaId = await _korisnikRepository.GetKlijentUlogaId(
            cancellationToken);

        if (!ulogaId.HasValue)
        {
            throw new InvalidOperationException(
                "Uloga klijenta nije pronađena.");
        }

        var korisnikId = await _korisnikRepository.GetNextKorisnikId(
            cancellationToken);

        var korisnik = new Korisnik
        {
            KorisnikId = korisnikId,
            Ime = ime,
            Prezime = prezime,
            Email = email,
            Telefon = request.Telefon?.Trim(),
            TipKorisnika = TipKorisnika.KLIJENT,
            UlogaId = ulogaId.Value,
            Lozinka = string.Empty
        };

        korisnik.Lozinka = _passwordHasher.HashPassword(
            korisnik,
            request.Lozinka);

        var klijent = new Klijent
        {
            KorisnikId = korisnikId
        };

        _korisnikRepository.AddKlijent(
            korisnik,
            klijent);

        await _korisnikRepository.SaveChanges(
            cancellationToken);

        return new KreiranjeKlijentaResponseDto
        {
            KorisnikId = korisnik.KorisnikId,
            Ime = korisnik.Ime,
            Prezime = korisnik.Prezime,
            Email = korisnik.Email
        };
    }
}