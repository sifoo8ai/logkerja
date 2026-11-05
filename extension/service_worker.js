// Allows the side panel to open when clicking the extension action toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// ---------------------------------------------------------------------------
// ERP-CAPTURE-01: relay antara content script ERP (erp-capture.js) dan side panel (sidepanel.js)
//
//   ERP tab ──ERP_CAPTURE──▶ SW ──(port) CAPTURE──▶ side panel ──postMessage──▶ PWA
//   ERP tab ◀──ERP_RESULT── SW ◀──(port) RESULT─── side panel ◀──postMessage── PWA
//
// Tangkapan tertangguh disimpan dalam chrome.storage.session supaya ia tidak hilang bila side
// panel baru dibuka (PWA belum sedia) atau service worker dimulakan semula.
// ---------------------------------------------------------------------------

const ERP_ORIGIN = 'https://erp.upm.edu.my/';
const PENDING_KEY = 'erpPendingCapture';
const PENDING_TTL_MS = 10 * 60 * 1000;
const TERMINAL_STATUSES = ['SUBMITTED', 'RESUBMITTED', 'BLOCKED', 'CANCELLED', 'WRONG_ROLE', 'ERROR'];

const sidePanelPorts = new Set();

async function getPending() {
    const res = await chrome.storage.session.get(PENDING_KEY);
    const pending = res[PENDING_KEY];
    if (!pending) return null;
    if (Date.now() - pending.ts > PENDING_TTL_MS) {
        await chrome.storage.session.remove(PENDING_KEY);
        return null;
    }
    return pending;
}

function toCapturePayload(pending) {
    return { type: 'CAPTURE', capture: { refNo: pending.refNo, creatorName: pending.creatorName } };
}

function broadcastToPanels(message) {
    for (const port of sidePanelPorts) {
        try { port.postMessage(message); } catch (e) { /* port sudah ditutup */ }
    }
}

// Side panel bersambung melalui port supaya SW tahu panel sedang terbuka
chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== 'logkerja-sidepanel') return;
    if (port.sender && port.sender.id !== chrome.runtime.id) return;

    sidePanelPorts.add(port);
    port.onDisconnect.addListener(() => sidePanelPorts.delete(port));

    port.onMessage.addListener(async (msg) => {
        if (!msg) return;

        // PWA dalam iframe sudah sedia — hantar tangkapan tertangguh jika ada
        if (msg.type === 'GET_PENDING') {
            const pending = await getPending();
            if (pending) port.postMessage(toCapturePayload(pending));
            return;
        }

        // Keputusan dari PWA — hantar balik ke frame ERP asal
        if (msg.type === 'RESULT' && msg.result) {
            const pending = await getPending();
            if (!pending) return;
            if (msg.result.refNo && msg.result.refNo.toUpperCase() !== pending.refNo.toUpperCase()) return;

            try {
                await chrome.tabs.sendMessage(
                    pending.tabId,
                    { type: 'ERP_RESULT', ...msg.result },
                    { frameId: pending.frameId }
                );
            } catch (e) {
                // Tab ERP telah ditutup / dinavigasi — abaikan
            }

            if (TERMINAL_STATUSES.includes(msg.result.status)) {
                await chrome.storage.session.remove(PENDING_KEY);
            }
        }
    });
});

// Tangkapan dari content script ERP
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!msg || msg.type !== 'ERP_CAPTURE') return;

    const fromErp = sender.id === chrome.runtime.id && sender.tab && typeof sender.url === 'string' && sender.url.startsWith(ERP_ORIGIN);
    if (!fromErp) {
        sendResponse({ ok: false, message: 'Sumber tidak dibenarkan.' });
        return;
    }

    const refNo = typeof msg.refNo === 'string' ? msg.refNo.trim() : '';
    const creatorName = typeof msg.creatorName === 'string' ? msg.creatorName.trim() : '';
    if (!refNo) {
        sendResponse({ ok: false, message: 'Ref. Nbr. tidak ditemui.' });
        return;
    }

    // sidePanel.open() mesti dipanggil serta-merta (masih dalam gesture klik pengguna)
    const openPromise = chrome.sidePanel.open({ windowId: sender.tab.windowId });

    const pending = {
        refNo,
        creatorName,
        tabId: sender.tab.id,
        frameId: sender.frameId || 0,
        ts: Date.now(),
    };

    (async () => {
        let opened = true;
        try {
            await openPromise;
        } catch (e) {
            opened = false;
            console.warn('[LogKerja] sidePanel.open gagal:', e);
        }

        await chrome.storage.session.set({ [PENDING_KEY]: pending });

        // Jika panel sudah terbuka dan PWA sedia, terus hantar
        broadcastToPanels(toCapturePayload(pending));

        sendResponse(opened || sidePanelPorts.size > 0
            ? { ok: true }
            : { ok: false, message: 'Tidak dapat membuka side panel. Klik ikon LogKerja pada toolbar — tangkapan akan dihantar bila panel dibuka.' });
    })();

    return true; // sendResponse async
});
