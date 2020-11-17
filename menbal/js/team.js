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

    const urlParams = new URLSearchParams(window.location.search);
    const isFormSaved = urlParams.get("saved");
    const id = urlParams.get("id");
    const btnSave = document.getElementById("save");

    // cek team pada indexDB
    getById(id)
        .then(function (team) {
            if (team) {
                btnSave.classList.add('disabled');
            }
        });

    if (isFormSaved) {
        // Hide fab jika dimuat dari indexed db
        btnSave.style.display = 'none';
        // ambil artikel lalu tampilkan
        getFavouriteById();
    } else {
        var item = getTeamById();
    }


    btnSave.onclick = function () {
        item.then(function (article) {
            saveForLatter(article);
            M.toast({ html: "Team Saved", classes: "rounded" });
            btnSave.classList.add('disabled');
        });
    }

});
