namespace EventOrganization.Api.DTOs.MuzickiIzvodjaci;

public class MuzickiIzvodjacDto
{
    public decimal UslugaId { get; set; }

    public string Naziv { get; set; } = null!;

    public string Telefon { get; set; } = null!;

    public string? Portfolio { get; set; }

    public string TipMuzicara { get; set; } = null!;

    public List<decimal> PaketIds { get; set; } = [];
}