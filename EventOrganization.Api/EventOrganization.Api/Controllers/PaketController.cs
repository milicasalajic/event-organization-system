using EventOrganization.Api.DTOs.Paketi;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class PaketController : ControllerBase
{
    private readonly PaketService _paketService;
    private readonly RestoranService _restoranService;

    public PaketController(
        PaketService paketService,
        RestoranService restoranService)
    {
        _paketService = paketService;
        _restoranService = restoranService;
    }

    [Authorize]
    [HttpGet("restoran/{restoranId}")]
    public async Task<ActionResult<List<PaketDto>>> GetByRestoranId(
    decimal restoranId,
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

        var paketi = await _paketService.GetByRestoranId(
            restoranId,
            cancellationToken);

        return Ok(paketi);
    }
    [Authorize(Roles = "MENADZER")]
    [HttpDelete(
        "restoran/{restoranId}/{paketId}")]
    public async Task<IActionResult> Delete(
        decimal restoranId,
        decimal paketId,
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

        var radiURestoranu =
            await _restoranService
                .KorisnikRadiURestoranu(
                    korisnikId,
                    restoranId,
                    cancellationToken);

        if (!radiURestoranu)
        {
            return Forbid();
        }

        var obrisan =
            await _paketService.Delete(
                restoranId,
                paketId,
                cancellationToken);

        if (!obrisan)
        {
            return NotFound(
                "Paket nije pronađen.");
        }

        return NoContent();
    }
    [Authorize(Roles = "MENADZER")]
    [HttpPut(
       "restoran/{restoranId}/{paketId}")]
    public async Task<ActionResult<PaketDto>>
       Update(
           decimal restoranId,
           decimal paketId,
           IzmenaPaketaDto request,
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

        var radiURestoranu =
            await _restoranService
                .KorisnikRadiURestoranu(
                    korisnikId,
                    restoranId,
                    cancellationToken);

        if (!radiURestoranu)
        {
            return Forbid();
        }

        try
        {
            var paket =
                await _paketService.Update(
                    restoranId,
                    paketId,
                    request,
                    cancellationToken);

            if (paket is null)
            {
                return NotFound(
                    "Paket nije pronađen.");
            }

            return Ok(paket);
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
    [Authorize(Roles = "MENADZER")]
    [HttpPost("restoran/{restoranId}")]
    public async Task<ActionResult<PaketDto>>
        Add(
            decimal restoranId,
            DodavanjePaketaDto request,
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

        var radiURestoranu =
            await _restoranService
                .KorisnikRadiURestoranu(
                    korisnikId,
                    restoranId,
                    cancellationToken);

        if (!radiURestoranu)
        {
            return Forbid();
        }

        try
        {
            var paket =
                await _paketService.Add(
                    restoranId,
                    request,
                    cancellationToken);

            return Ok(paket);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(
                exception.Message);
        }
    }

}