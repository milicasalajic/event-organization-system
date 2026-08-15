-- seed_data.sql
-- Testni podaci za informacioni sistem za organizaciju dogadjaja u restoranima.
-- Svi korisnicki podaci su izmisljeni.
-- Portfolio linkovi vode ka javno dostupnim sajtovima stvarnih pruzalaca usluga.
-- Pretpostavka: create_database.sql je vec izvrsen nad praznom semom.

--------------------------------------------------------------------------------
-- ULOGE
--------------------------------------------------------------------------------

INSERT INTO Uloga (uloga_id, tip_uloge) VALUES (1, 'ADMINISTRATOR');
INSERT INTO Uloga (uloga_id, tip_uloge) VALUES (2, 'KLIJENT');
INSERT INTO Uloga (uloga_id, tip_uloge) VALUES (3, 'MENADZER');
INSERT INTO Uloga (uloga_id, tip_uloge) VALUES (4, 'OPERATER');

--------------------------------------------------------------------------------
-- RESTORANI
--------------------------------------------------------------------------------

INSERT INTO Restoran (restoran_id, telefon, radno_vreme, adresa, grad, status, naziv)
VALUES (1, '021555101', '08:00-23:00', 'Bulevar oslobodjenja 88', 'Novi Sad', 'AKTIVNO', 'Dunavska terasa');

INSERT INTO Restoran (restoran_id, telefon, radno_vreme, adresa, grad, status, naziv)
VALUES (2, '011555202', '09:00-00:00', 'Bulevar kralja Aleksandra 210', 'Beograd', 'AKTIVNO', 'Zlatni breg');

INSERT INTO Restoran (restoran_id, telefon, radno_vreme, adresa, grad, status, naziv)
VALUES (3, '022555303', '10:00-23:00', 'Karadjordjeva 45', 'Sremska Mitrovica', 'AKTIVNO', 'Sremski dvor');

--------------------------------------------------------------------------------
-- SALE
--------------------------------------------------------------------------------

-- Restoran 1
INSERT INTO Sala (sala_id, rbr_s, kapacitet, status, restoran_id) VALUES (1, 1, 60,  'AKTIVNO', 1);
INSERT INTO Sala (sala_id, rbr_s, kapacitet, status, restoran_id) VALUES (2, 2, 120, 'AKTIVNO', 1);
INSERT INTO Sala (sala_id, rbr_s, kapacitet, status, restoran_id) VALUES (3, 3, 200, 'AKTIVNO', 1);

-- Restoran 2
INSERT INTO Sala (sala_id, rbr_s, kapacitet, status, restoran_id) VALUES (4, 1, 80,  'AKTIVNO', 2);
INSERT INTO Sala (sala_id, rbr_s, kapacitet, status, restoran_id) VALUES (5, 2, 150, 'AKTIVNO', 2);
INSERT INTO Sala (sala_id, rbr_s, kapacitet, status, restoran_id) VALUES (6, 3, 250, 'NEAKTIVNO', 2);

-- Restoran 3
INSERT INTO Sala (sala_id, rbr_s, kapacitet, status, restoran_id) VALUES (7, 1, 70,  'AKTIVNO', 3);
INSERT INTO Sala (sala_id, rbr_s, kapacitet, status, restoran_id) VALUES (8, 2, 130, 'AKTIVNO', 3);
INSERT INTO Sala (sala_id, rbr_s, kapacitet, status, restoran_id) VALUES (9, 3, 220, 'AKTIVNO', 3);

--------------------------------------------------------------------------------
-- USLUGE
--------------------------------------------------------------------------------

-- Fotografi
INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('AKTIVNO', 1, '063551637', 'FOTOGRAF', 'Danilo i Sharon', 'https://www.daniloandsharon.com/');

INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('AKTIVNO', 2, '0641111002', 'FOTOGRAF', 'Doroteja Tipsin', 'https://www.instagram.com/dorotejatipsin_wedd/');

INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('AKTIVNO', 3, '0641111003', 'FOTOGRAF', 'Fotkam studio', 'https://www.fotkam.rs/');

-- Ketering
INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('AKTIVNO', 4, '0692538791', 'KETERING', 'Bueno Gusto Catering', 'https://ketering-buenogusto.rs/');

INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('AKTIVNO', 5, '0648411111', 'KETERING', 'Party Service', 'https://partyservice.rs/');

INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('AKTIVNO', 6, '0646479999', 'KETERING', 'Madeleine Ketering', 'https://madeleineketering.rs/');

-- Dekorateri
INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('AKTIVNO', 7, '0601112001', 'DEKORATER', 'Black Calla Events', 'https://blackcallaevents.rs/');

INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('AKTIVNO', 8, '0606990064', 'DEKORATER', 'Arkadia Weddings', 'https://www.arkadiaweddings.com/');

INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('NEAKTIVNO', 9, '0640114422', 'DEKORATER', 'Provansa Dekor', 'https://provansadekor.rs/');

-- Muzicki izvodjaci
INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('AKTIVNO', 10, '0638879634', 'MUZICKI_IZVODJAC', 'Experiment Bend', 'https://www.instagram.com/experiment_band_/');

INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('AKTIVNO', 11, '0612450018', 'MUZICKI_IZVODJAC', 'Magla Bend', 'https://magla-bend.com/');

INSERT INTO Usluga (status, usluga_id, telefon, tip_usluge, naziv_u, portfolio)
VALUES ('AKTIVNO', 12, '063379549', 'MUZICKI_IZVODJAC', 'Gospon Tamburaši', 'https://gospontamburasi.com/');

--------------------------------------------------------------------------------
-- PODTIPOVI USLUGA
--------------------------------------------------------------------------------

INSERT INTO Fotograf (cena_foto, usluga_id, tip_foto) VALUES (400, 1, 'FOTOGRAFIJA');
INSERT INTO Fotograf (cena_foto, usluga_id, tip_foto) VALUES (400, 2, 'FOTOGRAFIJA_SNIMANJE');
INSERT INTO Fotograf (cena_foto, usluga_id, tip_foto) VALUES (300, 3, 'FOTOGRAFIJA');

INSERT INTO Ketering_firma (opis, usluga_id)
VALUES ('Finger food i ketering za svadbe, rodjendane i druge proslave.', 4);

INSERT INTO Ketering_firma (opis, usluga_id)
VALUES ('Kompletna ketering usluga za privatne i poslovne dogadjaje.', 5);

INSERT INTO Ketering_firma (opis, usluga_id)
VALUES ('Svecani ketering sa izborom vise menija za proslave.', 6);

INSERT INTO Dekoraterska_firma (opis, usluga_id)
VALUES ('Cvetna dekoracija i dekoracija vencanja i posebnih dogadjaja.', 7);

INSERT INTO Dekoraterska_firma (opis, usluga_id)
VALUES ('Organizacija i dekoracija vencanja i drugih svecanosti.', 8);

INSERT INTO Dekoraterska_firma (opis, usluga_id)
VALUES ('Dekoracija vencanja, stolova i prostora za proslave.', 9);

INSERT INTO Muzicki_izvodjac (tip_muzicara, usluga_id) VALUES ('BEND', 10);
INSERT INTO Muzicki_izvodjac (tip_muzicara, usluga_id) VALUES ('BEND', 11);
INSERT INTO Muzicki_izvodjac (tip_muzicara, usluga_id) VALUES ('TAMBURASI', 12);

--------------------------------------------------------------------------------
-- KORISNICI
-- Svaka testna lozinka je: lozinka123
-- Svaki email je oblika: ime@example.com
--------------------------------------------------------------------------------

-- Administrator: nema podtip, zato je tip_korisnika NULL.
INSERT INTO Korisnik
(korisnik_id, lozinka, ime, prezime, telefon, email, tip_korisnika, uloga_id)
VALUES
(100, 'lozinka123', 'Aleksandar', 'Admin', '0647000001', 'aleksandar@example.com', NULL, 1);

-- Klijenti
INSERT INTO Korisnik VALUES (1, 'lozinka123', 'Ana',    'Petrovic',   '0645001001', 'ana@example.com',    'KLIJENT', 2);
INSERT INTO Korisnik VALUES (2, 'lozinka123', 'Marko',  'Jovanovic',  '0645001002', 'marko@example.com',  'KLIJENT', 2);
INSERT INTO Korisnik VALUES (3, 'lozinka123', 'Milica', 'Nikolic',    '0645001003', 'milica@example.com', 'KLIJENT', 2);
INSERT INTO Korisnik VALUES (4, 'lozinka123', 'Stefan', 'Ilic',       '0645001004', 'stefan@example.com', 'KLIJENT', 2);
INSERT INTO Korisnik VALUES (5, 'lozinka123', 'Jelena', 'Stojanovic', '0645001005', 'jelena@example.com', 'KLIJENT', 2);
INSERT INTO Korisnik VALUES (6, 'lozinka123', 'Nikola', 'Pavlovic',   '0645001006', 'nikola@example.com', 'KLIJENT', 2);
INSERT INTO Korisnik VALUES (7, 'lozinka123', 'Marija', 'Savic',      '0645001007', 'marija@example.com', 'KLIJENT', 2);
INSERT INTO Korisnik VALUES (8, 'lozinka123', 'Luka',   'Djordjevic', NULL,          'luka@example.com',   'KLIJENT', 2);

INSERT INTO Klijent VALUES (1);
INSERT INTO Klijent VALUES (2);
INSERT INTO Klijent VALUES (3);
INSERT INTO Klijent VALUES (4);
INSERT INTO Klijent VALUES (5);
INSERT INTO Klijent VALUES (6);
INSERT INTO Klijent VALUES (7);
INSERT INTO Klijent VALUES (8);

-- Menadzeri: po jedan za svaki restoran.
INSERT INTO Korisnik VALUES (101, 'lozinka123', 'Petar', 'Markovic', '0646001001', 'petar@example.com', 'RADNIK', 3);
INSERT INTO Korisnik VALUES (102, 'lozinka123', 'Nenad', 'Matic',    '0646001002', 'nenad@example.com', 'RADNIK', 3);
INSERT INTO Korisnik VALUES (103, 'lozinka123', 'Bojan', 'Ristic',   '0646001003', 'bojan@example.com', 'RADNIK', 3);

INSERT INTO Radnik VALUES (101, 'MENADZER', 1);
INSERT INTO Radnik VALUES (102, 'MENADZER', 2);
INSERT INTO Radnik VALUES (103, 'MENADZER', 3);

-- Operateri: dva za restoran 1 i dva za restoran 2.
INSERT INTO Korisnik VALUES (104, 'lozinka123', 'Sanja',    'Radic', '0646001004', 'sanja@example.com',    'RADNIK', 4);
INSERT INTO Korisnik VALUES (105, 'lozinka123', 'Maja',     'Stevic','0646001005', 'maja@example.com',     'RADNIK', 4);
INSERT INTO Korisnik VALUES (106, 'lozinka123', 'Kristina', 'Vasic', '0646001006', 'kristina@example.com', 'RADNIK', 4);
INSERT INTO Korisnik VALUES (107, 'lozinka123', 'Vladimir', 'Babic', '0646001007', 'vladimir@example.com', 'RADNIK', 4);

INSERT INTO Radnik VALUES (104, 'OPERATER', 1);
INSERT INTO Radnik VALUES (105, 'OPERATER', 1);
INSERT INTO Radnik VALUES (106, 'OPERATER', 2);
INSERT INTO Radnik VALUES (107, 'OPERATER', 2);

--------------------------------------------------------------------------------
-- PAKETI
-- Svaki restoran ima tacno 3 paketa.
--------------------------------------------------------------------------------

-- Restoran 1
INSERT INTO Paket VALUES (1, 'Osnovni', 'Paket za manje proslave.', 'AKTIVNO', 1);
INSERT INTO Paket VALUES (2, 'Svecani', 'Paket za srednje proslave sa dodatnim uslugama.', 'AKTIVNO', 1);
INSERT INTO Paket VALUES (3, 'Premium', 'Paket za velike proslave sa prosirenom ponudom.', 'AKTIVNO', 1);

-- Restoran 2
INSERT INTO Paket VALUES (4, 'Standard', 'Standardni paket restorana Zlatni breg.', 'AKTIVNO', 2);
INSERT INTO Paket VALUES (5, 'Elegant', 'Svecani paket za vece proslave.', 'AKTIVNO', 2);
INSERT INTO Paket VALUES (6, 'Royal', 'Najbogatiji paket restorana Zlatni breg.', 'NEAKTIVNO', 2);

-- Restoran 3
INSERT INTO Paket VALUES (7, 'Sremski', 'Osnovni paket restorana Sremski dvor.', 'AKTIVNO', 3);
INSERT INTO Paket VALUES (8, 'Porodicni', 'Paket za porodicne proslave.', 'AKTIVNO', 3);
INSERT INTO Paket VALUES (9, 'Sremski premium', 'Prosireni paket za vece dogadjaje.', 'AKTIVNO', 3);

--------------------------------------------------------------------------------
-- PAKET - SALA
--------------------------------------------------------------------------------

-- Restoran 1
-- Paket 1 moze u salu kapaciteta 60.
INSERT INTO Paket_Sala VALUES (1, 1);

-- Paket 2 moze u sale kapaciteta 120 i 200.
INSERT INTO Paket_Sala VALUES (2, 2);
INSERT INTO Paket_Sala VALUES (3, 2);

-- Paket 3 je namenjen najvecoj sali.
INSERT INTO Paket_Sala VALUES (3, 3);

-- Restoran 2
INSERT INTO Paket_Sala VALUES (4, 4);
INSERT INTO Paket_Sala VALUES (5, 5);
INSERT INTO Paket_Sala VALUES (6, 6);

-- Restoran 3
INSERT INTO Paket_Sala VALUES (7, 7);
INSERT INTO Paket_Sala VALUES (8, 8);
INSERT INTO Paket_Sala VALUES (9, 9);

--------------------------------------------------------------------------------
-- PAKET - USLUGA
--------------------------------------------------------------------------------

-- Restoran 1
INSERT INTO Paket_Usluga VALUES (1, 4);
INSERT INTO Paket_Usluga VALUES (1, 10);

INSERT INTO Paket_Usluga VALUES (2, 1);
INSERT INTO Paket_Usluga VALUES (2, 7);
INSERT INTO Paket_Usluga VALUES (2, 10);

-- Premium paket restorana 1 - dozvoljene sve usluge
INSERT INTO Paket_Usluga VALUES (3, 1);
INSERT INTO Paket_Usluga VALUES (3, 2);
INSERT INTO Paket_Usluga VALUES (3, 3);
INSERT INTO Paket_Usluga VALUES (3, 4);
INSERT INTO Paket_Usluga VALUES (3, 5);
INSERT INTO Paket_Usluga VALUES (3, 6);
INSERT INTO Paket_Usluga VALUES (3, 7);
INSERT INTO Paket_Usluga VALUES (3, 8);
INSERT INTO Paket_Usluga VALUES (3, 9);
INSERT INTO Paket_Usluga VALUES (3, 10);
INSERT INTO Paket_Usluga VALUES (3, 11);
INSERT INTO Paket_Usluga VALUES (3, 12);

-- Restoran 2
INSERT INTO Paket_Usluga VALUES (4, 3);
INSERT INTO Paket_Usluga VALUES (4, 5);
INSERT INTO Paket_Usluga VALUES (5, 6);
INSERT INTO Paket_Usluga VALUES (5, 8);
INSERT INTO Paket_Usluga VALUES (5, 12);
INSERT INTO Paket_Usluga VALUES (6, 2);
INSERT INTO Paket_Usluga VALUES (6, 7);

-- Restoran 3
INSERT INTO Paket_Usluga VALUES (7, 4);
INSERT INTO Paket_Usluga VALUES (7, 12);
INSERT INTO Paket_Usluga VALUES (8, 3);
INSERT INTO Paket_Usluga VALUES (8, 7);
INSERT INTO Paket_Usluga VALUES (9, 5);
INSERT INTO Paket_Usluga VALUES (9, 8);
INSERT INTO Paket_Usluga VALUES (9, 10);

--------------------------------------------------------------------------------
-- TIPOVI DOGADJAJA
--------------------------------------------------------------------------------

INSERT INTO Tip_dogadjaja VALUES (1, 'VENCANJE');
INSERT INTO Tip_dogadjaja VALUES (2, 'RODJENDAN');
INSERT INTO Tip_dogadjaja VALUES (3, 'KRSTENJE');
INSERT INTO Tip_dogadjaja VALUES (4, 'POSLOVNI_DOGADJAJ');

--------------------------------------------------------------------------------
-- REZERVACIJE
-- Samo 3 rezervacije i sve pripadaju paketima restorana 1.
--
-- Rezervacija 1: 50 gostiju, paket 1 -> sala 1 ima kapacitet 60.
-- Rezervacija 2: 100 gostiju, paket 2 -> sala 2 ima kapacitet 120.
-- Rezervacija 3: 180 gostiju, paket 3 -> sala 3 ima kapacitet 200.
--------------------------------------------------------------------------------

INSERT INTO Rezervacija
(rezervacija_id, br_gostiju, opis, napomena, vreme_pocetka, vreme_zavrsetka,
 vreme_kreiranja, status_rez, korisnik_id, paket_id)
VALUES
(
    1,
    50,
    NULL,
    NULL,
    TO_DATE('2026-10-05 18:00', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-10-06 00:00', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-08-15 09:00', 'YYYY-MM-DD HH24:MI'),
    'POTVRDJENA',
    1,
    1
);

INSERT INTO Rezervacija
(rezervacija_id, br_gostiju, opis, napomena, vreme_pocetka, vreme_zavrsetka,
 vreme_kreiranja, status_rez, korisnik_id, paket_id)
VALUES
(
    2,
    100,
    'Proslava tridesetog rodjendana.',
    'Necemo koristiti fotografa iz ponude restorana. Koristicemo svog fotografa Marka Petrovica.',
    TO_DATE('2026-10-10 19:00', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-10-11 01:00', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-08-15 09:30', 'YYYY-MM-DD HH24:MI'),
    'POSLATA',
    2,
    2
);

INSERT INTO Rezervacija
(rezervacija_id, br_gostiju, opis, napomena, vreme_pocetka, vreme_zavrsetka,
 vreme_kreiranja, status_rez, korisnik_id, paket_id)
VALUES
(
    3,
    180,
    'Vencanje sa vecernjom proslavom.',
    'Potrebno je obezbediti dva decja stola.',
    TO_DATE('2026-06-20 17:00', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-06-21 02:00', 'YYYY-MM-DD HH24:MI'),
    TO_DATE('2026-03-10 11:00', 'YYYY-MM-DD HH24:MI'),
    'REALIZOVANA',
    3,
    3
);

--------------------------------------------------------------------------------
-- REZERVACIJA - TIP DOGADJAJA
--------------------------------------------------------------------------------

INSERT INTO Rezervacija_TipDogadjaja VALUES (2, 1);
INSERT INTO Rezervacija_TipDogadjaja VALUES (2, 2);
INSERT INTO Rezervacija_TipDogadjaja VALUES (1, 3);

--------------------------------------------------------------------------------
-- STAVKE REZERVACIJE
--
-- Kod rezervacije 2 namerno nema fotografa, jer je u napomeni navedeno
-- da klijent koristi svog fotografa koji nije u sistemu.
--------------------------------------------------------------------------------

-- Rezervacija 1
INSERT INTO Stavka_rezervacije VALUES (1, 'KETERING', 1, 4);
INSERT INTO Stavka_rezervacije VALUES (2, 'MUZICKI_IZVODJAC', 1, 10);

-- Rezervacija 2
INSERT INTO Stavka_rezervacije VALUES (3, 'DEKORATER', 2, 7);
INSERT INTO Stavka_rezervacije VALUES (4, 'MUZICKI_IZVODJAC', 2, 10);

-- Rezervacija 3
INSERT INTO Stavka_rezervacije VALUES (5, 'FOTOGRAF', 3, 2);
INSERT INTO Stavka_rezervacije VALUES (6, 'KETERING', 3, 5);
INSERT INTO Stavka_rezervacije VALUES (7, 'DEKORATER', 3, 8);
INSERT INTO Stavka_rezervacije VALUES (8, 'MUZICKI_IZVODJAC', 3, 11);

--------------------------------------------------------------------------------
-- CENOVNIK
-- Postoji vise cena za pojedine sale/usluge radi testiranja istorije cena.
--------------------------------------------------------------------------------

-- Cene stolice po salama
INSERT INTO Cenovnik VALUES (1, 3000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), 1, NULL);
INSERT INTO Cenovnik VALUES (2, 3300, TO_DATE('2026-07-01', 'YYYY-MM-DD'), 1, NULL);

INSERT INTO Cenovnik VALUES (3, 3600, TO_DATE('2026-01-01', 'YYYY-MM-DD'), 2, NULL);
INSERT INTO Cenovnik VALUES (4, 3900, TO_DATE('2026-07-01', 'YYYY-MM-DD'), 2, NULL);

INSERT INTO Cenovnik VALUES (5, 4500, TO_DATE('2026-01-01', 'YYYY-MM-DD'), 3, NULL);
INSERT INTO Cenovnik VALUES (6, 4800, TO_DATE('2026-07-01', 'YYYY-MM-DD'), 3, NULL);

INSERT INTO Cenovnik VALUES (7, 3200, TO_DATE('2026-01-01', 'YYYY-MM-DD'), 4, NULL);
INSERT INTO Cenovnik VALUES (8, 4000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), 5, NULL);
INSERT INTO Cenovnik VALUES (9, 4700, TO_DATE('2026-01-01', 'YYYY-MM-DD'), 6, NULL);

INSERT INTO Cenovnik VALUES (10, 2900, TO_DATE('2026-01-01', 'YYYY-MM-DD'), 7, NULL);
INSERT INTO Cenovnik VALUES (11, 3500, TO_DATE('2026-01-01', 'YYYY-MM-DD'), 8, NULL);
INSERT INTO Cenovnik VALUES (12, 4300, TO_DATE('2026-01-01', 'YYYY-MM-DD'), 9, NULL);

-- Cene usluga
INSERT INTO Cenovnik VALUES (13, 35000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 1);
INSERT INTO Cenovnik VALUES (14, 42000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 2);
INSERT INTO Cenovnik VALUES (15, 30000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 3);

INSERT INTO Cenovnik VALUES (16, 28000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 4);
INSERT INTO Cenovnik VALUES (17, 45000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 5);
INSERT INTO Cenovnik VALUES (18, 50000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 6);

INSERT INTO Cenovnik VALUES (19, 22000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 7);
INSERT INTO Cenovnik VALUES (20, 30000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 8);
INSERT INTO Cenovnik VALUES (21, 24000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 9);

INSERT INTO Cenovnik VALUES (22, 65000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 10);
INSERT INTO Cenovnik VALUES (23, 60000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 11);
INSERT INTO Cenovnik VALUES (24, 55000, TO_DATE('2026-01-01', 'YYYY-MM-DD'), NULL, 12);

COMMIT;
