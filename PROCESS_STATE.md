# PROCESS_STATE.md — Keadaan Semasa Projek

Fail "hidup" yang menjejak **status semasa**, **kerja tertunggak**, dan **keputusan** LogKerja.
Setiap sesi kerja patut mengemas kini fail ini. Untuk sejarah lengkap, lihat [CHANGELOG.md](CHANGELOG.md).

_Kemas kini terakhir: 2026-11-05 — ERP-CAPTURE-01 (kod siap, menunggu deploy)._

---

## Status semasa

- Sistem **aktif dalam pengeluaran** (deploy Vercel, Supabase project `csimvhrkwpoeyncqxvus`).
- Semua fasa teras (T2–T7.0), pipeline Push Notification, T7.1 (mobile shell) dan T7.3 (badge
  extension) **selesai**. Semua UAT push notification lulus.
- **ERP-CAPTURE-01** (Nov 2026): kod siap dan `npm run build` lulus. Logik content script diuji pada
  halaman ERP tiruan. **Belum deploy** — lihat langkah di bawah.

## Kerja tertunggak

### ERP-CAPTURE-01 — langkah deploy (ikut urutan, elak pecah production)
- [ ] 1. Jalankan migration `supabase/migrations/20261105120000_check_reference_exists.sql`
  (SQL Editor Supabase atau `supabase db push`). Ia tambahan sahaja.
- [ ] 2. Deploy `documents_create` (`supabase functions deploy documents_create --no-verify-jwt`).
  Bentuk `{ error }` dikekalkan, jadi klien lama tetap berfungsi.
- [ ] 3. Push PWA → Vercel. Modal manual masih berfungsi walaupun langkah 1 belum siap (semakan
  awal gagal dengan selamat dan pelayan masih menolak duplikasi).
- [ ] 4. Reload extension (unpacked, v1.1.0) selepas PWA live. Iframe side panel guna URL production.
- [ ] 5. UAT pada ERP sebenar: buka Requisition yang SUDAH di-approve → kad auto → "Sudah wujud".
  Kemudian uji approval sebenar seterusnya.

### Perlu disahkan pada ERP sebenar
- Selector `edReqNbr_text` / `edEmployeeID_text` diambil dari bookmarklet (terbukti berfungsi).
- Pengesanan grid APPROVALS (header "Approved By" + "Status") belum diuji pada DOM ERP sebenar.
  Jika kad auto tak muncul, butang manual "LogKerja" masih berfungsi; laporkan supaya selector diselaraskan.

## ✅ Isu deployment Vercel (SELESAI 2026-08-01)

**Status:** SELESAI. Push commit `a3d5f0c` (2026-08-01) berjaya deploy di Vercel oleh akaun
`sifoo8ai` — mengesahkan fix disconnect+reconnect Git-integration berkesan. Deployment kini pulih
selepas ~138 hari "Stale". Bahagian di bawah dikekalkan sebagai rujukan/pencegahan.

---

Vercel guna **Hobby plan** — hanya pemilik dibenarkan mencetus deployment. Selepas commit `31ca0db`
(Mar 16, deployment terakhir yang berjaya sebelum ini), semua commit berikutnya **tidak deploy**
(status "Stale") sehingga dipulihkan pada 2026-08-01.

**Diagnosis (disemak 2026-08-01 dari git history):** email author commit ialah `sifoo8.ai@gmail.com`
pada **kesemua** commit — termasuk yang berjaya deploy dan yang tidak. Jadi puncanya **bukan** email
author commit. Yang berubah hanyalah *nama* author (`Zero Cost Production` → `sifoo8ai`), yang Vercel
tidak padankan. Punca sebenar lebih berkemungkinan **akaun GitHub yang melakukan push** (authentication
sesi git) atau sambungan Git-integration Vercel yang putus — sepadan dengan teori pemilik (ada beberapa
akaun GitHub, tak switch sesi yang betul).

Tindakan yang telah diambil (2026-08-01): git di Vercel telah **disconnect & reconnect** sebelum
repo dipindah ke komputer baru. Belum disahkan sama ada ini selesaikan masalah.

**Mekanisme yang disahkan (2026-08-01):** komputer ini ada 2 akaun GitHub — `sifoo8ai` dan
`ibtisamimaai` (kedua-dua sah diguna, JANGAN padam mana-mana). Remote repo ini ialah
`https://sifoo8ai@github.com/sifoo8ai/logkerja.git` (nama pengguna `sifoo8ai` **tertanam** dalam URL),
dan `credential.helper=manager` (GCM). Kerana username tertanam, GCM akan pilih kredential `sifoo8ai`
semasa push. **Selagi remote URL kekal dengan `sifoo8ai@`, push akan guna akaun yang betul.**

**Sebelum setiap push, pastikan:**
- Remote URL masih `https://sifoo8ai@github.com/...` (`git remote get-url origin`). Ini yang memaksa
  GCM guna akaun `sifoo8ai`, bukan `ibtisamimaai`.
- Jika push ditolak (permission denied), ia mungkin cuba guna akaun salah — semak kredential
  `sifoo8ai` dalam Windows Credential Manager (jangan padam entri `ibtisamimaai`).
- Git author kekal `sifoo8ai` / `sifoo8.ai@gmail.com` (sudah betul dalam repo ini pada 2026-08-01) —
  untuk konsistensi, walaupun ia bukan punca utama block.
- Selepas push pertama, sahkan deployment berjalan di papan pemuka Vercel. Jika masih stale/block,
  semak sambungan Git-integration di tetapan projek Vercel dan akaun GitHub yang push.

## Backlog cadangan (diperhatikan semasa audit dokumentasi — belum diluluskan)

Keutamaan belum ditetapkan. Bincang dengan pemilik sebelum mula.

- [ ] **Tiada test automatik.** Tiada unit/integration/e2e test. Pertimbang Vitest + React Testing
  Library untuk lapisan `features/*Api.ts` dan logik state-machine.
- [ ] **Root berselerak.** `patch.diff` (25KB), `funcs.json` (23KB), `dev-dist/` (output PWA dev),
  slide persembahan dalam `public/`. Pertimbang alih ke `archive/` atau `docs/` (pemilik pilih
  *tak kemas root* buat masa ini — catat sahaja).
- [ ] **Ketakselarasan `config.toml`.** `supabase/config.toml` merujuk fungsi `push_test` yang tiada
  dalam `supabase/functions/`. Sahkan sama ada perlu dibuang atau fungsi hilang.
- [ ] **`CONTEXT.md` lama** kini digantikan oleh CHANGELOG.md + fail ini. Kekal sebagai arkib.
- [ ] **Tiada CI.** Hanya ada GitHub Action keep-alive Supabase; tiada build/lint automatik pada PR.
- [ ] **`npm run lint` tidak berfungsi** — tiada fail konfigurasi ESLint dalam repo (ditemui 2026-11-05).
- [ ] **Semakan origin `postMessage`**: `Login.tsx` (`popup-login-success`) tidak menyemak
  `event.origin`. `AppRouter.tsx` hantar sesi dengan target `'*'`. Ia sensitif kepada auth, jadi
  tidak disentuh dalam ERP-CAPTURE-01; perlu uji dalam extension bila dibaiki.
- [ ] `documents_transition` dan Edge Function lain masih pulangkan objek `debug` dalam respons 401
  (hanya `documents_create` dibersihkan).

## Idea feature baru (ruang untuk diisi)

Pemilik menyatakan kemungkinan menambah feature baru; roadmap belum pasti. Catat idea di sini:

- _(kosong — isi semasa perbincangan roadmap)_

## Decision Log

Catat keputusan seni bina/proses penting di sini (tarikh — keputusan — sebab).

- **2026-08-01** — Wujudkan set dokumentasi (`AGENTS.md`, `CLAUDE.md`, `docs/`, `CHANGELOG.md`,
  fail ini) tanpa mengubah kod. Sebab: repo tiada knowledge base untuk sambung development dengan
  selamat pada sistem yang guna aktif.
- **2026-08-01** — Gugurkan T7.2 (polish modal) dari kerja tertunggak. Feature baharu di-brainstorm kemudian.
- **2026-08-01** — Rakam kekangan deployment Vercel Hobby; git di Vercel telah disconnect+reconnect.
- **2026-11-05** — ERP-CAPTURE-01 dibina dalam extension LogKerja sedia ada (bukan extension
  berasingan), supaya sesi login PWA dalam side panel diguna semula. Nama Creator ERP disimpan dalam
  Keterangan Tambahan (tiada perubahan skema). Semakan duplikasi guna RPC SECURITY DEFINER sebab RLS
  sembunyikan dokumen pengguna lain. Bila nombor dah wujud, UI ikut state machine: hanya pencipta
  boleh Hantar Semula dari REJECTED/ON_HOLD; status lain perlu Admin (ON HOLD) atau Pengesah/Pelulus
  (tolak) dahulu.
- **2026-08-01** — Isu deployment Vercel **SELESAI**: push `a3d5f0c` berjaya deploy oleh akaun
  `sifoo8ai`. Punca sebenar = akaun GitHub push / sambungan Git-integration (bukan email author).
- **(sejarah)** — Auth guna popup + `postMessage` dan `getSession` (bukan `getUser`) sengaja, untuk
  atasi 403 iframe/partition side panel Chrome. Jangan ubah tanpa uji dalam extension.
- **(sejarah)** — Semua tulisan status dokumen melalui RPC SECURITY DEFINER (`transition_document`),
  bukan tulisan langsung ke jadual. Sebab: kuatkuasa state-machine + audit di satu tempat.

## Peraturan asas (rujuk AGENTS.md §6 untuk penuh)

- Elak breaking change — sistem guna aktif.
- Jangan tulis terus ke `documents`; guna Edge Function/RPC.
- Migration baharu = fail baharu bertarikh; jangan edit yang lama.
- `npm run build` mesti lulus sebelum commit. Commit/push hanya bila pemilik minta.
