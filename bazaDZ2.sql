

CREATE TABLE Korisnik (
    korisnik_id SERIAL PRIMARY KEY,
    ime VARCHAR(50) NOT NULL,
    prezime VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    lozinka VARCHAR(100) NOT NULL
);


CREATE TABLE Kupac (
    korisnik_id INT PRIMARY KEY,
    CONSTRAINT fk_kupac_korisnik
        FOREIGN KEY (korisnik_id)
        REFERENCES Korisnik(korisnik_id)
        ON DELETE CASCADE
);


CREATE TABLE Djelatnik (
    korisnik_id INT PRIMARY KEY,
    pozicija VARCHAR(50) NOT NULL,
    CONSTRAINT fk_djelatnik_korisnik
        FOREIGN KEY (korisnik_id)
        REFERENCES Korisnik(korisnik_id)
        ON DELETE CASCADE
);


CREATE TABLE KategorijaBicikla (
    kategorija_id SERIAL PRIMARY KEY,
    naziv VARCHAR(50) NOT NULL,
    opis TEXT
);


CREATE TABLE Bicikl (
    bicikl_id SERIAL PRIMARY KEY,
    naziv VARCHAR(100) NOT NULL,
    cijena DECIMAL(10,2) NOT NULL CHECK (cijena >= 0),
    kolicina INT NOT NULL CHECK (kolicina >= 0),
    status VARCHAR(30) NOT NULL,
    kategorija_id INT NOT NULL,
    CONSTRAINT fk_bicikl_kategorija
        FOREIGN KEY (kategorija_id)
        REFERENCES KategorijaBicikla(kategorija_id)
);


CREATE TABLE Narudzba (
    narudzba_id SERIAL PRIMARY KEY,
    datum TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL,
    kupac_korisnik_id INT NOT NULL,
    djelatnik_korisnik_id INT,
    CONSTRAINT fk_narudzba_kupac
        FOREIGN KEY (kupac_korisnik_id)
        REFERENCES Kupac(korisnik_id),
    CONSTRAINT fk_narudzba_djelatnik
        FOREIGN KEY (djelatnik_korisnik_id)
        REFERENCES Djelatnik(korisnik_id)
);


CREATE TABLE StavkaNarudzbe (
    stavka_id SERIAL PRIMARY KEY,
    kolicina INT NOT NULL CHECK (kolicina > 0),
    cijena DECIMAL(10,2) NOT NULL CHECK (cijena >= 0),
    bicikl_id INT NOT NULL,
    narudzba_id INT NOT NULL,
    CONSTRAINT fk_stavka_bicikl
        FOREIGN KEY (bicikl_id)
        REFERENCES Bicikl(bicikl_id),
    CONSTRAINT fk_stavka_narudzba
        FOREIGN KEY (narudzba_id)
        REFERENCES Narudzba(narudzba_id)
        ON DELETE CASCADE
);


CREATE TABLE Najam (
    najam_id SERIAL PRIMARY KEY,
    datum_pocetka DATE NOT NULL,
    datum_zavrsetka DATE NOT NULL,
    status_najma VARCHAR(30) NOT NULL,
    bicikl_id INT NOT NULL,
    djelatnik_korisnik_id INT,
    kupac_korisnik_id INT NOT NULL,
    CONSTRAINT fk_najam_bicikl
        FOREIGN KEY (bicikl_id)
        REFERENCES Bicikl(bicikl_id),
    CONSTRAINT fk_najam_djelatnik
        FOREIGN KEY (djelatnik_korisnik_id)
        REFERENCES Djelatnik(korisnik_id),
    CONSTRAINT fk_najam_kupac
        FOREIGN KEY (kupac_korisnik_id)
        REFERENCES Kupac(korisnik_id),
    CONSTRAINT chk_datum_najma
        CHECK (datum_zavrsetka >= datum_pocetka)
);


CREATE TABLE Placanje (
    placanje_id SERIAL PRIMARY KEY,
    iznos DECIMAL(10,2) NOT NULL CHECK (iznos >= 0),
    datum TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metoda VARCHAR(30) NOT NULL,
    status_placanja VARCHAR(30) NOT NULL
);


CREATE TABLE PlacanjeNajma (
    placanje_id INT PRIMARY KEY,
    najam_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_placanje_najma_placanje
        FOREIGN KEY (placanje_id)
        REFERENCES Placanje(placanje_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_placanje_najma_najam
        FOREIGN KEY (najam_id)
        REFERENCES Najam(najam_id)
        ON DELETE CASCADE
);


CREATE TABLE PlacanjeNarudzbe (
    placanje_id INT PRIMARY KEY,
    narudzba_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_placanje_narudzbe_placanje
        FOREIGN KEY (placanje_id)
        REFERENCES Placanje(placanje_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_placanje_narudzbe_narudzba
        FOREIGN KEY (narudzba_id)
        REFERENCES Narudzba(narudzba_id)
        ON DELETE CASCADE
);


