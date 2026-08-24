namespace EventOrganization.Api.DTOs.Rezervacije;

public class ObracunUslugeDto
{
    public decimal UslugaId { get; set; }

    public string Naziv { get; set; } = null!;

    public string TipUsluge { get; set; } = null!;

    public decimal Cena { get; set; }
}