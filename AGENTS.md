# AGENTS.md — Panduan Agen LogKerja

Fail ini ialah **sumber ilmu utama** untuk mana-mana agen AI atau pembangun yang menyambung kerja
pada LogKerja. Baca ini dahulu, kemudian rujuk dokumen mendalam dalam `docs/`.

> ⚠️ **LogKerja aktif digunakan dalam pengeluaran.** Keutamaan tertinggi ialah **elak breaking
> change**. Jangan ubah skema pangkalan data, aliran auth, atau RPC state-machine tanpa memahami
> kesan penuh. Bila ragu, tanya pemilik projek.

---

## 1. Apa itu sistem ini

Sistem kelulusan dokumen berperingkat. Dokumen dicipta oleh **PENYEMAK**, disahkan oleh
**PENGESAH** (verifier), diluluskan oleh **PELULUS** (approver), dan ditadbir oleh **ADMIN**.
Semua peralihan status dikuatkuasakan di pelayan (server-side) dan setiap tindakan direkod dalam
audit trail. UI dalam Bahasa Melayu.

Lihat [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) dan [docs/DATA_MODEL.md](docs/DATA_MODEL.md).

## 2. Stack & perintah

- React 18 + Vite 5 + TypeScript + TailwindCSS 3; react-router-dom 6; lucide-react (ikon).
- Supabase: Postgres (RLS), Auth (Google OAuth PKCE), Storage, Edge Functions (Deno), Realtime.
- PWA (vite-plugin-pwa, service worker `src/sw.ts`) + Web Push (VAPID). Extension Chrome MV3.
- Deploy: Vercel (`vercel.json` — SPA rewrite semua laluan ke `/index.html`).

```bash
npm run dev      # server pembangunan
npm run build    # tsc (semak jenis) + vite build — WAJIB lulus sebelum commit
npm run lint     # eslint, max-warnings 0
```

**Tiada test automatik** buat masa ini. Pengesahan = `npm run build` + ujian manual mengikut
[QA_CHECKLIST.md](QA_CHECKLIST.md).

## 3. Peta repo

```
src/
  main.tsx              entry — daftar SW, kendali redirect OAuth, render App
  App.tsx               BrowserRouter
  routes/AppRouter.tsx  semua definisi laluan + kendali sesi auth + popup login
  lib/
    supabaseClient.ts   init klien Supabase (flowType 'pkce')
    auth.ts             checkAndBootstrapProfile, fetchUserRoles, active-role, signOut
    roles.ts            peta peranan → laluan
  features/             LAPISAN API (panggil Supabase / Edge Functions)
    documents/          penyemakApi.ts, pengesahApi.ts, pelulusApi.ts
    admin/adminApi.ts
    attachments/attachmentsApi.ts
    notifications/pushClient.ts
  pages/                Login, RolePicker, Profile, dashboards/, mobile/
  components/           admin/, documents/, dashboard/, layout/, mobile/, attachments/
  hooks/                useAuth.ts, useMediaQuery.ts
  sw.ts                 service worker tersuai (injectManifest)

supabase/
  migrations/           16 fail SQL (skema, RLS, storage, grants, indeks)
  functions/            7 Edge Function Deno (lihat §5)
  config.toml

extension/              Chrome MV3 side panel (bungkus PWA)
.github/workflows/      supabase-ping.yml (keep-alive harian free-tier)
```

## 4. Model peranan & state machine (KRITIKAL)

Peranan (enum `app_role`): `ADMIN`, `PENYEMAK`, `PENGESAH`, `PELULUS`. Seorang pengguna boleh
ada **banyak peranan** (jadual `user_roles`, many-to-many). Peranan aktif disimpan dalam
`localStorage` (`activeRole`).

Status dokumen (enum `document_status`): `PENDING_VERIFIER`, `PENDING_APPROVER`, `REJECTED`,
`LULUS`, `ON_HOLD`.

Peralihan sah (dikuatkuasa dalam RPC `transition_document`):

| Dari | Tindakan | Oleh | Ke | Nota |
| --- | --- | --- | --- | --- |
| `PENDING_VERIFIER` | APPROVE | verifier ditugaskan | `PENDING_APPROVER` | jika verifier ≠ approver |
| `PENDING_VERIFIER` | APPROVE | verifier ditugaskan | `LULUS` | **AUTO_FINALIZE** jika verifier == approver |
| `PENDING_VERIFIER` | REJECT | verifier ditugaskan | `REJECTED` | nota wajib |
| `PENDING_APPROVER` | APPROVE | approver ditugaskan | `LULUS` | |
| `PENDING_APPROVER` | REJECT | approver ditugaskan | `REJECTED` | nota wajib |
| `REJECTED` / `ON_HOLD` | RESUBMIT | pencipta (PENYEMAK) | `PENDING_VERIFIER` | routing dikira semula |
| `LULUS` | SET_ON_HOLD | ADMIN | `ON_HOLD` | nota wajib |

Verifier/approver diberikan secara **automatik** daripada `category_routing` semasa dokumen
dicipta (dan dikira semula semasa resubmit). Peralihan tidak sah membangkitkan pengecualian.

## 5. Edge Functions (Deno) & bila diguna

Klien memanggil melalui `supabase.functions.invoke('<nama>', { body })` dari `src/features/`.

| Function | Guna |
| --- | --- |
| `documents_create` | Cipta dokumen (panggil RPC `create_document`) + cetus push ke verifier |
| `documents_transition` | Semua peralihan status; body `{ doc_id, action, note }` (action = `APPROVE`/`REJECT`/`RESUBMIT`/`SET_ON_HOLD`) |
| `attachments_upload_init` | Mulakan muat naik selamat ke bucket privat |
| `attachments_register` | Daftar metadata lampiran selepas muat naik |
| `attachments_signed_url` | Jana signed URL (semak peranan) untuk lihat lampiran |
| `push_register` | Daftar langganan push (VAPID) |
| `push_send` | Hantar Web Push; buang langganan mati |

Corak auth Edge Function: sahkan Bearer JWT guna klien **anon** (`auth.getUser`), kemudian
tulis DB privileged guna **service-role key**. (Lihat sejarah BUGFIX-JWT-EDGE dalam [CHANGELOG.md](CHANGELOG.md).)

## 6. Kaedah kerja SELAMAT (patuhi)

- **JANGAN tulis terus ke jadual `documents`** untuk perubahan status. Sentiasa guna RPC
  `transition_document` / `create_document` melalui Edge Function. RLS memang menyekat `UPDATE`
  langsung; pengecualian hanya suntingan kategori ADMIN yang terikat (lihat QA_CHECKLIST §3).
- **Setiap peralihan mesti tinggalkan rekod `document_actions`** (audit tak boleh ubah). RPC sedia
  buat ini — jangan pintas.
- **Jangan longgarkan RLS** tanpa sebab jelas. Kebocoran realtime dulu berpunca daripada
  penapis lajur salah (`assigned_verifier` sepatutnya `verifier_id`/`approver_id`).
- **Migration baharu:** tambah fail baharu bertarikh dalam `supabase/migrations/` — jangan edit
  migration lama. Namakan konsisten (`<timestamp>_<deskripsi>.sql`).
- **Rahsia:** `.env` di-gitignore. Jangan commit kunci. Env vars: `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`, `VITE_VAPID_PUBLIC_KEY`. Service-role key hanya dalam secret Supabase
  Edge Function, tidak pernah di frontend.
- **Auth rapuh dengan sengaja:** login guna popup + `postMessage('popup-login-success')` untuk
  elak 403 iframe/side-panel Chrome. Dashboard guna `getSession` (bukan `getUser`) untuk elak
  kick SIGNED_OUT. Jangan ubah tanpa uji dalam extension side panel.
- **Commit/push hanya bila pemilik minta.** Pastikan `npm run build` lulus dahulu.
- **Deployment Vercel (Hobby) — periksa akaun GitHub push sebelum push.** Deployment pernah berhenti
  (stale) selepas commit `31ca0db`. Punca bukan email author (kekal `sifoo8.ai@gmail.com` sepanjang
  masa) tetapi kemungkinan **akaun GitHub yang push** (pemilik ada beberapa akaun) atau sambungan
  Git-integration Vercel. Pastikan push diautentikasi sebagai akaun GitHub `sifoo8ai`, dan git author
  kekal `sifoo8ai`/`sifoo8.ai@gmail.com`. Butiran: [PROCESS_STATE.md](PROCESS_STATE.md) → "Isu deployment Vercel".

## 7. Selepas membuat perubahan

1. Kemas kini [CHANGELOG.md](CHANGELOG.md) (apa yang berubah).
2. Kemas kini [PROCESS_STATE.md](PROCESS_STATE.md) (status semasa / backlog / keputusan).
3. Jika skema berubah, kemas kini [docs/DATA_MODEL.md](docs/DATA_MODEL.md).
4. Jalankan `npm run build` dan `npm run lint`.

## 8. Dokumen berkaitan

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — seni bina penuh
- [docs/DATA_MODEL.md](docs/DATA_MODEL.md) — skema, enum, RPC, RLS
- [docs/SETUP.md](docs/SETUP.md) — env, dev, deploy, extension
- [CHANGELOG.md](CHANGELOG.md) · [PROCESS_STATE.md](PROCESS_STATE.md) · [QA_CHECKLIST.md](QA_CHECKLIST.md)
- Arkib lama (jangan padam, rujukan sejarah): [CONTEXT.md](CONTEXT.md), [walkthrough.md](walkthrough.md)
