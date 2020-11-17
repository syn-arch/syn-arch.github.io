const CACHE_NAME = "menbal-v1";

const urlsToCache = [
    "/",
    "/index.html",
    "/pages/home.html",
    "/pages/match.html",
    "/pages/scores.html",
    "/pages/team.html",
    "/pages/favourite.html",
    "/css/style.css",
    "/node_modules/@fortawesome/fontawesome-free/css/all.min.css",
    "/node_modules/@fortawesome/fontawesome-free/js/all.min.js",
    "/node_modules/materialize-css/dist/css/materialize.min.css",
    "/node_modules/materialize-css/dist/js/materialize.min.js",
    "/js/script.js",
    "/js/team.js",
    "/favicon.ico",
    "/img/ball.jpg",
    "/img/field.jpg",
    "/img/hero.jpg",
    "/img/maps.svg",
    "/img/offline.svg",
    "/img/onboard.svg",
    "/icon.png",
    "/maskable_icon.png",
    "/node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2",
    "/node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2",
    "/sw.js",
    "/manifest.json",
    "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
    "https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2",
    "/js/idb.js",
    "/js/db.js",
    "/js/api.js"
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheName != CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
})

self.addEventListener("fetch", event => {
    const base_url = "https://api.football-data.org/v2/";
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function (response) {
                return response || fetch(event.request);
            })
        )
    }
});

self.addEventListener('push', event => {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    const options = {
        body: body,
        badge: '/icon.png',
        icon: '/icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});
