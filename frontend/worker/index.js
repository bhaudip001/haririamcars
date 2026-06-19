self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // If the request URL has sw_ignore=true, we completely bypass the Service Worker!
  // This is critical for Cloudinary videos to natively support HTTP Range Requests on Android/Safari.
  if (url.searchParams.has('sw_ignore') || (url.hostname === 'res.cloudinary.com' && url.pathname.includes('/video/'))) {
    event.stopImmediatePropagation();
    // By stopping propagation and NOT calling event.respondWith(),
    // we force the browser to handle the request natively, preserving all Range headers!
  }
});
