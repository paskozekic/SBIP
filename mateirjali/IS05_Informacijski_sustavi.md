# Informacijski sustavi – IS05 (FER, Fertalj, 2025/26)

> Kompletne bilješke iz predavanja: modeliranje podataka, OO razvoj, DDD, arhitektura programske podrške, dokumentiranje arhitekture, izrada sustava, testiranje, primjena i održavanje, osnove IS, planiranje, prikupljanje zahtjeva, strukturirana analiza i dizajn.

---

## Sadržaj

1. [Konceptualno modeliranje podataka](#1-konceptualno-modeliranje-podataka)
2. [Logičko modeliranje podataka](#2-logičko-modeliranje-podataka)
3. [Dizajn baze podataka](#3-dizajn-baze-podataka)
4. [Meta-modeliranje](#4-meta-modeliranje)
5. [Objektno orijentirani razvoj](#5-objektno-orijentirani-razvoj)
6. [Domain-Driven Design (DDD)](#6-domain-driven-design-ddd)
7. [Arhitektura programske podrške](#7-arhitektura-programske-podrške)
8. [Dokumentiranje arhitekture – paketi, komponente, ugradnja](#8-dokumentiranje-arhitekture--paketi-komponente-ugradnja)
9. [Izrada sustava – programiranje i refaktoriranje](#9-izrada-sustava--programiranje-i-refaktoriranje)
10. [Provjera ispravnosti – testiranje](#10-provjera-ispravnosti--testiranje)
11. [Primjena i održavanje sustava](#11-primjena-i-održavanje-sustava)
12. [Osnove informacijskih sustava](#12-osnove-informacijskih-sustava)
13. [Strateško planiranje i pokretanje projekta](#13-strateško-planiranje-i-pokretanje-projekta)
14. [Prikupljanje informacija i analiza](#14-prikupljanje-informacija-i-analiza)
15. [Zahtjevi na sustav](#15-zahtjevi-na-sustav)
16. [Strukturirana analiza i dizajn](#16-strukturirana-analiza-i-dizajn)

---

## 1. Konceptualno modeliranje podataka

### Kontekst modeliranja podataka

Modeliranje podataka odvija se u svim fazama životnog ciklusa razvoja sustava:

- **Planiranje (zašto)** → grubi konceptualni model, model poduzeća
- **Analiza (tko, što, kada, gdje)** → konceptualni model podataka
- **Oblikovanje/projektiranje (kako)** → logički model podataka
- **Izrada** → ugradnja fizičke baze podataka ili datoteka
- **Primjena** → operabilni sustav

### Vrste modela podataka

#### Konceptualni model

- Najčešće **model entiteti-veze (MEV)**, prikazan ERD-om
- Predstavlja **poslovni pogled** na podatke
- Zanemaruje nekritične detalje
- Uglavnom sadrži značajne entitete i veze „više prema više"
- Može sadržavati važne atribute i ključeve

#### Logički model

- Relacijski, postrelacijski, objektno-relacijski
- Potpuno definirani atributi i domene (logički tipovi vrijednosti)
- Potpuno definirani ključevi
- Potpuno normalizirani entiteti (samo veze 1:N)

#### Fizički model

- Logički model preveden u model podataka za odabrani SUBP
- Sadrži stvarne tipove, indekse, poglede, procedure i fizičke parametre

### Izrada ERD analizom izjava korisnika

Koraci:
1. Čitanje teksta izjava korisnika
2. Identifikacija imenica → potencijalni entiteti
3. Identifikacija glagola → potencijalne veze
4. Određivanje kardinalnosti veza (1:1, 1:N, M:N)
5. Identifikacija atributa
6. Provjera modela s korisnicima

**Primjer (kemijski laboratorij):** Kemičar ili član osoblja kemijskog laboratorija može podnijeti zahtjev za jednom ili više kemikalija. Zahtjev može biti udovoljen dostavom pakiranja kemikalije koja se već nalazila na zalihi ili upućivanjem narudžbe za novim pakiranjem od vanjskog dobavljača. Osoba koja upućuje zahtjev mora imati mogućnost pretraživanja kataloga kemikalija vanjskog dobavljača dok sastavlja narudžbu. Sustav mora pratiti status svakog zahtjeva za kemikalijama.

Entiteti: `SkladišteLabaratorija`, `ZahtjevZaKemikalijom`, `PakiranjeKemikalija`, `Kemikalija`, `KatalogDobavljača`, `PovijestPakiranja`, `Zahtjevatelj`

### Hijerarhija specijalizacija

- Generalizacija/specijalizacija sličnih entiteta u hijerarhiju
- Nadentitet sadrži zajedničke atribute
- Podentiteti sadrže specifične atribute
- Veza hijerarhije: isključiva (disjoint) ili inkluzivna (overlapping)

### Preporuke za izradu modela podataka

- Uklanjanje veza koje se daju izvesti iz drugih
- Problem paralelnih i cirkularnih veza – treba ukloniti redudanciju
- Balansirane i nebalansirane binarne veze

### Šifarski sustav

- Šifra (code) – skraćena oznaka za identificiranje ili klasificiranje
- **Šifrarnik (code table)** – skup valjanih šifara i njihovih opisa
- **Šifarski sustav** – skup međusobno usklađenih šifrarnika

**Vrste šifara:**
- Numeričke, abecedne, alfanumeričke
- Sekvencijalne (redni broj)
- Blokne (raspon za skupinu)
- Hijerarhijske (višerazinska klasifikacija)
- Kombinacijske (više informacija u jednoj šifri)
- Samodokumentirajuće (mnemotehničke)

**Primjeri šifrarnika:** Šifra države (HR, US, DE...), šifra valute, poštanski broj, šifra zanimanja, OIB/JMBG.

**Izrada šifarskog sustava:**
1. Definirati sve potrebne klasifikacije
2. Provjeriti postoje li standardni šifrarnici
3. Koristiti standardne šifre gdje je moguće
4. Osigurati jedinstvenost šifra
5. Planirati proširenje šifrarnika

---

## 2. Logičko modeliranje podataka

### Pretvorba modela E-V u relacijski model

Pravila pretvorbe:
1. Svaki entitet postaje relacija (tablica)
2. Atributi entiteta postaju stupci relacije
3. Primarni ključ entiteta postaje primarni ključ relacije

### Pretvorba višeznačnih atributa

- Višeznačni atribut → nova relacija s FK na matičnu relaciju
- Svaka vrijednost postaje zapis u novoj relaciji

### Pretvorba ključeva

- Primarni ključ → PK u relaciji
- Jedinstveni ključ → UNIQUE indeks
- Strani ključ (FK) nastaje u relaciji koja sudjeluje u vezi

### Pretvorba binarnih veza

| Vrsta veze | Pretvorba |
|------------|-----------|
| 1:1        | FK u jednoj od relacija (preferira se strana s obaveznim sudjelovanjem) |
| 1:N        | FK u relaciji na strani „mnogo" |
| M:N        | Nova posrednička relacija s FK na obje relacije |

### Pretvorba identifikacijskih veza

- Slabi entitet (weak entity) nema vlastiti primarni ključ
- PK slabog entiteta = PK jakog entiteta + vlastiti parcijalni ključ
- FK na jaki entitet je dio PK slabog entiteta

### Pretvorba nespecifičnih veza (M:N)

- Veza M:N → posrednička tablica
- PK posredničke tablice: kombinacija FK obaju entiteta
- Može imati vlastite atribute veze

### Pretvorba specijalizacija

**Mogućnosti:**
1. Sve specijalizacije u jednu tablicu (s atributom tipa + NULL stupci)
2. Svaka specijalizacija u zasebnu tablicu (sadrži FK na nadentitet)
3. Svaka specijalizacija u tablicu koja ponavlja atribute nadentiteta

**Odabir ovisno o:**
- Broju specijalizacija
- Sličnosti atributa
- Učestalosti upita

### Pretvorba ostalih binarnih veza

- Rekurzivne veze (entitet vezan sam na sebe) → FK unutar iste relacije
- Ternarne veze → posrednička tablica s trima FK

---

## 3. Dizajn baze podataka

### Normalizacija

- **1NF** – bez ponavljajućih grupa, atomski atributi
- **2NF** – 1NF + svaki neatributni atribut potpuno ovisi o cijelom PK
- **3NF** – 2NF + nema tranzitivnih zavisnosti između neatributnih atributa
- **BCNF** – jača varijanta 3NF; svaki determinant je kandidatski ključ
- **4NF** – nema višeznačnih zavisnosti
- **5NF** – nema zavisnosti spajanja

### Denormalizacija

Namjerna odstupanja od normalizacije radi performansi:
- Pohrana izvedenih podataka (npr. ukupno)
- Spajanje rijetko upotrebljavanih tablica
- Dijeljenjem tablice radi učestalih upita na podskup stupaca

**Preporuka:** Denormalizirati tek nakon mjerenja, a ne kao „unaprijed optimizacija".

### Podešavanje (umjesto denormalizacije)

- Indeksi na FK i stupce koji se koriste u WHERE uvjetima
- Particijsko podešavanje velikih tablica
- Pogledi (views) za često korištene projekcije
- Materijalizirani pogledi (Materialized Views)

### Uklanjanje nul-vrijednosti

- NULL može značiti nepoznato, neprimjenjivo ili nepostojano
- Rješenje: izdvajanje opcionalnih atributa u zasebnu tablicu
- Ili korištenje podrazumijevanih vrijednosti

### Nadomjesni (surogatni) ključevi

- Tehnički PK koji nema poslovno značenje (npr. auto-increment INT)
- Uvodi se kad prirodni ključ nije prikladan

**Razlozi uvođenja:**
- Prirodni ključ je promjenjiv (npr. OIB može biti ispravan ili pogrešan)
- Prirodni ključ je složen (višestruki stupci)
- Poboljšanje performansi JOIN operacija

**Aplikacijski razlozi:**
- Prikrivanje internih ključeva od korisnika
- Olakšana replikacija i integracija sustava
- Globalno jedinstveni identifikatori (GUID/UUID)

### „Čisti" dizajn

Načela:
- Svaka tablica modelira jednu stvar
- Nema višeznačnih stupaca
- Nema ponavljajućih skupina
- Stupci imaju konzistentna značenja

### Izvedeni podaci (Derivable Data)

- Podaci koji se mogu izračunati iz drugih podataka
- Primjer: `UkupnaCijena = Cijena * Količina`
- **Opasnost:** pohrana izvedenih podataka → rizik nekonzistentnosti
- **Preporuka:** izvoditi (računati) u aplikaciji ili pogledu, ne pohranjivati
- Iznimka: performanse, ako se izračun ponavlja često i skupo

**Tablica izvješća (Report Table):**
- Posebna tablica napunjena agregatnim podacima radi performansi
- Popunjava se periodickim procesima (batch)
- Prihvatljivo rješenje za analitičke upite

### Preopterećeni tipovi podataka

- Jedan stupac koji nosi više različitih vrsta podataka (ovisno o tipu zapisa)
- Antiuzorak – treba izbjegavati
- Rješenje: zasebni stupci ili zasebne tablice

---

## 4. Meta-modeliranje

### Pojam

- **Meta-model** – model koji opisuje drugi model
- **Meta-baza (Data Dictionary)** – baza podataka o bazi podataka
- Podaci o strukturi (tablice, stupci, domene, ograničenja, ...)

### Modelom vođena arhitektura (MDA – Model-Driven Architecture)

Razine:
- **M3** – meta-meta-model (npr. MOF – Meta-Object Facility)
- **M2** – meta-model (npr. UML)
- **M1** – model (npr. dijagram razreda aplikacije)
- **M0** – instanca (izvodeći sustav, stvarni objekti)

### Jezik za opis metamodela

- **MOF** – OMG standard za definiranje meta-modela
- **Ecore** (Eclipse Modeling Framework)
- **XML Schema** za opisivanje strukture XML dokumenata

### Životni ciklus MDA

1. Izrada platformski neovisnog modela (PIM – Platform-Independent Model)
2. Transformacija PIM → PSM (Platform-Specific Model)
3. Transformacija PSM → izvorni kod

### Transformacija modela

- **Model-to-model (M2M)** – npr. UML → relacijski model
- **Model-to-text (M2T)** – npr. UML → SQL DDL, C# klase
- Alati: Eclipse MDA, Acceleo, AndroMDA, openArchitectureWare

### Primjene meta-modeliranja

- Rječnik SUBP (sistemske tablice i INFORMATION_SCHEMA)
- Generatori aplikacija – generiranje koda iz meta-modela
- Opisi sučelja, web servisi (WSDL, XSD)
- Konfigurabilne aplikacije (tablicama opisani obrasci, prava pristupa, ...)

### Shema rječnika SUBP

- SUBP čuva opis svojih objekata u tzv. **rječniku podataka** ili **sistemskim tablicama**
- Standardizirani pristup: **INFORMATION_SCHEMA** (SQL standard)
- Sadrži: TABLES, COLUMNS, CONSTRAINTS, REFERENTIAL_CONSTRAINTS, ...

**Primjer upita:**
```sql
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'dbo'
ORDER BY TABLE_NAME, ORDINAL_POSITION
```

### Sistemske tablice i objekti

- MS SQL Server: `sys.tables`, `sys.columns`, `sys.indexes`, `sys.foreign_keys`
- Oracle: `USER_TABLES`, `USER_COLUMNS`, `ALL_CONSTRAINTS`
- Koriste se za administraciju, dokumentaciju, generiranje koda

### Meta-modeliranje aplikacije

**Ideja:** Opisati elemente aplikacije (entiteti, atributi, forme, izvješća) u tablicama baze podataka, a ne hardkodirati u aplikaciji.

Prednosti:
- Konfigurabilnost bez rekompilacije
- Smanjivanje dupliciranja koda
- Lakše dodavanje novih entiteta

Primjer kaskade sličnih entiteta → opisati ih meta-modelom koji generira UI i logiku.

---

## 5. Objektno orijentirani razvoj

### Prikupljanje zahtjeva

#### Radni tok (Workflow)

- OO razvoj nije sekvencijalan nego iterativni s radnim tokovima
- **Radni tok prikupljanja zahtjeva:** identificiranje dionika, prikupljanje zahtjeva, modeliranje slučajeva korištenja
- **Radni tok konstrukcije:** dizajn, implementacija, testiranje

#### Modeliranje funkcionalnosti – Use Case dijagrami

- **Akter (Actor)** – osoba, organizacija ili sustav koji interagira s IS
- **Slučaj korištenja (Use Case – UC)** – opis interakcije aktora i sustava
- Veze: `<<include>>`, `<<extend>>`, generalizacija

**Primjer UC dijagrama:** sustav za reservacije s akterima Korisnik, Administrator, Sustav plaćanja i UC-ovima kao što su Pretraži dostupnost, Napravi rezervaciju, Potvrdi rezervaciju, Otkaži rezervaciju.

#### Opis slučaja korištenja

Elementi:
- Naziv i ID slučaja korištenja
- Kratki opis
- Akteri
- Preduvjeti (preconditions)
- Tok događaja (main flow)
- Alternativni tokovi
- Poslijeuvjeti (postconditions)
- Posebni zahtjevi (nefunkcionalni)

**Primjer:**
- **Naziv:** Napravi rezervaciju
- **Akter:** Registrirani korisnik
- **Preduvjet:** Korisnik je prijavljen u sustav
- **Osnovni tok:** korisnik odabire datume → sustav prikazuje dostupnost → korisnik odabire smještaj → korisnik potvrđuje → sustav sprema rezervaciju
- **Alternativni tok:** nema dostupnih smještaja → sustav obavještava korisnika

### Modeliranje struktura

#### CRC kartice (Class-Responsibility-Collaborator)

- Tehnika za inicijalno identificiranje razreda
- Kartica = razred, njegova odgovornost, suradnici

**Format:**
```
Naziv razreda:
Odgovornosti:           Suradnici:
- opis odgovornosti     - SuradničkiRazred
```

#### Koraci modeliranja strukture

1. Identificirati potencijalne objekte (imenice u opisu zahtjeva)
2. Identificirati odgovornosti (glagoli)
3. Rasporediti odgovornosti na objekte
4. Identificirati suradnike
5. Izraditi CRC kartice

### Dizajn vođen odgovornostima (RDD – Responsibility-Driven Design)

- Fokus na **što objekti znaju** (know) i **što objekti rade** (do)
- Uspoređuje se s poduzetjem gdje objekti igraju uloge (roles)
- Odgovornosti se grupiraju u ugovore (contracts) koje objekt nudi

**Pristup:**
1. Identificirati objekte kroz igranje uloga
2. Dodijeliti odgovornosti
3. Definirati suradnje između objekata
4. Restrukturirati i optimizirati dizajn

### Projektiranje objekata (Object Design)

#### Razredi potencijalnih objekata

- Entitetski razredi – opisuju „stvari" iz problemske domene
- Granični razredi (boundary) – sučelje prema korisnicima ili sustavima
- Upravljački razredi (control) – koordiniraju poslovnu logiku

#### Revizija dizajna

Pitanja pri reviziji:
- Može li se reducirati broj razreda?
- Postoje li razredi s previše odgovornosti?
- Postoje li razredi s premalo odgovornosti?
- Može li se iskoristiti nasljeđivanje?

#### Problemi u dizajnu – Zaduženje (Assignment Problem)

Kada je nejasno kojem razredu pripada odgovornost → analizirati:
- Koji razred „zna" više o predmetu odgovornosti?
- Koji razred je kohezivniji ako mu se doda ta odgovornost?

#### Udruživanje sličnih razreda – nasljeđivanje

- Apstrakcija zajedničkog ponašanja u nadrazred
- Specifičnosti u podrazredima
- Odgovornosti nadrazreda = odgovornosti koje dijele svi podrazredi

### Vladanje zajedničkim ponašanjem – obrasci dizajna

- Nasljeđivanje (Inheritance) – za dijeljenje implementacije
- Agregacija – „ima" veza
- Kompozicija – jaka agregacija (komponenta ne može bez cjeline)
- Delegiranje – objekt delegira odgovornost drugom objektu

### ORM – Object-Relational Mapping

Na kraju OO analize dobivamo **OO model**, ali pohrana podataka je relacijska:
- Relacijski dizajn i OO dizajn su 2 različita procesa s različitim modelima
- Usklađivanje: **ORM (Object-Relational Mapping)** – tehnika konverzije podataka između relacijske BP i OO jezika
- Alati: Entity Framework (.NET), Hibernate (Java), Django ORM (Python)

---

## 6. Domain-Driven Design (DDD)

### Uvod

- **Domena** – problemsko područje (što sustav modelira)
- **DDD** – projektiranje softvera na temelju ulaza stručnjaka domene (domain experts)
- Koncepti nastali iz suradnje razvojnog tima i domenskih stručnjaka

### Sveprisutni jezik (Ubiquitous Language)

- Zajednički jezik razumljiv i razvojnicima i domenskim stručnjacima
- Koristi se konzistentno u kodu, dokumentaciji i razgovorima
- Sprječava semantičke prijevode koji uvode greške

**Primjer scenarija:** „The product owner commits a backlog item to a sprint. The backlog item may be committed only if it is already scheduled for release, and if a quorum of team members have approved commitment."

Ovi pojmovi (`commit`, `backlog item`, `sprint`, `quorum`, `team member`) trebaju se 1:1 pojaviti u kodu.

### Ograničeni kontekst (Bounded Context)

- Granica/opseg jedne (pod)domene
- Unutar jednog konteksta – jedan konzistentni model
- Između konteksta – integracija i preslikavanje

### Domene i poddomene

- **Jezgrena (Core Domain)** – ključna kompetitivna prednost organizacije; vlastiti razvoj, dobro definiran model
- **Potporna (Supporting Subdomain)** – zahtijeva razvoj po mjeri, ne postoji gotovo rješenje; vanjski razvoj (outsourcing)
- **Opća poddomena (Generic Subdomain)** – kupiti gotovo rješenje ili eksternalizirati

### Strateški dizajn mapiranjem konteksta (Context Mapping)

Odnosi između konteksta:

| Obrazac | Opis |
|---------|------|
| **Partnership** | Sinkronizacija, kontinuirana integracija dviju ekipa |
| **Shared Kernel** | Dijeljeni dio modela između konteksta |
| **Customer-Supplier** | Supplier (upstream U) određuje što i kada Customer (downstream D) dobiva |
| **Conformist** | Downstream preuzima upstream model bez preslikavanja |
| **Anticorruption Layer** | Translacija upstream modela u prikladni downstream model |
| **Open Host Service (OHS)** | Definira protokol/sučelje otvoreno za korištenje |
| **Published Language** | Dobro dokumentirani jezik razmjene (XML Schema, JSON Schema) |
| **Separate Ways** | Svaki kontekst razvija vlastito specijalizirano rješenje |

### Građevni blokovi MDD (Modelom vođeni dizajn)

#### Entiteti (Entities)

- Imaju identitet koji se ne mijenja promjenom stanja softvera
- Atributi entiteta se mogu mijenjati (mutable)
- Imaju ponašanje – poslovna logika
- Primjer: `Narudžba`, `Korisnik`, `Projekt`

#### Vrijednosni objekti (Value Objects – VO)

- „Stvari" bez identiteta/jedinstvenosti
- Jednaki ako imaju jednake vrijednosti svih atributa
- Atributi često nepromjenjivi (immutable) – uništiš i stvoriš novi
- Primjer: `Adresa`, `Novac`, `Datumski raspon`

**Varijante:**
- **DTO (Data Transfer Object)** – klasa podataka bez logike, za prijenos između slojeva
- **POCO/POJO** – Plain Old (C)LR/Java Object – bez tehničke infrastrukture

#### Agregati (Aggregates)

- Grupe entiteta i vrijednosti tretirane kao cjelina
- Svaki agregat ima jedan **korijenski entitet (Aggregate Root)**
- Identitet korijena je globalan; identiteti unutarnjih entiteta su lokalni
- Vanjski objekti smiju referencirati **samo korijen**
- Interni objekti ne mogu biti promijenjeni izvan agregata
- Svaki agregat treba biti izmijenjen i pohranjen u **zasebnoj transakciji**

#### Taktički dizajn agregatima – osnovna pravila

1. **Zaštiti poslovne invarijante unutar granica agregata** – konzistentnost: „po završetku transakcije svi zavisni dijelovi moraju biti konzistentni u odnosu na korijen"
2. **Dizajniraj male agregate** – manje je lakše savladivo; primijeni SRP (Single Responsibility Principle)
3. **Referenciraj ostale agregate samo identitetom** – nema navigacijskih referenci između agregata
4. **Ažuriraj ostale agregate koristeći eventual consistency** – konačna konzistentnost; promjene se propagiraju asinkrono

#### Usluge (Services)

- Poslovna logika domene koja nije prirodni dio entiteta ili vrijednosnog objekta
- Obično rukuju s više entiteta i VO
- **Nema stanje (stateless!)**
- Izložena kao sučelje definirano modelom
- Parametri i rezultati su domenski objekti

**Vrste servisa:**
- **Aplikacijska usluga** – koordinacija slučajeva korištenja, bez poslovne logike
- **Domenska usluga** – poslovna logika koja ne pripada jednom entitetu
- **Infrastrukturna usluga** – tehnički servisi (email, log, pohrana)

#### Tvornice (Factories)

- Objekt koji kreira složene domenskih objekte/agregate
- Skriva složenost kreiranja
- Osigurava konzistentnost novostvorenih objekata

#### Repozitoriji (Repositories)

- Učahuruju pohranu i dohvat domenskih objekata (persistence and retrieval)
- Čisto razdvajanje i jednosmjerna zavisnost između domene i sloja za preslikavanje podataka
- **Jedan repozitorij po agregatu!**
- Sučelje definira domena; implementacija je u infrastrukturnom sloju

### Slojevita arhitektura DDD-a

- **Korisničko sučelje** – prezentacija
- **Aplikacijski sloj** – koordinacija aplikacijskih aktivnosti, orchestration
- **Domenski sloj** – stanje poslovnih objekata, poslovna logika (srce aplikacije)
- **Potporna knjižnica/Infrastruktura** – komunikacija slojeva, implementacija pohrane, integracijski adapteri

---

## 7. Arhitektura programske podrške

### Temeljni pojmovi

- **Softverska arhitektura (software architecture)** – nacrt sustava (blueprint), strukturirano rješenje; opisuje komponente sustava, njihovu povezanost i interakciju
- **Stil arhitekture** – organizacija programskog koda, specifikacija slojeva i modula (Component-based, Monolithic, Layered, Pipes-and-Filters, Event-driven, ...)
- **Arhitekturni obrazac (architectural pattern)** – općenito, višekratno iskoristivo rješenje uobičajenog problema softverske arhitekture u zadanom kontekstu (Three-tier, Microkernel, MVC, MVVM, ...)

### Aplikacija i arhitektura

- **Aplikacija** – skup programskih komponenti koje čine logičku cjelinu (dvoslojni debeli klijenti, višeslojni pametni klijenti, web aplikacije)
- Nasuprot SOA modelu – poslovni sustav sastavljen od aplikacija i servisa gdje su korisnička aplikacija i servis nezavisne cjeline; servis je također aplikacija – JSON ili XML umjesto GUI ili HTML sučelja

**Logička arhitektura** – razdvajanje tipova funkcionalnosti (sučelje, poslovni sloj, podatkovni sloj)
- Sloj logičke arhitekture = **layer** → n-layer architecture

**Fizička arhitektura** – fizička reprezentacija glavnih komponenti IS; raspodjela logičkih komponenti na fizičke uređaje
- Sloj fizičke arhitekture = **tier** → n-tier architecture

### Petoslojna logička arhitektura

| Sloj | Kratica | Opis |
|------|---------|------|
| Korisničko sučelje | UI, PL | Prezentacijski sloj – prikaz podataka, unos korisnika |
| Kontrola sučelja | IC | Generiranje izlaza, interpretacija ulaza; event-driven |
| Poslovni sloj | BL | Poslovna pravila, validacija, autentifikacija |
| Podatkovni sloj | DL, DAL | Dohvat, umetanje, ažuriranje, brisanje (CRUD) bez pohrane |
| Sloj pohrane i upravljanja podacima | DSML | Fizička pohrana, CRUD mehanizmi RSUBP-a |

#### Detalji pojedinih slojeva

**Korisničko sučelje (UI, PL):**
- Prikaz podataka, unos od strane korisnika
- Primjer: HTML = MVC view, SOA JSON/XML poruka, Windows sučelje
- Vrlo slično i blisko kontroli sučelja

**Kontrola sučelja (IC):**
- Generiranje izlaza, interpretacija/obrada ulaza
- Primjer: Web, WPF ili WF pozadinski kod, MVC controller
- Vođen događajima (event-driven)
- Prihvat unosa korisnika i prosljeđivanje u BL na validaciju i obradu

**Poslovni sloj (BL):**
- Poslovna pravila, validacija, obrada, autentifikacija, database lookups...
- Primjer: MVC model
- Odvajanje od sučelja olakšava održavanje i ponovnu iskoristivost
- Fizički bliže PL – klijentsko računalo, interaktivne aplikacije (npr. validacija)
- Fizički bliže DL – nefunkcionalni procesi (npr. obrada plaća, izračun zaliha)

**Podatkovni sloj (DL):**
- Surađuje sa slojem pohrane i rukovanja podacima
- Dohvaća, umeće, ažurira, briše podatke – ali **ne upravlja i ne pohranjuje**
- Sučelje između BL i DSML
- Odvajanje povećava fleksibilnost – neovisnost o sustavu pohrane
- Primjer: ADO.NET, LINQ, EF
- Omogućuje objektno-relacijsko preslikavanje (ORM)

**Sloj pohrane i rukovanja podacima (DSML):**
- Upravlja fizičkim stvaranjem, dohvatom, ažuriranjem i brisanjem podataka
- Mehanizmima RSUBP ili XML servisa implementira CRUD mehanizme
- Može replicirati dio poslovnih pravila (npr. pravila integriteta)

### Veza logičke i fizičke arhitekture

**Ključna spoznaja:** Logička arhitektura se ne preslikava 1:1 u fizičku!

- Logička arhitektura odnosi se isključivo na odvajanje funkcionalnosti
- Broj slojeva logičke ≥ broj slojeva fizičke arhitekture
- Više logičkih slojeva može biti smješteno na isti fizički uređaj
- Prilikom kreiranja aplikacije važno je odabrati logičku arhitekturu koja će omogućiti kasniji odabir fizičke arhitekture

**Komunikacija slojeva – ograničenja:**
- BL od DL: moderne aplikacije odvajaju podatke od ostatka
- UI od BL: nepraktično i nepoželjno zbog data bindinga

### Fizičke arhitekture i složenost aplikacija

**Višeslojne fizičke arhitekture smanjuju složenost ako:**
- Aplikacija je velika ili složena
- Postoji velika ili složena kombinacija više jednostavnih aplikacija
- Velika ili složena okolina (ugradnje, podrške)

**Višeslojne fizičke arhitekture povećavaju složenost ako:**
- Aplikacija je mala ili relativno jednostavna
- Aplikacija nije dio većeg sustava
- Jednostavna okolina

**Napomena:** Jednostavne aplikacije mogu rasti i usložnjavati se → treba planirati skalabilnost.

### Karakteristike fizičke arhitekture (kriteriji uslojavanja)

**Performanse – brzina odziva:**
- Najveća kad su komponente na istom računalu

**Skalabilnost – prilagodba kapaciteta s obzirom na opterećenje:**
- Smanjenje opterećenja odvajanjem poslovne logike na aplikacijski poslužitelj
- Za većinu aplikacija ipak nije dovoljan razlog za prijelaz na tri sloja (moderne BP lako poslužuju stotine istovremenih korisnika u dvoslojnoj)

**Sigurnost – glavni argument:**
- Broj fizičkih slojeva ne utječe na autentifikaciju/autorizaciju korisnika
- Utječe na fizički pristup strojevima pojedinog sloja (npr. izloženost konekcija)
- Troslojna je općenito sigurnija ali unutar iste LAN teže branjiva (poželjno odvajanje vatrozidom)

**Tolerancija pogrešaka:**
- Bolja ako su fizički dijelovi zamjenjivi (npr. redundantnim hardverom)

### Fizička ugradnja logičke arhitekture

#### Pametni (smart) klijent s optimalnim performansama

- Samostalna aplikacija – svi logički slojevi na istom stroju
- Primjer: blagajna (POS) uz periodički transfer podataka
- Debeli klijent – odvajanje DSML (premještaj BP na server zahtijeva samo promjenu konekcije)
- Maksimalno okvirno 300 istovremenih korisnika

#### Visokoskalabilni pametni klijent u troslojnoj fizičkoj arhitekturi (1)

Odvajanje DL na aplikacijski poslužitelj:
- Dobro pravilo: više od 50–100 istovremenih korisnika
- Bolja sigurnost – DAL kôd se seli na aplikacijski poslužitelj pa nije izložen na korisničkom računalu
- Bolja optimizacija pristupa (connection pooling) kad korisnici koriste isto korisničko ime – 150–200 istovremenih pristupa s 2–3 konekcije

Odvajanje BL na aplikacijski poslužitelj:
- Dobro za neinteraktivne aplikacije
- Ipak, većina modernih aplikacija zahtijeva korisničku interakciju
- Nedostatak: latencija, pad performansi

#### Visokoskalabilni pametni klijent u troslojnoj fizičkoj arhitekturi (2)

DL na aplikacijskom poslužitelju, BL i na klijentu i poslužitelju:
- Iskorištenje snage oba računala (validacija na klijentu, procesna obrada na poslužitelju)
- Preko 1000 istovremenih korisnika
- Vrlo velika skalabilnost

#### Web-klijent s optimalnim performansama

- Osnovna varijanta: IL fizički odvojen (u pregledniku), ostali slojevi na istom stroju
- Manje mrežno opterećenje, bolje performanse
- Poboljšanje skalabilnosti: web farma s više web poslužitelja koji izvode isti kod
- Dobar pristup (pooling) BP jer svaki web poslužitelj obradi stotine korisnika

#### Vrlo sigurni Web-klijent

- Web poslužitelj u **demilitariziranoj zoni (DMZ)** – između vanjskog i unutarnjeg vatrozida
- Komunicira s drugim poslužiteljem na kojem je BP
- Slično skalabilnoj troslojnoj arhitekturi – BL i na web i na aplikacijskom serveru
- Cijena: 50% smanjenja performansi
- Povećanje skalabilnosti web farmom

### Aplikacijski okvir (Application Framework)

- **Aplikacijski okvir** – okosnica aplikacije; skup osnovnih softverskih rutina koje čine temeljnu strukturu za razvoj aplikacije u koju se ugrađuju aplikacijski specifične komponente (poslovni objekti, poslovna pravila, zaslonske maske, ...)
- **Okvir poduzeća (Enterprise Framework)** – cjelovito okruženje za razvoj i ugradnju složenih IS; sadrži pre-built aplikacije i razvojne alate za prilagodbu i integraciju; može imati komponente za upravljanje radnim tokovima (workflow)

**Primjeri okvira:**
- **CSLA.NET** (Component-based Scalable Logical Architecture) – .NET Core, Windows/macOS/Linux/iOS/Android
- Spring, Apache Struts, Oracle ADF – Java
- Angular, React – web
- React Native, Xamarin – mobile
- Flutter, Ionic – hybrid

#### Elementi aplikacijskog okvira CSLA.NET

| Sloj | Sadržaj |
|------|---------|
| Prezentacijski | Sučelje glavne forme, bazne forme i kontrole, logika ponašanja aplikacije, komunikacija između formi |
| Poslovni | Bazne poslovne klase, pomoćne klase (validacija, kontrola pristupa), automatizacija upravljanja poslovnim objektima (stvaranje, uništavanje, prijenos između klijenta i poslužitelja) |
| Podatkovni | Bazne klase za pristup podacima, automatizacija čitanja/spremanja/brisanja, upravljanje transakcijama |

**Pametan i mobilan objekt (Smart Mobile Object):**
- Umjesto pasivnih skupova podataka → poslovni objekt centralizira logiku
- DataPortal mehanizam: klijent može pozvati operacije koje se transparentno izvode na poslužitelju (Start new) ili lokalno (Step into)

### Čista arhitektura (Clean Architecture)

- The Clean Architecture (Martin, 2012) – filozofija softverskog dizajna kružnim odvajanjem elemenata
- Opći naziv za srodne: Onion, Hexagonal, ...
- **Pravilo zavisnosti (dependency rule):** zavisnost samo prema unutra (od vanjskog prema jezgri)

**Prstenovi (od jezgre prema van):**
1. **Entiteti** – poslovna pravila poduzeća, jezgra, kao model domene u lukovici
2. **Use Cases** – aplikacijska pravila
3. **Interface Adapters** – MVC, Presenters, Gateways
4. **Frameworks & Drivers** – detalji (baze podataka, web okviri, UI)

**Problem:** zavisnost prema unutra uz tok podataka unutra-van.

### Inverzija zavisnosti (Dependency Inversion Principle – DIP)

- Visokouslojni moduli ne ovise o niskouslojnim; oba ovise o apstrakcijama
- Apstrakcije ne ovise o detaljima; detalji ovise o apstrakcijama
- Primjena: interfaceima se definira kontrakt između slojeva; implementacija je u donjem sloju

**Primjer:** BL definira sučelje `IRepository`; DL implementira `Repository`. BL ovisi o sučelju, ne o konkretnoj implementaciji.

### Arhitektura lukovice (Onion Architecture)

- Onion architecture (Jeffrey Palermo, 2008)
- **Problem:** kopčanje UI, BL na DAL (ne toliko kao na infrastrukturu)
- **Rješenje:** DI principle – baza nije u središtu nego vani; ne postoje „database apps"
- Aplikacije mogu koristiti BP za pohranu kodom koji implementira sučelja

**Slojevi lukovice (od jezgre prema van):**
1. Domain Model – entiteti, VO
2. Domain Services – repozitoriji (sučelja), domenski servisi
3. Application Services – koordinacija
4. Infrastructure/Tests/UI – vanjski detalji

**Primjer projekta:** IS07-Project.MVC-Onion s projektima `DomainModel`, `DomainModel.Validation`, `DomainServices`, `Infrastructure`, `ProjectMVC`.

#### DomainModel + DomainModel.Validation

- Entiteti domene
- Validacija odvojena (nije nužno)
- **MediatR** – implementira obrazac Mediator, za složenije validacije
- **FluentValidation** – .NET library za strongly-typed validacijska pravila

#### DomainServices + Infrastructure

- Sučelja repozitorija
- Repozitoriji (implementacije)
- DTO (EFModel – Data Transfer Object za preslikavanje s domenom)

#### ProjectMVC – postavljanje dependency injection

```csharp
// Kontekst BP za repozitorije
builder.Services.AddDbContext<ProjectContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Project")));

// Repozitoriji za konstruktore kontrolera
builder.Services.AddTransient<IPeopleRepository, PeopleRepository>();

// AutoMapper – preslikavanje domene i modela
builder.Services.AddAutoMapper(mapperConfigAction, typeof(MappingProfile));
```

#### Primjer kreiranja novog projekta (Onion MVC)

```csharp
[HttpPost]
public async Task<IActionResult> Create(ProjectViewModel model)
{
    var domainEntity = mapper.Map<DomainModel.Project>(model); // prepiši
    domainEntity.IsNew = true; // za razliku od ažuriranja
    await domainEntity.Validate(validators); // pozove ProjectValidator
    await projectsRepository.SaveProject(domainEntity); // pospremi
    TempData.Put(Constants.ActionStatus, new ActionStatus(true, $"{model.ProjectName} added"));
    return RedirectToAction(nameof(Details), new { id = model.ProjectId });
}
```

### Arhitektura vertikalnog reza (Vertical Slice Architecture)

- Vertical Slice Architecture (Bogard, 2018)
- Svaki zahtjev kao zasebni use case
- Grupiranje brige (concerns) oko različitih zahtjeva od fronte do pozadine
- **Kopčanje unutar kriške** a ne sloja / između kriški
- Sustav se uredno rastavlja na „naredbe" i „upite" → CQRS

#### Problem strukture foldera u ASP.NET MVC

- Standardni MVC: podjela na M (Models), V (Views), C (Controllers) – sve zajedno
- Problem: pri dodavanju feature-a treba dirnut tri različita foldera

#### Rješenje strukture foldera – Grupiranje Features

```csharp
// Program.cs – prilagodba routinga
app.MapDefaultControllerRoute();

// FeatureLocationExpander
public IEnumerable<string> ExpandViewLocations(...)
{
    return new string[] {
        "/Features/{1}/{0}.cshtml",
        "/Features/Shared/{0}.cshtml"
    };
}
```

### Odvajanje naredbi i upita (CQRS)

#### CQS – Command-Query Separation (Meyer, 2014) – načelo

- Svaka metoda treba biti ili **naredba** koja izvodi radnju ili **upit** koji vraća podatke – ali **ne oboje**

#### CQRS – Command Query Responsibility Segregation – arhitekturni obrazac

- Primjena CQS principa odvajanjem poruka za dohvat i izmjenu podataka

#### Implementacija naredbi i upita

```csharp
// DomainServices – „deklaracije" zahtjeva
public class Commands {
    public record DeleteProjectCommand(string ProjectId) : IRequest;
    public class AddProjectCommand : IRequest {
        public string ProjectId { get; set; }
        // ...
    }
}

public class Queries {
    public record GetProjectQuery(string ProjectId, bool IncludeMembers) : IRequest<Project>;
    public class GetProjectsQuery : IRequest<IList<ProjectInfo>> {
        public SieveModel Criteria { get; set; }
    }
}
```

#### Validacija u CQRS/MediatR

```csharp
public AddProjectCommandValidator(IMediator mediator) {
    RuleFor(p => p.ProjectId).NotEmpty().MaximumLength(10)
        .DependentRules(() => RuleFor(p => p.ProjectId)
            .MustAsync(ProjectIdMustBeUnique)
            .WithMessage("ProjectId must be unique"));
    RuleFor(p => p.ProjectName).NotEmpty().MaximumLength(50);
    When(a => a.EndingDate.HasValue && a.StartingDate.HasValue, () =>
        RuleFor(a => a.StartingDate.Value).LessThanOrEqualTo(a => a.EndingDate.Value));
}
```

#### Primjer slijeda (Vertical Slice + CQRS)

```csharp
// ProjectsController
[HttpPost]
public async Task<IActionResult> Create(ProjectViewModel model) {
    var command = mapper.Map<Commands.AddProjectCommand>(model);
    await mediator.Send(command); // ide kroz ValidationBehavior pa u Handler
}

// Infrastructure Handler
public async Task<Unit> Handle(AddProjectCommand request, CancellationToken ...) {
    var entity = mapper.Map<EFModel.Project>(request);
    ctx.Add(entity);
    await ctx.SaveChangesAsync();
}
```

### Šesterokutna arhitektura (Hexagonal Architecture)

- Hexagonal architecture (Cockburn, 2005)
- **Problem:** sprezanje poslovne logike s vanjskim komponentama:
  - Infiltracija poslovne logike u kôd za pristup podacima
  - Infiltracija poslovne logike u kôd korisničkog sučelja
- **Perspektiva:** arhitekturu sagledavamo iznutra prema van (umjesto gore-dolje)
- Hexa je navodno ishodište mikroservisne arhitekture

**Komponente (4 vrste):**
1. Jezgra aplikacije (poslovna logika)
2. Baza podataka (sekundarni prilagodnik)
3. Korisničko sučelje (primarni prilagodnik)
4. Testne skripte (primarni prilagodnik)

#### Obrazac priključaka i prilagodnika (Ports-and-Adapters)

**Priključci (Ports):**
- Sučelja koja propisuju oblik povezivanja vanjskih komponenti
- Primjer: `IRepository`, `INotifier`

**Prilagodnici (Adapters):**
- Komponenta koja se veže na sustav preko priključka
- Primjer: `MongoRepository`, `MySQLRepository`, `EmailNotifier`, `ChatNotifier`

**Primarni (pokretački) prilagodnici:**
- Aplikacije
- Testna okruženja
- Administracijska sučelja
- Druge aplikacije/sustavi

**Sekundarni (pokretani) prilagodnici:**
- Komponente za slanje notifikacija
- Komponente za pristupanje podacima

**Tipična granulacija priključaka:**
- Izvori događaja (korisničko sučelje, automatski izvori)
- Notifikacije (izlazne)
- Spremišta podataka (sučelja prema BP i drugim spremištima)
- Administriranje (kontrola komponenti)

#### Šesterokutna arhitektura – primjer (IS07-ProjectHEX)

- `IS07-ProjectHEX.Domain\Models` – agregati (Aggregate Root)
- `IS07-ProjectHEX.Domain\Commons` – entiteti, VO, zajednički elementi
- `IS07-ProjectHEX.Ports\Repositories` – sučelja repozitorija (priključci)
- `IS07-ProjectHEX.Adapters.Repositories.Mssql` – implementacija nad SQL Serverom
- `IS07-ProjectHEX.Adapters.UseCases` – implementacija use caseva

**Odvajanje domenskog modela od DAL modela (Mappers):**
```csharp
internal static DomainModels.Person ToDomainModel(this DbModels.Person person) =>
    new DomainModels.Person(
        person.PersonId,
        person.PersonFirstName,
        person.PersonLastName,
        person.PersonEmail,
        person.PersonalIdentificationNumber);

internal static DbModels.Person ToDbModel(this DomainModels.Person person) =>
    new DbModels.Person() {
        PersonId = person.Id,
        PersonFirstName = person.FirstName,
        // ...
    };
```

**Postavljanje dependency injection (WpfApp):**
```csharp
// Repozitoriji
services.AddTransient<IRoleRepository, MssqlRepos.RoleRepository>();
// Notifikatori
services.AddTransient<IEmailNotifier, TraceEmailNotifier>(_ =>
    new TraceEmailNotifier(
        Configuration.GetSection("EmailSubscribers").AsEnumerable()
            .Select(x => new EmailSubscriber(x.Key, x.Value))));
// Use Cases
services.AddTransient<IProjectUseCases, ProjectUseCases>();
// ViewModels i Views
services.AddTransient<MainViewModel>();
```

#### Netflix i šesterokutna arhitektura (blog 2020)

Netflix implementacija (više od 30 developera, 300 tablica):

**Interna poslovna logika:**
- **Entities** – objekti domene koji ne znaju gdje su pohranjeni
- **Repositories** – sučelja za dobavljanje, stvaranje i izmjenu entiteta
- **Interactors** – klase za orkestraciju akcija, poslovna pravila, validacija

**Vanjski „sloj":**
- **Data sources** – adapteri na implementacije pohrane
- **Transport layer** – okidači interakcije s poslovnom logikom

Protokoli: gRPC, JSON API, GraphQL.

---

## 8. Dokumentiranje arhitekture – Paketi, Komponente, Ugradnja

### Paketi (Packages)

- Paket = opći mehanizam grupiranja elemenata; logički povezana grupa elemenata modela
- **Elementi dijagrama:** podsustavi, drugi manji paketi, realizacije slučajeva korištenja, sučelja
- **Svojstva:** paketi tvore imenike (namespace, domain); svaki element sadržan je u samo jednom paketu → jedinstveni nazivi (FQN)
- UML podrazumijeva da postoji anonimni paket-korijen (root package)

**Primjena u fazi razvoja:**
- Grubi pregled zahtjeva (high-level overview)
- Konceptualno projektiranje – dizajn sustava
- Organizacija izvornog koda, modularizacija složenih dijagrama

#### Dijagram paketa

- Notacija: paket (pravokutnik s jezičkom), zavisnost (iscrtkana strelica), ugniježđeni razredi
- Naziv paketa koristi se za tvorbu punog naziva razreda (namespace u C# i C++)
- Vanjski paketi ponekad se nazivaju **domene**
- Primjer: puni naziv razreda `Racun` u paketu `Dokumenti` je `Dokumenti.Racun`

#### Veze između paketa

| Vrsta veze | Opis |
|------------|------|
| **Zavisnost (Dependency)** | Jedan treba drugog za specifikaciju ili implementaciju; **nije tranzitivna!** |
| **<<Import>>** | Elementi modela uvezeni iz drugog; omogućuje referenciranje bez kvalifikacije |
| **<<Access>>** | Elementi mogu biti korišteni ali ne i uvezeni |
| **<<Merge>>** | Sadržaji jednako nazvani predstavljaju isti koncept (npr. parcijalne klase) |
| **Realizacija (Realization)** | Jedan specificira, drugi implementira |

### Dijagrami komponenti (Component Diagrams)

- **Komponenta** – fizički modul programskog koda (izvorna datoteka, pogonska komponenta ili izvedbeni program)
- **Dijagram komponenti** – prikaz organizacije i zavisnosti softverskih komponenti
- **Zavisnost komponenti** – iskazuje na koji način promjena jedne komponente može utjecati na promjenu drugih (zavisnost pri komunikaciji, zavisnost pri prevođenju)

**Razlika komponenta vs. paket:**
- Komponenta: reprezentira fizičko pakiranje programskog koda
- Paket: logičko grupiranje
- Isti razred može biti u različitim komponentama, ali je definiran u samo jednom paketu

**Stereotipovi komponenti:**
- `<<application>>` – komponenta prednjeg plana (Web, Win GUI)
- `<<datastore>>` – trajna pohrana podataka
- `<<document>>` – papirnati ili elektronički dokument
- `<<executable>>` – komponenta izvodljiva na fizičkom čvoru
- `<<file>>` – datoteka s podacima
- `<<infrastructure>>` – tehnička komponenta (servis pohrane, logger)
- `<<library>>` – knjižnica funkcija
- `<<source code>>` – datoteka izvornog koda
- `<<table>>` – tablica u bazi podataka
- `<<web service>>` – jedan ili više web servisa

### Dijagram ugradnje (Deployment Diagram)

- Prikaz konfiguracije pogonskih elemenata i pripadnih softverskih komponenti
- **Čvorovi (Nodes)** – izvršni resursi, najčešće sklopovlje
- **Spojevi (Connections)** – komunikacijski putovi (TCP/IP, ...)
- Nazivlje: `ime_čvora : tip_čvora` (opcionalno)

**Kombiniranje dijagrama komponenti i ugradnje:**
- Prikaz fizičke zavisnosti između softvera i hardvera
- Lokacije komponenti unutar distribuiranog sustava

**Primjer (distribuirani smart client):**
```
Client                          Server
  «application»                   «library»
  ProjektWin.exe                  Projekt.Bll
  «library»
  Projekt.Bll                   «datastore»
  «library»                       Projekt
  Projekt.Dal
  «framework»
  CSLA.dll
```

---

## 9. Izrada sustava – Programiranje i Refaktoriranje

### Implementacija sustava

- **Implementacija/ugradnja** – faza u kojoj se obavlja izrada novog sustava i isporuka u produkciju
- Aktivnosti izrade: programiranje, testiranje, dokumentiranje
- **Programiranje** – proces pisanja (kodiranja), provjere (testiranja), ispravljanja pogrešaka (debugiranja) i održavanja izvornog koda
- **Kodiranje** – pretvorba detaljnog opisa programa u stvarni program; može biti ručno ili automatsko (generiranje koda, sheme BP, ...)

### Pristup programiranju

**Monolitni pristup (build and fix):**
- Dugotrajno kodiranje, a zatim niz ponavljanja oblika provjera+ispravak
- Odgađa otkrivanje problema (pogrešaka u kodu i dizajnu)
- Prosljeđuje probleme u primjenu i održavanje

**Inkrementalni pristup (stupnjevito programiranje):**
- Niz ponavljanja oblika kodiranje+provjera+ispravak
- Omogućuje raniju provjeru i izdvajanje pogrešaka (fault isolation)
- Omogućuje raniju raspoloživost djelomičnih verzija
- Omogućuje ravnomjerniju podjelu posla

#### Inkrementalno programiranje – pojmovi

- **Odrezak/okrajak (Stub)** – pri izradi funkcije koja poziva druge funkcije, pozvane funkcije kodiraju se kao stubs (poruka „Neimplementirana funkcija X" ili hardkodirana povratna vrijednost)
- **Pokretač/upravljački program (Driver)** – pri izradi funkcije koja će biti pozvana iz još neugrađene funkcije, izrađuje se driver (pogonska funkcija)

### Očuvanje kvalitete programskog koda

- **Kohezija (cohesion)** – što veće unutarnje prianjanje modula; svaki modul treba obavljati jednu i samo jednu funkciju; postizanje ponovne upotrebljivosti
- **Kopčanje (coupling)** – što manja vanjska zavisnost modula; minimizacija utjecaja promjene jednog modula na druge

### Refaktoriranje

**Definicija (Fowler, 1999):** Promjena interne strukture programske podrške da bi ju se bolje razumjelo i lakše održavalo, uz **očuvanje vanjskog ponašanja**.

**Prednosti:**
- Sprječava narušavanje strukture koda
- Povećanje razumljivosti i čitljivosti
- Olakšano otkrivanje bugova
- Povećanje produktivnosti
- Lakše i jeftinije održavanje

**Nedostaci:**
- Pretjerana primjena smanjuje produktivnost
- Neautomatizirano refaktoriranje – dugotrajno i mukotrpno
- Nezreli i nepouzdani alati

#### Tehnike refaktoriranja (Obrasci)

**Composing Methods:**
- `Extract Method`, `Inline Method`, `Inline Temp`, `Replace Temp with Query`, `Introduce Explaining Variable`, `Split Temporary Variable`, ...

**Moving Features Between Objects:**
- `Move Method`, `Move Field`, `Extract Class`, `Inline Class`, `Hide Delegate`, `Remove Middle Man`, `Introduce Foreign Method`, ...

**Organizing Data:**
- `Self Encapsulate Field`, `Replace Data Value with Object`, `Change Value to Reference`, `Replace Array with Object`, `Encapsulate Field`, ...

**Simplifying Conditional Expressions:**
- `Decompose Conditional`, `Remove Control Flag`, `Replace Conditional with Polymorphism`, `Replace Nested Conditional with Guard`, ...

**Making Method Calls Simpler:**
- `Rename Method`, `Parameterize Method`, `Remove Parameter`, ...

**Dealing with Generalization:**
- `Pull Up Field`, `Pull Up Method`, `Push Down Method`, `Extract Subclass`, `Extract Interface`, ...

#### Reprezentativni predlošci refaktoriranja

- **Rename Method** – davanje novog, razumljivijeg imena metodi
- **Extract Method** – dio koda se izdvaja u posebnu metodu
- **Replace Temp with Query** – zamjena varijable koja poprima vrijednost nekog izraza s pozivom metode
- **Move Method/Field** – metoda/članska varijabla se premješta u drugi razred
- **Extract Class / Inline Class** – razred koji „radi puno toga" dijeli se na više razreda; suprotno je inline class
- **Replace Conditional with Polymorphism** – zamjena switch uvjeta koji ispituje tip objekta polimorfizmom (apstraktna metoda + overriding u podrazredima)
- **Replace Type Code with State/Strategy** – postoji kod koji utječe na ponašanje a ne može se primijeniti subclassing

#### Primjer refaktoriranja (Video klub)

**Aplikacija:** evidencija posudbi filmova; izračun iznosa ovisi o tipu filma (OBICNI, NOVI, DJECA) i trajanju posudbe.

**Početni problemi:** metoda `Clan.IspisiInfoOPosudbama` je preduga, obavlja više posla nego što bi trebala, obrada je u pogrešnom razredu.

**Koraci refaktoriranja:**

1. **Extract Method (R1):** switch dio koji izračunava iznos posudbe izdvojen u novu metodu `IzracunajIznosPosudbe(Posudba p)` u razredu `Clan`.

2. **Move Method (R2):** metoda `IzracunajIznosPosudbe` premještena iz `Clan` u `Posudba` (gubi argument p, zamjenjuje ga this); u `IspisiInfoOPosudbama` poziv mijenja se u `p.IzracunajIznosPosudbe()`.

3. **Replace Temp with Query (R3):** lokalna varijabla `trenutniIznos` zamijenjena izravnim pozivom `p.IzracunajIznosPosudbe()`.

4. **Extract Method + Move Method (R4):** isti postupak za računanje frekvencije posuđivanja → `Posudba.IzracunajFrekvencijuPosudbe()`.

5. **Replace Temp with Query (R5):** uklanjanje `ukupniIznos` i `frekvencijaPosudbiBodovi` iz `IspisiInfoOPosudbama`; zamijenjene novim metodama `Clan.IzracunajUkupniIznosPosudbi()` i `Clan.IzracunajUkupnuFrekvencijuPosudbiBodovi()`. Sada metoda `IspisiInfoOPosudbama` sadrži isključivo kod koji se bavi ispisom.

6. **Dodavanje HTML metode (R6):** budući da je kod čist i separiran, lako se dodaje `IspisiInfoOPosudbamaHTML()` koristeći iste metode.

7. **Move Method + Replace Conditional with Polymorphism (R7, R8):** Uvodi se nova klasifikacija filmova → `Film.IzracunajIznosPosudbe(int trajanjeDana)` + nasljeđivanje: sučelje `IFilm`, razredi `ObicniFilm`, `NoviFilm`, `FilmZaDjecu` s polimorfnim metodama.

#### Kada primijeniti refaktoriranje

- „Uvijek" – kada se naprave promjene koje „kvare" strukturu ili kada se promjene očekuju
- **The Rule of Three** – 1. put napravi, 2. put dupliciraj s grižnjom savjesti, 3. put refaktoriraj
- Kad se dodaje nova funkcionalnost – prije dodavanja, analizirati dio koda
- Kad se ispravi bug – bug signalizira problematičan kod
- Pri pregledu koda (code review) – novo oko vidi prilike za poboljšanje
- **Bad code smells:** duplicirani kod, duge metode, veliki razredi, metode s mnogo parametara, divergent change, shotgun surgery, feature envy, primitive obsession, switch statements, parallel inheritance hierarchies, lazy class, temporary field, message chains, middle man, ...

---

## 10. Provjera ispravnosti – Testiranje

### Temeljni pojmovi

| Pojam | Definicija |
|-------|------------|
| **Test** | Provjerava je li neki aspekt softvera ispravan |
| **Pogreška (error)** | Propust programera (npr. radi nerazumijevanja); dovodi do jednog ili više kvarova |
| **Kvar (fault/defect/bug)** | Neispravan dio koda (npr. pogrešno indeksiranje polja) |
| **Zastoj (failure)** | Stanje izazvano jednim ili više kvarova (npr. pad sustava) |
| **Ispravak (fix)** | Stanje popravka, često debugiranjem |

### Verifikacija i Validacija

- **Verifikacija** – ovjera ispravnosti; dokazivanje da je faza dobro provedena i da proizvod odgovara specifikaciji zahtjeva (slučajevima korištenja). „Gradimo li stvar ispravno?"
- **Validacija** – potvrda valjanosti; utvrđivanje da je napravljen pravi proizvod koji odgovara namjeni i prihvatljiv je korisniku. „Gradimo li ispravnu stvar?"

### Problem testiranja OO sustava

- Poslovni proces je raspodijeljen u skupu međudjelujućih razreda
- Učahurivanje sakriva podatke i obradu iza izloženih sučelja
- Nasljeđivanje i višeobličje: bugovi nadrazreda propagiraju u podrazrede
- Pri dinamičkom povezivanju ne zna se unaprijed koja će implementacija biti izvršena

### Plan testiranja i specifikacija testa

Plan testiranja definira niz testova; treba se napraviti na početku razvoja i stalno ažurirati.

**Sadržaj plana (Class Test Plan):**
- Naziv razreda, verzija, ID CRC kartice
- Cilj razreda, srodne ugovore, UC
- Nadrazredi
- Ciljevi testiranja
- Walkthrough testovi, invarijantni, stanjeosnovani, ugovorni testovi

### Testiranje jedinica (Unit Testing)

- Najmanja jedinica mjere je **razred**
- Testovi nadrazreda primjenjivi su na izvedene razrede (osim preopterećenih)

**Funkcionalno (Black-Box Testing):**
- Provjera ŠTO cjelina radi; da li zadovoljava zahtjeve
- Probni slučajevi izvode se iz specifikacija
- Provodi osoblje proizvođača ili korisnici
- Osnovica: CRC kartice, dijagrami razreda, ugovori

**Strukturalno (White-Box / Clear-Box Testing):**
- Provjera KAKO cjelina radi
- Probni slučajevi izvode se uvidom u programski kôd (inspekcija)
- Provode programeri
- Osnovica: specifikacije metoda

### Integracijsko testiranje (Integration Testing)

- Jedinica je **komponenta** (razredi koji tvore logičku cjelinu, sloj, paket, knjižnica)
- Ispitivanje provodi tim za testiranje

**Vrste:**
- **Testiranje korisničkog sučelja** – svaka funkcija sučelja; prolaz kroz svaku stavku izbornika
- **Testiranje slučajeva korištenja (UC Testing)** – svaki UC; prolaz kroz svaki UC
- **Testiranje interakcije (Interaction Testing)** – svaki proces korak po korak; od skupa stubs-a postupno se dodaju razredi i testiraju
- **Testiranje sučelja sustava** – razmjena podataka s drugim sustavima; posebna pažnja jer prijenosi su često automatizirani

### Testiranje sustava (System Testing)

- Provjera rada sustava kao cjeline; da svi nezavisno razvijeni programi rade ispravno i sukladno specifikacijama

**Vrste:**
- **Testiranje zahtjeva** – jesu li zadovoljeni izvorni poslovni zahtjevi
- **Testiranje upotrebljivosti (Usability Testing)** – prikladnost sustava za korištenje; analitičar koji razumije korisnika
- **Testiranje sigurnosti (Security Testing)** – mogućnost oporavka i neautoriziranog pristupa
- **Testiranje performansi (Performance Testing):**
  - Stress testing – velik broj interakcija (simulacijom pristupa)
  - Load testing – velika količina podataka (generatorima podataka)
- **Testiranje dokumentacije** – ispravnost dokumentacije (priručnici, sustav pomoći)

### Test prihvatljivosti (Acceptance Testing – UAT)

- Dokazivanje da proizvod zadovoljava zahtjeve i uvjete preuzimanja
- Iscrpan test nad stvarnim podacima

**Alfa-testiranje (Alpha Testing / FAT – Factory Acceptance Testing):**
- Probna uporaba kod izvođača ili u razvojnom okruženju
- Simulacija stvarnog okruženja, traženje pogrešaka

**Beta-testiranje (Beta Testing / SAT – Site Acceptance Testing):**
- Provode korisnici u stvarnom okruženju
- Performanse, vršna opterećenja, upotrebljivost, radne procedure, backup/oporavak

**Nadzorni test (Audit Test) – opcionalno:**
- Potvrda da je sustav gotov, ispravan i spreman za primjenu
- Provode nezavisne tvrtke ili odjeli za osiguranje kvalitete

### Razvoj vođen testiranjem (TDD)

- **TDD = TFD (Test-First Development) + Refactoring**
- Testovi se pišu **prije koda** – ne kodira se nešto za što ne postoji test
- U svakoj iteraciji po obavljanju testa provodi se refaktoriranje

**Automatizacija testiranja:**
- Alati za automatsko testiranje: *Unit okviri (JUnit, NUnit, xUnit, MSTest, ...)
- Otvoreni kod: JUnit (Beck, Gamma), NUnit (po uzoru na JUnit)

**Regresijsko testiranje:**
- Provjera da softver nije nazadovao (regressed)
- Pokretanje svih testova (starih i novih) pri svakoj promjeni softvera

#### Tehnika testiranja – AAA obrazac

```
Arrange – kreiranje objekata
Act     – upravljanje objektima
Assert  – provjera tvrdnje (Assert.AreEqual, ...)
```

**Primjer (NUnit):**
```csharp
[TestFixture]
public class AutomobilTestsR {
    [SetUp]
    public void SetUp() { ... }

    [Test]
    public void testKreiraj() {
        // Arrange
        AutomobilModel automobilModel = new AutomobilModel(...);
        int kilometri = 234243;
        // Act
        Automobil automobil = new Automobil(automobilModel, kilometri);
        // Assert
        Assert.AreEqual(kilometri, automobil.Kilometri);
    }
}
```

### Krivotvorine (Fakes, Stubs, Shims)

- **Fake** – krivotvorina; omogućuje izolaciju koda (testa) zamjenom dijelova koda
- **Stub** – mali substitut koji implementira isto sučelje
- **Shim (MS Fakes)** – mijenja kompilirani kod u pogonu tako da se umjesto određenog poziva pokrene kod osiguran testom

### Builds i smokes

- **Smoke test** – preliminarni test prije izdanja; podskup test slučajeva; confidence/sanity testing; build verification test (BVT)
- **Neutral build** – test aktualnog stanja (checked in) u neutralnom okruženju
- **Nightly build** – automatiziran, tipično noću (nema promjena izvornog koda)
- **Continuous Integration** – automatski rebuild nakon svake promjene, nekoliko puta dnevno
- **Daily Build and Smoke Test** – kompilacija svega + relativno jednostavna proba, svakodnevno

---

## 11. Primjena i održavanje sustava

### Uvođenje u primjenu

- Uvođenje u primjenu podrazumijeva **promjenu u sustavu**

**Upravljanje promjenama:**
- Odmrzavanje (Unfreezing) – napuštanje starih navika i normi
- Prijelaz (Moving) – prijelaz sa starog na novi sustav
- Zamrzavanje (Refreezing) – usvajanje i uhodavanje novog načina rada

### Tehnička konverzija

Konverzija sustava – tehnički proces u kojem novi sustav zamjenjuje stari.

**Glavni koraci:**
1. Instalacija hardvera
2. Instalacija softvera
3. Konverzija podataka – najsloženija (inicijalni unos, prijenos matičnih podataka, prijenos zbirnih stanja)
4. Odgovarajući plan testiranja

**Konverzija se provodi u 3 dimenzije:**
- Stil konverzije (conversion style) – način uvođenja
- Lokacija konverzije (conversion location) – gdje
- Moduli konverzije (conversion modules) – što, koji dijelovi

### Načini (stilovi) konverzije

| Stil | Opis | Prednosti | Nedostaci |
|------|------|-----------|-----------|
| **Izravno uvođenje (Big Bang)** | Početak rada novog uz prestanak starog; na određeni dan (kraj poslovnog razdoblja) | Brzo, jeftino (ako uspije) | Visok rizik; neposredna izloženost pogreškama |
| **Paralelno uvođenje** | Istovremeni rad oba sustava dok se novi ne pokaže ispravnim | Bitno manje rizičan | Dvostruka obrada podataka → otpor korisnika; skupo |

### Lokacije konverzije

| Vrsta | Opis | Prednosti | Nedostaci |
|-------|------|-----------|-----------|
| **Probno uvođenje (Pilot)** | Izravno/paralelno na jednoj lokaciji, pa na ostalima | Dodatna provjera, ograničenje problema na probu | Dulje trajanje; heterogenost verzija |
| **Postupno/fazno uvođenje** | Slijedno po grupama lokacija | Manje zahtijeva ljude | Dulje trajanje |
| **Istovremeno uvođenje** | Istovremeno na svim lokacijama | Uklanja heterogenost | Zahtijeva više ljude |

### Modularnost konverzije

| Vrsta | Opis | Prednosti | Nedostaci |
|-------|------|-----------|-----------|
| **Cijeli sustav** | Čitav sustav instalira se odjednom | Najčešći način | U velikim sustavima naporno za korisnike |
| **Modularno uvođenje** | Postupna zamjena, uvođenje po dijelovima | Postupni prijelaz, lakša poduka | Dulje; potrebni spojni programi |

### Odabir strategije uvođenja

| Uvođenje | Rizik | Trošak | Trajanje |
|----------|-------|--------|----------|
| Izravno | visok | nizak (ako uspije) | kratko (ako uspije) |
| Paralelno | nizak | visok | dugo |
| Probno | nizak | srednji | srednje |
| Fazno | srednji | srednji | dugo |
| Istovremeno | srednji | srednji | kratko |
| Cijeli sustav | visok | srednji | kratko |
| Modularno | srednji | visok | dugo |

### Upravljanje promjenama

- **Sponzor promjena** – osoba koja želi promjenu (najčešće poslovnjak koji je pokrenuo zahtjev); mora biti aktivan jer upravlja onima koji usvajaju sustav
- **Agent promjena** – osobe koje vode promjenu (obično izvan organizacijske jedinice na koju se promjena odnosi)
- **Usvojitelj promjena** – osobe na koje se promjena odnosi (krajnji korisnici)

**Otpor promjenama:**
- Što je dobro za organizaciju, ne mora biti dobro za pojedinca
- Promjena radne procedure za istu plaću
- Promjena zahtijeva napor prilagodbe

### Poduka (Training)

- Sadržaj: **kako obaviti posao** (a ne kako koristiti aplikacije!); što korisnik može napraviti (a ne što sustav može)
- Poduka krajnjih korisnika: opća informatička kultura, funkcije i način upotrebe, posebna znanja
- Poduka tehničkog osoblja: OS i uslužni programi, administriranje BP, programski jezici i razvojni alati

**Redoslijed poduke (preporuka):**
1. Tehničko osoblje (za održavanje i potporu)
2. Rukovodstvo (za podršku poduke i primjene)
3. Krajnji korisnici (prilagođeno poslovnim procesima)

### Sistemska potpora i održavanje sustava

**Post-implementacija:**
- **Sistemska potpora (system support)** – operativna grupa, centar kompetencija; pomoć korisnicima, on-demand training, help desk
- **Održavanje sustava (system maintenance)**
- **Procjena projekta (project assessment)**

### Odjel pomoći (Help Desk)

**Višerazinska organizacija:**
- **1st level support** – odgovara na široki raspon zahtjeva; treba riješiti 80% problema; inače zapisnik problema → prosljeđuje 2. razini
- **2nd level support** – složenija stručna pomoć (timovi po struci: desktop, mrežni)
- Kad se pronađe bug → **zahtjev za promjenom (change request)** prosljeđuje se odjelu održavanja

**Sustav za praćenje problema (Issue Tracking / Trouble Ticket System):**
- Baza znanja o problemima, rješenjima, korisnicima
- Kartoni (tickets) jednoznačno označeni (unique reference number)
- Tiket evidentira problem i intervencije = radni nalog

### Održavanje sustava

**Definicija (IEEE 14764-2006 – ISO/IEC):** Modifikacija programskog proizvoda nakon isporuke da bi se ispravili kvarovi, popravile performanse ili druga svojstva ili da bi se proizvod prilagodio promjenama okruženja.

**Najčešći razlozi (po prioritetu):**
1. Prijava kvara
2. Zahtjev za poboljšanje (ugradnja nove funkcije)
3. Zahtjevi vanjskih sustava (integracija)
4. Nove inačice sistemskog softvera (BP, OS)
5. Zahtjevi višeg rukovodstva (promjena strategije)

### Vrste održavanja

| Vrsta | Opis |
|-------|------|
| **Preventivno** | Prevencija problema, nadzor logova, uklanjanje uskih grla i ranjivosti; redoviti backup; periodički (dnevno, tjedno, ...) |
| **Korektivno** | Popravak nakon pojave problema; restore iz backup-a; uklanjanje uzroka (ispravljanje + reinstalacija) |
| **Adaptivno** | Prilagodba funkcionalnosti i ograničenja; prilagodba strukture podataka; poboljšanje performansi |
| **Perfektivno** | Nadgradnja sustava za nove probleme; ugradnja novih mogućnosti (features) |

---

## 12. Osnove informacijskih sustava

### Podatak, informacija i znanje

- **Podatak** – sirova činjenica koja predstavlja istinu iz stvarnog svijeta; pojedinačni podaci sami za sebe znače malo
- **Informacija** – interpretacija podatka; pročišćen, organiziran i obrađen podatak u smislenom kontekstu; subjektivnog značenja, u kontekstu primatelja
- **Znanje** – gradi se vezivanjem novih informacija na postojeće znanje; isti podaci mogu biti različito interpretirani ovisno o znanju primatelja

### Sustav

- **Sustav** – skup međusobno zavisnih komponenti koje rade zajedno da bi ostvarile zajednički cilj
- **Elementi sustava:** ulaz (input) → obrada (process) → izlaz (output); povratna veza (feedback); granica sustava; okolina

### Informacijski sustav (IS)

- Skup međusobno zavisnih komponenti koje prikupljaju, obrađuju, pohranjuju i distribuiraju informacije u svrhu potpore odlučivanju i upravljanju u organizaciji
- **Poslovni IS** – podupire poslovne funkcije organizacije

**Informacijski sustav podržan računalom:**
- Hardver + softver + podaci + korisnici + procedure + mreže

### Slojevi poslovnih informacijskih sustava

- **Strateška razina** – podrška strateškom upravljanju (Executive Information System – EIS)
- **Upravljačka razina** – podrška taktičkom upravljanju (Management Information System – MIS)
- **Operativna razina** – podrška svakodnevnim poslovnim operacijama (Transaction Processing System – TPS)
- **Stručni sustavi** – ekspertni, DSS (Decision Support System)

### Značajke informacijskih sustava

- Točnost, ažurnost, potpunost, relevantnost, dostupnost informacija
- Sigurnost, pouzdanost, skalabilnost
- Interoperabilnost s drugim sustavima

### Projektiranje i izgradnja IS

- **Programsko inženjerstvo (Software Engineering)** – primjena sustavnih, discipliniranih i kvantitativno mjerljivih pristupa razvoju softvera
- **Informacijsko inženjerstvo** – primjena IS metoda i tehnika za planiranje, analizu, dizajn i izgradnju poslovnih IS

### (ne)Uspješnost informacijskih sustava

**Uzroci neuspjeha:**
- Loše upravljanje projektom
- Neadekvatno prikupljanje zahtjeva
- Nekvalitetno testiranje
- Nedovoljna uključenost korisnika
- Promjena zahtjeva usred razvoja
- Nerealni rokovi i resursi
- Nedostatak komunikacije

**Poboljšanje uspješnosti IS:**
- Metodike i standardizirani procesi razvoja
- Upravljanje zahtjevima
- Kvalitetno testiranje
- Projektni menadžment
- Uključivanje korisnika od samog početka

---

## 13. Strateško planiranje i pokretanje projekta

### Strateško planiranje poslovanja

- **Misija (Mission)** – svrha i razlog postojanja organizacije
- **Vizija (Vision)** – slika željene budućnosti
- **Ciljevi (Goals)** – konkretni mjerljivi ishodi koje organizacija želi postići
- **Strategija (Strategy)** – plan kako postići ciljeve

### Planiranje informacijskog sustava

- IS treba biti usklađen s poslovnom strategijom
- Planiranje IS-a mora biti koordinirano s poslovnim planiranjem
- Okosnica plana razvoja sustava: sadašnje stanje → željeno stanje → plan migracije

### Identifikacija i odabir projekata

- Zahtjevi za novim IS nastaju iz:
  - Poslovnih potreba (automatizacija procesa, poboljšanje učinkovitosti)
  - Propisa i regulative
  - Potreba za integracijom
  - Prilike na tržištu

**Predlaganje i odabir projekata:**
- Procjena potencijalnih projekata prema kriterijima prioriteta, resursa, izvedivosti, koristi
- Usklađivanje s strateškim ciljevima

### Proučavanje problema i analiza izvedivosti

**Analiza problema:**
- Snimka stanja – opis postojećih problema i prijedlozi rješenja
- Analiza uzroka i posljedica
- Ključni faktori uspjeha (Critical Success Factors – CSF)

### Analiza izvedivosti

#### Organizacijska izvedivost

- Je li projekt u skladu s poslovnom strategijom?
- Postoji li podrška rukovodstva i korisnika?
- Može li organizacija upravljati promjenom?

#### Tehničko-tehnološka izvedivost

- Je li predloženo rješenje tehnički izvedivo?
- Postoje li raspoložive ili dostupne tehnologije?
- Ima li tim potrebne vještine?

#### Vremenska izvedivost

- Može li se projekt završiti u traženom roku?

**Postupak procjenjivanja:**
- Procjena funkcijskim i UC točkama (Function Points, Use Case Points)
- Procjena objektnim točkama
- Procjena analogijom (usporedba s sličnim projektima)
- Upozorenje: (ne)preciznost procjene – razlog za analizu i dizajn

**Procjena trajanja projekta:**
- Identifikacija aktivnosti
- Procjena trajanja svake aktivnosti
- Određivanje zavisnosti između aktivnosti
- Kritični put (CPM – Critical Path Method)
- Identifikacija rizika

#### Ekonomska izvedivost

**Kategorije troškova:**
- Jednokratni razvojni troškovi (hardver, softver, konzultanti, obuka)
- Tekući operativni troškovi (održavanje, licencije, podrška)

**Kategorije koristi:**
- Opipljive (tangible) – mjerljive financijske koristi (smanjenje troškova, povećanje prihoda)
- Neopipljive (intangible) – teško mjerljive (poboljšanje zadovoljstva korisnika, imidž)

**Financijske mjere:**
- **NSV (Neto Sadašnja Vrijednost)** – sadašnja vrijednost budućih koristi minus troškovi
- **ROI (Return on Investment)** – povrat investicije = (korist - trošak) / trošak × 100%
- **Rok povrata investicije** – koliko vremena treba da se investicija povrati iz ostvarenih uštedina/prihoda

### Modaliteti izgradnje sustava

#### Vlastiti razvoj (Insourcing)

- Razvoj unutar organizacije
- Prednosti: potpuna kontrola, specifično po mjeri, zadržano znanje unutar organizacije
- Nedostaci: skupo, dugo, rizično (potrebno iskustvo)

#### Vanjski razvoj (Outsourcing)

- Razvoj povjeriti vanjskom partneru/konzultantu
- Prednosti: specifična stručnost, manji fiksni troškovi
- Nedostaci: ovisnost o dobavljaču, rizik tajnosti, komunikacijski problemi

#### Crowdsourcing

- Outsourcing velikog broja malih zadataka prema „masi" (npr. platforme Amazon Mechanical Turk)

#### Graditi, kupiti ili unajmiti? (Build vs Buy vs Rent)

- **Graditi (Build)** – za core domain i specifične zahtjeve; puna fleksibilnost, visoki troškovi
- **Kupiti (Buy)** – gotovi paketi (ERP, CRM); brže, niži razvoj, ali prilagodba skuplja
- **Unajmiti (Rent – SaaS)** – usluge u oblaku; najniži inicijalni troškovi, ali tekući troškovi i ovisnost o provideru

**Vrednovanje mogućih rješenja:**
- Definirati kriterije odabira s težinama
- Procijeniti svako rješenje prema svakom kriteriju
- Odabrati rješenje s najvećim ukupnim bodovima

---

## 14. Prikupljanje informacija i analiza

### Postupci prikupljanja informacija

#### Intervjuiranje

**Koraci:**
1. Priprema i planiranje (ciljevi, popis dionika)
2. Inicijalni kontakt (dogovor termina i okvirnih tema)
3. Provođenje intervjua (otvorena i zatvorena pitanja, slušanje)
4. Dokumentiranje (zapisnik odmah nakon)
5. Naknadno pojašnjenje (provjera razumijevanja)

**Preporuke za vođenje intervjua:**
- Koristiti primarno otvorena pitanja (Što, Kako, Zašto, Opišite...)
- Aktivno slušanje – parafraziranje
- Kontrolirati tok intervjua ali ostati fleksibilan
- Izbjegavati tehničke termine
- Voditi bilješke, ali ne previše opsežno

**Vrste pitanja:**
- Otvorena (slobodan odgovor)
- Zatvorena (da/ne ili odabir)
- Istraživačka (follow-up, pojašnjavanje)

#### Radne sjednice (Joint Application Development – JAD)

- Strukturirane radionice s dionicima (korisnici, analitičari, donositelji odluka)
- Cilj: brže prikupljanje zahtjeva i suglasnost svih strana
- Facilitator vodi sjednicu, bilježnik dokumentira

#### Upitnici i ankete

- Korisni za prikupljanje mišljenja od većeg broja korisnika
- Zatvorena pitanja (Likertova skala) → lako se analiziraju
- Otvorena pitanja → bogatiji uvid, teže za analizirati

#### Analiza dokumentacije

- Proučavanje postojeće dokumentacije (poslovni procesi, priručnici, obrasci, izvješća)
- Analiza ulaznih i izlaznih dokumenata → identificiranje podataka i tokova

#### Promatranje poslovnog sustava

- Direktno promatranje korisnika pri radu
- „Tiho promatranje" – ne ometati korisnika
- Identificiranje implicitnih procesa i zahtjeva koji se ne iskazuju intervjuom

### Analiza sustava

#### Kontekst analize sustava

- Razumijevanje poslovnih procesa i zahtjeva korisnika
- Identificiranje problema i mogućnosti poboljšanja
- Definiranje dosega (scope) novog IS-a

#### Automatizacija poslovnih procesa

- Automatizirani procesi koji su prethodno rađeni ručno
- Primjer: unos narudžbi, obrada plaća, generiranje faktura

#### Poboljšanje poslovnih procesa (Business Process Improvement – BPI)

- Identifikacija i uklanjanje uskih grla, redundancija i neefikasnosti
- Integracija srodnih procesa
- Paralelizacija procesa koji se mogu izvoditi istovremeno

#### Preustroj poslovnih procesa (Business Process Reengineering – BPR)

- Radikalno redizajniranje poslovnih procesa od nule
- Cilj: dramatično poboljšanje ključnih mjera (troškovi, kvaliteta, brzina)
- Visoki rizik → visoka potencijalna nagrada

---

## 15. Zahtjevi na sustav

### Pojmovi i vrste zahtjeva

- **Poslovni zahtjevi** – ciljevi i potrebe organizacije na visokoj razini (Što organizacija treba postići?)
- **Korisnički zahtjevi** – potrebe krajnjih korisnika (Što korisnici trebaju napraviti?)
- **Funkcionalni zahtjevi** – funkcije koje sustav mora podržavati (Što sustav treba raditi?)
- **Nefunkcionalni zahtjevi** – svojstva sustava (performanse, sigurnost, skalabilnost, raspoloživost, ...)
- **Sistemski zahtjevi** – detaljna specifikacija funkcionalnosti i ograničenja

### Zahtjevi na kvalitetu programske podrške (IEEE)

- Funkcionalnost, pouzdanost, upotrebljivost, učinkovitost, mogućnost održavanja, prenosivost

### Inženjerstvo zahtjeva

**Aktivnosti:**
1. **Prikupljanje (Elicitation)** – interviews, workshops, observation, ...
2. **Analiza (Analysis)** – razrada, provjera konzistentnosti, prioriteti
3. **Specifikacija (Specification)** – dokumentiranje zahtjeva (SRS)
4. **Verifikacija (Verification)** – provjera ispravnosti zahtjeva
5. **Upravljanje (Management)** – praćenje promjena zahtjeva kroz razvoj

### Određivanje zahtjeva (Elicitation)

- Kako razlučiti prave od lažnih zahtjeva
- Razlika između zahtjeva koji su **simptom** i zahtjeva koji su **uzrok**
- Zašto korisnici ne znaju što žele (ambiguity, tacit knowledge, ...): „latentni" zahtjevi

**Najčešći problemi:**
- Nedostupnost dionika
- Zahtjevi su nekonzistentni
- Zahtjevi se mijenjaju
- Korisnici ne znaju što žele

### Analiza zahtjeva

- Modeliranje i provjera konzistentnosti zahtjeva
- Identificiranje konflikata
- Analitika i modeliranje sustava: slučajevi korištenja, dijagrami aktivnosti, toka podataka, ...

### Postavljanje prioriteta (MoSCoW)

| Kategorija | Opis |
|------------|------|
| **Must have** | Mora biti; bez toga sustav ne funkcionira |
| **Should have** | Treba biti; važno ali ne kritično |
| **Could have** | Može biti; poželjno ako ima vremena/resursa |
| **Won't have** | Neće biti (ovaj put); u budućoj verziji |

### Specifikacija zahtjeva (SRS)

**Predložak (Software Requirements Specification):**
- Uvod (svrha, doseg, kratice)
- Opis sustava (kontekst, dionici, ograničenja)
- Funkcionalni zahtjevi (po UC ili po funkciji)
- Nefunkcionalni zahtjevi (performanse, sigurnost, ...)
- Ograničenja dizajna
- Primjeri sučelja

**Označavanje zahtjeva:**
- Jedinstveni ID (npr. FR001, NFR001)
- Prioritet (MoSCoW ili 1–3)
- Izvor zahtjeva
- Status (predložen, odobren, implementiran, testiran)

### Verifikacija zahtjeva

Provjera je li specifikacija:
- **Potpuna** – pokriva sve potrebe korisnika
- **Konzistentna** – nema međusobnih konflikata
- **Nedvosmislena** – jednoznačna interpretacija
- **Provjerljiva** – može se dokazati da je zahtjev ispunjen
- **Izvediva** – tehnički i financijski moguće realizirati

### Upravljanje zahtjevima

- **Praćenje promjena zahtjeva** – Change Control Board (CCB)
- **Sljedivost (Traceability)** – matrica sljedivosti zahtjeva ↔ dizajn ↔ test
- **Alati:** JIRA, Azure DevOps, Confluence, IBM DOORS, Enterprise Architect

---

## 16. Strukturirana analiza i dizajn

### Strukturirana analiza

#### Logički procesi

- Procesi se opisuju **neovisno o implementaciji** (logički, ne fizički)
- Logički model pokazuje ŠTO sustav radi, a ne KAKO

#### Elementarni procesi

- Najmanji opisivi poslovni proces
- Jedinstven, ne može se dalje rastaviti
- Ima jasno definirane ulaze i izlaze

#### Poslovna pravila i poslovna politika

- Poslovna pravila definiraju uvjete pod kojim se procesi odvijaju
- Primjer: „Narudžba se može potvrditi samo ako su svi artikli na zalihi"

### Modeliranje funkcija

#### Dijagram dekompozicije funkcija (Function Decomposition Diagram)

- Hijerarhijska dekompozicija poslovnih funkcija od najviše razine prema najnižoj
- Svaka funkcija se rastavlja na podfunkcije
- Listovi hijerarhije su elementarni procesi

**Izrada dijagrama dekompozicije:**
1. Identificirati temeljne poslovne funkcije
2. Rastavljati svaku funkciju na podfunkcije
3. Nastaviti dok se ne dosegnu elementarni procesi
4. Verificirati s korisnicima

#### Hijerarhijski prikaz funkcija

- Drvo funkcija prikazuje organizacijsku strukturu sustava
- Može se organizirati po poslovnim područjima ili organizacijskim jedinicama

#### Dijagram organizacije

- Prikaz organizacijske strukture s vezama između organizacijskih jedinica

#### Hijerarhija funkcija aplikacije

- Mapa svih funkcija/ekrana aplikacije
- Služi za planiranje i organizaciju razvoja

### Razrada poslovnih procesa

- **Poslovni proces** – skup aktivnosti koji transformira ulaz u izlaz s definiranom vrijednošću za korisnika
- Razrada: od grubog opisa prema detaljnoj specifikaciji

### Modeliranje toka rada (Workflow Modeling)

- Prikaz redoslijeda aktivnosti u poslovnom procesu
- Tko što radi i kojim redoslijedom
- Prikazuje parallelizam, sekvencijalne i uvjetne tokove

### Modeliranje toka podataka (DTP / DFD)

#### Elementi dijagrama toka podataka (DFD)

| Element | Notacija (Gane-Sarson) | Opis |
|---------|----------------------|------|
| **Proces** | Pravokutnik s zaobljenim kutovima ili krug | Transformira ulazne podatke u izlazne |
| **Tok podataka** | Strelica s imenom | Pokazuje protok podataka između elemenata |
| **Pohrana podataka (Data Store)** | Dvije paralelne crte ili otvoreni pravokutnik | Pohrana podataka u sustavu |
| **Vanjski entitet (Terminator)** | Pravokutnik | Izvor ili odredište podataka izvan dosega sustava |

#### Razine DFD-a

- **Kontekstni dijagram (razina 0)** – cijeli sustav kao jedan proces, vanjski entiteti i tokovi
- **Razina 1** – rastavljanje kontekstnog dijagrama na glavne procese
- **Razina 2 i dalje** – dalje rastavljanje procesa

#### Izrada dijagrama toka podataka

Koraci:
1. Identificirati vanjske entitete (terminatore)
2. Identificirati tokove podataka između entiteta i sustava (kontekstni dijagram)
3. Identificirati procese i pohranjivanje (razina 1)
4. Rasporediti tokove podataka između procesa i pohrana
5. Provjeriti balansiranost (isti ulazi/izlazi na svakoj razini)

#### Pravila i ograničenja DTP-a

- Svaki proces mora imati barem jedan ulaz i jedan izlaz
- Podaci mogu teći samo između procesa, entiteta i pohrana (ne direktno entitet → entitet, pohrana → pohrana)
- Procesi moraju biti numbered (npr. 1.1, 1.2, ...)
- Svaki proces mora imati ime (glagol + imenica: „Provjeri narudžbu")
- Pohrana podataka mora imati jednoznačan naziv

#### Preporuke za izradu DTP

- Koristiti dosljedne i jasne nazive
- Razina detalja prikladna razini dijagrama
- Izbjegavati previše procesa na jednom dijagramu (max. 7 ± 2)
- Balansirati dijagrame između razina
- Verificirati s korisnicima

### Modeliranje događaja (Event Modeling)

#### Događaji

- Nešto što se dogodi u poslovnom okruženju na što sustav mora reagirati
- Okida izvršavanje jednog ili više procesa u sustavu

#### Vrste događaja

- **Vremenski (Temporal)** – nastaju protokom vremena (npr. kraj mjeseca → generiraj obračun)
- **Vanjski (External)** – inicirani od strane vanjskog entiteta (npr. korisnik podnosi narudžbu)
- **Unutarnji (Internal)** – nastaju unutar sustava (npr. stanje zaliha pada ispod minimuma)

#### Modeliranje procesa vođeno događajima (Event-Driven Process Modeling)

- Svaki poslovni događaj pokrenuti odgovarajući proces
- Tablica događaja: za svaki događaj – koji proces se pokreće i koji podaci su uključeni

**Tablica događaja u sustavu:**

| ID | Događaj | Vrsta | Pokrenuti proces | Ulazni podaci | Izlazni podaci |
|----|---------|-------|-----------------|---------------|----------------|
| E1 | Korisnik podnosi narudžbu | vanjski | Obrada narudžbe | Narudžba | Potvrda narudžbe |
| E2 | Kraj radnog dana | vremenski | Generiranje dnevnog izvješća | Transakcije | Dnevno izvješće |

#### Matrični prikaz modela događaja

- **Matrica entiteti/događaji** – pokazuje koji entiteti su pogođeni kojim događajima (C – create, R – read, U – update, D – delete)
- Koristi se za određivanje podsustava – grupiranje događaja koji dijele slične entitete

#### Određivanje podsustava matricom događaja

- Identificirati događaje i entitete
- Popuniti matricu (CRUD)
- Grupirati slične redove i stupce → podsustavi

### Dijagram prijelaza stanja (State Transition Diagram / DPS)

- Prikazuje moguća stanja nekog entiteta i prijelaze između stanja
- **Stanje** – prepoznatljivo stanje entiteta koje traje određeno vrijeme
- **Prijelaz** – promjena iz jednog stanja u drugo, uzrokovana događajem
- **Uvjet/Akcija** – uvjet koji mora biti zadovoljen i/ili akcija koja se izvrši pri prijelazu

**Notacija:** stanja = zaobljeni pravokutnici, prijelazi = strelice s imenom događaja i/ili akcijom (uvjet / akcija).

**Primjer stanja narudžbe:**
- Zaprimljena → Potvrđena → U obradi → Isporučena → Zatvorena
- Zaprimljena → Otkazana (uvjet: korisnik otkazao)

**Koristi:**
- Modeliranje životnog ciklusa entiteta
- Provjera potpunosti (postoje li stanja bez izlaza, nedostižna stanja?)
- Osnova za implementaciju poslovne logike stanja

**Primjer stanja indeksne kartice:**
- A=Izdana, D=Student diplomirao, G=Pogrešni podaci, I=Izgubljena, J=Poništena zbog promjene JMBG, K=Istekao apsolventski rok, N=Nezavršena, O=Oduzeta, P=Poništena, R=Student upisao prekid, S=Student ispisao, Š=Oštećena, T=Tiskana, U=Ukradena, X=Nestala, Y=Poništena zbog neispravnih podataka, Z=Zatražena

**Sustav za rad u stvarnom vremenu:**
- Dijagrami sadrže posebno stanje „besposlen" (idle/prazni hod)
- Primjer: bankomat s stanjima: prazni hod → čekanje na izbor → obradan odabir → natočeno → čekanje na vađenje kartice → prazni hod

### Mape dijaloga (Dialog Maps)

- Varijanta dijagrama prijelaza stanja za korisničko sučelje
- Jedno stanje = jedan element sučelja (forma, izbornik, dijalog) aktivan u trenutku
- Pristup ograničenom broju innych elemenata ovisno o akcijama korisnika

**Primjena:**
- Prikaz dijaloga i navigacije (bez dizajna zaslona)
- Usklađivanje korisnika i razvojnika oko interakcije
- Vizualizacija strukture web sjedišta (site maps)

**Koristi se notacija DPS-a:**
- Uvjet pokretanja navigacije kao tekst na strelici: korisnička akcija (klik, tipka), podatkovna vrijednost (pogrešan unos), sistemski uvjet (pisač bez papira), kombinacija uvjeta
- Može prikazati: alternative korištenja, opcionalnu funkcionalnost, posebna stanja (npr. „Prikaz poruke o...")
- Izostavljanje općih funkcija (F1 za pomoć, Natrag)
- Pri analizi: konceptualna razina (konkretna implementacija može biti drugačija)

---

*Materijal: FER Fertalj, Informacijski sustavi IS05, 2025/26. Kompletne bilješke pokrivaju svih 524 stranica predavanja.*
