import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ApiError, apiJson } from "../lib/api";

type BiciklKatalog = {
  bicikl_id: number;
  naziv: string;
  cijena_najma_po_danu: string | null;
  status: string;
  kolicina: number;
};

function cijenaNajmaBroj(v: string | null | undefined): number {
  if (v == null || String(v).trim() === "") return NaN;
  return parseFloat(String(v).replace(",", "."));
}

export default function NajamPage() {
  const { user } = useAuth();
  const [bicikli, setBicikli] = useState<BiciklKatalog[]>([]);
  const [biciklId, setBiciklId] = useState("");
  const [od, setOd] = useState("");
  const [doDat, setDoDat] = useState("");
  const [greska, setGreska] = useState<string | null>(null);
  const [uspjeh, setUspjeh] = useState<string | null>(null);
  const [listaGreska, setListaGreska] = useState<string | null>(null);

  const load = useCallback(async () => {
    setListaGreska(null);
    try {
      const list = await apiJson<BiciklKatalog[]>("/api/katalog/bicikli?samo_dostupni=1");
      setBicikli(list.filter((b) => {
        const n = cijenaNajmaBroj(b.cijena_najma_po_danu);
        return !Number.isNaN(n) && n > 0;
      }));
    } catch (e) {
      setListaGreska(e instanceof Error ? e.message : "Greška pri učitavanju ponude");
      setBicikli([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function dana(): number {
    if (!od || !doDat) return 0;
    const a = new Date(`${od}T12:00:00Z`);
    const b = new Date(`${doDat}T12:00:00Z`);
    if (b < a) return 0;
    return Math.floor((b.getTime() - a.getTime()) / 86400000) + 1;
  }

  const odabrani = bicikli.find((x) => String(x.bicikl_id) === biciklId);
  const cijenaDan = odabrani ? cijenaNajmaBroj(odabrani.cijena_najma_po_danu) : 0;
  const cijenaDanOk = !Number.isNaN(cijenaDan) && cijenaDan > 0;
  const ukupno = dana() > 0 && cijenaDanOk ? (dana() * cijenaDan).toFixed(2) : "0.00";

  async function rezerviraj(e: React.FormEvent) {
    e.preventDefault();
    setGreska(null);
    setUspjeh(null);
    if (user?.role !== "kupac") {
      setGreska("Rezervaciju može napraviti samo prijavljeni kupac.");
      return;
    }
    if (!biciklId || !od || !doDat) {
      setGreska("Popuni sva polja.");
      return;
    }
    try {
      await apiJson("/api/najmovi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bicikl_id: Number(biciklId),
          datum_pocetka: od,
          datum_zavrsetka: doDat,
        }),
      });
      setUspjeh("Najam je kreiran. Ukupna cijena (procjena): " + ukupno + " €");
      void load();
    } catch (err) {
      setGreska(err instanceof ApiError ? err.message : "Greška");
    }
  }

  return (
    <div className="panel" style={{ maxWidth: 520 }}>
      <h2>Rezervacija najma</h2>
      {!user && <p className="hint">Prijavite se kao kupac.</p>}
      {listaGreska && <p className="greska">{listaGreska}</p>}
      {!listaGreska && bicikli.length === 0 && (
        <p className="hint">
          Nema bicikala za najam: trebaju biti <strong>DOSTUPAN</strong>, s <strong>zalihom &gt; 0</strong> i{" "}
          <strong>cijenom najma/dan</strong> (djelatnik: stranica Bicikli). Nakon dodavanja stupca u bazu često
          su sve cijene najma prazne — ponovno pokrenite <code>SPIB_migrate_from_pre_spec.sql</code> da se
          automatski popune za dostupne bicikle.
        </p>
      )}
      {greska && <p className="greska">{greska}</p>}
      {uspjeh && <p className="hint">{uspjeh}</p>}
      <form className="forma-blok" onSubmit={rezerviraj}>
        <label>
          Bicikl
          <select value={biciklId} onChange={(e) => setBiciklId(e.target.value)} required>
            <option value="">— odaberi —</option>
            {bicikli.map((b) => (
              <option key={b.bicikl_id} value={b.bicikl_id}>
                {b.naziv} ({b.cijena_najma_po_danu} €/dan)
              </option>
            ))}
          </select>
        </label>
        <label>
          Datum početka
          <input type="date" value={od} onChange={(e) => setOd(e.target.value)} required />
        </label>
        <label>
          Datum završetka
          <input type="date" value={doDat} onChange={(e) => setDoDat(e.target.value)} required />
        </label>
        <p>
          Broj dana: <strong>{dana()}</strong> · Ukupno: <strong>{ukupno} €</strong>
        </p>
        <button type="submit" className="btn" disabled={user?.role !== "kupac"}>
          Potvrdi rezervaciju
        </button>
      </form>
    </div>
  );
}
