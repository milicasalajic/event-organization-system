using System.Security.Claims;
using EventOrganization.Api.DTOs.Korisnici;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventOrganization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class KorisnikController : ControllerBase
{
    private readonly KorisnikService _korisnikService;

    public KorisnikController(
        KorisnikService korisnikService)
    {
        _korisnikService = korisnikService;
    }

    [HttpGet("profil")]
    public async Task<ActionResult<KorisnikProfilDto>> GetProfil(
        CancellationToken cancellationToken)
    {
        var korisnikIdClaim =
            User.FindFirst(
                ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(
                korisnikIdClaim,
                out var korisnikId))
        {
            return Unauthorized();
        }

        var profil =
            await _korisnikService.GetProfil(
                korisnikId,
                cancellationToken);

        if (profil is null)
        {
            return NotFound(
                "Korisnik nije pronađen.");
        }

        return Ok(profil);
    }

    [HttpPut("profil")]
    public async Task<ActionResult<KorisnikProfilDto>> IzmeniProfil(
        IzmenaKorisnikProfilDto request,
        CancellationToken cancellationToken)
    {
        var korisnikIdClaim =
            User.FindFirst(
                ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(
                korisnikIdClaim,
                out var korisnikId))
        {
            return Unauthorized();
        }

        try
        {
            var profil =
                await _korisnikService.IzmeniProfil(
                    korisnikId,
                    request,
                    cancellationToken);

            if (profil is null)
            {
                return NotFound(
                    "Korisnik nije pronađen.");
            }

            return Ok(profil);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(exception.Message);
        }
    }
}