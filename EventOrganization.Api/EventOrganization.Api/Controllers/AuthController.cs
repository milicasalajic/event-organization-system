using EventOrganization.Api.DTOs.Auth;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventOrganization.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(
        LoginRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _authService.Login(
            request,
            cancellationToken);

        if (result is null)
        {
            return Unauthorized(
                "Email adresa ili lozinka nisu ispravni.");
        }

        return Ok(result);
    }
}