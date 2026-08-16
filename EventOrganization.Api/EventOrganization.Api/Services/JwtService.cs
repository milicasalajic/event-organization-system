using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EventOrganization.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace EventOrganization.Api.Services;

public class JwtService
{
    private readonly IConfiguration _configuration; //citanje konfiguracije za app, najvesce applicaton.json, ovde za citanje jwt

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(Korisnik korisnik)
    {
        var key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "JWT ključ nije konfigurisan.");
        /*"Jwt": {
  "Key": "neki-dugacak-tajni-kljuc",
  "Issuer": "EventOrganizationApi",
  "Audience": "EventOrganizationClient"
}*/

        var issuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException(
                "JWT issuer nije konfigurisan.");

        var audience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException(
                "JWT audience nije konfigurisan.");

        var claims = new List<Claim>//claims-info o korisniku, stavljanje tih info u jwt
        {
            new(
                ClaimTypes.NameIdentifier,
                korisnik.KorisnikId.ToString()),

            new(
                ClaimTypes.Email,
                korisnik.Email),

            new(
                ClaimTypes.Name,
                $"{korisnik.Ime} {korisnik.Prezime}"),

            new(
                ClaimTypes.Role,
                korisnik.Uloga.TipUloge.ToString())
        };

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key));

        var credentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}