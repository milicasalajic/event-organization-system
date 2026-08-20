namespace EventOrganization.Api.DTOs.Restorani;

public class DodavanjeRestoranaDto
{
    public string Naziv { get; set; } = null!;

    public string Telefon { get; set; } = null!;

    public string RadnoVreme { get; set; } = null!;

    public string Adresa { get; set; } = null!;

    public string Grad { get; set; } = null!;
}