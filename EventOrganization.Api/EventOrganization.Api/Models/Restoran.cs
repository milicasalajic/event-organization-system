using System;
using System.Collections.Generic;
using EventOrganization.Api.Enums;

namespace EventOrganization.Api.Models;

public partial class Restoran
{
    public decimal RestoranId { get; set; }

    public string Telefon { get; set; } = null!;

    public string? RadnoVreme { get; set; }

    public string Adresa { get; set; } = null!;

    public string Grad { get; set; } = null!;

    public Status Status { get; set; } 

    public string Naziv { get; set; } = null!;

    public virtual ICollection<Paket> Paketi { get; set; } = new List<Paket>();

    public virtual ICollection<Radnik> Radnici { get; set; } = new List<Radnik>();

    public virtual ICollection<Sala> Sale { get; set; } = new List<Sala>();
}
