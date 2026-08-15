using System;
using System.Collections.Generic;
using EventOrganization.Api.Enums;

namespace EventOrganization.Api.Models;

public partial class Usluga
{
    public Status Status { get; set; } 

    public decimal UslugaId { get; set; }

    public string Telefon { get; set; } = null!;

    public TipUsluge TipUsluge { get; set; } 

    public string NazivU { get; set; } = null!;

    public string? Portfolio { get; set; }

    public virtual ICollection<Cenovnik> Cenovnici { get; set; } = new List<Cenovnik>();

    public virtual DekoraterskaFirma? DekoraterskaFirma { get; set; }

    public virtual Fotograf? Fotograf { get; set; }

    public virtual KeteringFirma? KeteringFirma { get; set; }

    public virtual MuzickiIzvodjac? MuzickiIzvodjac { get; set; }

    public virtual ICollection<StavkaRezervacije> StavkeRezervacije { get; set; } = new List<StavkaRezervacije>();

    public virtual ICollection<Paket> Paketi { get; set; } = new List<Paket>();
}
