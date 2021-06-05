


const STATIC_CACHE = `static-cache-v1`;
const RUNTIME_CACHE = `runtime-cache`;


const FILES_TO_CACHE = [
    `/js/idb.js`,
    `/index.html`,
    `/js/index.js`,
    `/css/styles.css`,
    `/manifest.webmanifest`,
    `/icons/icon-72x72.png`,
    `/icons/icon-96x96.png`,
    `/icons/icon-128x128.png`,
    `/icons/icon-144x144.png`,
    `/icons/icon-152x152.png`,
    `/icons/icon-192x192.png`,
    `/icons/icon-384x384.png`,
    `/icons/icon-512x512.png`,
];


// Install the service worker
self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            console.log('Your files were pre-cached successfully!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener(`activate`, event => {
    const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
    event.waitUntil(
        caches
            .keys()
            .then(cacheNames =>
                cacheNames.filter(cacheName => !currentCaches.includes(cacheName))
            )
            .then(cachesToDelete =>
                Promise.all(
                    cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete))
                )
            )
            .then(() => self.clients.claim())
    );
});

// Respond with cached resources
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) { // if cache is available, respond with cache
                console.log('responding with cache : ' + e.request.url);
                return request;
            } else {       // if there are no cache, try fetching request
                console.log('file is not cached, fetching : ' + e.request.url);
                return fetch(e.request);
            }

            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        })
    );
});