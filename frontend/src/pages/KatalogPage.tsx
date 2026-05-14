import { useCallback, useEffect, useState } from "react";
import { apiJson } from "../lib/api";
import { statusBicikla } from "../lib/biciklStatus";

type KatOpt = { kategorijaId: number; naziv: string };

type BiciklKatalog = {
  bicikl_id: number;
  naziv: string;
  cijena: string;
  kolicina: number;
  status: string;
  kategorija_id: number;
  kategorija_naziv: string | null;
  cijena_najma_po_danu: string | null;
};

export default function KatalogPage() {
  const [kategorije, setKategorije] = useState<KatOpt[]>([]);
  const [katId, setKatId] = useState("");
  const [q, setQ] = useState("");
  const [cijenaOd, setCijenaOd] = useState("");
  const [cijenaDo, setCijenaDo] = useState("");
  const [samoDostupni, setSamoDostupni] = useState(false);
  const [rows, setRows] = useState<BiciklKatalog[]>([]);
  const [greska, setGreska] = useState<string | null>(null);

  const loadKat = useCallback(async () => {
    const k = await apiJson<Array<{ kategorijaId: number; naziv: string }>>("/api/kategorije/za-odabir");
    setKategorije(k.map((x) => ({ kategorijaId: x.kategorijaId, naziv: x.naziv })));
  }, []);

  const pretrazi = useCallback(async () => {
    setGreska(null);
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (katId) p.set("kategorija_id", katId);
    if (cijenaOd) p.set("cijena_od", cijenaOd);
    if (cijenaDo) p.set("cijena_do", cijenaDo);
    if (samoDostupni) p.set("samo_dostupni", "1");
    try {
      const list = await apiJson<BiciklKatalog[]>(`/api/katalog/bicikli?${p.toString()}`);
      setRows(list);
    } catch (e) {
      setGreska(e instanceof Error ? e.message : "Greška");
    }
  }, [q, katId, cijenaOd, cijenaDo, samoDostupni]);

  useEffect(() => {
    void loadKat();
  }, [loadKat]);

  useEffect(() => {
    void pretrazi();
  }, [pretrazi]);

  return (
    <div className="panel">
      <h2>Katalog bicikala</h2>
      {greska && <p className="greska">{greska}</p>}
      <div className="forma-blok forma-blok--zag">
        <label>
          Naziv (dio)
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="pretraga…" />
        </label>
        <label>
          Kategorija
          <select value={katId} onChange={(e) => setKatId(e.target.value)}>
            <option value="">— sve —</option>
            {kategorije.map((k) => (
              <option key={k.kategorijaId} value={String(k.kategorijaId)}>
                {k.naziv}
              </option>
            ))}
          </select>
        </label>
        <label>
          Cijena od
          <input type="number" min={0} value={cijenaOd} onChange={(e) => setCijenaOd(e.target.value)} />
        </label>
        <label>
          Cijena do
          <input type="number" min={0} value={cijenaDo} onChange={(e) => setCijenaDo(e.target.value)} />
        </label>
        <label className="chk-inline">
          <input type="checkbox" checked={samoDostupni} onChange={(e) => setSamoDostupni(e.target.checked)} />
          Samo dostupni (zaloga &gt; 0, status DOSTUPAN)
        </label>
      </div>
      <div className="kartice-katalog">
        {rows.map((b) => (
          <article key={b.bicikl_id} className="kartica-bicikl">
            <h3>{b.naziv}</h3>
            <p className="kartica-bicikl__meta">
              {b.kategorija_naziv} · <span className="status-znacka">{statusBicikla(b.status)}</span>
            </p>
            <p>
              Prodaja: <strong>{b.cijena} €</strong>
            </p>
            <p>
              Najam/dan:{" "}
              <strong>
                {b.cijena_najma_po_danu != null && String(b.cijena_najma_po_danu).trim() !== ""
                  ? `${b.cijena_najma_po_danu} €`
                  : "nije postavljeno"}
              </strong>
            </p>
            <p>Zaliha: {b.kolicina}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
