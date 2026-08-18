using System.Security.Claims;
using EventOrganization.Api.DTOs.Rezervacije;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventOrganization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RezervacijaController : ControllerBase
{
    private readonly RezervacijaService _rezervacijaService;
    private readonly RestoranService _restoranService;

    public RezervacijaController(
        RezervacijaService rezervacijaService,
        RestoranService restoranService)
    {
        _rezervacijaService =
            rezervacijaService;

        _restoranService =
            restoranService;
    }

    [Authorize(Roles = "MENADZER,OPERATER")]
    [HttpGet("restoran/{restoranId}")]
    public async Task<ActionResult<List<RezervacijaPregledDto>>>
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
            await _restoranService
                .KorisnikRadiURestoranu(
                    korisnikId,
                    restoranId,
                    cancellationToken);

        if (!korisnikRadiURestoranu)
        {
            return Forbid();
        }

        var rezervacije =
            await _rezervacijaService
                .GetByRestoranId(
                    restoranId,
                    cancellationToken);

        return Ok(rezervacije);
    }

    [Authorize(Roles = "MENADZER,OPERATER")]
    [HttpGet("restoran/{restoranId}/{rezervacijaId}")]
    public async Task<ActionResult<RezervacijaDetaljiDto>>
        GetDetalji(
            decimal restoranId,
            decimal rezervacijaId,
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
            await _restoranService
                .KorisnikRadiURestoranu(
                    korisnikId,
                    restoranId,
                    cancellationToken);

        if (!korisnikRadiURestoranu)
        {
            return Forbid();
        }

        var rezervacija =
            await _rezervacijaService.GetDetalji(
                restoranId,
                rezervacijaId,
                cancellationToken);

        if (rezervacija is null)
        {
            return NotFound(
                "Rezervacija nije pronađena.");
        }

        return Ok(rezervacija);
    }

    [Authorize(Roles = "MENADZER,OPERATER")]
    [HttpPatch(
        "restoran/{restoranId}/{rezervacijaId}/obrada")]
    public async Task<ActionResult<RezervacijaDetaljiDto>>
        ObradiRezervaciju(
            decimal restoranId,
            decimal rezervacijaId,
            ObradaRezervacijeDto request,
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
            await _restoranService
                .KorisnikRadiURestoranu(
                    korisnikId,
                    restoranId,
                    cancellationToken);

        if (!korisnikRadiURestoranu)
        {
            return Forbid();
        }

        try
        {
            var rezervacija =
                await _rezervacijaService
                    .ObradiRezervaciju(
                        restoranId,
                        rezervacijaId,
                        request,
                        cancellationToken);

            if (rezervacija is null)
            {
                return NotFound(
                    "Rezervacija nije pronađena.");
            }

            return Ok(rezervacija);
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
}