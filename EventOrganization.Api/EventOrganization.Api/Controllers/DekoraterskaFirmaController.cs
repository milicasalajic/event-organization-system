using System.Security.Claims;
using EventOrganization.Api.DTOs.DekoraterskeFirme;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventOrganization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "MENADZER")]
public class DekoraterskaFirmaController : ControllerBase
{
    private readonly DekoraterskaFirmaService
        _dekoraterskaFirmaService;

    private readonly RestoranService
        _restoranService;

    public DekoraterskaFirmaController(
        DekoraterskaFirmaService dekoraterskaFirmaService,
        RestoranService restoranService)
    {
        _dekoraterskaFirmaService =
            dekoraterskaFirmaService;

        _restoranService =
            restoranService;
    }

    [HttpGet("restoran/{restoranId}")]
    public async Task<ActionResult<List<DekoraterskaFirmaDto>>>
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

        var dekoraterskeFirme =
            await _dekoraterskaFirmaService.GetByRestoranId(
                restoranId,
                cancellationToken);

        return Ok(dekoraterskeFirme);
    }

    [HttpPost("restoran/{restoranId}")]
    public async Task<ActionResult<DekoraterskaFirmaDto>> Add(
        decimal restoranId,
        DodavanjeDekoraterskeFirmeDto request,
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
            var dekoraterskaFirma =
                await _dekoraterskaFirmaService.Add(
                    restoranId,
                    request,
                    cancellationToken);

            return Ok(dekoraterskaFirma);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(
                exception.Message);
        }
    }

    [HttpPut("restoran/{restoranId}/{uslugaId}")]
    public async Task<ActionResult<DekoraterskaFirmaDto>> Update(
        decimal restoranId,
        decimal uslugaId,
        IzmenaDekoraterskeFirmeDto request,
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
            var dekoraterskaFirma =
                await _dekoraterskaFirmaService.Update(
                    restoranId,
                    uslugaId,
                    request,
                    cancellationToken);

            if (dekoraterskaFirma is null)
            {
                return NotFound(
                    "Dekoraterska firma nije pronađena.");
            }

            return Ok(dekoraterskaFirma);
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

        var obrisana =
            await _dekoraterskaFirmaService.Delete(
                restoranId,
                uslugaId,
                cancellationToken);

        if (!obrisana)
        {
            return NotFound(
                "Dekoraterska firma nije pronađena.");
        }

        return NoContent();
    }
}