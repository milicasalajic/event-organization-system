namespace EventOrganization.Api.DTOs.Korisnici;

public class IzmenaKorisnikProfilDto
{
    public string Ime { get; set; } = null!;

    public string Prezime { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Telefon { get; set; }
}