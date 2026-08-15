using System;
using System.Collections.Generic;
using EventOrganization.Api.Enums;

namespace EventOrganization.Api.Models;

public partial class Sala
{
    public decimal SalaId { get; set; }

    public decimal RbrS { get; set; }

    public decimal Kapacitet { get; set; }

    public Status Status { get; set; }

    public decimal RestoranId { get; set; }

    public virtual ICollection<Cenovnik> Cenovnici { get; set; } = new List<Cenovnik>();

    public virtual Restoran Restoran { get; set; } = null!;

    public virtual ICollection<Paket> Paketi { get; set; } = new List<Paket>();
}
