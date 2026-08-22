namespace EventOrganization.Api.DTOs.DekoraterskeFirme;

public class DodavanjeDekoraterskeFirmeDto
{
	public string Naziv { get; set; } = null!;

	public string Telefon { get; set; } = null!;

	public string? Portfolio { get; set; }

	public string? Opis { get; set; }

	public List<decimal> PaketIds { get; set; } = [];
}