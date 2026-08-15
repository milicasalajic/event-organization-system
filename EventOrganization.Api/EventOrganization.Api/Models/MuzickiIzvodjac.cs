using System;
using System.Collections.Generic;
using EventOrganization.Api.Enums;

namespace EventOrganization.Api.Models;

public partial class MuzickiIzvodjac
{
    public TipMuzicara TipMuzicara { get; set; } 

    public decimal UslugaId { get; set; }

    public virtual Usluga Usluga { get; set; } = null!;
}
