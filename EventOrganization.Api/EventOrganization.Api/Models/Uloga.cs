using System;
using System.Collections.Generic;
using EventOrganization.Api.Enums;

namespace EventOrganization.Api.Models;

public partial class Uloga
{
    public decimal UlogaId { get; set; }

    public TipUloge  TipUloge { get; set; } 

    public virtual ICollection<Korisnik> Korisnici { get; set; } = new List<Korisnik>();
}
