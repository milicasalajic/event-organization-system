namespace EventOrganization.Api.DTOs.Cenovnik;

public class CenovnikStavkaDto
{
    public decimal CenovnikId { get; set; }

    public decimal? SalaId { get; set; }

    public decimal? UslugaId { get; set; }

    public string Naziv { get; set; } = null!;

    public string Vrsta { get; set; } = null!;

    public decimal Iznos { get; set; }

    public DateTime DatumIzmene { get; set; }

    public bool Vazeca { get; set; }
}