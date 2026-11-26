import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { supabase } from './lib/supabaseClient';
import { registerSW } from 'virtual:pwa-register';

// Side panel extension jarang di-refresh — semak versi baharu setiap 30 minit & bila tab kembali aktif.
const SW_UPDATE_INTERVAL_MS = 30 * 60 * 1000;
registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
        if (!registration) return;
        const checkForUpdate = () => {
            if (navigator.onLine) registration.update().catch(() => { /* abaikan */ });
        };
        setInterval(checkForUpdate, SW_UPDATE_INTERVAL_MS);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') checkForUpdate();
        });
    },
});

async function handleOAuthRedirect() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        url.searchParams.delete('code');
        url.searchParams.delete('next');
        window.history.replaceState({}, document.title, url.toString());
    }
}

handleOAuthRedirect().then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
});
