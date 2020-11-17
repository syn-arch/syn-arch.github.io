document.addEventListener("DOMContentLoaded", function () {

    // install & active service worker
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
            navigator.serviceWorker
                .register("/sw.js")
                .then(function () {
                    console.log("pendaftaran serviceWorker berhasil");
                })
                .catch(function (e) {
                    console.log("pendaftaran serviceWorker gagal : " + e)
                });
        });
    } else {
        console.log("serviceWorker belum didukung oleh browser ini");
    }

    // mobile navbar
    const navMoblie = document.querySelectorAll(".sidenav");
    M.Sidenav.init(navMoblie);

    // toggle navbar
    window.addEventListener("scroll", function () {
        const heightTop = window.pageYOffset;
        const nav = document.querySelector("nav");
        const textColor = document.querySelectorAll(".toggle-scroll-color");

        if (heightTop > 65) {
            nav.classList.remove("transparent");
            nav.classList.add("white");
            nav.classList.add("z-depth-1");
            nav.classList.remove("z-depth-0");
            textColor.forEach(function (el) {
                el.classList.add("black-text");
            });
        } else {
            nav.classList.add("transparent");
            nav.classList.remove("white");
            nav.classList.remove("z-depth-1");
            nav.classList.add("z-depth-0");
            textColor.forEach(function (el) {
                el.classList.remove("black-text");
            });
        }
    });

    // load page
    let page = window.location.hash.substr(1);
    if (page === "") page = "home";
    loadPage(page);

    // click action navbar
    const navLink = document.querySelectorAll(".sidenav a, .topnav a");
    navLink.forEach(function (el) {
        el.addEventListener("click", function (e) {
            // close side navbar
            const sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();

            // load content
            const link = e.target.getAttribute("href").substr(1);
            loadPage(link);
        });
    });

    function loadPage(page) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                const content = document.querySelector("#app");

                if (page == "home") {
                    getStandings();
                }

                if (page == "team") {
                    getTeamById();
                }

                if (page == "scores") {
                    getScores();
                }

                if (page == "favourite") {
                    getFavourites();
                }

                if (this.status == 200) {
                    content.innerHTML = xhr.responseText;
                } else if (this.status == 404) {
                    content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
                } else {
                    content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
                }
            }
        };
        xhr.open("GET", `pages/${page}.html`, true);
        xhr.send();
    }

    // Periksa fitur Notification API
    if ("Notification" in window) {
        requestPermission();
    } else {
        console.error("Browser tidak mendukung notifikasi.");
    }

    // Meminta ijin menggunakan Notification API
    function requestPermission() {
        Notification.requestPermission().then(function (result) {
            if (result === "denied") {
                console.log("Fitur notifikasi tidak diijinkan.");
                return;
            } else if (result === "default") {
                console.error("Pengguna menutup kotak dialog permintaan ijin.");
                return;
            }

            console.log("Fitur notifikasi diijinkan.");
            navigator.serviceWorker.ready.then(() => {

                if (('PushManager' in window)) {
                    navigator.serviceWorker.getRegistration().then(function (registration) {
                        registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array("BPLUaT7XSMdbtcnKlplsIbWAINTDyB9JBYrM0FGNx0HzJRqHSbiUQXaunsm8irWSsaNUUDii0P8jvaVpKpxg2gk")
                        }).then(function (subscribe) {
                            console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                            console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('p256dh')))));
                            console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('auth')))));
                        }).catch(function (e) {
                            console.error('Tidak dapat melakukan subscribe ', e.message);
                        });
                    });
                }
            })

        });
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
});
