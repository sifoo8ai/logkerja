# CLAUDE.md

Panduan untuk Claude Code apabila bekerja dalam repo ini. Fail ini dimuat automatik setiap sesi —
sengaja ringkas. **Sumber ilmu penuh ada dalam [AGENTS.md](AGENTS.md) dan `docs/`.**

## Baca dahulu

Sebelum membuat sebarang perubahan, baca:
1. [AGENTS.md](AGENTS.md) — panduan agen (peta repo, peranan, state machine, kaedah selamat)
2. [PROCESS_STATE.md](PROCESS_STATE.md) — status semasa & backlog
3. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) / [docs/DATA_MODEL.md](docs/DATA_MODEL.md) bila perlu butiran

## Peraturan penting (ringkasan — butiran penuh di AGENTS.md §6)

- **LogKerja aktif dalam pengeluaran** — utamakan elak breaking change.
- **Jangan** tulis terus ke jadual `documents`; guna RPC `transition_document`/`create_document`
  melalui Edge Function. Setiap peralihan mesti tinggalkan audit `document_actions`.
- **Migration** = tambah fail baharu bertarikh dalam `supabase/migrations/`; jangan edit yang lama.
- Auth (popup + `getSession`) sengaja dibina begitu untuk extension Chrome — jangan ubah tanpa uji.
- `.env` di-gitignore; jangan commit rahsia. Service-role key hanya di Edge Function.
- **Commit/push hanya bila pemilik minta**, dan hanya selepas `npm run build` lulus.

## Perintah

```bash
npm run dev      # server pembangunan
npm run build    # tsc + vite build (semak sebelum commit)
npm run lint     # eslint, max-warnings 0
```

## Selepas berubah

Kemas kini [CHANGELOG.md](CHANGELOG.md) + [PROCESS_STATE.md](PROCESS_STATE.md), dan
[docs/DATA_MODEL.md](docs/DATA_MODEL.md) jika skema berubah.
