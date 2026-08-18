namespace EventOrganization.Api.DTOs.Rezervacije;

public class RezervacijaDetaljiDto
{
    public decimal RezervacijaId { get; set; }

    public string ImeKlijenta { get; set; } = null!;

    public string PrezimeKlijenta { get; set; } = null!;

    public string EmailKlijenta { get; set; } = null!;

    public string? TelefonKlijenta { get; set; }

    public decimal PaketId { get; set; }

    public string NazivPaketa { get; set; } = null!;

    public decimal RedniBrojSale { get; set; }

    public List<string> TipoviDogadjaja { get; set; } = [];

    public decimal BrGostiju { get; set; }

    public string? Opis { get; set; }

    public string? Napomena { get; set; }

    public DateTime VremePocetka { get; set; }

    public DateTime VremeZavrsetka { get; set; }

    public DateTime VremeKreiranja { get; set; }

    public string Status { get; set; } = null!;

    public List<string> DodatneUsluge { get; set; } = [];
}