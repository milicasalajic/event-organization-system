using System;
using System.Collections.Generic;

namespace EventOrganization.Api.Models;

public partial class Korisnik
{
    public decimal KorisnikId { get; set; }

    public string Lozinka { get; set; } = null!;

    public string Ime { get; set; } = null!;

    public string Prezime { get; set; } = null!;

    public string? Telefon { get; set; }

    public string Email { get; set; } = null!;

    public string TipKorisnika { get; set; } = null!;

    public decimal UlogaId { get; set; }

    public virtual Klijent? Klijent { get; set; }

    public virtual Radnik? Radnik { get; set; }

    public virtual Uloga Uloga { get; set; } = null!;
}
