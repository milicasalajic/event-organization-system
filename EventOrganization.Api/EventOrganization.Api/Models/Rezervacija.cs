using System;
using System.Collections.Generic;
using EventOrganization.Api.Enums;

namespace EventOrganization.Api.Models;

public partial class Rezervacija
{
    public decimal RezervacijaId { get; set; }

    public decimal BrGostiju { get; set; }

    public string? Opis { get; set; }

    public string? Napomena { get; set; }

    public DateTime VremePocetka { get; set; }

    public DateTime VremeZavrsetka { get; set; }

    public DateTime VremeKreiranja { get; set; }

    public StatusRez StatusRez { get; set; } 

    public decimal KorisnikId { get; set; }

    public decimal PaketId { get; set; }

    public virtual Klijent Korisnik { get; set; } = null!;

    public virtual Paket Paket { get; set; } = null!;

    public virtual ICollection<StavkaRezervacije> StavkeRezervacije { get; set; } = new List<StavkaRezervacije>();

    public virtual ICollection<TipDogadjaja> TipoviDogadjaja { get; set; } = new List<TipDogadjaja>();
}
