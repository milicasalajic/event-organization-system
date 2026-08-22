using System.Security.Claims;
using EventOrganization.Api.DTOs.Cenovnik;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventOrganization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "MENADZER,OPERATER")]
public class CenovnikController : ControllerBase
{
    private readonly CenovnikService _cenovnikService;
    private readonly RestoranService _restoranService;

    public CenovnikController(
        CenovnikService cenovnikService,
        RestoranService restoranService)
    {
        _cenovnikService = cenovnikService;
        _restoranService = restoranService;
    }

    [HttpGet("restoran/{restoranId}")]
    public async Task<ActionResult<List<CenovnikStavkaDto>>> GetByRestoranId(
        decimal restoranId,
        DateTime? datum,
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

        var radi =
            await _restoranService.KorisnikRadiURestoranu(
                korisnikId,
                restoranId,
                cancellationToken);

        if (!radi)
        {
            return Forbid();
        }

        var datumZaCenu =
            datum?.Date ??
            DateTime.Today;

        var cenovnik =
            await _cenovnikService.GetByRestoranId(
                restoranId,
                datumZaCenu,
                cancellationToken);

        return Ok(cenovnik);
    }

    [Authorize(Roles = "MENADZER")]
    [HttpPost("restoran/{restoranId}/sala/{salaId}")]
    public async Task<ActionResult<CenovnikStavkaDto>> AddCenaSale(
        decimal restoranId,
        decimal salaId,
        NovaCenaDto request,
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

        var radi =
            await _restoranService.KorisnikRadiURestoranu(
                korisnikId,
                restoranId,
                cancellationToken);

        if (!radi)
        {
            return Forbid();
        }

        try
        {
            var novaCena =
                await _cenovnikService.AddCenaSale(
                    restoranId,
                    salaId,
                    request,
                    cancellationToken);

            return Ok(novaCena);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(
                exception.Message);
        }
    }

    [Authorize(Roles = "MENADZER")]
    [HttpPost("restoran/{restoranId}/usluga/{uslugaId}")]
    public async Task<ActionResult<CenovnikStavkaDto>> AddCenaUsluge(
        decimal restoranId,
        decimal uslugaId,
        NovaCenaDto request,
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

        var radi =
            await _restoranService.KorisnikRadiURestoranu(
                korisnikId,
                restoranId,
                cancellationToken);

        if (!radi)
        {
            return Forbid();
        }

        try
        {
            var novaCena =
                await _cenovnikService.AddCenaUsluge(
                    restoranId,
                    uslugaId,
                    request,
                    cancellationToken);

            return Ok(novaCena);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(
                exception.Message);
        }
    }
}