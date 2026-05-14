import { useCallback, useEffect, useState } from "react";
import { ApiError, apiJson } from "../lib/api";

type NarudzbaList = {
  narudzba_id: number;
  datum: string;
  status: string;
  kupac_korisnik_id: number;
  kupac_ime: string;
  kupac_prezime: string;
  djelatnik_korisnik_id: number | null;
};

type Stavka = {
  stavka_id: number;
  kolicina: number;
  cijena: string;
  bicikl_id: number;
  narudzba_id: number;
  bicikl_naziv: string | null;
};

type NarudzbaDetalj = NarudzbaList & {
  djelatnik_ime: string | null;
  djelatnik_prezime: string | null;
  stavke: Stavka[];
};

type Osoba = { korisnik_id: number; ime: string; prezime: string };
type Bicikl = { bicikl_id: number; naziv: string; kolicina: number; cijena: string };

function osobaLabel(o: Osoba) {
  return `${o.prezime}, ${o.ime} (#${o.korisnik_id})`;
}

export default function NarudzbePage() {
  const [lista, setLista] = useState<NarudzbaList[]>([]);
  const [kupci, setKupci] = useState<Osoba[]>([]);
  const [djelatnici, setDjelatnici] = useState<Osoba[]>([]);
  const [bicikli, setBicikli] = useState<Bicikl[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detalj, setDetalj] = useState<NarudzbaDetalj | null>(null);
  const [greska, setGreska] = useState<string | null>(null);
  const [loadDetalj, setLoadDetalj] = useState(0);

  const [novaOtvorena, setNovaOtvorena] = useState(false);
  const [novaStatus, setNovaStatus] = useState("NOVA");
  const [novaKupac, setNovaKupac] = useState<number | "">("");
  const [novaDjel, setNovaDjel] = useState<number | "">("");

  const [zagStatus, setZagStatus] = useState("");
  const [zagDjel, setZagDjel] = useState<number | "">("");

  const [novaStBicikl, setNovaStBicikl] = useState<number | "">("");
  const [novaStKol, setNovaStKol] = useState(1);

  const [editStId, setEditStId] = useState<number | null>(null);
  const [editBicikl, setEditBicikl] = useState<number | "">("");
  const [editKol, setEditKol] = useState(1);

  const loadSifre = useCallback(async () => {
    const [k, d, b] = await Promise.all([
      apiJson<Osoba[]>("/api/kupci"),
      apiJson<Osoba[]>("/api/djelatnici"),
      apiJson<Bicikl[]>("/api/bicikli"),
    ]);
    setKupci(k);
    setDjelatnici(d);
    setBicikli(b);
    setNovaKupac((prev) => (prev === "" && k[0] ? k[0].korisnik_id : prev));
  }, []);

  const loadLista = useCallback(async () => {
    const rows = await apiJson<NarudzbaList[]>("/api/narudzbe?limit=100");
    setLista(rows);
  }, []);

  useEffect(() => {
    let o = false;
    setGreska(null);
    (async () => {
      try {
        await loadSifre();
        await loadLista();
      } catch (e) {
        if (!o) setGreska(e instanceof ApiError ? e.message : "Greška učitavanja");
      }
    })();
    return () => {
      o = true;
    };
  }, [loadLista, loadSifre]);

  useEffect(() => {
    if (selectedId == null) {
      setDetalj(null);
      return;
    }
    let o = false;
    setGreska(null);
    (async () => {
      try {
        const d = await apiJson<NarudzbaDetalj>(`/api/narudzbe/${selectedId}`);
        if (!o) {
          setDetalj(d);
          setZagStatus(d.status);
          setZagDjel(d.djelatnik_korisnik_id ?? "");
        }
      } catch (e) {
        if (!o) setGreska(e instanceof ApiError ? e.message : "Greška detalja");
      }
    })();
    return () => {
      o = true;
    };
  }, [selectedId, loadDetalj]);

  async function spremiZaglavlje() {
    if (selectedId == null) return;
    setGreska(null);
    try {
      const body: { status?: string; djelatnik_korisnik_id?: number | null } = {};
      if (zagStatus.trim()) body.status = zagStatus.trim();
      body.djelatnik_korisnik_id = zagDjel === "" ? null : Number(zagDjel);
      const d = await apiJson<NarudzbaDetalj>(`/api/narudzbe/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setDetalj(d);
      await loadLista();
    } catch (e) {
      setGreska(e instanceof ApiError ? e.message : "Greška spremanja");
    }
  }

  async function dodajStavku() {
    if (selectedId == null || novaStBicikl === "") return;
    setGreska(null);
    try {
      await apiJson<NarudzbaDetalj>(`/api/narudzbe/${selectedId}/stavke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bicikl_id: Number(novaStBicikl), kolicina: novaStKol }),
      });
      setLoadDetalj((x) => x + 1);
      setNovaStKol(1);
    } catch (e) {
      setGreska(e instanceof ApiError ? e.message : "Greška dodavanja stavke");
    }
  }

  async function spremiStavku() {
    if (selectedId == null || editStId == null || editBicikl === "") return;
    setGreska(null);
    try {
      await apiJson<NarudzbaDetalj>(`/api/narudzbe/${selectedId}/stavke/${editStId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bicikl_id: Number(editBicikl), kolicina: editKol }),
      });
      setEditStId(null);
      setLoadDetalj((x) => x + 1);
    } catch (e) {
      setGreska(e instanceof ApiError ? e.message : "Greška stavke");
    }
  }

  async function obrisiStavku(stavkaId: number) {
    if (selectedId == null || !confirm("Obrisati stavku?")) return;
    setGreska(null);
    try {
      await apiJson<NarudzbaDetalj>(`/api/narudzbe/${selectedId}/stavke/${stavkaId}`, {
        method: "DELETE",
      });
      setLoadDetalj((x) => x + 1);
    } catch (e) {
      setGreska(e instanceof ApiError ? e.message : "Greška brisanja");
    }
  }

  async function kreirajNarudzbu() {
    if (novaKupac === "") return;
    setGreska(null);
    try {
      const body = {
        status: novaStatus.trim() || "NOVA",
        kupac_korisnik_id: Number(novaKupac),
        djelatnik_korisnik_id: novaDjel === "" ? null : Number(novaDjel),
      };
      const d = await apiJson<NarudzbaDetalj>("/api/narudzbe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setNovaOtvorena(false);
      setSelectedId(d.narudzba_id);
      setDetalj(d);
      setZagStatus(d.status);
      setZagDjel(d.djelatnik_korisnik_id ?? "");
      await loadLista();
    } catch (e) {
      setGreska(e instanceof ApiError ? e.message : "Greška kreiranja");
    }
  }

  return (
    <div className="grid-dva">
      <section className="panel">
        <div className="panel-head">
          <h2>Narudžbe</h2>
          <button type="button" className="btn btn-sekundarni" onClick={() => setNovaOtvorena((v) => !v)}>
            {novaOtvorena ? "Zatvori" : "Nova narudžba"}
          </button>
        </div>
        {novaOtvorena && (
          <div className="forma-blok">
            <label>
              Status
              <input value={novaStatus} onChange={(e) => setNovaStatus(e.target.value)} />
            </label>
            <label>
              Kupac
              <select
                value={novaKupac === "" ? "" : String(novaKupac)}
                onChange={(e) => setNovaKupac(e.target.value ? Number(e.target.value) : "")}
              >
                {kupci.map((k) => (
                  <option key={k.korisnik_id} value={k.korisnik_id}>
                    {osobaLabel(k)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Djelatnik (opcionalno)
              <select
                value={novaDjel === "" ? "" : String(novaDjel)}
                onChange={(e) => setNovaDjel(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">—</option>
                {djelatnici.map((d) => (
                  <option key={d.korisnik_id} value={d.korisnik_id}>
                    {osobaLabel(d)}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="btn" onClick={kreirajNarudzbu}>
              Kreiraj
            </button>
          </div>
        )}
        <ul className="lista-nar">
          {lista.map((n) => (
            <li key={n.narudzba_id}>
              <button
                type="button"
                className={selectedId === n.narudzba_id ? "lista-nar__btn lista-nar__btn--akt" : "lista-nar__btn"}
                onClick={() => setSelectedId(n.narudzba_id)}
              >
                <span className="lista-nar__id">#{n.narudzba_id}</span>
                <span className="lista-nar__meta">
                  {n.status} · {n.kupac_prezime} {n.kupac_ime}
                </span>
                <span className="lista-nar__dat">{n.datum}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel panel--siroko">
        <h2>Detalj</h2>
        {greska && <p className="greska">{greska}</p>}
        {!selectedId && <p className="hint">Odaberi narudžbu s lijeve strane.</p>}
        {selectedId != null && !detalj && <p>Učitavanje…</p>}
        {detalj && (
          <>
            <div className="forma-blok forma-blok--zag">
              <p>
                <strong>#{detalj.narudzba_id}</strong> · {detalj.datum}
              </p>
              <p>
                Kupac: {detalj.kupac_prezime} {detalj.kupac_ime}
              </p>
              <label>
                Status
                <input value={zagStatus} onChange={(e) => setZagStatus(e.target.value)} />
              </label>
              <label>
                Djelatnik
                <select
                  value={zagDjel === "" ? "" : String(zagDjel)}
                  onChange={(e) => setZagDjel(e.target.value ? Number(e.target.value) : "")}
                >
                  <option value="">—</option>
                  {djelatnici.map((d) => (
                    <option key={d.korisnik_id} value={d.korisnik_id}>
                      {osobaLabel(d)}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="btn" onClick={spremiZaglavlje}>
                Spremi zaglavlje
              </button>
            </div>

            <h3>Stavke</h3>
            <div className="table-wrap">
              <table className="tablica">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Bicikl</th>
                    <th>Kol.</th>
                    <th>Cijena</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {detalj.stavke.map((s) => (
                    <tr key={s.stavka_id}>
                      {editStId === s.stavka_id ? (
                        <>
                          <td>{s.stavka_id}</td>
                          <td>
                            <select
                              value={editBicikl === "" ? "" : String(editBicikl)}
                              onChange={(e) => setEditBicikl(e.target.value ? Number(e.target.value) : "")}
                            >
                              {bicikli.map((b) => (
                                <option key={b.bicikl_id} value={b.bicikl_id}>
                                  {b.naziv} (zal. {b.kolicina})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              min={1}
                              value={editKol}
                              onChange={(e) => setEditKol(Number(e.target.value))}
                            />
                          </td>
                          <td>{s.cijena}</td>
                          <td className="tablica-akcije">
                            <button type="button" className="btn btn-mali" onClick={spremiStavku}>
                              Spremi
                            </button>
                            <button type="button" className="btn btn-mali btn-sekundarni" onClick={() => setEditStId(null)}>
                              Odustani
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{s.stavka_id}</td>
                          <td>
                            {s.bicikl_naziv ?? `bicikl #${s.bicikl_id}`}
                          </td>
                          <td>{s.kolicina}</td>
                          <td>{s.cijena}</td>
                          <td className="tablica-akcije">
                            <button
                              type="button"
                              className="btn btn-mali btn-sekundarni"
                              onClick={() => {
                                setEditStId(s.stavka_id);
                                setEditBicikl(s.bicikl_id);
                                setEditKol(s.kolicina);
                              }}
                            >
                              Uredi
                            </button>
                            <button type="button" className="btn btn-mali" onClick={() => void obrisiStavku(s.stavka_id)}>
                              Obriši
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="forma-blok">
              <h4>Nova stavka</h4>
              <label>
                Bicikl
                <select
                  value={novaStBicikl === "" ? "" : String(novaStBicikl)}
                  onChange={(e) => setNovaStBicikl(e.target.value ? Number(e.target.value) : "")}
                >
                  <option value="">— odaberi —</option>
                  {bicikli.map((b) => (
                    <option key={b.bicikl_id} value={b.bicikl_id}>
                      {b.naziv} (zal. {b.kolicina})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Količina
                <input
                  type="number"
                  min={1}
                  value={novaStKol}
                  onChange={(e) => setNovaStKol(Number(e.target.value))}
                />
              </label>
              <button type="button" className="btn" onClick={dodajStavku}>
                Dodaj stavku
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
