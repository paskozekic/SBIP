-- =============================================================================
-- SPIB – ogledni podaci (nakon SPIB_schema.sql)
-- Lozinke su placeholderi (demo, nije produkcija).
-- =============================================================================

INSERT INTO Korisnik (ime, prezime, email, lozinka) VALUES
    ('Iva', 'Ivić', 'iva.narucitelj@spi.local', '$2b$10$YOsmUNorzlfMXi2mSfg.mOe5Mik0Ngq5EftaJ.GFsr9IADpFSzf2e'),
    ('Marko', 'Marković', 'marko.narucitelj@spi.local', '$2b$10$YOsmUNorzlfMXi2mSfg.mOe5Mik0Ngq5EftaJ.GFsr9IADpFSzf2e'),
    ('Petra', 'Horvat', 'petra.djelatnik@spi.local', '$2b$10$YOsmUNorzlfMXi2mSfg.mOe5Mik0Ngq5EftaJ.GFsr9IADpFSzf2e');

INSERT INTO Kupac (korisnik_id)
SELECT korisnik_id FROM Korisnik WHERE email = 'iva.narucitelj@spi.local'
UNION ALL
SELECT korisnik_id FROM Korisnik WHERE email = 'marko.narucitelj@spi.local';

INSERT INTO Djelatnik (korisnik_id, pozicija)
SELECT korisnik_id, 'Prodavač' FROM Korisnik WHERE email = 'petra.djelatnik@spi.local';

INSERT INTO KategorijaBicikla (naziv, opis) VALUES
    ('Gradski', 'Bicikli za gradsku vožnju i pendanje.'),
    ('MTB', 'Brdski / trail bicikli.'),
    ('Cestovni', 'Dugi relaji i tempo vožnja.'),
    ('Dječji', 'Manji okviri i prilagođena oprema.'),
    ('Električni', 'E-bike kategorija.');

INSERT INTO Bicikl (naziv, cijena, kolicina, status, kategorija_id, cijena_najma_po_danu) VALUES
    ('City One 28"', 420.00, 5, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Gradski'), 18.00),
    ('Urban Lite', 310.50, 3, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Gradski'), 15.00),
    ('Trail X 29"', 890.00, 2, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'MTB'), 35.00),
    ('RockRide Comp', 1250.00, 1, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'MTB'), 45.00),
    ('Aero Sprint', 2100.00, 2, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Cestovni'), 55.00),
    ('Kid 20"', 180.00, 4, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Dječji'), 12.00),
    ('E-City Pro', 1650.00, 2, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Električni'), 40.00),
    ('E-MTB Lite', 1980.00, 1, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Električni'), 48.00),
    ('City One 28"', 420.00, 0, 'NEDOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Gradski'), NULL),
    ('Trail X 29"', 890.00, 0, 'U_SERVISU', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'MTB'), NULL);

INSERT INTO Narudzba (status, kupac_korisnik_id, djelatnik_korisnik_id)
SELECT
    'NOVA',
    k_korisnik.korisnik_id,
    d_korisnik.korisnik_id
FROM Korisnik k_korisnik
CROSS JOIN Korisnik d_korisnik
WHERE k_korisnik.email = 'iva.narucitelj@spi.local'
  AND d_korisnik.email = 'petra.djelatnik@spi.local';

INSERT INTO Narudzba (status, kupac_korisnik_id, djelatnik_korisnik_id)
SELECT
    'U_OBRADI',
    k_korisnik.korisnik_id,
    NULL
FROM Korisnik k_korisnik
WHERE k_korisnik.email = 'marko.narucitelj@spi.local';

INSERT INTO StavkaNarudzbe (kolicina, cijena, bicikl_id, narudzba_id)
SELECT 1, b.cijena, b.bicikl_id, n.narudzba_id
FROM Bicikl b
CROSS JOIN Narudzba n
WHERE b.naziv = 'City One 28"'
  AND b.kolicina > 0
  AND n.status = 'NOVA'
LIMIT 1;

INSERT INTO StavkaNarudzbe (kolicina, cijena, bicikl_id, narudzba_id)
SELECT 2, b.cijena, b.bicikl_id, n.narudzba_id
FROM Bicikl b
CROSS JOIN Narudzba n
WHERE b.naziv = 'Trail X 29"'
  AND b.kolicina > 0
  AND n.status = 'NOVA'
LIMIT 1;

INSERT INTO StavkaNarudzbe (kolicina, cijena, bicikl_id, narudzba_id)
SELECT 1, b.cijena, b.bicikl_id, n.narudzba_id
FROM Bicikl b
CROSS JOIN Narudzba n
WHERE b.naziv = 'Kid 20"'
  AND b.kolicina > 0
  AND n.status = 'U_OBRADI'
LIMIT 1;

-- Ogledni najmovi (prodaja + najam)
INSERT INTO Najam (datum_pocetka, datum_zavrsetka, status_najma, ukupna_cijena, bicikl_id, djelatnik_korisnik_id, kupac_korisnik_id)
SELECT DATE '2025-03-10', DATE '2025-03-15', 'VRACEN', 5 * 35.00,
  (SELECT bicikl_id FROM bicikl WHERE naziv = 'Trail X 29"' AND status = 'DOSTUPAN' LIMIT 1),
  (SELECT korisnik_id FROM korisnik WHERE email = 'petra.djelatnik@spi.local'),
  (SELECT korisnik_id FROM korisnik WHERE email = 'marko.narucitelj@spi.local');

INSERT INTO Najam (datum_pocetka, datum_zavrsetka, status_najma, ukupna_cijena, bicikl_id, djelatnik_korisnik_id, kupac_korisnik_id)
SELECT CURRENT_DATE - 10, CURRENT_DATE - 6, 'AKTIVAN', 4 * 12.00,
  (SELECT bicikl_id FROM bicikl WHERE naziv = 'Kid 20"' AND status = 'DOSTUPAN' LIMIT 1),
  (SELECT korisnik_id FROM korisnik WHERE email = 'petra.djelatnik@spi.local'),
  (SELECT korisnik_id FROM korisnik WHERE email = 'iva.narucitelj@spi.local');

UPDATE bicikl b
SET status = 'IZNAJMLJEN'
FROM najam n
WHERE n.bicikl_id = b.bicikl_id AND n.status_najma = 'AKTIVAN';
