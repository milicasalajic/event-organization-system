namespace EventOrganization.Api.DTOs.Usluge;

public class DodavanjeKeteringFirmeDto
{
    public string Naziv { get; set; } = null!;

    public string Telefon { get; set; } = null!;

    public string? Portfolio { get; set; }

    public string? Opis { get; set; }

    public List<decimal> PaketIds { get; set; } = [];
}