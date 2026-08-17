namespace EventOrganization.Api.DTOs.Paketi;

public class PaketDto
{
    public decimal PaketId { get; set; }

    public string Naziv { get; set; } = null!;

    public string? Opis { get; set; }
}