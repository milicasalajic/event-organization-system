namespace EventOrganization.Api.DTOs.Auth;

public class LoginRequestDto
{
    public string Email { get; set; } = null!;

    public string Lozinka { get; set; } = null!;
}