-- =============================================================================
-- Patch (ZASTARIO za novu shemu): stupac bicikl.inventarni_broj na jednoj tablici bicikl.
-- Nova shema koristi tablicu bicikl_jedinica — vidi SPIB_schema.sql i
-- SPIB_migrate_to_bicikl_jedinica.sql ako bazi nedostaje bicikl_jedinica.
--
-- Stari opis: skladišna jedinica uz bicikl_id
-- Pokrenite na postojećoj bazi ako backend javlja: column b.inventarni_broj does not exist
--
--   psql -U spib -d spib -h localhost -f database/SPIB_patch_inventarni_broj.sql
--
-- Idempotentno: ADD COLUMN IF NOT EXISTS, IF NOT EXISTS na indeksu.
-- =============================================================================

ALTER TABLE bicikl ADD COLUMN IF NOT EXISTS inventarni_broj VARCHAR(64);

UPDATE bicikl SET inventarni_broj = 'JB-' || lpad(bicikl_id::text, 6, '0') WHERE inventarni_broj IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_bicikl_inventarni_broj ON bicikl (inventarni_broj);

ALTER TABLE bicikl ALTER COLUMN inventarni_broj SET NOT NULL;
