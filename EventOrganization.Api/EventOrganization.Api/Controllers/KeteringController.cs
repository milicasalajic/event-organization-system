using System.Security.Claims;
using EventOrganization.Api.DTOs.Usluge;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventOrganization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "MENADZER")]
public class KeteringController : ControllerBase
{
    private readonly KeteringService _keteringService;
    private readonly RestoranService _restoranService;

    public KeteringController(
        KeteringService keteringService,
        RestoranService restoranService)
    {
        _keteringService = keteringService;
        _restoranService = restoranService;
    }

    [HttpGet("restoran/{restoranId}")]
    public async Task<ActionResult<List<KeteringFirmaDto>>> GetByRestoranId(
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

        var keteringFirme =
            await _keteringService.GetByRestoranId(
                restoranId,
                cancellationToken);

        return Ok(keteringFirme);
    }

    [HttpPost("restoran/{restoranId}")]
    public async Task<ActionResult<KeteringFirmaDto>> Add(
        decimal restoranId,
        DodavanjeKeteringFirmeDto request,
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
            var keteringFirma =
                await _keteringService.Add(
                    restoranId,
                    request,
                    cancellationToken);

            return Ok(keteringFirma);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(
                exception.Message);
        }
    }

    [HttpPut("restoran/{restoranId}/{uslugaId}")]
    public async Task<ActionResult<KeteringFirmaDto>> Update(
        decimal restoranId,
        decimal uslugaId,
        IzmenaKeteringFirmeDto request,
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
            var keteringFirma =
                await _keteringService.Update(
                    restoranId,
                    uslugaId,
                    request,
                    cancellationToken);

            if (keteringFirma is null)
            {
                return NotFound(
                    "Ketering firma nije pronađena.");
            }

            return Ok(keteringFirma);
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
            await _keteringService.Delete(
                restoranId,
                uslugaId,
                cancellationToken);

        if (!obrisan)
        {
            return NotFound(
                "Ketering firma nije pronađena.");
        }

        return NoContent();
    }
}