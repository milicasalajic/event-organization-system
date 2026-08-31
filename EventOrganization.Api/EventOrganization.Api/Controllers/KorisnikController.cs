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

    public KorisnikController(KorisnikService korisnikService)
    {
        _korisnikService = korisnikService;
    }

    [HttpGet("profil")]
    public async Task<ActionResult<KorisnikProfilDto>> GetProfil(
        CancellationToken cancellationToken)
    {
        var korisnikIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(korisnikIdClaim, out var korisnikId))
        {
            return Unauthorized();
        }

        var profil = await _korisnikService.GetProfil(
            korisnikId,
            cancellationToken);

        if (profil is null)
        {
            return NotFound("Korisnik nije pronađen.");
        }

        return Ok(profil);
    }

    [HttpPut("profil")]
    public async Task<ActionResult<KorisnikProfilDto>> IzmeniProfil(
        IzmenaKorisnikProfilDto request,
        CancellationToken cancellationToken)
    {
        var korisnikIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(korisnikIdClaim, out var korisnikId))
        {
            return Unauthorized();
        }

        try
        {
            var profil = await _korisnikService.IzmeniProfil(
                korisnikId,
                request,
                cancellationToken);

            if (profil is null)
            {
                return NotFound("Korisnik nije pronađen.");
            }

            return Ok(profil);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(exception.Message);
        }
    }
    [Authorize(Roles = "MENADZER,OPERATER")]
    [HttpGet("klijenti")]
    public async Task<ActionResult<List<KlijentPregledDto>>> GetKlijenti(
    CancellationToken cancellationToken)
    {
        var klijenti = await _korisnikService.GetKlijenti(cancellationToken);
        return Ok(klijenti);
    }
    [Authorize(Roles = "MENADZER,OPERATER")]
    [HttpPost("klijenti")]
    public async Task<ActionResult<KreiranjeKlijentaResponseDto>> KreirajKlijenta(
    KreiranjeKlijentaDto request,
    CancellationToken cancellationToken)
    {
        try
        {
            var klijent = await _korisnikService.KreirajKlijenta(
                request,
                cancellationToken);

            return Ok(klijent);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(exception.Message);
        }
    }
    [Authorize]
    [HttpPut("lozinka")]
    public async Task<IActionResult> IzmeniLozinku(
    IzmenaLozinkeDto request,
    CancellationToken cancellationToken)
    {
        var korisnikIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(korisnikIdClaim, out var korisnikId))
        {
            return Unauthorized();
        }

        try
        {
            await _korisnikService.IzmeniLozinku(
                korisnikId,
                request,
                cancellationToken);

            return NoContent();
        }
        catch (ArgumentException exception)
        {
            return BadRequest(exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(exception.Message);
        }
    }
}