import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ApiError, apiJson } from "../lib/api";

export default function IzvjestajiPage() {
  const { user } = useAuth();
  const [od, setOd] = useState("");
  const [doDat, setDoDat] = useState("");
  const [prodaja, setProdaja] = useState<{
    broj_zavrsenih_narudzbi: number;
    ukupni_prihod: string;
    broj_stavki: number;
  } | null>(null);
  const [najam, setNajam] = useState<{ broj_najmova: number; ukupna_naplatena_najma: string } | null>(null);
  const [greska, setGreska] = useState<string | null>(null);

  async function pokreniProdaja() {
    setGreska(null);
    try {
      const r = await apiJson<{
        broj_zavrsenih_narudzbi: number;
        ukupni_prihod: string;
        broj_stavki: number;
      }>(`/api/izvjestaji/prodaja?od=${encodeURIComponent(od)}&do=${encodeURIComponent(doDat)}`);
      setProdaja(r);
    } catch (e) {
      setGreska(e instanceof ApiError ? e.message : "Greška");
    }
  }

  async function pokreniNajam() {
    setGreska(null);
    try {
      const r = await apiJson<{ broj_najmova: number; ukupna_naplatena_najma: string }>(
        `/api/izvjestaji/najam?od=${encodeURIComponent(od)}&do=${encodeURIComponent(doDat)}`,
      );
      setNajam(r);
    } catch (e) {
      setGreska(e instanceof ApiError ? e.message : "Greška");
    }
  }

  if (user?.role !== "djelatnik") {
    return (
      <div className="panel">
        <p>Izvještaji su dostupni samo djelatnicima.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Izvještaji (PZ-03)</h2>
      {greska && <p className="greska">{greska}</p>}
      <div className="forma-blok">
        <label>
          Od (YYYY-MM-DD)
          <input type="date" value={od} onChange={(e) => setOd(e.target.value)} />
        </label>
        <label>
          Do
          <input type="date" value={doDat} onChange={(e) => setDoDat(e.target.value)} />
        </label>
        <button type="button" className="btn" onClick={() => void pokreniProdaja()}>
          Prodaja
        </button>
        <button type="button" className="btn btn-sekundarni" onClick={() => void pokreniNajam()}>
          Najam
        </button>
      </div>
      {prodaja && (
        <div className="izvj-blok">
          <h3>Prodaja</h3>
          <p>Završenih narudžbi: {prodaja.broj_zavrsenih_narudzbi}</p>
          <p>Ukupni prihod (stavke): {prodaja.ukupni_prihod} €</p>
          <p>Broj prodanih jedinica (stavke): {prodaja.broj_stavki}</p>
        </div>
      )}
      {najam && (
        <div className="izvj-blok">
          <h3>Najam</h3>
          <p>Broj najmova (početak u razdoblju): {najam.broj_najmova}</p>
          <p>Ukupno naplaćeno: {najam.ukupna_naplatena_najma} €</p>
        </div>
      )}
    </div>
  );
}
