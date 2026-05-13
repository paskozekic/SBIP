-- =============================================================================
-- SPIB – ogledni podaci (nakon SPIB_schema.sql)
-- Lozinke su placeholderi (demo, nije produkcija).
-- =============================================================================

INSERT INTO Korisnik (ime, prezime, email, lozinka) VALUES
    ('Iva', 'Ivić', 'iva.narucitelj@spi.local', 'demo'),
    ('Marko', 'Marković', 'marko.narucitelj@spi.local', 'demo'),
    ('Petra', 'Horvat', 'petra.djelatnik@spi.local', 'demo');

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

INSERT INTO Bicikl (naziv, cijena, kolicina, status, kategorija_id) VALUES
    ('City One 28"', 420.00, 5, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Gradski')),
    ('Urban Lite', 310.50, 3, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Gradski')),
    ('Trail X 29"', 890.00, 2, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'MTB')),
    ('RockRide Comp', 1250.00, 1, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'MTB')),
    ('Aero Sprint', 2100.00, 2, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Cestovni')),
    ('Kid 20"', 180.00, 4, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Dječji')),
    ('E-City Pro', 1650.00, 2, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Električni')),
    ('E-MTB Lite', 1980.00, 1, 'DOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Električni')),
    ('City One 28" (rezerva)', 420.00, 0, 'NEDOSTUPAN', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'Gradski')),
    ('Trail X 29" (servis)', 890.00, 0, 'SERVIS', (SELECT kategorija_id FROM KategorijaBicikla WHERE naziv = 'MTB'));

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
