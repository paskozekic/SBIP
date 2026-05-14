-- =============================================================================
-- Migracija: postojeća SPIB baza prije proširenja (auth, katalog, narudžba, najam)
-- Pokretanje (Windows / Linux):
--   psql -U spib -d spib -h localhost -f database/SPIB_migrate_from_pre_spec.sql
-- Nakon uspjeha: restart backend-a.
-- =============================================================================

-- Narudžba: plaćanje, dostava, idempotentnost prodaje
ALTER TABLE narudzba ADD COLUMN IF NOT EXISTS adresa_dostave VARCHAR(500) NOT NULL DEFAULT '';
ALTER TABLE narudzba ADD COLUMN IF NOT EXISTS nacin_placanja VARCHAR(30) NOT NULL DEFAULT 'POUZEĆE';
ALTER TABLE narudzba ADD COLUMN IF NOT EXISTS prodaja_obradena BOOLEAN NOT NULL DEFAULT FALSE;

-- Bicikl: najam po danu (FZ-02); uklonjen stupac url_slike ako postoji iz starije sheme
ALTER TABLE bicikl DROP COLUMN IF EXISTS url_slike;
ALTER TABLE bicikl ADD COLUMN IF NOT EXISTS cijena_najma_po_danu DECIMAL(10,2);

-- Inventarni broj = ljudski čitljiva jedinica u skladištu (uz bicikl_id); nije „model“
ALTER TABLE bicikl ADD COLUMN IF NOT EXISTS inventarni_broj VARCHAR(64);
UPDATE bicikl SET inventarni_broj = 'JB-' || lpad(bicikl_id::text, 6, '0') WHERE inventarni_broj IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_bicikl_inventarni_broj ON bicikl (inventarni_broj);
ALTER TABLE bicikl ALTER COLUMN inventarni_broj SET NOT NULL;

-- Ako je stupac tek dodan, retci imaju NULL — bez cijene najma backend ne dopušta najam
UPDATE bicikl
SET cijena_najma_po_danu = ROUND((cijena * 0.05)::numeric, 2)
WHERE cijena_najma_po_danu IS NULL
  AND status = 'DOSTUPAN'
  AND kolicina > 0;

-- Najam: ukupna cijena (FZ-05)
ALTER TABLE najam ADD COLUMN IF NOT EXISTS ukupna_cijena DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Postojeći retci najma bez iznosa
UPDATE najam SET ukupna_cijena = 0 WHERE ukupna_cijena IS NULL;

-- Seed (starije instalacije): ukloni suvišan tekst u nazivu — stanje je u stupcu status
UPDATE bicikl SET naziv = 'City One 28"' WHERE naziv = 'City One 28" (rezerva)';
UPDATE bicikl SET naziv = 'Trail X 29"' WHERE naziv = 'Trail X 29" (servis)';

-- Lozinke u dev okruženju: zamijeni plain "demo" bcrypt hashom (isti kao u SPIB_seed.sql)
UPDATE korisnik
SET lozinka = '$2b$10$YOsmUNorzlfMXi2mSfg.mOe5Mik0Ngq5EftaJ.GFsr9IADpFSzf2e'
WHERE lozinka IN ('demo', 'demo ');
