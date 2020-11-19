importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

const { registerRoute } = workbox.routing;
const { CacheFirst } = workbox.strategies;
const { StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { precacheAndRoute } = workbox.precaching;
const { ExpirationPlugin } = workbox.expiration;

if (workbox) {
    console.log(`Workbox berhasil dimuat`);
    precacheAndRoute([
        { url: "/", revision: 1 },
        { url: "/index.html", revision: 1 },
        { url: "/pages/home.html", revision: 1 },
        { url: "/pages/match.html", revision: 1 },
        { url: "/pages/scores.html", revision: 1 },
        { url: "/pages/team.html", revision: 1 },
        { url: "/pages/favourite.html", revision: 1 },
        { url: "/css/style.css", revision: 1 },
        { url: "/node_modules/@fortawesome/fontawesome-free/css/all.min.css", revision: 1 },
        { url: "/node_modules/@fortawesome/fontawesome-free/js/all.min.js", revision: 1 },
        { url: "/node_modules/materialize-css/dist/css/materialize.min.css", revision: 1 },
        { url: "/node_modules/materialize-css/dist/js/materialize.min.js", revision: 1 },
        { url: "/js/script.js", revision: 1 },
        { url: "/js/team.js", revision: 1 },
        { url: "/favicon.ico", revision: 1 },
        { url: "/img/ball.jpg", revision: 1 },
        { url: "/img/field.jpg", revision: 1 },
        { url: "/img/hero.jpg", revision: 1 },
        { url: "/img/maps.svg", revision: 1 },
        { url: "/img/offline.svg", revision: 1 },
        { url: "/img/onboard.svg", revision: 1 },
        { url: "/icon.png", revision: 1 },
        { url: "/maskable_icon.png", revision: 1 },
        { url: "/node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2", revision: 1 },
        { url: "/node_modules/@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff2", revision: 1 },
        { url: "/sw.js", revision: 1 },
        { url: "/manifest.json", revision: 1 },
        { url: "https://fonts.googleapis.com/css2?family=Poppins&display=swap", revision: 1 },
        { url: "https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2", revision: 1 },
        { url: "/js/idb.js", revision: 1 },
        { url: "/js/db.js", revision: 1 }
    ], {
        // Ignore all URL parameters.
        ignoreURLParametersMatching: [/.*/]
    });

    registerRoute(
        ({ request }) => request.destination === "image",
        new CacheFirst({
            cacheName: "images-cache",
            plugins: [
                new CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new ExpirationPlugin({
                    maxEntries: 100,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                }),
            ],
        })
    );

    workbox.routing.registerRoute(
        new RegExp("https://api.football-data.org/v2/"),
        new StaleWhileRevalidate()
    );

    // Menyimpan cache dari CSS Google Fonts
    workbox.routing.registerRoute(
        /^https:\/\/fonts\.googleapis\.com/,
        new StaleWhileRevalidate({
            cacheName: "google-fonts-stylesheets",
        })
    );

    // Caching Google Fonts
    registerRoute(
        /^https:\/\/fonts\.gstatic\.com/,
        new CacheFirst({
            cacheName: "google-fonts-webfonts",
            plugins: [
                new CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
                new ExpirationPlugin({
                    maxAgeSeconds: 60 * 60 * 24 * 365,
                    maxEntries: 30,
                }),
            ],
        })
    );

    workbox.routing.registerRoute(
        /\.(?:js|css)$/,
        new StaleWhileRevalidate({
            cacheName: "static-resources",
        })
    );
} else {
    console.log(`Workbox gagal dimuat`);
}

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
