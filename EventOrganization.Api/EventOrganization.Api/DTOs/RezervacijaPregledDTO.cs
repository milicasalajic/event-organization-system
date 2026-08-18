namespace EventOrganization.Api.DTOs.Rezervacije;

public class RezervacijaPregledDto
{
    public decimal RezervacijaId { get; set; }

    public DateTime VremePocetka { get; set; }

    public DateTime VremeZavrsetka { get; set; }

    public int BrGostiju { get; set; }

    public string Status { get; set; } = null!;

    public List<string> TipoviDogadjaja { get; set; } = [];
}