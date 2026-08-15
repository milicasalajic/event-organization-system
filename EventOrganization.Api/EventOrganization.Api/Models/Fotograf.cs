using System;
using System.Collections.Generic;

namespace EventOrganization.Api.Models;

public partial class Fotograf
{
    public byte? CenaFoto { get; set; }

    public decimal UslugaId { get; set; }

    public string TipFoto { get; set; } = null!;

    public virtual Usluga Usluga { get; set; } = null!;
}
