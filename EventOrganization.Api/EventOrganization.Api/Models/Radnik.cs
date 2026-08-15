using System;
using System.Collections.Generic;
using EventOrganization.Api.Enums;

namespace EventOrganization.Api.Models;

public partial class Radnik
{
    public decimal KorisnikId { get; set; }

    public TipRadnika TipRadnika { get; set; } 

    public decimal RestoranId { get; set; }

    public virtual Korisnik Korisnik { get; set; } = null!;

    public virtual Restoran Restoran { get; set; } = null!;
}
