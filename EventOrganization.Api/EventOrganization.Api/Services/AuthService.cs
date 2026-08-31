using EventOrganization.Api.DTOs.Auth;
using EventOrganization.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EventOrganization.Api.Services;

public class AuthService
{
    private readonly EventOrganizationDbContext _context;
    private readonly JwtService _jwtService;
    private readonly PasswordHasher<Korisnik> _passwordHasher;

    public AuthService(
        EventOrganizationDbContext context,
        JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
        _passwordHasher = new PasswordHasher<Korisnik>();
    }

    public async Task<LoginResponseDto?> Login(
        LoginRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var korisnik = await _context.Korisnici
            .Include(k => k.Uloga)
            .Include(k => k.Radnik)
            .FirstOrDefaultAsync(
                k => k.Email == request.Email,
                cancellationToken);

        if (korisnik is null)
        {
            return null;
        }

        var rezultat = _passwordHasher.VerifyHashedPassword(
            korisnik,
            korisnik.Lozinka,
            request.Lozinka);

        if (rezultat == PasswordVerificationResult.Failed)
        {
            return null;
        }

        var token = _jwtService.GenerateToken(korisnik);

        return new LoginResponseDto
        {
            Token = token,
            KorisnikId = korisnik.KorisnikId,
            Ime = korisnik.Ime,
            Prezime = korisnik.Prezime,
            Email = korisnik.Email,
            Uloga = korisnik.Uloga.TipUloge.ToString(),
            RestoranId = korisnik.Radnik?.RestoranId
        };
    }
}