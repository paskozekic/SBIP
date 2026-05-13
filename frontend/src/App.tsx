import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState<string>('…')
  const [greska, setGreska] = useState<string | null>(null)

  useEffect(() => {
    let otkazano = false
    ;(async () => {
      try {
        const h = await fetch('/api/health')
        if (!h.ok) throw new Error(`health ${h.status}`)
        const hj = (await h.json()) as { status: string }
        if (!otkazano) setHealth(hj.status)
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
        <h2>Narudžbe</h2>
        <p className="hint">
          REST za narudžbe i stavke je na backendu (§2). UI master–detail dolazi u Fazi C.
        </p>
      </section>
    </div>
  )
}

export default App
