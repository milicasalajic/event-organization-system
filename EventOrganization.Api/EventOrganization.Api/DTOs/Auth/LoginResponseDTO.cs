namespace EventOrganization.Api.DTOs.Auth;

public class LoginResponseDto
{
    public string Token { get; set; } = null!;

    public decimal KorisnikId { get; set; }

    public string Ime { get; set; } = null!;

    public string Prezime { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Uloga { get; set; } = null!;
}