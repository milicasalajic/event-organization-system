namespace EventOrganization.Api.DTOs.Rezervacije;

public class KreiranjeRezervacijeResponseDto
{
    public decimal RezervacijaId { get; set; }

    public string Status { get; set; } = null!;

    public DateTime VremeKreiranja { get; set; }

    public decimal UkupnaCena { get; set; }
}