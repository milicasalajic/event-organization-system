using System;
using System.Collections.Generic;
using EventOrganization.Api.Enums;

namespace EventOrganization.Api.Models;

public partial class StavkaRezervacije
{
    public decimal StavkaId { get; set; }

    public TipUsluge TipStavke { get; set; } 

    public decimal RezervacijaId { get; set; }

    public decimal UslugaId { get; set; }

    public virtual Rezervacija Rezervacija { get; set; } = null!;

    public virtual Usluga Usluga { get; set; } = null!;
}
