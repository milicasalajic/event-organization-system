using System.Security.Claims;
using EventOrganization.Api.DTOs.Usluge;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventOrganization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UslugaController : ControllerBase
{
    private readonly UslugaService _uslugaService;
    private readonly RestoranService _restoranService;

    public UslugaController(
        UslugaService uslugaService,
        RestoranService restoranService)
    {
        _uslugaService = uslugaService;
        _restoranService = restoranService;
    }

    [Authorize]
    [HttpGet("restoran/{restoranId}/paket/{paketId}")]
    public async Task<ActionResult<List<UslugaDto>>> GetByPaketId(
        decimal restoranId,
        decimal paketId,
        CancellationToken cancellationToken)
    {
        var korisnikIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(
                korisnikIdClaim,
                out var korisnikId))
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

        var usluge = await _uslugaService.GetByPaketId(
            restoranId,
            paketId,
            cancellationToken);

        return Ok(usluge);
    }
}