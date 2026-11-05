// LogKerja — ERP Capture (ERP-CAPTURE-01)
//
// Content script untuk https://erp.upm.edu.my/* (semua frame). BACA SAHAJA — tidak klik, menaip
// atau mengubah apa-apa dalam ERP.
//
// 1. Kesan skrin Requisition (medan Ref. Nbr. + Creator, selector sama seperti bookmarklet ErpCopy).
// 2. Auto: bila baris PERTAMA grid APPROVALS mempunyai "Approved By" == nama approver yang
//    dikonfigurasi dan Status "Approved", papar kad "Daftar ke LogKerja".
// 3. Manual: butang kecil "LogKerja" sentiasa ada pada skrin Requisition sebagai sandaran.
// 4. Klik → hantar { refNo, creatorName } ke service worker → side panel LogKerja dibuka dan PWA
//    menyemak duplikasi / daftar / hantar semula. Keputusan dipaparkan semula pada kad.
(() => {
    if (window.__logkerjaErpCapture) return;
    window.__logkerjaErpCapture = true;

    const DEFAULT_APPROVER = 'MOHD NOR RIZAL BIN SULAIMAN';
    const REF_SELECTOR = 'input[id$="edReqNbr_text"]';
    const CREATOR_SELECTOR = 'input[id$="edEmployeeID_text"]';
    const SCAN_INTERVAL_MS = 2000;
    const MUTATION_DEBOUNCE_MS = 600;
    const PROMPTED_KEY = 'logkerja-erp-prompted';

    let approverName = DEFAULT_APPROVER;
    let lastRef = null;
    let host = null;      // elemen hos Shadow DOM
    let ui = null;        // rujukan elemen dalam shadow root
    let cardState = null; // { refNo, creatorName, approved, source, status }

    const normalize = (s) => (s || '').replace(/\s+/g, ' ').trim().toUpperCase();
    const textOf = (el) => (el ? (el.innerText || el.textContent || '') : '').replace(/\s+/g, ' ').trim();

    // ---------- Konfigurasi ----------
    try {
        chrome.storage.sync.get({ approverName: DEFAULT_APPROVER }, (res) => {
            if (res && res.approverName) approverName = res.approverName;
        });
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === 'sync' && changes.approverName) {
                approverName = changes.approverName.newValue || DEFAULT_APPROVER;
            }
        });
    } catch (e) {
        // Konteks extension tidak sah (extension di-reload) — guna nilai lalai
    }

    // ---------- Dedupe per tab (sessionStorage asal ERP) ----------
    const wasPrompted = (ref) => {
        try {
            return JSON.parse(sessionStorage.getItem(PROMPTED_KEY) || '[]').includes(ref);
        } catch (e) { return false; }
    };
    const markPrompted = (ref) => {
        try {
            const list = JSON.parse(sessionStorage.getItem(PROMPTED_KEY) || '[]');
            if (!list.includes(ref)) {
                list.push(ref);
                sessionStorage.setItem(PROMPTED_KEY, JSON.stringify(list.slice(-200)));
            }
        } catch (e) { /* abaikan */ }
    };

    // ---------- Baca data ERP ----------
    function readRequisition() {
        const refEl = document.querySelector(REF_SELECTOR);
        if (!refEl) return null;
        const refNo = (refEl.value || '').trim().substring(0, 15);
        if (!refNo) return null;

        const creatorEl = document.querySelector(CREATOR_SELECTOR);
        const creatorRaw = creatorEl ? (creatorEl.value || '').trim() : '';
        const creatorName = creatorRaw.includes(' - ') ? creatorRaw.split(' - ').slice(1).join(' - ').trim() : creatorRaw;

        return { refNo, creatorName };
    }

    /**
     * Baca baris pertama grid APPROVALS. Grid Acumatica memisahkan jadual tajuk dan jadual data,
     * tetapi indeks lajur sepadan (kaedah sama seperti erp-notifier).
     * Pulangkan { approvedBy, status } atau null.
     */
    function readFirstApprovalRow() {
        const leafRows = Array.from(document.querySelectorAll('tr')).filter((tr) => !tr.querySelector('tr'));
        const cellsOf = (tr) => Array.from(tr.querySelectorAll('td, th')).map(textOf);

        // Skrin Requisition ada beberapa grid (Details, Approvals, ...). Cuba setiap baris tajuk
        // yang ada "Approved By" + "Status" sehingga satu menghasilkan baris approval yang sah.
        const isApprovedByHeader = (c) => /^approved by$/i.test(c);
        const isStatusHeader = (c) => /^status$/i.test(c);

        for (const headerRow of leafRows) {
            const header = cellsOf(headerRow);
            if (!header.some(isApprovedByHeader) || !header.some(isStatusHeader)) continue;

            const idxApprovedBy = header.findIndex(isApprovedByHeader);
            const idxStatus = header.findIndex(isStatusHeader);

            // Hadkan carian kepada bekas grid yang sama jika boleh dikenal pasti
            const scope = headerRow.closest('[id*="grid" i]') || document.body;
            const rows = Array.from(scope.querySelectorAll('tr')).filter((tr) => !tr.querySelector('tr') && tr !== headerRow);

            for (const tr of rows) {
                const cells = cellsOf(tr);
                if (Math.abs(cells.length - header.length) > 1) continue;
                const status = cells[idxStatus] || '';
                if (!/^(approved|pending|rejected|cancel)/i.test(status)) continue;
                return { approvedBy: cells[idxApprovedBy] || '', status };
            }
        }
        return null;
    }

    function isApprovedByMe(row) {
        return !!row && /approved/i.test(row.status) && normalize(row.approvedBy) === normalize(approverName);
    }

    // ---------- UI (Shadow DOM) ----------
    const STYLE = `
        :host { all: initial; }
        .wrap { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .pill {
            position: fixed; right: 18px; bottom: 18px; z-index: 2147483646;
            display: flex; align-items: center; gap: 6px;
            padding: 8px 14px; border-radius: 999px; border: none; cursor: pointer;
            background: #2563eb; color: #fff; font-size: 13px; font-weight: 600;
            box-shadow: 0 6px 16px rgba(37, 99, 235, .35);
        }
        .pill:hover { background: #1d4ed8; }
        .card {
            position: fixed; right: 18px; bottom: 64px; z-index: 2147483647; width: 320px;
            background: #fff; border-radius: 14px; border: 1px solid #e2e8f0;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,.18), 0 10px 10px -5px rgba(0,0,0,.08);
            overflow: hidden; color: #0f172a;
        }
        .head { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
        .title { font-size: 14px; font-weight: 700; color: #1e3a8a; }
        .close { background: none; border: none; cursor: pointer; font-size: 18px; color: #94a3b8; line-height: 1; }
        .body { padding: 12px 14px; font-size: 13px; }
        .row { margin-bottom: 8px; }
        .label { font-size: 10px; font-weight: 700; letter-spacing: .5px; color: #64748b; text-transform: uppercase; }
        .value { font-size: 14px; font-weight: 600; word-break: break-all; }
        .note { margin-top: 6px; font-size: 12px; color: #b45309; }
        .status { margin-top: 8px; padding: 8px 10px; border-radius: 8px; font-size: 12px; line-height: 1.4; }
        .status.info { background: #eff6ff; color: #1e40af; }
        .status.ok { background: #ecfdf5; color: #047857; }
        .status.warn { background: #fffbeb; color: #b45309; }
        .status.err { background: #fef2f2; color: #b91c1c; }
        .foot { display: flex; gap: 8px; padding: 0 14px 14px; }
        .btn { flex: 1; padding: 9px 10px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid #cbd5e1; background: #fff; color: #334155; }
        .btn.primary { background: #2563eb; border-color: #2563eb; color: #fff; }
        .btn.primary:disabled { opacity: .5; cursor: default; }
    `;

    function ensureUi() {
        if (host && document.documentElement.contains(host)) return;
        host = document.createElement('div');
        host.id = 'logkerja-erp-capture';
        const root = host.attachShadow({ mode: 'closed' });
        root.innerHTML = `
            <style>${STYLE}</style>
            <div class="wrap">
                <div class="card" hidden>
                    <div class="head">
                        <span class="title">LogKerja</span>
                        <button class="close" title="Tutup">&times;</button>
                    </div>
                    <div class="body">
                        <div class="row"><div class="label">Ref. Nbr.</div><div class="value" data-ref></div></div>
                        <div class="row"><div class="label">Creator</div><div class="value" data-creator></div></div>
                        <div class="note" data-note hidden></div>
                        <div class="status" data-status hidden></div>
                    </div>
                    <div class="foot">
                        <button class="btn" data-dismiss>Tutup</button>
                        <button class="btn primary" data-send>Semak &amp; Daftar</button>
                    </div>
                </div>
                <button class="pill" title="Hantar ke LogKerja">&#10022; LogKerja</button>
            </div>
        `;
        ui = {
            card: root.querySelector('.card'),
            pill: root.querySelector('.pill'),
            ref: root.querySelector('[data-ref]'),
            creator: root.querySelector('[data-creator]'),
            note: root.querySelector('[data-note]'),
            status: root.querySelector('[data-status]'),
            send: root.querySelector('[data-send]'),
        };
        root.querySelector('.close').addEventListener('click', hideCard);
        root.querySelector('[data-dismiss]').addEventListener('click', hideCard);
        ui.pill.addEventListener('click', () => {
            const req = readRequisition();
            if (!req) return;
            const approved = isApprovedByMe(readFirstApprovalRow());
            showCard({ ...req, approved, source: 'manual' });
        });
        ui.send.addEventListener('click', sendToLogKerja);
        (document.body || document.documentElement).appendChild(host);
    }

    function removeUi() {
        if (host) host.remove();
        host = null;
        ui = null;
        cardState = null;
    }

    function showCard(state) {
        ensureUi();
        cardState = { ...state, status: null };
        ui.ref.textContent = state.refNo;
        ui.creator.textContent = state.creatorName || '-';
        if (!state.approved) {
            ui.note.textContent = 'Nota: kelulusan anda belum dikesan dalam tab APPROVALS.';
            ui.note.hidden = false;
        } else {
            ui.note.hidden = true;
        }
        setStatus(null);
        ui.send.disabled = false;
        ui.send.textContent = 'Semak & Daftar';
        ui.card.hidden = false;
    }

    function hideCard() {
        if (ui) ui.card.hidden = true;
        cardState = null;
    }

    function setStatus(kind, text) {
        if (!ui) return;
        if (!kind) {
            ui.status.hidden = true;
            ui.status.textContent = '';
            return;
        }
        ui.status.className = `status ${kind}`;
        ui.status.textContent = text;
        ui.status.hidden = false;
    }

    function sendToLogKerja() {
        if (!cardState) return;
        ui.send.disabled = true;
        setStatus('info', 'Membuka LogKerja di side panel...');
        try {
            chrome.runtime.sendMessage(
                { type: 'ERP_CAPTURE', refNo: cardState.refNo, creatorName: cardState.creatorName },
                (res) => {
                    if (chrome.runtime.lastError || !res || !res.ok) {
                        ui.send.disabled = false;
                        setStatus('warn', (res && res.message) || 'Tidak dapat membuka side panel. Klik ikon LogKerja pada toolbar, kemudian cuba lagi.');
                        return;
                    }
                    setStatus('info', 'Menunggu semakan di LogKerja (side panel)...');
                }
            );
        } catch (e) {
            ui.send.disabled = false;
            setStatus('err', 'Extension LogKerja telah dikemas kini. Muat semula halaman ERP ini.');
        }
    }

    // ---------- Keputusan dari LogKerja ----------
    try {
        chrome.runtime.onMessage.addListener((msg) => {
            if (!msg || msg.type !== 'ERP_RESULT' || !ui || !cardState) return;
            if (msg.refNo && cardState.refNo && msg.refNo.toUpperCase() !== cardState.refNo.toUpperCase()) return;

            const map = {
                SUBMITTED: ['ok', '✓ Didaftarkan dalam LogKerja.'],
                RESUBMITTED: ['ok', '✓ Dihantar semula untuk semakan baharu.'],
                BLOCKED: ['warn', msg.message || 'Nombor ini sudah wujud dan tidak boleh dikemas kini sekarang.'],
                WRONG_ROLE: ['warn', msg.message || 'Buka LogKerja sebagai PENYEMAK.'],
                CANCELLED: ['info', 'Dibatalkan di LogKerja.'],
                ERROR: ['err', msg.message || 'Ralat di LogKerja.'],
            };
            const [kind, text] = map[msg.status] || ['info', msg.status];
            setStatus(kind, text);

            const terminalOk = msg.status === 'SUBMITTED' || msg.status === 'RESUBMITTED' || msg.status === 'BLOCKED';
            ui.send.disabled = terminalOk;
            ui.send.textContent = terminalOk ? 'Selesai' : 'Cuba Lagi';
        });
    } catch (e) { /* konteks extension tidak sah */ }

    // ---------- Imbasan ----------
    function scan() {
        const req = readRequisition();
        if (!req) {
            if (host) removeUi();
            lastRef = null;
            return;
        }

        ensureUi();

        if (req.refNo !== lastRef) {
            lastRef = req.refNo;
            // Rekod lain dibuka — tutup kad lama yang belum dihantar
            if (cardState && cardState.refNo !== req.refNo) hideCard();
        }

        if (cardState) return; // kad sedang dipaparkan
        if (wasPrompted(req.refNo)) return;

        if (isApprovedByMe(readFirstApprovalRow())) {
            markPrompted(req.refNo);
            showCard({ ...req, approved: true, source: 'auto' });
        }
    }

    let debounceTimer = null;
    const scheduleScan = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(scan, MUTATION_DEBOUNCE_MS);
    };

    const start = () => {
        scan();
        new MutationObserver((mutations) => {
            // Abaikan perubahan dalam UI kita sendiri
            if (host && mutations.every((m) => host.contains(m.target))) return;
            scheduleScan();
        }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
        // Nilai <input> berubah tanpa mutasi DOM — imbasan berkala sebagai sandaran
        setInterval(scan, SCAN_INTERVAL_MS);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
