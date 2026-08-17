namespace EventOrganization.Api.DTOs.Usluge;

public class UslugaDto
{
    public decimal UslugaId { get; set; }

    public string? Naziv { get; set; }

    public string? Telefon { get; set; }

    public string? Portfolio { get; set; }

    public string TipUsluge { get; set; } = null!;

    public string? Opis { get; set; }

    public decimal? CenaFoto { get; set; }

    public string? TipFoto { get; set; }

    public string? TipMuzicara { get; set; }
}