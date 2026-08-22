using System;
using System.Collections.Generic;
using EventOrganization.Api.Enums;

namespace EventOrganization.Api.Models;

public partial class Fotograf
{
    public decimal CenaFoto { get; set; }

    public decimal UslugaId { get; set; }

    public TipFoto TipFoto { get; set; } 

    public virtual Usluga Usluga { get; set; } = null!;
}
