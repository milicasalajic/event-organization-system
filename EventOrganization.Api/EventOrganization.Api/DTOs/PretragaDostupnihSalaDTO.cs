namespace EventOrganization.Api.DTOs.Rezervacije;

public class PretragaDostupnihSalaDto
{
    public decimal PaketId { get; set; }

    public decimal BrGostiju { get; set; }

    public DateTime VremePocetka { get; set; }

    public DateTime VremeZavrsetka { get; set; }
}