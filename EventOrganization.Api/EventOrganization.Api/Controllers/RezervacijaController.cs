using System.Security.Claims;
using EventOrganization.Api.DTOs.Rezervacije;
using EventOrganization.Api.Enums;
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
        _rezervacijaService = rezervacijaService;
        _restoranService = restoranService;
    }

    [Authorize(Roles = "MENADZER,OPERATER")]
    [HttpGet("restoran/{restoranId}")]
    public async Task<ActionResult<List<RezervacijaPregledDto>>> GetByRestoranId(
        decimal restoranId,
        CancellationToken cancellationToken)
    {
        var korisnikIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(korisnikIdClaim, out var korisnikId))
        {
            return Unauthorized();
        }

        var korisnikRadiURestoranu = await _restoranService.KorisnikRadiURestoranu(
            korisnikId,
            restoranId,
            cancellationToken);

        if (!korisnikRadiURestoranu)
        {
            return Forbid();
        }

        var rezervacije = await _rezervacijaService.GetByRestoranId(
            restoranId,
            cancellationToken);

        return Ok(rezervacije);
    }

    [Authorize(Roles = "MENADZER,OPERATER")]
    [HttpGet("restoran/{restoranId}/{rezervacijaId}")]
    public async Task<ActionResult<RezervacijaDetaljiDto>> GetDetalji(
        decimal restoranId,
        decimal rezervacijaId,
        CancellationToken cancellationToken)
    {
        var korisnikIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(korisnikIdClaim, out var korisnikId))
        {
            return Unauthorized();
        }

        var korisnikRadiURestoranu = await _restoranService.KorisnikRadiURestoranu(
            korisnikId,
            restoranId,
            cancellationToken);

        if (!korisnikRadiURestoranu)
        {
            return Forbid();
        }

        var rezervacija = await _rezervacijaService.GetDetalji(
            restoranId,
            rezervacijaId,
            cancellationToken);

        if (rezervacija is null)
        {
            return NotFound("Rezervacija nije pronađena.");
        }

        return Ok(rezervacija);
    }

    [Authorize(Roles = "MENADZER,OPERATER")]
    [HttpPatch("restoran/{restoranId}/{rezervacijaId}/obrada")]
    public async Task<ActionResult<RezervacijaDetaljiDto>> ObradiRezervaciju(
        decimal restoranId,
        decimal rezervacijaId,
        StatusRez noviStatus,
        CancellationToken cancellationToken)
    {
        var korisnikIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(korisnikIdClaim, out var korisnikId))
        {
            return Unauthorized();
        }

        var korisnikRadiURestoranu = await _restoranService.KorisnikRadiURestoranu(
            korisnikId,
            restoranId,
            cancellationToken);

        if (!korisnikRadiURestoranu)
        {
            return Forbid();
        }

        try
        {
            var rezervacija = await _rezervacijaService.ObradiRezervaciju(
                restoranId,
                rezervacijaId,
                noviStatus,
                cancellationToken);

            if (rezervacija is null)
            {
                return NotFound("Rezervacija nije pronađena.");
            }

            return Ok(rezervacija);
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [Authorize(Roles = "KLIJENT")]
    [HttpPost("restoran/{restoranId}/dostupne-sale")]
    public async Task<ActionResult<List<DostupnaSalaDto>>> GetDostupneSale(
        decimal restoranId,
        PretragaDostupnihSalaDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            var sale = await _rezervacijaService.GetDostupneSale(
                restoranId,
                request,
                cancellationToken);

            return Ok(sale);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [Authorize(Roles = "KLIJENT")]
    [HttpPost("obracun")]
    public async Task<ActionResult<decimal>> Obracun(
        KreiranjeRezervacijeDto request,
        CancellationToken cancellationToken)
    {
        try
        {
            var ukupnaCena = await _rezervacijaService.Obracun(
                request,
                cancellationToken);

            return Ok(ukupnaCena);
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

    [Authorize(Roles = "KLIJENT")]
    [HttpPost]
    public async Task<ActionResult<KreiranjeRezervacijeResponseDto>> KreirajRezervaciju(
        KreiranjeRezervacijeDto request,
        CancellationToken cancellationToken)
    {
        // Bitno je ko kreira rezervaciju
        var korisnikIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Claim iz tokena je string, pa ga pretvaramo u decimal
        if (!decimal.TryParse(korisnikIdClaim, out var korisnikId))
        {
            return Unauthorized();
        }

        try
        {
            var rezervacija = await _rezervacijaService.KreirajRezervaciju(
                korisnikId,
                request,
                cancellationToken);

            return Ok(rezervacija);
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

    [Authorize(Roles = "KLIJENT")]
    [HttpGet("moje")]
    public async Task<ActionResult<List<MojaRezervacijaDto>>> GetMojeRezervacije(
        CancellationToken cancellationToken)
    {
        var korisnikIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(korisnikIdClaim, out var korisnikId))
        {
            return Unauthorized();
        }

        var rezervacije = await _rezervacijaService.GetMojeRezervacije(
            korisnikId,
            cancellationToken);

        return Ok(rezervacije);
    }
}