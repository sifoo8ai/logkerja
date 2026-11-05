# Persediaan & Deploy LogKerja

Panduan menjalankan LogKerja pada mesin baru dan deploy. Untuk seni bina, lihat
[ARCHITECTURE.md](ARCHITECTURE.md).

## Prasyarat

- Node.js 18+ dan npm.
- Akses ke projek Supabase (`csimvhrkwpoeyncqxvus`) — untuk migration/Edge Function/secret.
- (Pilihan) Supabase CLI untuk urus migration & deploy Edge Function.
- Akaun Vercel untuk deploy frontend.

## 1. Pembolehubah persekitaran

Salin `.env.example` → `.env` dan isi nilai sebenar. **Jangan commit `.env`** (sudah di-gitignore).

| Var | Guna |
| --- | --- |
| `VITE_SUPABASE_URL` | URL projek Supabase (mis. `https://csimvhrkwpoeyncqxvus.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Kunci anon Supabase (selamat didedah ke klien) |
| `VITE_VAPID_PUBLIC_KEY` | Kunci awam VAPID untuk Web Push (**mesti sah**: 65 bait bila di-decode, ~87 aksara Base64URL) |

> **Service-role key** tidak pernah diletak dalam frontend. Ia hanya wujud sebagai secret Edge
> Function di Supabase.

## 2. Pembangunan tempatan

```bash
npm install
npm run dev        # http://localhost:5173
```

Skrip lain:

```bash
npm run build      # tsc (semak jenis) + vite build
npm run lint       # eslint, max-warnings 0
npm run preview    # pratonton hasil build
```

Tiada test automatik buat masa ini; pengesahan manual ikut [../QA_CHECKLIST.md](../QA_CHECKLIST.md).

## 3. Supabase

### Supabase CLI (v3)

CLI dipasang sebagai devDependency (`npx supabase ...`). Login sekali dengan `npx supabase login`.

> ⚠️ **CLI v3 sasarkan stack LOKAL secara lalai.** Sentiasa tambah `--remote` (atau
> `--remote=csimvhrkwpoeyncqxvus`) untuk production, dan buat `--dry-run` dahulu:
>
> ```bash
> npx supabase migration list --remote          # pastikan hanya migration baharu yang belum ada di remote
> npx supabase db push --remote --dry-run       # semak apa yang akan dijalankan
> npx supabase db push --remote --yes
> npx supabase functions deploy <nama> --no-verify-jwt --remote=csimvhrkwpoeyncqxvus --yes
> ```
>
> Tanpa `--yes`, prompt deploy berpilihan lalai **No**.

### Migration
- Fail SQL dalam `supabase/migrations/` (bernama `<timestamp>_<deskripsi>.sql`).
- **Tambah migration baharu** untuk sebarang perubahan skema — jangan edit fail lama.
- Selaraskan dengan DB jauh sebelum menambah (commit lalu pernah "align migrations with remote DB").
- Guna Supabase CLI (`supabase db push` / `supabase migration up`) atau papan pemuka SQL editor.

### Edge Functions
- Deno, dalam `supabase/functions/` (lihat senarai di [ARCHITECTURE.md](ARCHITECTURE.md)).
- Deploy: `supabase functions deploy <nama>`. Sesetengah pernah di-deploy dengan `--no-verify-jwt`
  (auth dikendali dalam kod). Semak `supabase/config.toml` untuk tetapan `verify_jwt`.
- Secret Edge Function (service-role key, VAPID private key, dll) diset melalui
  `supabase secrets set` — bukan dalam repo.

### Realtime
- Didayakan melalui migration `enable_realtime` untuk jadual `documents`.

## 4. Deploy frontend (Vercel)

- Import repo ke Vercel; framework preset Vite.
- Set env vars (`VITE_*`) dalam tetapan projek Vercel.
- `vercel.json` sudah menulis semula semua laluan ke `/index.html` (perlu untuk SPA routing).
- Build command: `npm run build`; output: `dist/`.

### ⚠️ Kekangan Hobby plan (commit author)

Projek guna Vercel **Hobby plan** — deployment hanya dicetus oleh pemilik. Deployment pernah berhenti
(status "Stale") selepas commit `31ca0db` (Mar 2026); commit berikutnya tidak deploy. Semakan git
history menunjukkan **email author kekal `sifoo8.ai@gmail.com`** pada semua commit, jadi puncanya
**bukan** email author — lebih berkemungkinan **akaun GitHub yang push** atau sambungan Git-integration
Vercel yang putus. Sebelum setiap `git push`:

- **Pastikan push diautentikasi sebagai akaun GitHub `sifoo8ai`** (yang bersambung ke Vercel).
  Pemilik ada beberapa akaun GitHub; di komputer baru, semak kredential tersimpan (Windows Credential
  Manager) menggunakan akaun yang betul.
- Kekalkan git author `sifoo8ai` / `sifoo8.ai@gmail.com` untuk konsistensi.
- Jika masih tak deploy, connect semula integrasi Git di tetapan projek Vercel dan sahkan akaun
  GitHub yang push.

## 5. Extension Chrome (pilihan)

Side panel MV3 dalam `extension/` yang membungkus PWA. Ikut arahan pasang dalam
[../extension/README.md](../extension/README.md) (muat di `chrome://extensions` mod pembangun).

## 6. Keep-alive Supabase

`.github/workflows/supabase-ping.yml` menjalankan ping REST harian (00:00 UTC) untuk kekalkan
Supabase free-tier aktif. Perlu secret repo GitHub: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

## Nota keselamatan

- Jangan commit `.env` atau sebarang kunci.
- Service-role key hanya di secret Edge Function Supabase.
- Bucket lampiran privat — akses hanya via signed URL.
- Aliran auth (popup + `getSession`) sengaja untuk extension — uji dalam side panel sebelum ubah.
