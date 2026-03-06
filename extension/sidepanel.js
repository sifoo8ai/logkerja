document.getElementById('refreshBtn').addEventListener('click', () => {
    const frame = document.getElementById('appFrame');
    // Force reload iframe content
    const currentSrc = frame.src;
    frame.src = '';
    setTimeout(() => {
        frame.src = currentSrc;
    }, 50);
});

// Update badge count from app
window.addEventListener('message', (event) => {
    // Only accept messages from localhost or allowed domains
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];
    if (!allowedOrigins.includes(event.origin)) return;

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
