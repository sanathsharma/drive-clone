const CACHE_NAME = "app-cache-v1";
const URLS_TO_CACHE = []; // add other page routes you want available offline

self.addEventListener("install", (event) => {
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE)));
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))),
	);
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const isPageNav = event.request.mode === "navigate";
  const isAsset = ["script", "style", "image"].includes(event.request.destination);

  if (!isAsset || isPageNav) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        const cacheControl = response.headers.get("Cache-Control") || "";
        const isNonCacheable =
          cacheControl.includes("no-cache") ||
          cacheControl.includes("no-store") ||
          cacheControl.includes("private");

        if (response.ok && !isNonCacheable) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }

        return response;
      });
    })
  );
});;

self.addEventListener("message", (event) => {
	if (event.data?.type === "CLEAR_CACHE") {
		event.waitUntil(
			caches
				.keys()
				.then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
				.then(() => event.ports[0]?.postMessage({ done: true })),
		);
	}
});
