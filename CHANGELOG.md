# Changelog

Semua perubahan penting pada LogKerja direkod di sini. Format berdasarkan
[Keep a Changelog](https://keepachangelog.com/). Projek belum menggunakan tag versi semantik;
rekod disusun mengikut **fasa pembinaan (T-milestone)** dan **siri pembetulan** secara kronologi,
dirumus daripada mesej git commit dan `CONTEXT.md`.

> Nota: `CONTEXT.md` (fail lama) kekal sebagai arkib. Mulai kini, catat perubahan di sini.

## [Belum dikeluarkan]

### BRAND-01 — Logo & ikon rasmi LogKerja (Nov 2026)
- Logo rasmi (`public/icon.svg`) menggantikan ikon placeholder untuk favicon, PWA dan push notification.
- Ikon PNG dijana dari logo: `public/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`
  (Android, logo dalam zon selamat) dan `apple-touch-icon.png` (iOS, 180px). Ikon extension
  16/32/48/128 turut diganti.
- Manifest PWA kini senaraikan ikon PNG + SVG. Notifikasi push guna PNG (SVG tidak disokong
  kebanyakan platform).
- Komponen `BrandLogo` dipaparkan di sebelah kiri tajuk "LogKerja" pada Topbar dan Sidebar desktop,
  header side panel, dan halaman Login (menggantikan ikon perisai).

### UX-DETAILS-01 — Reka semula modal butiran dokumen Penyemak (Nov 2026)
- `DocumentDetailsSlideOver` (desktop + side panel Penyemak) direka semula dengan:
  - header: nombor rujukan + butang **Copy**, ✕, dan butang **Tutup** di footer
  - **banner status** berlabel Bahasa Melayu, warna ikut skema status sistem
  - 2 tab: **Butiran Dokumen** dan **Jejak Audit**, dengan chip bilangan aktiviti
  - Pegawai tindakan dengan avatar inisial, Tarikh daftar / Dikemas kini, kotak "Tiada lampiran"
  - "Aktiviti terkini" + pautan "Lihat semua X aktiviti" yang membuka tab Jejak Audit
  - timeline dengan ikon lucide, label tindakan Bahasa Melayu, dan nama/unit pelaku dua baris
- Format tarikh `05 Nov 2026` (`documentDetailsFormat.ts`).
- Label hanya untuk paparan modal ini; tiada perubahan database, enum, atau modal role lain.

### ERP-CAPTURE-01 — Tangkapan Requisition ERP UPM → LogKerja (Nov 2026)

#### Ditambah
- **Extension v1.1.0**: content script `extension/erp-capture.js` untuk `erp.upm.edu.my`. Ia kesan
  approval pengguna (baris pertama "Approved By" + Status Approved di tab APPROVALS) dan papar kad
  "Daftar ke LogKerja" dengan Ref. Nbr. + Creator. Butang manual "LogKerja" sentiasa ada sebagai
  sandaran. Script ini baca sahaja dan tidak klik atau ubah apa-apa dalam ERP.
- Relay `service_worker.js` ↔ `sidepanel.js` ↔ PWA (`LOGKERJA_READY` / `LOGKERJA_ERP_CAPTURE` /
  `LOGKERJA_ERP_RESULT`). Side panel dibuka automatik bila butang diklik.
- Halaman tetapan extension (`options.html`) untuk tukar nama approver.
- PWA `ErpCaptureHost`: terima tangkapan (iframe + `chrome-extension://` origin sahaja) dan buka
  modal pra-isi (Keterangan = nama Creator).
- RPC baharu `check_reference_exists` (SECURITY DEFINER, maklumat minimum) — migration
  `20261105120000_check_reference_exists.sql`.
- Mod compact/side panel untuk **PENYEMAK**: `/app/penyemak/{home,dokumen,profile}` + BottomNav.

#### Diubah
- Modal Daftar Dokumen: semak nombor rujukan semasa menaip, papar keputusan ikut state machine
  (daftar baharu / **Hantar Semula** dokumen sendiri yang REJECTED/ON_HOLD / info disekat), ralat jelas.
  Jika lampiran gagal selepas dokumen dicipta, modal tak lagi biarkan pengguna klik hantar semula.
- `documents_create`: duplikasi → **409** `{ code: 'DUPLICATE_REF' }`; buang data debug daripada respons 401.

#### Dibaiki
- Ralat generik "Edge Function returned a non-2xx status code" — klien kini baca mesej sebenar
  daripada respons (`src/lib/edgeError.ts`) dalam `penyemakApi` dan `attachmentsApi`.

### Dokumentasi (Ogos 2026)
- Set dokumentasi & memori projek: `README.md`, `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md`,
  `PROCESS_STATE.md`, dan `docs/` (ARCHITECTURE, DATA_MODEL, SETUP). Tiada perubahan kod aplikasi.

---

## Deployment & persembahan — Jul 2026
- Fail persembahan (presentation) ditambah dan aset dipindah ke `public/` root untuk deploy Vercel.
- Ujian deployment melalui git tempatan.

## Penyelenggaraan — Jun 2026
- **ADMIN-DELETE-01**: selesaikan kebenaran padam dokumen untuk admin (migration
  `fix_admin_delete_documents`, grant `DELETE` + polisi `documents_delete_admin_only`); selaraskan
  migration dengan DB jauh (remote). Lihat [walkthrough.md](walkthrough.md).

## Pengukuhan auth & infra — Mac 2026
- **fix(auth)**: selesaikan popup login Google 403 & partition iframe dalam side panel extension.
- **fix(auth)**: fallback untuk `localStorage` berpartition extension bila `setSession` gagal 403.
- **fix(auth)**: ganti `getUser` → `getSession` dalam dashboard untuk elak 403 & kick `SIGNED_OUT` dari Vercel.
- **chore**: skrip GitHub Action (`supabase-ping.yml`) ping harian untuk kekalkan Supabase free-tier aktif.
- **prep**: `vercel.json` untuk SPA routing.

## T7.3 — Badge extension realtime (Mac 2026)
- Kaunter badge extension daripada pending realtime; kemas ikon extension.
- Kemas kini badge realtime global melalui `MobileShell`.
- Kemas semula reka bentuk UI `Login.tsx`.

## T7.1 — Shell mobile/sidepanel (Feb 2026)
- Bottom nav mobile/sidepanel + KPI "pending" realtime di Home untuk pengesah/pelulus.
- **hotfix**: dayakan Supabase Realtime untuk `documents` & reka semula kad KPI Home.

## Pipeline Push Notification — Feb 2026 (semua UAT lulus 🎉)
- **PUSH-03**: betulkan upsert jsonb `push_register` + logik pendaftaran SW (elak hang tak terhingga) + semak VAPID.
- **PUSH-04**: langgan & daftar push selepas kebenaran diberi.
- **PUSH-KEY-01**: betulkan `applicationServerKey` VAPID tidak sah.
- **PUSH-DELIVERY-02**: cetus `push_send` semasa `documents_create` + hurai langganan jsonb.
- **JWT-EDGE-02**: betulkan "Invalid JWT" — guna klien anon untuk auth, service key untuk tulis DB.
- **JWT-EDGE-03/04**: debug env vars; betulkan JWT dalam `push_register`; `push_send` pulang array ralat terperinci.
- Dokumen `.env.example` untuk VAPID key.

## Siri pembetulan UI/UX & data (Feb 2026)
- **TRANSITION-01**: betulkan pemetaan payload/action `documents_transition`.
- **STATUSMODAL-01**: betulkan ikatan badge status pada detail pengesah.
- **PROFILE-01**: reka semula halaman profil (kad korporat + ikon).
- **DISPLAY-02/03**: papar nama penyemak via `creator_id`; terjemah label butang ke Bahasa Melayu.
- **UX-ENHANCE-01**: papar nama pelaku (actor) pending dalam detail dokumen penyemak.
- **DB-ENHANCE-EMAIL-01**: tambah `profiles.email`, isi semasa login; grant update pada email.
- **PENGESAH-01/02/03**: betulkan query 400 & sejarah pengesah agar padan skema v2.
- **CORS-01**: kendali CORS preflight dalam Edge Functions.
- **AUTH-01**: betulkan pertukaran sesi OAuth & redirect.
- **ADMIN-01..05**: grant & RLS untuk `category_routing`, `user_roles`, `document_categories`;
  betulkan simpan/papar routing kategori admin.

## Fasa pembinaan teras (Feb 2026)
- **T2.1**: skema DB v2 (enum, jadual, fungsi RPC).
- **T2.2**: polisi RLS & pengukuhan keistimewaan.
- **T3.0**: shell auth frontend dengan routing ikut peranan.
- **T3.1**: daftar & hantar push notification.
- **T3.2**: lampiran privat via signed URL Edge Functions.
- **T4.0**: dashboard penyemak (KPI, penghantaran, slide-over).
- **T4.1**: dashboard pengesah (bulk approve/reject + realtime).
- **T4.2**: dashboard pelulus (bulk approve/reject).
- **T5.0**: dashboard admin (kawalan governance).
- **T6.0**: pembetulan audit integriti (lihat [QA_CHECKLIST.md](QA_CHECKLIST.md)).
- **T6.1**: manifest PWA & service worker.
- **T6.2**: extension Chrome side panel.
- **T7.0**: pengukuhan produksi (optimistic lock, indeks, rate limit).
