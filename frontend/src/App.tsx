import { useEffect, useState } from 'react'
import './App.css'

type Kategorija = {
  kategorija_id: number
  naziv: string
  opis: string | null
}

function App() {
  const [health, setHealth] = useState<string>('…')
  const [kategorije, setKategorije] = useState<Kategorija[]>([])
  const [greska, setGreska] = useState<string | null>(null)

  useEffect(() => {
    let otkazano = false
    ;(async () => {
      try {
        const h = await fetch('/api/health')
        if (!h.ok) throw new Error(`health ${h.status}`)
        const hj = (await h.json()) as { status: string }
        if (!otkazano) setHealth(hj.status)

        const k = await fetch('/api/kategorije')
        if (!k.ok) throw new Error(`kategorije ${k.status}`)
        const kj = (await k.json()) as Kategorija[]
        if (!otkazano) setKategorije(kj)
      } catch (e) {
        if (!otkazano) {
          setGreska(e instanceof Error ? e.message : 'Greška mreže')
          setHealth('greška')
        }
      }
    })()
    return () => {
      otkazano = true
    }
  }, [])

  return (
    <div className="spib">
      <header>
        <h1>SPIB</h1>
        <p className="podnaslov">Sustav za prodaju i iznajmljivanje bicikala — Faza B</p>
      </header>

      <section className="status">
        <h2>API</h2>
        <p>
          <code>/api/health</code> → <strong>{health}</strong>
        </p>
        {greska && <p className="greska">{greska} (pokreni backend: npm run dev u mapi backend)</p>}
      </section>

      <section>
        <h2>Kategorije bicikla</h2>
        <p className="hint">Podaci s <code>GET /api/kategorije</code> (proxy s Vite na port 3000).</p>
        <ul className="lista">
          {kategorije.map((c) => (
            <li key={c.kategorija_id}>
              <span className="naziv">{c.naziv}</span>
              {c.opis && <span className="opis"> — {c.opis}</span>}
            </li>
          ))}
        </ul>
        {kategorije.length === 0 && !greska && <p>Učitavanje…</p>}
      </section>
    </div>
  )
}

export default App
