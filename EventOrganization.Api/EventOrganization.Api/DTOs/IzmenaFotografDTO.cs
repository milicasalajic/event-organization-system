namespace EventOrganization.Api.DTOs.Fotografi;

public class IzmenaFotografaDto
{
    public string Naziv { get; set; } = null!;

    public string Telefon { get; set; } = null!;

    public string? Portfolio { get; set; }

    public decimal CenaFoto { get; set; }

    public string TipFoto { get; set; } = null!;

    public List<decimal> PaketIds { get; set; } = [];
}