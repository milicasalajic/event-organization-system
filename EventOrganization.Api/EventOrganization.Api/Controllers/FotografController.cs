using EventOrganization.Api.DTOs.Fotografi;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventOrganization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "MENADZER")]
public class FotografController : ControllerBase
{
    private readonly FotografService _fotografService;
    private readonly RestoranService _restoranService;

    public FotografController(
        FotografService fotografService,
        RestoranService restoranService)
    {
        _fotografService =
            fotografService;

        _restoranService =
            restoranService;
    }

    [HttpGet("restoran/{restoranId}")]
    public async Task<ActionResult<List<FotografDto>>> GetByRestoranId(
        decimal restoranId,
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

        var korisnikRadiURestoranu =
            await _restoranService.KorisnikRadiURestoranu(
                korisnikId,
                restoranId,
                cancellationToken);

        if (!korisnikRadiURestoranu)
        {
            return Forbid();
        }

        var fotografi =
            await _fotografService.GetByRestoranId(
                restoranId,
                cancellationToken);

        return Ok(fotografi);
    }

    [HttpPost("restoran/{restoranId}")]
    public async Task<ActionResult<FotografDto>> Add(
        decimal restoranId,
        DodavanjeFotografaDto request,
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

        var korisnikRadiURestoranu =
            await _restoranService.KorisnikRadiURestoranu(
                korisnikId,
                restoranId,
                cancellationToken);

        if (!korisnikRadiURestoranu)
        {
            return Forbid();
        }

        try
        {
            var fotograf =
                await _fotografService.Add(
                    restoranId,
                    request,
                    cancellationToken);

            return Ok(fotograf);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(
                exception.Message);
        }
    }

    [HttpPut("restoran/{restoranId}/{uslugaId}")]
    public async Task<ActionResult<FotografDto>> Update(
        decimal restoranId,
        decimal uslugaId,
        IzmenaFotografaDto request,
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

        var korisnikRadiURestoranu =
            await _restoranService.KorisnikRadiURestoranu(
                korisnikId,
                restoranId,
                cancellationToken);

        if (!korisnikRadiURestoranu)
        {
            return Forbid();
        }

        try
        {
            var fotograf =
                await _fotografService.Update(
                    restoranId,
                    uslugaId,
                    request,
                    cancellationToken);

            if (fotograf is null)
            {
                return NotFound(
                    "Fotograf nije pronađen.");
            }

            return Ok(fotograf);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(
                exception.Message);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(
                exception.Message);
        }
    }

    [HttpDelete("restoran/{restoranId}/{uslugaId}")]
    public async Task<IActionResult> Delete(
        decimal restoranId,
        decimal uslugaId,
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

        var korisnikRadiURestoranu =
            await _restoranService.KorisnikRadiURestoranu(
                korisnikId,
                restoranId,
                cancellationToken);

        if (!korisnikRadiURestoranu)
        {
            return Forbid();
        }

        var obrisan =
            await _fotografService.Delete(
                restoranId,
                uslugaId,
                cancellationToken);

        if (!obrisan)
        {
            return NotFound(
                "Fotograf nije pronađen.");
        }

        return NoContent();
    }
}