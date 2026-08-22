namespace EventOrganization.Api.DTOs.Fotografi;

public class FotografDto
{
    public decimal UslugaId { get; set; }

    public string Naziv { get; set; } = null!;

    public string Telefon { get; set; } = null!;

    public string? Portfolio { get; set; }

    public decimal CenaFoto { get; set; }

    public string TipFoto { get; set; } = null!;

    public List<decimal> PaketIds { get; set; } = [];
}