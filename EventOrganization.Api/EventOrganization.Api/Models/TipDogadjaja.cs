using System;
using System.Collections.Generic;
using EventOrganization.Api.Enums;

namespace EventOrganization.Api.Models;

public partial class TipDogadjaja
{
    public decimal TipDogadjajaId { get; set; }

    public Dogadjaj Tip{ get; set; } 

    public virtual ICollection<Rezervacija> Rezervacije { get; set; } = new List<Rezervacija>();
}
