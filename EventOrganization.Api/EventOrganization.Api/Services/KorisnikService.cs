using EventOrganization.Api.DTOs.Korisnici;
using EventOrganization.Api.Repositories;

namespace EventOrganization.Api.Services;

public class KorisnikService
{
	private readonly KorisnikRepository _korisnikRepository;

	public KorisnikService(
		KorisnikRepository korisnikRepository)
	{
		_korisnikRepository = korisnikRepository;
	}

	public async Task<KorisnikProfilDto?> GetProfil(
		decimal korisnikId,
		CancellationToken cancellationToken = default)
	{
		var korisnik =
			await _korisnikRepository.GetById(
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
		var korisnik =
			await _korisnikRepository.GetById(
				korisnikId,
				cancellationToken);

		if (korisnik is null)
		{
			return null;
		}

		var emailPostoji =
			await _korisnikRepository
				.EmailPostojiZaDrugogKorisnika(
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

		await _korisnikRepository.SaveChanges(
			cancellationToken);

		return new KorisnikProfilDto
		{
			KorisnikId = korisnik.KorisnikId,
			Ime = korisnik.Ime,
			Prezime = korisnik.Prezime,
			Email = korisnik.Email,
			Telefon = korisnik.Telefon
		};
	}
}