/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

// Precache the app shell via workbox
precacheAndRoute(self.__WB_MANIFEST || [])
cleanupOutdatedCaches()

// SW-UPDATE-01: versi baharu terus aktif & ambil alih semua tab/side panel, tanpa tunggu semua ditutup.
// Halaman yang sedang terbuka TIDAK di-reload automatik — refresh biasa sudah memuatkan versi terkini.
self.addEventListener('install', () => {
    self.skipWaiting()
})
self.addEventListener('activate', (event: ExtendableEvent) => {
    event.waitUntil(self.clients.claim())
})

// Handle Push notifications
self.addEventListener('push', function (event: PushEvent) {
    if (event.data) {
        const data = event.data.json()
        const options: NotificationOptions = {
            body: data.body,
            // PNG — kebanyakan platform tidak menyokong SVG untuk ikon notifikasi
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            // @ts-ignore
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
            }
        }
        event.waitUntil(
            self.registration.showNotification(data.title || 'LogKerja Notification', options)
        )
    }
})

// Handle Notification Clicks (Routing)
self.addEventListener('notificationclick', function (event: NotificationEvent) {
    event.notification.close()
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clientList) => {
            // If already open, focus it
            for (const client of clientList) {
                if ('focus' in client) {
                    return client.focus()
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow('/app')
            }
        })
    )
})
