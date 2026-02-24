import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { supabase } from './lib/supabaseClient';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

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
