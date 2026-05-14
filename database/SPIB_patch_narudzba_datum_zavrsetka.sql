-- Prodaja u izvještaju: filtrirati po trenutku završetka narudžbe, ne po datumu kreiranja.
ALTER TABLE narudzba ADD COLUMN IF NOT EXISTS datum_zavrsetka TIMESTAMP NULL;

-- Postojeće ZAVRSENE: kao aproksimacija koristi datum kreiranja (prije nije bilo zasebnog polja).
UPDATE narudzba SET datum_zavrsetka = datum WHERE status = 'ZAVRSENA' AND datum_zavrsetka IS NULL;

-- Postojeće POTVRDJENE već s knjiženom prodajom: aproksimacija datuma knjiženja.
UPDATE narudzba SET datum_zavrsetka = datum WHERE status = 'POTVRDJENA' AND prodaja_obradena = TRUE AND datum_zavrsetka IS NULL;
