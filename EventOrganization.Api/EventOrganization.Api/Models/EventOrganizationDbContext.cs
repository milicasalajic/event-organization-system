using System.Collections.Generic;
using EventOrganization.Api.Enums;
using Microsoft.EntityFrameworkCore;

namespace EventOrganization.Api.Models;

public partial class EventOrganizationDbContext : DbContext
{
    public EventOrganizationDbContext()
    {
    }

    public EventOrganizationDbContext(
        DbContextOptions<EventOrganizationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cenovnik> Cenovnici { get; set; }

    public virtual DbSet<DekoraterskaFirma> DekoraterskeFirme { get; set; }

    public virtual DbSet<Fotograf> Fotografi { get; set; }

    public virtual DbSet<KeteringFirma> KeteringFirme { get; set; }

    public virtual DbSet<Klijent> Klijenti { get; set; }

    public virtual DbSet<Korisnik> Korisnici { get; set; }

    public virtual DbSet<MuzickiIzvodjac> MuzickiIzvodjaci { get; set; }

    public virtual DbSet<Paket> Paketi { get; set; }

    public virtual DbSet<Radnik> Radnici { get; set; }

    public virtual DbSet<Restoran> Restorani { get; set; }

    public virtual DbSet<Rezervacija> Rezervacije { get; set; }

    public virtual DbSet<Sala> Sale { get; set; }

    public virtual DbSet<StavkaRezervacije> StavkeRezervacije { get; set; }

    public virtual DbSet<TipDogadjaja> TipoviDogadjaja { get; set; }

    public virtual DbSet<Uloga> Uloge { get; set; }

    public virtual DbSet<Usluga> Usluge { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasDefaultSchema("EVENT_ORGANIZATION")
            .UseCollation("USING_NLS_COMP");

        modelBuilder.Entity<Cenovnik>(entity =>
        {
            entity.HasKey(e => e.CenovnikId)
                .HasName("CENOVNIK_PK");

            entity.ToTable("CENOVNIK");

            entity.Property(e => e.CenovnikId)
                .ValueGeneratedNever()
                .HasColumnType("NUMBER")
                .HasColumnName("CENOVNIK_ID");

            entity.Property(e => e.DatumIzmene)
                .HasColumnType("DATE")
                .HasColumnName("DATUM_IZMENE");

            entity.Property(e => e.Iznos)
                .HasPrecision(5)
                .HasColumnName("IZNOS");

            entity.Property(e => e.SalaId)
                .HasColumnType("NUMBER")
                .HasColumnName("SALA_ID");

            entity.Property(e => e.UslugaId)
                .HasColumnType("NUMBER")
                .HasColumnName("USLUGA_ID");

            entity.HasOne(d => d.Sala)
                .WithMany(p => p.Cenovnici)
                .HasForeignKey(d => d.SalaId)
                .HasConstraintName("C_SALA_FK");

            entity.HasOne(d => d.Usluga)
                .WithMany(p => p.Cenovnici)
                .HasForeignKey(d => d.UslugaId)
                .HasConstraintName("C_USLUGA_FK");
        });

        modelBuilder.Entity<DekoraterskaFirma>(entity =>
        {
            entity.HasKey(e => e.UslugaId)
                .HasName("DEKORATERSKA_FIRMA_PK");

            entity.ToTable("DEKORATERSKA_FIRMA");

            entity.Property(e => e.UslugaId)
                .ValueGeneratedNever()
                .HasColumnType("NUMBER")
                .HasColumnName("USLUGA_ID");             

           entity.Property(e => e.Opis)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("OPIS");

            entity.HasOne(d => d.Usluga)
                .WithOne(p => p.DekoraterskaFirma)
                .HasForeignKey<DekoraterskaFirma>(d => d.UslugaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("D_USLUGA_FK");
        });

        modelBuilder.Entity<Fotograf>(entity =>
        {
            entity.HasKey(e => e.UslugaId)
                .HasName("FOTOGRAF_PK");

            entity.ToTable("FOTOGRAF");

            entity.Property(e => e.UslugaId)
                .ValueGeneratedNever()
                .HasColumnType("NUMBER")
                .HasColumnName("USLUGA_ID");

            entity.Property(e => e.CenaFoto)
                .HasPrecision(4)
                .HasColumnName("CENA_FOTO");

            entity.Property(e => e.TipFoto)
                .HasConversion<string>()
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("TIP_FOTO");

            entity.HasOne(d => d.Usluga)
                .WithOne(p => p.Fotograf)
                .HasForeignKey<Fotograf>(d => d.UslugaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("F_USLUGA_FK");
        });

        modelBuilder.Entity<KeteringFirma>(entity =>
        {
            entity.HasKey(e => e.UslugaId)
                .HasName("KETERING_FIRMA_PK");

            entity.ToTable("KETERING_FIRMA");

            entity.Property(e => e.UslugaId)
                .ValueGeneratedNever()
                .HasColumnType("NUMBER")
                .HasColumnName("USLUGA_ID");

            entity.Property(e => e.Opis)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("OPIS");

            entity.HasOne(d => d.Usluga)
                .WithOne(p => p.KeteringFirma)
                .HasForeignKey<KeteringFirma>(d => d.UslugaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("K_USLUGA_FK");
        });

        modelBuilder.Entity<Klijent>(entity =>
        {
            entity.HasKey(e => e.KorisnikId)
                .HasName("KLIJENT_PK");

            entity.ToTable("KLIJENT");

            entity.Property(e => e.KorisnikId)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("KORISNIK_ID");

            entity.HasOne(d => d.Korisnik)
                .WithOne(p => p.Klijent)
                .HasForeignKey<Klijent>(d => d.KorisnikId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("KLIJENT_FK");
        });

        modelBuilder.Entity<Korisnik>(entity =>
        {
            entity.HasKey(e => e.KorisnikId)
                .HasName("KORISNIK_PK");

            entity.ToTable("KORISNIK");

            entity.Property(e => e.KorisnikId)
                .HasColumnType("NUMBER")
                .HasColumnName("KORISNIK_ID");

            entity.Property(e => e.Email)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("EMAIL");

            entity.Property(e => e.Ime)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("IME");

            entity.Property(e => e.Lozinka)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("LOZINKA");

            entity.Property(e => e.Prezime)
                .HasMaxLength(35)
                .IsUnicode(false)
                .HasColumnName("PREZIME");

            entity.Property(e => e.Telefon)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("TELEFON");

            entity.Property(e => e.TipKorisnika)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("TIP_KORISNIKA");

            entity.Property(e => e.UlogaId)
                .HasColumnType("NUMBER")
                .HasColumnName("ULOGA_ID");

            entity.HasOne(d => d.Uloga)
                .WithMany(p => p.Korisnici)
                .HasForeignKey(d => d.UlogaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("KORISNIK_ULOGA_FK");
        });

        modelBuilder.Entity<MuzickiIzvodjac>(entity =>
        {
            entity.HasKey(e => e.UslugaId)
                .HasName("MUZICKI_IZVODJAC_PK");

            entity.ToTable("MUZICKI_IZVODJAC");

            entity.Property(e => e.UslugaId)
                .ValueGeneratedNever()
                .HasColumnType("NUMBER")
                .HasColumnName("USLUGA_ID");

            entity.Property(e => e.TipMuzicara)
                .HasConversion<string>()
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("TIP_MUZICARA");

            entity.HasOne(d => d.Usluga)
                .WithOne(p => p.MuzickiIzvodjac)
                .HasForeignKey<MuzickiIzvodjac>(d => d.UslugaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("M_USLUGA_FK");
        });

        modelBuilder.Entity<Paket>(entity =>
        {
            entity.HasKey(e => e.PaketId)
                .HasName("PAKET_PK");

            entity.ToTable("PAKET");

            entity.Property(e => e.PaketId)
                .HasColumnType("NUMBER")
                .HasColumnName("PAKET_ID");

            entity.Property(e => e.Naziv)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NAZIV");

            entity.Property(e => e.Opis)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("OPIS");

            entity.Property(e => e.RestoranId)
                .HasColumnType("NUMBER")
                .HasColumnName("RESTORAN_ID");

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("STATUS");

            entity.HasOne(d => d.Restoran)
                .WithMany(p => p.Paketi)
                .HasForeignKey(d => d.RestoranId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("P_RESTORAN_FK");

            entity.HasMany(d => d.Usluge)
                .WithMany(p => p.Paketi)
                .UsingEntity<Dictionary<string, object>>(
                    "PaketUsluga",
                    r => r.HasOne<Usluga>()
                        .WithMany()
                        .HasForeignKey("UslugaId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("PU_USLUGA_FK"),
                    l => l.HasOne<Paket>()
                        .WithMany()
                        .HasForeignKey("PaketId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("PU_PAKET_FK"),
                    j =>
                    {
                        j.HasKey("PaketId", "UslugaId")
                            .HasName("PAKET_USLUGA_PK");

                        j.ToTable("PAKET_USLUGA");

                        j.IndexerProperty<decimal>("PaketId")
                            .HasColumnType("NUMBER")
                            .HasColumnName("PAKET_ID");

                        j.IndexerProperty<decimal>("UslugaId")
                            .HasColumnType("NUMBER")
                            .HasColumnName("USLUGA_ID");
                    });
        });

        modelBuilder.Entity<Radnik>(entity =>
        {
            entity.HasKey(e => e.KorisnikId)
                .HasName("RADNIK_PK");

            entity.ToTable("RADNIK");

            entity.Property(e => e.KorisnikId)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("KORISNIK_ID");

            entity.Property(e => e.RestoranId)
                .HasColumnType("NUMBER")
                .HasColumnName("RESTORAN_ID");

            entity.Property(e => e.TipRadnika)
                .HasConversion<string>()
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("TIP_RADNIKA");

            entity.HasOne(d => d.Korisnik)
                .WithOne(p => p.Radnik)
                .HasForeignKey<Radnik>(d => d.KorisnikId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("RADNIK_FK");

            entity.HasOne(d => d.Restoran)
                .WithMany(p => p.Radnici)
                .HasForeignKey(d => d.RestoranId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("R_RESTORAN_FK");
        });

        modelBuilder.Entity<Restoran>(entity =>
        {
            entity.HasKey(e => e.RestoranId)
                .HasName("RESTORAN_PK");

            entity.ToTable("RESTORAN");

            entity.Property(e => e.RestoranId)
                .HasColumnType("NUMBER")
                .HasColumnName("RESTORAN_ID");

            entity.Property(e => e.Adresa)
                .HasMaxLength(40)
                .IsUnicode(false)
                .HasColumnName("ADRESA");

            entity.Property(e => e.Grad)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("GRAD");

            entity.Property(e => e.Naziv)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("NAZIV");

            entity.Property(e => e.RadnoVreme)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("RADNO_VREME");

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("STATUS");

            entity.Property(e => e.Telefon)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("TELEFON");
        });

        modelBuilder.Entity<Rezervacija>(entity =>
        {
            entity.HasKey(e => e.RezervacijaId)
                .HasName("REZERVACIJA_PK");

            entity.ToTable("REZERVACIJA");

            entity.Property(e => e.RezervacijaId)
                .HasColumnType("NUMBER")
                .HasColumnName("REZERVACIJA_ID");

            entity.Property(e => e.BrGostiju)
                .HasColumnType("NUMBER")
                .HasColumnName("BR_GOSTIJU");

            entity.Property(e => e.KorisnikId)
                .HasColumnType("NUMBER")
                .HasColumnName("KORISNIK_ID");

            entity.Property(e => e.Napomena)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("NAPOMENA");

            entity.Property(e => e.Opis)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("OPIS");

            entity.Property(e => e.PaketId)
                .HasColumnType("NUMBER")
                .HasColumnName("PAKET_ID");

            entity.Property(e => e.StatusRez)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("STATUS_REZ");

            entity.Property(e => e.VremeKreiranja)
                .HasColumnType("DATE")
                .HasColumnName("VREME_KREIRANJA");

            entity.Property(e => e.VremePocetka)
                .HasColumnType("DATE")
                .HasColumnName("VREME_POCETKA");

            entity.Property(e => e.VremeZavrsetka)
                .HasColumnType("DATE")
                .HasColumnName("VREME_ZAVRSETKA");

            entity.HasOne(d => d.Korisnik)
                .WithMany(p => p.Rezervacije)
                .HasForeignKey(d => d.KorisnikId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("R_KLIJENT_FK");

            entity.HasOne(d => d.Paket)
                .WithMany(p => p.Rezervacije)
                .HasForeignKey(d => d.PaketId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("R_PAKET_FK");
        });

        modelBuilder.Entity<Sala>(entity =>
        {
            entity.HasKey(e => e.SalaId)
                .HasName("SALA_PK");

            entity.ToTable("SALA");

            entity.Property(e => e.SalaId)
                .ValueGeneratedNever()
                .HasColumnType("NUMBER")
                .HasColumnName("SALA_ID");

            entity.Property(e => e.Kapacitet)
                .HasColumnType("NUMBER")
                .HasColumnName("KAPACITET");

            entity.Property(e => e.RbrS)
                .HasColumnType("NUMBER")
                .HasColumnName("RBR_S");

            entity.Property(e => e.RestoranId)
                .HasColumnType("NUMBER")
                .HasColumnName("RESTORAN_ID");

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("STATUS");

            entity.HasOne(d => d.Restoran)
                .WithMany(p => p.Sale)
                .HasForeignKey(d => d.RestoranId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("SALA_RESTORAN_FK");

            entity.HasMany(d => d.Paketi)
                .WithMany(p => p.Sale)
                .UsingEntity<Dictionary<string, object>>(
                    "PaketSala",
                    r => r.HasOne<Paket>()
                        .WithMany()
                        .HasForeignKey("PaketId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("PS_PAKET_FK"),
                    l => l.HasOne<Sala>()
                        .WithMany()
                        .HasForeignKey("SalaId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("PS_SALA_FK"),
                    j =>
                    {
                        j.HasKey("SalaId", "PaketId")
                            .HasName("PAKET_SALA_PK");

                        j.ToTable("PAKET_SALA");

                        j.IndexerProperty<decimal>("SalaId")
                            .HasColumnType("NUMBER")
                            .HasColumnName("SALA_ID");

                        j.IndexerProperty<decimal>("PaketId")
                            .HasColumnType("NUMBER")
                            .HasColumnName("PAKET_ID");
                    });
        });

        modelBuilder.Entity<StavkaRezervacije>(entity =>
        {
            entity.HasKey(e => new
            {
                e.StavkaId,
                e.RezervacijaId
            })
                .HasName("STAVKA_REZERVACIJE_PK");

            entity.ToTable("STAVKA_REZERVACIJE");

            entity.Property(e => e.StavkaId)
                .HasColumnType("NUMBER")
                .HasColumnName("STAVKA_ID");

            entity.Property(e => e.RezervacijaId)
                .HasColumnType("NUMBER")
                .HasColumnName("REZERVACIJA_ID");

            entity.Property(e => e.TipStavke)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("TIP_STAVKE");

            entity.Property(e => e.UslugaId)
                .HasColumnType("NUMBER")
                .HasColumnName("USLUGA_ID");

            entity.HasOne(d => d.Rezervacija)
                .WithMany(p => p.StavkeRezervacije)
                .HasForeignKey(d => d.RezervacijaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("SR_REZERVACIJA_FK");

            entity.HasOne(d => d.Usluga)
                .WithMany(p => p.StavkeRezervacije)
                .HasForeignKey(d => d.UslugaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("SR_USLUGA_FK");
        });

        modelBuilder.Entity<TipDogadjaja>(entity =>
        {
            entity.HasKey(e => e.TipDogadjajaId)
                .HasName("TIP_DOGADJAJA_PK");

            entity.ToTable("TIP_DOGADJAJA");

            entity.Property(e => e.TipDogadjajaId)
                .HasColumnType("NUMBER")
                .HasColumnName("TIP_DOGADJAJA_ID");

            entity.Property(e => e.Tip)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("TIP_DOGADJAJA");

            entity.HasMany(d => d.Rezervacije)
                .WithMany(p => p.TipoviDogadjaja)
                .UsingEntity<Dictionary<string, object>>(
                    "RezervacijaTipdogadjaja",
                    r => r.HasOne<Rezervacija>()
                        .WithMany()
                        .HasForeignKey("RezervacijaId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("RTD_REZERVACIJA_FK"),
                    l => l.HasOne<TipDogadjaja>()
                        .WithMany()
                        .HasForeignKey("TipDogadjajaId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("RTD_TIP_DOGADJAJA_FK"),
                    j =>
                    {
                        j.HasKey("TipDogadjajaId", "RezervacijaId")
                            .HasName("REZERVACIJA_TIPDOGADJAJA_PK");

                        j.ToTable("REZERVACIJA_TIPDOGADJAJA");

                        j.IndexerProperty<decimal>("TipDogadjajaId")
                            .HasColumnType("NUMBER")
                            .HasColumnName("TIP_DOGADJAJA_ID");

                        j.IndexerProperty<decimal>("RezervacijaId")
                            .HasColumnType("NUMBER")
                            .HasColumnName("REZERVACIJA_ID");
                    });
        });

        modelBuilder.Entity<Uloga>(entity =>
        {
            entity.HasKey(e => e.UlogaId)
                .HasName("ULOGA_PK");

            entity.ToTable("ULOGA");

            entity.Property(e => e.UlogaId)
                .HasColumnType("NUMBER")
                .HasColumnName("ULOGA_ID");

            entity.Property(e => e.TipUloge)
                .HasConversion<string>()
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("TIP_ULOGE");
        });

        modelBuilder.Entity<Usluga>(entity =>
        {
            entity.HasKey(e => e.UslugaId)
                .HasName("USLUGA_PK");

            entity.ToTable("USLUGA");

            entity.Property(e => e.UslugaId)
                .HasColumnType("NUMBER")
                .HasColumnName("USLUGA_ID");

            entity.Property(e => e.NazivU)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("NAZIV_U");

            entity.Property(e => e.Portfolio)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("PORTFOLIO");

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("STATUS");

            entity.Property(e => e.Telefon)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("TELEFON");

            entity.Property(e => e.TipUsluge)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("TIP_USLUGE");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}