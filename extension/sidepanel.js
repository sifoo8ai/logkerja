document.getElementById('refreshBtn').addEventListener('click', () => {
    const frame = document.getElementById('appFrame');
    // PWA akan menghantar LOGKERJA_READY semula selepas dimuat
    appReady = false;
    // Force reload iframe content
    const currentSrc = frame.src;
    frame.src = '';
    setTimeout(() => {
        frame.src = currentSrc;
    }, 50);
});

// ---------------------------------------------------------------------------
// ERP-CAPTURE-01: relay tangkapan ERP ke PWA dalam iframe, dan keputusan balik ke service worker
// ---------------------------------------------------------------------------
const appFrame = document.getElementById('appFrame');
let appReady = false;
let swPort = null;

function appOrigin() {
    try { return new URL(appFrame.src).origin; } catch (e) { return null; }
}

function sendCaptureToApp(capture) {
    const origin = appOrigin();
    if (!appReady || !origin || !appFrame.contentWindow) return;
    appFrame.contentWindow.postMessage({
        type: 'LOGKERJA_ERP_CAPTURE',
        refNo: capture.refNo,
        creatorName: capture.creatorName,
    }, origin);
}

function connectServiceWorker() {
    swPort = chrome.runtime.connect({ name: 'logkerja-sidepanel' });
    swPort.onMessage.addListener((msg) => {
        if (msg && msg.type === 'CAPTURE' && msg.capture) {
            sendCaptureToApp(msg.capture);
        }
    });
    swPort.onDisconnect.addListener(() => {
        swPort = null;
        // Service worker dimulakan semula — sambung semula
        setTimeout(connectServiceWorker, 500);
    });
    if (appReady) swPort.postMessage({ type: 'GET_PENDING' });
}

connectServiceWorker();

// Mesej dari PWA (badge + ERP capture)
window.addEventListener('message', (event) => {
    // Only accept messages from localhost or allowed domains
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:4173',
        'https://logkerja.vercel.app'
    ];
    if (!allowedOrigins.includes(event.origin)) return;
    if (event.source !== appFrame.contentWindow) return;

    if (event.data && event.data.type === 'LOGKERJA_READY') {
        appReady = true;
        if (swPort) swPort.postMessage({ type: 'GET_PENDING' });
        return;
    }

    if (event.data && event.data.type === 'LOGKERJA_ERP_RESULT') {
        if (swPort) {
            swPort.postMessage({
                type: 'RESULT',
                result: {
                    refNo: event.data.refNo,
                    status: event.data.status,
                    docStatus: event.data.docStatus || null,
                    message: event.data.message || null,
                },
            });
        }
        return;
    }

    if (event.data && event.data.type === 'LOGKERJA_PENDING') {
        const count = event.data.count;
        if (chrome && chrome.action && chrome.action.setBadgeText) {
            if (count > 0) {
                chrome.action.setBadgeText({ text: String(count) });
                chrome.action.setBadgeBackgroundColor({ color: '#2563eb' });
            } else {
                chrome.action.setBadgeText({ text: '' });
            }
        }

        // Store the count so it can be restored if the panel reloads
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ pendingCount: count });
        }
    }
});

// Restore previous badge count if available
if (chrome && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['pendingCount'], (result) => {
        const count = result.pendingCount;
        if (count !== undefined && count > 0 && chrome.action && chrome.action.setBadgeText) {
            chrome.action.setBadgeText({ text: String(count) });
            chrome.action.setBadgeBackgroundColor({ color: '#2563eb' });
        }
    });
}
