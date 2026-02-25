import { supabase } from '../../lib/supabaseClient';

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function subscribeUserToPush(): Promise<{ success: boolean; error?: string }> {
    if (!('Notification' in window)) {
        console.warn("Browser tidak menyokong notifikasi desktop.");
        return { success: false, error: "Browser tidak menyokong notifikasi desktop." };
    }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        return { success: false, error: "Kebenaran notifikasi ditolak oleh pengguna." };
    }
    console.log('PUSH: permission granted');

    if (!navigator.serviceWorker) {
        return { success: false, error: "Push not supported (Service Worker unavailable)." };
    }

    // Check if service worker is actually registered, because navigator.serviceWorker.ready can hang infinitely if it's not.
    const swRegistration = await navigator.serviceWorker.getRegistration();
    if (!swRegistration) {
        return { success: false, error: "Service Worker tiada/belum sedia. Sila muat semula web, atau pastikan anda menggunakan HTTPS / Localhost." };
    }
    const registration = await navigator.serviceWorker.ready;
    if (!registration) {
        return { success: false, error: "Push not supported. Service worker not ready." };
    }

    // VAPID keys ideally retrieved from config/env; using placeholder for logkerja project
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY?.trim();
    if (!vapidPublicKey) {
        console.error("VAPID_PUBLIC_KEY is not defined in env variables");
        return { success: false, error: "VAPID public key belum diset dalam .env" };
    }

    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
    console.log('PUSH: key length', convertedVapidKey.length);
    try {
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });
        }
        console.log('PUSH: subscription created', subscription);
        console.log('PUSH: subscription endpoint', subscription.endpoint);

        console.log('PUSH: calling push_register');
        // Save to DB via Edge function
        const { data, error } = await supabase.functions.invoke('push_register', {
            body: { subscription: JSON.parse(JSON.stringify(subscription)) },
        });

        if (error || data?.error) {
            let errMsg = 'Gagal mendaftar push_subscription ke Supabase';
            if (error) {
                console.error("Invoke error:", error);

                // Try extracting JSON error from edge function if possible
                try {
                    if (error.context && typeof error.context.json === 'function') {
                        const errBody = await error.context.json();
                        errMsg = errBody.error || errMsg;
                    } else if (error.message) {
                        errMsg = error.message;
                    }
                } catch { }
            } else {
                errMsg = data.error;
            }

            return { success: false, error: errMsg };
        }

        console.log('PUSH: push_register success');
        return { success: true };

    } catch (err: any) {
        console.error("Gagal melanggan Web Push", err);
        return { success: false, error: err.message || "Gagal melanggan Web Push" };
    }
}
