namespace EventOrganization.Api.DTOs.Rezervacije;

public class KreiranjeRezervacijeDto
{
    public decimal RestoranId { get; set; }

    public decimal PaketId { get; set; }

    public decimal SalaId { get; set; }

    public decimal TipDogadjajaId { get; set; }

    public decimal BrGostiju { get; set; }

    public DateTime VremePocetka { get; set; }

    public DateTime VremeZavrsetka { get; set; }

    public string? Opis { get; set; }

    public string? Napomena { get; set; }

    public List<decimal> UslugaIds { get; set; } = [];
}