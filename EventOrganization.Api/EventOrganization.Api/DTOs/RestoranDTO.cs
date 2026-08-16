namespace EventOrganization.Api.DTOs.Restorani;

public class RestoranDto
{
    public decimal RestoranId { get; set; }

    public string Naziv { get; set; } = null!;

    public string Adresa { get; set; } = null!;

    public string Grad { get; set; } = null!;

    public string Telefon { get; set; } = null!;

}