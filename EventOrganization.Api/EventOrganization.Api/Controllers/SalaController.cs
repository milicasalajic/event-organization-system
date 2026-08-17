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
}