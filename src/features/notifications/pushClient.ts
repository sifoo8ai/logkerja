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

export async function askNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.warn("Browser tidak menyokong notifikasi desktop.");
        return false;
    }
    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

export async function subscribeUserToPush() {
    const isGranted = await askNotificationPermission();
    if (!isGranted) return false;

    // We need service worker registered for this.
    const registration = await navigator.serviceWorker.ready;

    // VAPID keys ideally retrieved from config/env; using placeholder for logkerja project
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
        console.error("VAPID_PUBLIC_KEY is not defined in env variables");
        return false;
    }

    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        });

        // Save to DB via Edge function
        const { error } = await supabase.functions.invoke('push_register', {
            body: { subscription: JSON.parse(JSON.stringify(subscription)) },
        });

        if (error) {
            console.error("Gagal mendaftar push_subscription ke Supabase", error);
            return false;
        }

        return true;

    } catch (err: any) {
        console.error("Gagal melanggan Web Push", err);
        return false;
    }
}
