self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // If the request URL has sw_ignore=true, we completely bypass the Service Worker!
  // This is critical for Cloudinary videos to natively support HTTP Range Requests on Android/Safari.
  if (url.searchParams.has('sw_ignore') || (url.hostname === 'res.cloudinary.com' && url.pathname.includes('/video/'))) {
    event.stopImmediatePropagation();
    // By stopping propagation and NOT calling event.respondWith(),
    // we force the browser to handle the request natively, preserving all Range headers!
  }

  // Bypass Service Worker for admin pages, API routes, and dynamic catalog routes
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/backend') || url.pathname.startsWith('/api') || url.pathname.startsWith('/catalog/')) {
    event.stopImmediatePropagation();
  }
});

self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try { data = event.data.json(); } catch (e) { data = { title: event.data.text() }; }
  }
  const title = data.title || 'Hariram Motors';
  const options = {
    body: data.body || 'You have a new update!',
    icon: '/logo-192.jpg',
    badge: '/logo-48.jpg',
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      const url = event.notification.data.url || '/';
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
