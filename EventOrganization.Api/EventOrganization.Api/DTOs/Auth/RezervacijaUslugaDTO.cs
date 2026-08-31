namespace EventOrganization.Api.DTOs.Rezervacije;

public class RezervacijaUslugaDto
{
    public decimal StavkaId { get; set; }
    public decimal UslugaId { get; set; }
    public string Naziv { get; set; } = string.Empty;
    public string TipUsluge { get; set; } = string.Empty;
}