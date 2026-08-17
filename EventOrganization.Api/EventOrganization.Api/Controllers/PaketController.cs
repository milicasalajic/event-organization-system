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
}