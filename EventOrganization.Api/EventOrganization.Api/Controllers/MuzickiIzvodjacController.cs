using System.Security.Claims;
using EventOrganization.Api.DTOs.MuzickiIzvodjaci;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventOrganization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "MENADZER")]
public class MuzickiIzvodjacController : ControllerBase
{
    private readonly MuzickiIzvodjacService
        _muzickiIzvodjacService;

    private readonly RestoranService
        _restoranService;

    public MuzickiIzvodjacController(
        MuzickiIzvodjacService muzickiIzvodjacService,
        RestoranService restoranService)
    {
        _muzickiIzvodjacService =
            muzickiIzvodjacService;

        _restoranService =
            restoranService;
    }

    [HttpGet("restoran/{restoranId}")]
    public async Task<ActionResult<List<MuzickiIzvodjacDto>>>
        GetByRestoranId(
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

        var izvodjaci =
            await _muzickiIzvodjacService.GetByRestoranId(
                restoranId,
                cancellationToken);

        return Ok(izvodjaci);
    }

    [HttpPost("restoran/{restoranId}")]
    public async Task<ActionResult<MuzickiIzvodjacDto>> Add(
        decimal restoranId,
        DodavanjeMuzickogIzvodjacaDto request,
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
            var izvodjac =
                await _muzickiIzvodjacService.Add(
                    restoranId,
                    request,
                    cancellationToken);

            return Ok(izvodjac);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(
                exception.Message);
        }
    }

    [HttpPut("restoran/{restoranId}/{uslugaId}")]
    public async Task<ActionResult<MuzickiIzvodjacDto>> Update(
        decimal restoranId,
        decimal uslugaId,
        IzmenaMuzickogIzvodjacaDto request,
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
            var izvodjac =
                await _muzickiIzvodjacService.Update(
                    restoranId,
                    uslugaId,
                    request,
                    cancellationToken);

            if (izvodjac is null)
            {
                return NotFound(
                    "Muzički izvođač nije pronađen.");
            }

            return Ok(izvodjac);
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
            await _muzickiIzvodjacService.Delete(
                restoranId,
                uslugaId,
                cancellationToken);

        if (!obrisan)
        {
            return NotFound(
                "Muzički izvođač nije pronađen.");
        }

        return NoContent();
    }
}