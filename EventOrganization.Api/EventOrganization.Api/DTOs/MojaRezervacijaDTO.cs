namespace EventOrganization.Api.DTOs.Rezervacije;

public class MojaRezervacijaDto
{
    public decimal RezervacijaId { get; set; }

    public decimal RestoranId { get; set; }

    public string NazivRestorana { get; set; } =
        string.Empty;

    public decimal PaketId { get; set; }

    public string NazivPaketa { get; set; } =
        string.Empty;

    public decimal? SalaId { get; set; }

    public decimal? RbrSSale { get; set; }

    public List<string> TipoviDogadjaja { get; set; } =
        [];

    public decimal BrGostiju { get; set; }

    public string? Opis { get; set; }

    public string? Napomena { get; set; }

    public DateTime VremePocetka { get; set; }

    public DateTime VremeZavrsetka { get; set; }

    public DateTime VremeKreiranja { get; set; }

    public string Status { get; set; } =
        string.Empty;

    public List<string> DodatneUsluge { get; set; } =
        [];

    public decimal? UkupnaCena { get; set; }
}