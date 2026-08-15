using System;
using System.Collections.Generic;

namespace EventOrganization.Api.Models;

public partial class DekoraterskaFirma
{
    public string? Opis { get; set; }

    public decimal UslugaId { get; set; }

    public virtual Usluga Usluga { get; set; } = null!;
}
