using System;
using System.Collections.Generic;

namespace EventOrganization.Api.Models;

public partial class Klijent
{
    public decimal KorisnikId { get; set; }

    public virtual Korisnik Korisnik { get; set; } = null!;

    public virtual ICollection<Rezervacija> Rezervacije { get; set; } = new List<Rezervacija>();
}
