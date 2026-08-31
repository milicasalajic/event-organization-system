namespace EventOrganization.Api.DTOs.Rezervacije;

public class RezervacijaDetaljiDto
{
    public decimal RezervacijaId { get; set; }

    public string ImeKlijenta { get; set; } = string.Empty;
    public string PrezimeKlijenta { get; set; } = string.Empty;
    public string EmailKlijenta { get; set; } = string.Empty;
    public string? TelefonKlijenta { get; set; }

    public decimal PaketId { get; set; }
    public string NazivPaketa { get; set; } = string.Empty;

    public List<string> TipoviDogadjaja { get; set; } = [];

    public decimal BrGostiju { get; set; }

    public string? Opis { get; set; }
    public string? Napomena { get; set; }

    public DateTime VremePocetka { get; set; }
    public DateTime VremeZavrsetka { get; set; }
    public DateTime VremeKreiranja { get; set; }

    public string Status { get; set; } = string.Empty;

    public List<RezervacijaUslugaDto> DodatneUsluge { get; set; } = [];

    public decimal? SalaId { get; set; }
    public decimal? RbrSSale { get; set; }
}