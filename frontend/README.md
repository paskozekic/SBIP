# SPIB — frontend (Faza C)

**Stack:** React 19, TypeScript, Vite 8, **react-router-dom** 7.

## Pokretanje

Zahtijeva **pokrenut backend** na `http://localhost:3000` (Vite proksi šalje `/api` tamo).

```powershell
cd frontend
npm install
npm run dev
```

Sučelje: **http://localhost:5173**

## Rute u aplikaciji

| Put | Opis |
|-----|------|
| `/` | Početna, provjera `/api/health` |
| `/narudzbe` | Master–detail narudžbe + stavke |
| `/kategorije` | Šifrarnik kategorija (CRUD + pretraga) |

Izvorni kod: `src/App.tsx` (ruter), `src/components/Layout.tsx`, `src/pages/`, `src/lib/api.ts`.
