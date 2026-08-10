// Ajwaa & Saeed Protocol Service Worker
const CACHE_NAME = 'ajwaa-saeed-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Listen for background notification schedule messages
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SCHEDULE_ACCUMULATION_REMINDER') {
        const intervalMs = (event.data.intervalMinutes || 60) * 60 * 1000;
        
        // Trigger notification
        if (self.registration && self.registration.showNotification) {
            self.registration.showNotification('Saeed Protocol Check-in', {
                body: 'Time for an Anytime Accumulation set! Push-ups, Vacuums or Hollow Holds.',
                icon: '/vite.svg',
                tag: 'saeed-reminder'
            });
        }
    }
});

// Push Notifications
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.text() : 'Saeed Protocol: Check your daily vacuums & push-ups!';
    event.waitUntil(
        self.registration.showNotification('Saeed Protocol Alert', {
            body: data,
            icon: '/vite.svg',
            badge: '/vite.svg'
        })
    );
});
