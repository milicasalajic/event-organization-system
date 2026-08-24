using EventOrganization.Api.Enums;

namespace EventOrganization.Api.DTOs.Rezervacije;

public class PretragaDostupnihSalaDto
{
    public Dogadjaj TipDogadjaja { get; set; }

    public decimal BrGostiju { get; set; }

    public DateTime VremePocetka { get; set; }

    public DateTime VremeZavrsetka { get; set; }
}