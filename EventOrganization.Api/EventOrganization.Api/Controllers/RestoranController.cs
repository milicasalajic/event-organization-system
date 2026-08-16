using System.Security.Claims;
using EventOrganization.Api.DTOs.Restorani;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventOrganization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestoranController : ControllerBase
{
    private readonly RestoranService _restoranService;

    public RestoranController(
        RestoranService restoranService)
    {
        _restoranService = restoranService;
    }

    [Authorize(Roles = "ADMINISTRATOR, KLIJENT")]
    [HttpGet]
    public async Task<ActionResult<List<RestoranDto>>> GetAll(
        CancellationToken cancellationToken)
    {
        var restorani = await _restoranService.GetAll(
            cancellationToken);

        return Ok(restorani);
    }
    [Authorize(Roles = "MENADZER,OPERATER")]
    [HttpGet("moj")]
    public async Task<ActionResult<RestoranDto>> GetMojRestoran(
    CancellationToken cancellationToken)
    {
        var korisnikIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        if (!decimal.TryParse(korisnikIdClaim, out var korisnikId))
        {
            return Unauthorized();
        }

        var restoran = await _restoranService.GetMojRestoran(
            korisnikId,
            cancellationToken);

        if (restoran is null)
        {
            return NotFound(
                "Restoran za prijavljenog korisnika nije pronađen.");
        }

        return Ok(restoran);
    }
}