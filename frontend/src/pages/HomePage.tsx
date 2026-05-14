import { useEffect, useState } from "react";
import { ApiError, apiJson } from "../lib/api";

export default function HomePage() {
  const [health, setHealth] = useState<string>("…");
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    let o = false;
    (async () => {
      try {
        const j = await apiJson<{ status: string }>("/api/health");
        if (!o) setHealth(j.status);
      } catch (e) {
        if (!o) setGreska(e instanceof ApiError ? e.message : "Greška mreže");
      }
    })();
    return () => {
      o = true;
    };
  }, []);

  return (
    <section>
      <h2>Dobrodošli</h2>
      <p className="hint">
        Backend: <code>/api/health</code> → <strong>{health}</strong>
      </p>
      {greska && <p className="greska">{greska}</p>}
      <p>
        Odaberi <strong>Narudžbe</strong> za master–detail ili <strong>Kategorije</strong> za šifrarnik.
      </p>
    </section>
  );
}
