using System;
using System.Collections.Generic;
using EventOrganization.Api.Enums;

namespace EventOrganization.Api.Models;

public partial class Paket
{
    public decimal PaketId { get; set; }

    public string Naziv { get; set; } = null!;

    public string? Opis { get; set; }

    public Status Status { get; set; } 

    public decimal RestoranId { get; set; }

    public virtual Restoran Restoran { get; set; } = null!;

    public virtual ICollection<Rezervacija> Rezervacije { get; set; } = new List<Rezervacija>();

    public virtual ICollection<Sala> Sale { get; set; } = new List<Sala>();

    public virtual ICollection<Usluga> Usluge { get; set; } = new List<Usluga>();
}
