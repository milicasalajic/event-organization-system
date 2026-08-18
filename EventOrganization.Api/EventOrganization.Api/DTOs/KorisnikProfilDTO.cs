namespace EventOrganization.Api.DTOs.Korisnici;

public class KorisnikProfilDto
{
    public decimal KorisnikId { get; set; }

    public string Ime { get; set; } = null!;

    public string Prezime { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Telefon { get; set; }
}