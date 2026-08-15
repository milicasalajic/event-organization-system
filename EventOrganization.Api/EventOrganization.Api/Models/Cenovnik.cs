using System;
using System.Collections.Generic;

namespace EventOrganization.Api.Models;

public partial class Cenovnik
{
    public decimal CenovnikId { get; set; }

    public short Iznos { get; set; }

    public DateTime DatumIzmene { get; set; }

    public decimal? SalaId { get; set; }

    public decimal? UslugaId { get; set; }

    public virtual Sala? Sala { get; set; }

    public virtual Usluga? Usluga { get; set; }
}
