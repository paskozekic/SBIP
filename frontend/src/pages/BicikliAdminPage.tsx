import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ApiError, apiJson, apiVoid } from "../lib/api";
import { statusBicikla } from "../lib/biciklStatus";

type Bicikl = {
  bicikl_id: number;
  naziv: string;
  cijena: string;
  kolicina: number;
  status: string;
  kategorija_id: number;
  kategorija_naziv: string | null;
  cijena_najma_po_danu: string | null;
};

type KatOpt = { kategorijaId: number; naziv: string };

type UrediForm = {
  naziv: string;
  cijena: string;
  kolicina: number;
  status: string;
  kategorija_id: number;
  cijena_najma_po_danu: string;
};

const STATUSI = ["DOSTUPAN", "IZNAJMLJEN", "PRODAN", "U_SERVISU", "NEDOSTUPAN"];

function formIzBicikla(b: Bicikl): UrediForm {
  return {
    naziv: b.naziv,
    cijena: b.cijena,
    kolicina: b.kolicina,
    status: b.status,
    kategorija_id: b.kategorija_id,
    cijena_najma_po_danu:
      b.cijena_najma_po_danu != null && String(b.cijena_najma_po_danu).trim() !== ""
        ? String(b.cijena_najma_po_danu)
        : "",
  };
}

export default function BicikliAdminPage() {
  const { user } = useAuth();
  const [lista, setLista] = useState<Bicikl[]>([]);
  const [kat, setKat] = useState<KatOpt[]>([]);
  const [greska, setGreska] = useState<string | null>(null);

  const [naziv, setNaziv] = useState("");
  const [cijena, setCijena] = useState("");
  const [kolicina, setKolicina] = useState(1);
  const [status, setStatus] = useState("DOSTUPAN");
  const [kategorijaId, setKategorijaId] = useState("");
  const [cijenaNajma, setCijenaNajma] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [uredi, setUredi] = useState<UrediForm | null>(null);

  const load = useCallback(async () => {
    if (user?.role !== "djelatnik") return;
    const [b, k] = await Promise.all([
      apiJson<Bicikl[]>("/api/katalog/bicikli"),
      apiJson<Array<{ kategorijaId: number; naziv: string }>>("/api/kategorije/za-odabir"),
    ]);
    setLista(b);
    setKat(k.map((x) => ({ kategorijaId: x.kategorijaId, naziv: x.naziv })));
    setKategorijaId((prev) => prev || (k[0] ? String(k[0].kategorijaId) : ""));
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  function pocniUredi(b: Bicikl) {
    setGreska(null);
    setEditId(b.bicikl_id);
    setUredi(formIzBicikla(b));
  }

  function odustaniUredi() {
    setEditId(null);
    setUredi(null);
    setGreska(null);
  }

  async function spremiUredi() {
    if (editId == null || !uredi) return;
    setGreska(null);
    try {
      await apiJson<Bicikl>(`/api/bicikli/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naziv: uredi.naziv.trim(),
          cijena: uredi.cijena.trim(),
          kolicina: uredi.kolicina,
          status: uredi.status,
          kategorija_id: uredi.kategorija_id,
          cijena_najma_po_danu: uredi.cijena_najma_po_danu.trim() || null,
        }),
      });
      odustaniUredi();
      await load();
    } catch (err) {
      setGreska(err instanceof ApiError ? err.message : "Greška");
    }
  }

  async function dodaj(e: React.FormEvent) {
    e.preventDefault();
    setGreska(null);
    try {
      await apiJson("/api/bicikli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naziv,
          cijena,
          kolicina,
          status,
          kategorija_id: Number(kategorijaId),
          cijena_najma_po_danu: cijenaNajma.trim() || null,
        }),
      });
      setNaziv("");
      setCijena("");
      setCijenaNajma("");
      await load();
    } catch (err) {
      setGreska(err instanceof ApiError ? err.message : "Greška");
    }
  }

  async function obrisi(id: number) {
    if (!confirm("Obrisati bicikl?")) return;
    setGreska(null);
    if (editId === id) odustaniUredi();
    try {
      await apiVoid(`/api/bicikli/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setGreska(err instanceof ApiError ? err.message : "Greška");
    }
  }

  if (user?.role !== "djelatnik") {
    return (
      <div className="panel">
        <p>Upravljanje katalogom bicikala (FZ-04 / KZ-04) dostupno je samo djelatnicima.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Katalog bicikala (admin)</h2>
      {greska && <p className="greska">{greska}</p>}
      <h3>Novi bicikl</h3>
      <form className="forma-blok forma-blok--zag" onSubmit={dodaj}>
        <label>
          Naziv
          <input value={naziv} onChange={(e) => setNaziv(e.target.value)} required />
        </label>
        <label>
          Prodajna cijena (€)
          <input value={cijena} onChange={(e) => setCijena(e.target.value)} required />
        </label>
        <label>
          Zaliha
          <input type="number" min={0} value={kolicina} onChange={(e) => setKolicina(Number(e.target.value))} />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSI.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Kategorija (FZ-09)
          <select value={kategorijaId} onChange={(e) => setKategorijaId(e.target.value)} required>
            {kat.map((k) => (
              <option key={k.kategorijaId} value={k.kategorijaId}>
                {k.naziv}
              </option>
            ))}
          </select>
        </label>
        <label>
          Cijena najma / dan (opcionalno)
          <input value={cijenaNajma} onChange={(e) => setCijenaNajma(e.target.value)} />
        </label>
        <button type="submit" className="btn">
          Dodaj
        </button>
      </form>
      <h3>Postojeći</h3>
      <div className="table-wrap">
        <table className="tablica">
          <thead>
            <tr>
              <th>#</th>
              <th>Naziv</th>
              <th>Kat.</th>
              <th>Cijena</th>
              <th>Najam/d</th>
              <th>Stat</th>
              <th>Zal.</th>
              <th>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((b) => {
              const u = editId === b.bicikl_id ? uredi : null;
              return (
                <tr key={b.bicikl_id}>
                  <td>{b.bicikl_id}</td>
                  <td>
                    {u ? (
                      <input
                        className="tablica-cel-input tablica-cel-naziv"
                        value={u.naziv}
                        onChange={(e) => setUredi({ ...u, naziv: e.target.value })}
                      />
                    ) : (
                      b.naziv
                    )}
                  </td>
                  <td>
                    {u ? (
                      <select
                        className="tablica-cel-input"
                        value={u.kategorija_id}
                        onChange={(e) => setUredi({ ...u, kategorija_id: Number(e.target.value) })}
                      >
                        {kat.map((k) => (
                          <option key={k.kategorijaId} value={k.kategorijaId}>
                            {k.naziv}
                          </option>
                        ))}
                      </select>
                    ) : (
                      b.kategorija_naziv
                    )}
                  </td>
                  <td>
                    {u ? (
                      <input
                        className="tablica-cel-input"
                        value={u.cijena}
                        onChange={(e) => setUredi({ ...u, cijena: e.target.value })}
                      />
                    ) : (
                      b.cijena
                    )}
                  </td>
                  <td>
                    {u ? (
                      <input
                        className="tablica-cel-input"
                        value={u.cijena_najma_po_danu}
                        onChange={(e) => setUredi({ ...u, cijena_najma_po_danu: e.target.value })}
                        placeholder="prazno = nema"
                      />
                    ) : b.cijena_najma_po_danu != null && String(b.cijena_najma_po_danu).trim() !== "" ? (
                      b.cijena_najma_po_danu
                    ) : (
                      "nije postavljeno"
                    )}
                  </td>
                  <td>
                    {u ? (
                      <select
                        className="tablica-cel-input"
                        value={u.status}
                        onChange={(e) => setUredi({ ...u, status: e.target.value })}
                      >
                        {STATUSI.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      statusBicikla(b.status)
                    )}
                  </td>
                  <td>
                    {u ? (
                      <input
                        type="number"
                        min={0}
                        className="tablica-cel-input"
                        value={u.kolicina}
                        onChange={(e) => setUredi({ ...u, kolicina: Number(e.target.value) })}
                      />
                    ) : (
                      b.kolicina
                    )}
                  </td>
                  <td className="tablica-akcije">
                    {u ? (
                      <>
                        <button type="button" className="btn btn-mali" onClick={() => void spremiUredi()}>
                          Spremi
                        </button>
                        <button type="button" className="btn btn-mali btn-sekundarni" onClick={odustaniUredi}>
                          Odustani
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-mali"
                        onClick={() => pocniUredi(b)}
                        disabled={editId !== null}
                      >
                        Uredi
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-mali btn-sekundarni"
                      onClick={() => void obrisi(b.bicikl_id)}
                      disabled={editId !== null}
                    >
                      Obriši
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
