# LogKerja

Sistem **kelulusan dokumen berperingkat** (multi-stage document approval) berasaskan web.
Dibina dengan React + Vite + Supabase, dipasang sebagai PWA, dan disokong oleh sambungan (extension)
Chrome side-panel. UI dalam Bahasa Melayu.

> **Status:** Aktif dalam pengeluaran (production). Sila baca [AGENTS.md](AGENTS.md) dan
> [PROCESS_STATE.md](PROCESS_STATE.md) sebelum membuat sebarang perubahan.

## Apa itu LogKerja?

Dokumen melalui aliran kelulusan berperingkat oleh empat peranan:

| Peranan | Fungsi |
| --- | --- |
| **PENYEMAK** | Mencipta & menghantar dokumen; menghantar semula (resubmit) dokumen yang ditolak |
| **PENGESAH** | *Verifier* — menyemak & mengesahkan dokumen (peringkat pertama) |
| **PELULUS** | *Approver* — meluluskan dokumen (peringkat akhir) |
| **ADMIN** | Urus pengguna/peranan/kategori/routing; boleh `ON_HOLD` & padam dokumen |

Aliran status: `PENDING_VERIFIER → PENDING_APPROVER → LULUS`, dengan cabang `REJECTED`,
`ON_HOLD`, dan `RESUBMIT`. Butiran penuh dalam [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Stack

- **Frontend:** React 18, Vite 5, TypeScript, TailwindCSS 3, react-router-dom 6, lucide-react
- **Backend:** Supabase — Postgres (RLS), Auth (Google OAuth), Storage, Edge Functions (Deno), Realtime
- **PWA/Notifikasi:** vite-plugin-pwa + Web Push (VAPID)
- **Extension:** Chrome MV3 side panel (lihat [extension/README.md](extension/README.md))
- **Deploy:** Vercel

## Mula pantas

```bash
npm install
cp .env.example .env   # isi nilai sebenar (lihat docs/SETUP.md)
npm run dev
```

Panduan penuh (env, Supabase, deploy, extension): [docs/SETUP.md](docs/SETUP.md).

## Skrip

| Skrip | Fungsi |
| --- | --- |
| `npm run dev` | Server pembangunan Vite |
| `npm run build` | Semak jenis (`tsc`) + build produksi |
| `npm run lint` | ESLint (max-warnings 0) |
| `npm run preview` | Pratonton hasil build |

## Dokumentasi

- **[AGENTS.md](AGENTS.md)** — panduan untuk agen AI / pembangun yang menyambung kerja (baca dulu)
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — seni bina sistem hujung-ke-hujung
- **[docs/DATA_MODEL.md](docs/DATA_MODEL.md)** — skema pangkalan data, enum, RPC
- **[docs/SETUP.md](docs/SETUP.md)** — persediaan tempatan & deploy
- **[CHANGELOG.md](CHANGELOG.md)** — sejarah perubahan
- **[PROCESS_STATE.md](PROCESS_STATE.md)** — status semasa & backlog
- **[QA_CHECKLIST.md](QA_CHECKLIST.md)** — audit keselamatan/integriti (T6.0)
