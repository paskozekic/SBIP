# Faza C — frontend (SPIB)

## Što je u repou

- **React 19 + TypeScript + Vite 8**
- **`react-router-dom`** — rute: `/` (početna), `/narudzbe`, `/kategorije`
- Zajednički **layout** s gornjom navigacijom (`src/components/Layout.tsx`)

## Pokretanje

**Terminal 1 — backend** (port 3000):

```powershell
cd backend
npm run dev
```

**Terminal 2 — frontend** (port 5173, proxy `/api` → 3000):

```powershell
cd frontend
npm run dev
```

Otvori **http://localhost:5173**.

## Stranice (za QA)

| Ruta | Sadržaj |
|------|---------|
| `/` | Početna — dobrodošlica i brzi pristup Narudžbama / Kategorijama |
| `/narudzbe` | Master–detail narudžbe, CRUD stavki, nova narudžba |
| `/kategorije` | Šifrarnik: pretraga, tablica, CRUD |

## Backend ovisnosti (Faza C)

Za padajuće liste u narudžbi dodane su read-only rute: `GET /api/kupci`, `GET /api/djelatnici`, `GET /api/bicikli` (vidi `backend/README.md`).
