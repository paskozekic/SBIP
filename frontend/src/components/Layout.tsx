import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const djelatnik = user?.role === "djelatnik";

  return (
    <div className="spib spib-layout">
      <header className="spib-header">
        <div className="spib-header-card">
          <h1>SPIB</h1>
          <p className="podnaslov">Prodaja i iznajmljivanje bicikala — katalog, narudžbe, najam, izvještaji</p>
          <div className="spib-userbar">
            {user ? (
              <>
                <span>
                  {user.prezime}, {user.ime} ({user.role})
                </span>
                <button type="button" className="btn btn-sekundarni btn-mali" onClick={logout}>
                  Odjava
                </button>
              </>
            ) : (
              <NavLink to="/prijava" className="nav-a">
                Prijava
              </NavLink>
            )}
          </div>
        </div>
      </header>
      <nav className="nav-glava" aria-label="Glavna navigacija">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-a nav-a--aktivno" : "nav-a")}>
          Početna
        </NavLink>
        <NavLink to="/katalog" className={({ isActive }) => (isActive ? "nav-a nav-a--aktivno" : "nav-a")}>
          Katalog
        </NavLink>
        <NavLink to="/najam" className={({ isActive }) => (isActive ? "nav-a nav-a--aktivno" : "nav-a")}>
          Najam
        </NavLink>
        <NavLink to="/narudzbe" className={({ isActive }) => (isActive ? "nav-a nav-a--aktivno" : "nav-a")}>
          Narudžbe
        </NavLink>
        {djelatnik && (
          <>
            <NavLink to="/bicikli-admin" className={({ isActive }) => (isActive ? "nav-a nav-a--aktivno" : "nav-a")}>
              Bicikli
            </NavLink>
            <NavLink to="/najmovi" className={({ isActive }) => (isActive ? "nav-a nav-a--aktivno" : "nav-a")}>
              Najmovi
            </NavLink>
            <NavLink to="/izvjestaji" className={({ isActive }) => (isActive ? "nav-a nav-a--aktivno" : "nav-a")}>
              Izvještaji
            </NavLink>
            <NavLink to="/kategorije" className={({ isActive }) => (isActive ? "nav-a nav-a--aktivno" : "nav-a")}>
              Kategorije
            </NavLink>
          </>
        )}
      </nav>
      <main className="spib-main">
        <Outlet />
      </main>
    </div>
  );
}
