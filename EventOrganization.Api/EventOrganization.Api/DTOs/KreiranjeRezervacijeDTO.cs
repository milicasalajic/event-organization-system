using EventOrganization.Api.Enums;

namespace EventOrganization.Api.DTOs.Rezervacije;

public class KreiranjeRezervacijeDto
{
    public decimal RestoranId { get; set; }

    public Dogadjaj TipDogadjaja { get; set; }

    public decimal BrGostiju { get; set; }

    public DateTime VremePocetka { get; set; }

    public DateTime VremeZavrsetka { get; set; }

    public decimal SalaId { get; set; }

    public decimal PaketId { get; set; }

    public List<decimal> UslugaIds { get; set; } = [];

    public string? Opis { get; set; }

    public string? Napomena { get; set; }
}