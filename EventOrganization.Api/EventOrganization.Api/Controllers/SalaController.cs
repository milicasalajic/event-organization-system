using System.Security.Claims;
using EventOrganization.Api.DTOs.Sale;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventOrganization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalaController : ControllerBase
{
    private readonly SalaService _salaService;
    private readonly RestoranService _restoranService;

    public SalaController(
        SalaService salaService,
        RestoranService restoranService)
    {
        _salaService = salaService;
        _restoranService = restoranService;
    }

    [Authorize]
    [HttpGet("restoran/{restoranId}/paket/{paketId}")]
    public async Task<ActionResult<List<SalaDto>>> GetByPaketId(
        decimal restoranId,
        decimal paketId,
        CancellationToken cancellationToken)
    {
        var korisnikIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(korisnikIdClaim, out var korisnikId))
        {
            return Unauthorized();
        }

        var uloga = User.FindFirst(
            ClaimTypes.Role)?.Value;

        if (uloga is "MENADZER" or "OPERATER")
        {
            var korisnikRadiURestoranu =
                await _restoranService.KorisnikRadiURestoranu(
                    korisnikId,
                    restoranId,
                    cancellationToken);

            if (!korisnikRadiURestoranu)
            {
                return Forbid();
            }
        }

        var sale = await _salaService.GetByPaketId(
            restoranId,
            paketId,
            cancellationToken);

        return Ok(sale);
    }
    [HttpGet("restoran/{restoranId}")]
    public async Task<ActionResult<List<SalaDto>>> GetByRestoranId(
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

        var sale =
            await _salaService.GetByRestoranId(
                restoranId,
                cancellationToken);

        return Ok(sale);
    }
    [HttpPost("restoran/{restoranId}")]
    public async Task<ActionResult<SalaDto>> Add(
          decimal restoranId,
          DodavanjeSaleDto request,
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
            var sala =
                await _salaService.Add(
                    restoranId,
                    request,
                    cancellationToken);

            return Ok(sala);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(
                exception.Message);
        }
    }
    [HttpPut("restoran/{restoranId}/{salaId}")]
    public async Task<ActionResult<SalaDto>> Update(
       decimal restoranId,
       decimal salaId,
       IzmenaSaleDto request,
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
            var sala =
                await _salaService.Update(
                    restoranId,
                    salaId,
                    request,
                    cancellationToken);

            if (sala is null)
            {
                return NotFound(
                    "Sala nije pronađena.");
            }

            return Ok(sala);
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
    [HttpDelete("restoran/{restoranId}/{salaId}")]
    public async Task<IActionResult> Delete(
         decimal restoranId,
         decimal salaId,
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
            await _salaService.Delete(
                restoranId,
                salaId,
                cancellationToken);

        if (!obrisana)
        {
            return NotFound(
                "Sala nije pronađena.");
        }

        return NoContent();
    }
}