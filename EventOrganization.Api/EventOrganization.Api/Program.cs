using System.Text;
using EventOrganization.Api.Models;
using EventOrganization.Api.Repositories;
using EventOrganization.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<EventOrganizationDbContext>(options =>
    options.UseOracle(
        builder.Configuration.GetConnectionString("EventOrganization")));

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<RestoranRepository>();
builder.Services.AddScoped<RestoranService>();
builder.Services.AddScoped<PaketRepository>();
builder.Services.AddScoped<PaketService>();
builder.Services.AddScoped<SalaRepository>();
builder.Services.AddScoped<SalaService>();
builder.Services.AddScoped<UslugaRepository>();
builder.Services.AddScoped<UslugaService>();
builder.Services.AddScoped<KorisnikRepository>();
builder.Services.AddScoped<KorisnikService>();
builder.Services.AddScoped<RezervacijaRepository>();
builder.Services.AddScoped<RezervacijaService>();
builder.Services.AddScoped<FotografRepository>();
builder.Services.AddScoped<FotografService>();
builder.Services.AddScoped<KeteringRepository>();
builder.Services.AddScoped<KeteringService>();
builder.Services.AddScoped<DekoraterskaFirmaRepository>();
builder.Services.AddScoped<DekoraterskaFirmaService>();
builder.Services.AddScoped<MuzickiIzvodjacRepository>();
builder.Services.AddScoped<MuzickiIzvodjacService>();
builder.Services.AddScoped<CenovnikRepository>();
builder.Services.AddScoped<CenovnikService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5174")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "JWT ključ nije konfigurisan.");

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "JWT issuer nije konfigurisan.");

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "JWT audience nije konfigurisan.");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)),

                ClockSkew = TimeSpan.Zero
            };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var rezervacijaService =
        scope.ServiceProvider
            .GetRequiredService<RezervacijaService>();

    await rezervacijaService
        .RealizujIstekleRezervacije();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


app.Run();