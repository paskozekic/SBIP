import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="pocetna">
      <h2>Dobro došli</h2>
      <p className="pocetna-uvod">
        Ovdje možete voditi narudžbe kupaca i održavati vrste bicikala u katalogu. Odaberite što želite raditi —
        sve je dostupno i iz izbornika gore.
      </p>

      <div className="pocetna-kartice">
        <Link to="/narudzbe" className="pocetna-karta">
          <span className="pocetna-karta__naslov">Narudžbe</span>
          <span className="pocetna-karta__opis">Pregledajte narudžbe, dodajte nove ili uredite stavke.</span>
        </Link>
        <Link to="/kategorije" className="pocetna-karta">
          <span className="pocetna-karta__naslov">Kategorije bicikla</span>
          <span className="pocetna-karta__opis">Dodajte, pretražite ili izmijenite kategorije u katalogu.</span>
        </Link>
      </div>
    </section>
  );
}
