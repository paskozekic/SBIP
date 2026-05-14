import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  const djelatnik = user?.role === "djelatnik";

  return (
    <section className="pocetna">
      <h2>Dobro došli u SPIB</h2>
      <p className="pocetna-uvod">
        Sustav za online pregled kataloga, narudžbe kupnje (s plaćanjem i dostavom), rezervacije najma, upravljanje
        katalogom za djelatnike te izvještaje o prodaji i najmu.
      </p>

      <div className="pocetna-kartice">
        <Link to="/katalog" className="pocetna-karta">
          <span className="pocetna-karta__naslov">Katalog (KZ-01 / FZ-02)</span>
          <span className="pocetna-karta__opis">Pregled bicikala s filtriranjem po kategoriji, cijeni i dostupnosti.</span>
        </Link>
        <Link to="/najam" className="pocetna-karta">
          <span className="pocetna-karta__naslov">Najam (KZ-02 / FZ-04–05)</span>
          <span className="pocetna-karta__opis">Rezervacija datuma i prikaz ukupne cijene najma.</span>
        </Link>
        <Link to="/narudzbe" className="pocetna-karta">
          <span className="pocetna-karta__naslov">Narudžbe</span>
          <span className="pocetna-karta__opis">Master–detail, stavke, status, plaćanje i adresa dostave.</span>
        </Link>
        {djelatnik && (
          <>
            <Link to="/bicikli-admin" className="pocetna-karta">
              <span className="pocetna-karta__naslov">Bicikli (djelatnik)</span>
              <span className="pocetna-karta__opis">CRUD kataloga; kategorija s padajuće liste (FZ-09).</span>
            </Link>
            <Link to="/najmovi" className="pocetna-karta">
              <span className="pocetna-karta__naslov">Najmovi (djelatnik)</span>
              <span className="pocetna-karta__opis">Aktivni najmovi, kašnjenje, vraćanje (KZ-03 / FZ-08).</span>
            </Link>
            <Link to="/izvjestaji" className="pocetna-karta">
              <span className="pocetna-karta__naslov">Izvještaji</span>
              <span className="pocetna-karta__opis">Prodaja i najam u razdoblju (PZ-03).</span>
            </Link>
            <Link to="/kategorije" className="pocetna-karta">
              <span className="pocetna-karta__naslov">Kategorije</span>
              <span className="pocetna-karta__opis">Šifrarnik kategorija bicikla.</span>
            </Link>
          </>
        )}
        {!user && (
          <Link to="/prijava" className="pocetna-karta">
            <span className="pocetna-karta__naslov">Prijava / registracija</span>
            <span className="pocetna-karta__opis">Korisnički račun (FZ-01), lozinka bcrypt na poslužitelju.</span>
          </Link>
        )}
      </div>
    </section>
  );
}
