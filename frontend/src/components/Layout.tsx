import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="spib spib-layout">
      <header className="spib-header">
        <div className="spib-header-card">
          <h1>SPIB</h1>
          <p className="podnaslov">Sustav za prodaju i iznajmljivanje bicikala — Faza C</p>
        </div>
      </header>
      <nav className="nav-glava" aria-label="Glavna navigacija">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-a nav-a--aktivno" : "nav-a")}>
          Početna
        </NavLink>
        <NavLink to="/narudzbe" className={({ isActive }) => (isActive ? "nav-a nav-a--aktivno" : "nav-a")}>
          Narudžbe
        </NavLink>
        <NavLink to="/kategorije" className={({ isActive }) => (isActive ? "nav-a nav-a--aktivno" : "nav-a")}>
          Kategorije
        </NavLink>
      </nav>
      <main className="spib-main">
        <Outlet />
      </main>
    </div>
  );
}
