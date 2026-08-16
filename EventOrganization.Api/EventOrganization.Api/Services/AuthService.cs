using EventOrganization.Api.DTOs.Auth;
using EventOrganization.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EventOrganization.Api.Services;

public class AuthService
{
	private readonly EventOrganizationDbContext _context;
	private readonly JwtService _jwtService;

	public AuthService(
		EventOrganizationDbContext context,
		JwtService jwtService)
	{
		_context = context;
		_jwtService = jwtService;
	}

	public async Task<LoginResponseDto?> Login(
		LoginRequestDto request,
		CancellationToken cancellationToken = default)
	{
		var korisnik = await _context.Korisnici
			.Include(k => k.Uloga) // za ucitavanje povezanog entiteta
			.FirstOrDefaultAsync(
				k => k.Email == request.Email,
				cancellationToken);

		if (korisnik is null)
		{
			return null;
		}

		if (korisnik.Lozinka != request.Lozinka)
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
			Uloga = korisnik.Uloga.TipUloge.ToString()
		};
	}
}