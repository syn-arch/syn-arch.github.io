const base_url = "https://api.football-data.org/v2/";
const API_KEY = "ad675f75979741d8ac50f36fcb7de729";
let id_liga = "PL";
let standingsURL = `${base_url}/competitions/${id_liga}/standings`;

// date helper
function getDay(Date) {
    return String(Date.getDate()).padStart(2, "0");
}
function getMonth(Date) {
    return String(Date.getMonth() + 1).padStart(2, "0");
}
function Date2Time(time) {
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function addDays(dateObj, numDays) {
    return dateObj.setDate(dateObj.getDate() + numDays);
}
function toDateTime(secs) {
    let t = new Date(Date.UTC(1970, 0, 1));
    t.setUTCSeconds(secs / 1000);
    return t;
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getStandings() {

    if ('caches' in window) {
        caches.match(`${base_url}competitions/${id_liga}/standings`).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    const result = data.standings[0].table
                    // Objek/array JavaScript dari response.json() masuk lewat data.
                    // Menyusun komponen card artikel secara dinamis
                    let standingsHTML = "";
                    result.forEach(function (data) {
                        standingsHTML += `<tr>
                            <td>${data.position}</td>
                            <td>
                            <a href="/pages/team.html?id=${data.team.id}" class="white-text truncate detail_team">
                            <img alt="${data.team.name}" class="responsive-img hide-on-small-only" width="40" height="auto" src="${data.team.crestUrl}"> 
                            ${data.team.name}
                            </a>
                            </td>
                            <td>${data.playedGames}</td>
                            <td>${data.won}</td>
                            <td>${data.draw}</td>
                            <td>${data.lost}</td>
                            <td>${data.goalsFor}</td>
                            <td>${data.goalsAgainst}</td>
                            <td>${data.goalDifference}</td>
                            <td>${data.points}</td>
                            </tr>`
                    });
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.querySelector(".body-standings").innerHTML = standingsHTML;
                })
            }
        })
    }

    fetch(`${base_url}competitions/${id_liga}/standings`, {
        method: "GET",
        headers: {
            "X-Auth-Token": API_KEY
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            const result = data.standings[0].table
            // Objek/array JavaScript dari response.json() masuk lewat data.
            // Menyusun komponen card artikel secara dinamis
            let standingsHTML = "";
            result.forEach(function (data) {
                standingsHTML += `<tr>
                    <td>${data.position}</td>
                    <td>
                    <a href="/pages/team.html?id=${data.team.id}" class="white-text truncate detail_team">
                    <img alt="${data.team.name}" class="responsive-img hide-on-small-only" alt="team image" width="40" height="auto" src="${data.team.crestUrl}"> 
                    ${data.team.name}
                    </a>
                    </td>
                    <td>${data.playedGames}</td>
                    <td>${data.won}</td>
                    <td>${data.draw}</td>
                    <td>${data.lost}</td>
                    <td>${data.goalsFor}</td>
                    <td>${data.goalsAgainst}</td>
                    <td>${data.goalDifference}</td>
                    <td>${data.points}</td>
                    </tr>`
            });

            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.querySelector(".body-standings").innerHTML = standingsHTML;
        })
        .catch(error);
}

function getTeamById() {
    // Ambil nilai query parameter (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    const teamID = urlParams.get("id");

    return new Promise(function (resolve, reject) {
        if ('caches' in window) {
            caches.match(base_url + `teams/${teamID}`).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        // parsing data ke elemen HTML
                        document.querySelector(".section-title").innerHTML = data.shortName;
                        document.querySelector(".team-name").innerHTML = data.shortName;
                        document.querySelector(".team-area").innerHTML = data.area.name;
                        document.querySelector(".team-colour").innerHTML = data.clubColors;
                        document.querySelector(".team-website").innerHTML = `<a target="_blank" href="${data.website}">${data.website}</a>`;
                        document.querySelector(".team-img").src = data.crestUrl;

                        // Menyusun komponen card artikel secara dinamis
                        let comp = '';
                        data.activeCompetitions.forEach(function (el) {
                            tgl = new Date(el.lastUpdated);
                            comp += `
                                <tr>
                                    <td>${el.name}</td>
                                    <td>${el.area.name}</td>
                                    <td>${getDay(tgl) + "-" + getMonth(tgl) + "-" + tgl.getFullYear()}</td>
                                </tr>
                                `;
                        });
                        document.getElementById("active-competitions").innerHTML = comp;

                        let squad = '';
                        data.squad.forEach(function (el) {
                            tanggal = new Date(el.dateOfBirth);
                            squad += `
                            <tr>
                                <td>${el.name} </td>
                                <td>${el.position}</td>
                                <td>${el.shirtNumber == null ? "" : el.shirtNumber}</td>
                                <td>${el.role}</td>
                                <td>${getDay(tanggal) + "-" + getMonth(tanggal) + "-" + tanggal.getFullYear()}</td>
                                <td>${el.nationality}</td>
                            </tr>
                            `;
                        });
                        document.getElementById("team-squad").innerHTML = squad;
                        resolve(data)
                    })
                }
            })
        }

        fetch(base_url + `teams/${teamID}`, {
            method: "GET",
            headers: {
                "X-Auth-Token": API_KEY
            }
        })
            .then(status)
            .then(json)
            .then(function (data) {
                // parsing data ke elemen HTML
                document.querySelector(".section-title").innerHTML = data.shortName;
                document.querySelector(".team-name").innerHTML = data.shortName;
                document.querySelector(".team-area").innerHTML = data.area.name;
                document.querySelector(".team-colour").innerHTML = data.clubColors;
                document.querySelector(".team-website").innerHTML = `<a target="_blank" href="${data.website}">${data.website}</a>`;
                document.querySelector(".team-img").src = data.crestUrl;

                // Menyusun komponen card artikel secara dinamis
                let comp = '';
                data.activeCompetitions.forEach(function (el) {
                    tgl = new Date(el.lastUpdated);
                    comp += `
                        <tr>
                            <td>${el.name}</td>
                            <td>${el.area.name}</td>
                            <td>${getDay(tgl) + "-" + getMonth(tgl) + "-" + tgl.getFullYear()}</td>
                        </tr>
                        `;
                });
                document.getElementById("active-competitions").innerHTML = comp;

                let squad = '';
                data.squad.forEach(function (el) {
                    tanggal = new Date(el.dateOfBirth);
                    squad += `
                    <tr>
                        <td>${el.name} </td>
                        <td>${el.position}</td>
                        <td>${el.shirtNumber == null ? "" : el.shirtNumber}</td>
                        <td>${el.role}</td>
                        <td>${getDay(tanggal) + "-" + getMonth(tanggal) + "-" + tanggal.getFullYear()}</td>
                        <td>${el.nationality}</td>
                    </tr>
                    `;
                });
                document.getElementById("team-squad").innerHTML = squad;
                resolve(data)
            });
    });


}

function changeMatchDate() {
    let s = document.getElementById("start").value;
    let e = document.getElementById("end").value;
    let tanggalAwal = s.split("-");
    let dateAwal = new Date(tanggalAwal[0], tanggalAwal[1] - 1, tanggalAwal[2]);
    let tanggalAkhir = e.split("-");
    let dateAkhir = new Date(
        tanggalAkhir[0],
        tanggalAkhir[1] - 1,
        tanggalAkhir[2]
    );
    getMatches(dateAwal, dateAkhir);
}

function getMatches(today = new Date(), day14 = toDateTime(addDays(new Date(), 14))) {
    let dd = getDay(today);
    let mm = getMonth(today);
    let yyyy = today.getFullYear();
    let dd14 = getDay(day14);
    let mm14 = getMonth(day14);
    let yyyy14 = day14.getFullYear();

    if ('caches' in window) {
        caches.match(`${base_url}competitions/${id_liga}/matches?dateFrom=${yyyy}-${mm}-${dd}&dateTo=${yyyy14}-${mm14}-${dd14}`).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    let matchesHTML = "";
                    data.matches.forEach(function (data) {
                        let tanggal = new Date(data.utcDate);
                        let waktu = Date2Time(tanggal);
                        let bulan = tanggal.toLocaleString("default", { month: "short" });
                        let hari = getDay(tanggal);
                        let tahun = tanggal.getFullYear();
                        matchesHTML += `<tr>
                                <td>${hari + " " + bulan + " " + tahun}</td>
                                <td>${waktu}</td>
                                <td>${data.status}</td>
                                <td class="valign-wrapper"><img class="responsive-img" width="20" height="auto" style="margin-right:5px"" src="https://crests.football-data.org/${data.homeTeam.id}.svg">${data.homeTeam.name}</td>
                                <td>${data.score.fullTime.homeTeam == null
                                ? "-"
                                : data.score.fullTime.homeTeam
                            } : ${data.score.fullTime.awayTeam == null
                                ? "-"
                                : data.score.fullTime.awayTeam
                            }</td>
                                <td class="valign-wrapper">${data.awayTeam.name}
                                <img class="responsive-img" width="20" height="auto" style="margin-left:5px"" src="https://crests.football-data.org/${data.awayTeam.id}.svg"
                            }"></td>
                            </tr>`
                    });

                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.querySelector("#body-matches").innerHTML = matchesHTML;
                });
            }
        })
    }

    fetch(`${base_url}competitions/${id_liga}/matches?dateFrom=${yyyy}-${mm}-${dd}&dateTo=${yyyy14}-${mm14}-${dd14}`, {
        method: "GET",
        headers: {
            "X-Auth-Token": API_KEY
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            // Objek/array JavaScript dari response.json() masuk lewat data.
            // Menyusun komponen card artikel secara dinamis
            let matchesHTML = "";
            data.matches.forEach(function (data) {
                let tanggal = new Date(data.utcDate);
                let waktu = Date2Time(tanggal);
                let bulan = tanggal.toLocaleString("default", { month: "short" });
                let hari = getDay(tanggal);
                let tahun = tanggal.getFullYear();
                matchesHTML += `<tr>
                                <td>${hari + " " + bulan + " " + tahun}</td>
                                <td>${waktu}</td>
                                <td>${data.status}</td>
                                <td class="valign-wrapper"><img class="responsive-img" width="20" height="auto" style="margin-right:5px"" src="https://crests.football-data.org/${data.homeTeam.id}.svg">${data.homeTeam.name}</td>
                                <td>${data.score.fullTime.homeTeam == null
                        ? "-"
                        : data.score.fullTime.homeTeam
                    } : ${data.score.fullTime.awayTeam == null
                        ? "-"
                        : data.score.fullTime.awayTeam
                    }</td>
                                <td class="valign-wrapper">${data.awayTeam.name}
                                <img class="responsive-img" width="20" height="auto" style="margin-left:5px"" src="https://crests.football-data.org/${data.awayTeam.id}.svg"
                            }"></td>
                            </tr>`
            });

            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.querySelector("#body-matches").innerHTML = matchesHTML;
        })
        .catch(error);
}


function getScores() {

    if ('caches' in window) {
        caches.match(`${base_url}competitions/${id_liga}/scorers`).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    // Menyusun komponen card artikel secara dinamis
                    let scoresHTML = "";
                    let counter = 1;
                    data.scorers.forEach(function (data) {
                        scoresHTML += `
                            <tr>
                                <td>${counter}</td>
                                <td>${data.player.name}</td>
                                <td>${data.team.name}</td>
                                <td>${data.numberOfGoals}</td>
                            </tr>
                        `;
                        counter++;
                    });
                    // Sisipkan komponen card ke dalam elemen dengan id #content
                    document.querySelector("#body-scores").innerHTML = scoresHTML;
                });
            }
        })
    }

    fetch(`${base_url}competitions/${id_liga}/scorers`, {
        method: "GET",
        headers: {
            "X-Auth-Token": API_KEY
        }
    })
        .then(status)
        .then(json)
        .then(function (data) {
            // Menyusun komponen card artikel secara dinamis
            let scoresHTML = "";
            let counter = 1;
            data.scorers.forEach(function (data) {
                scoresHTML += `
              <tr>
                <td>${counter}</td>
                <td>${data.player.name}</td>
                <td>${data.team.name}</td>
                <td>${data.numberOfGoals}</td>
              </tr>
              `;
                counter++;
            });
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.querySelector("#body-scores").innerHTML = scoresHTML;
        })
        .catch(error);
}

function getFavourites() {
    getAll().then(function (favourites) {
        // Menyusun komponen card artikel secara dinamis
        var favouritesHTML = "";
        favourites.forEach(function (favourite) {
            favouritesHTML += `
                <div class="col s12 m4">
                    <div class="card">
                        <div class="card-image">
                            <a href="/pages/team.html?id=${favourite.id}&saved=true">
                                <img src="${favourite.crestUrl}">
                            </a>
                        </div>
                        <div class="card-content">
                            <p>${favourite.name}</p>
                        </div>          
                        <div class="card-action">
                            <a href="#" class="btn-flat white-text red remove-team-btn" data-id="${favourite.id}"><i class="fa fa-trash"></i> Remove</a>
                        </div>
                    </div>
                </div>
                `;
        });

        // Sisipkan komponen card ke dalam elemen dengan id #body-content
        document.querySelector(".body-favourites").innerHTML = favouritesHTML;

        // delete button
        const favouriteTeamBtn = document.querySelectorAll(".remove-team-btn");
        favouriteTeamBtn.forEach(function (elm) {
            elm.addEventListener("click", function (e) {
                e.preventDefault();
                const id = this.getAttribute("data-id");
                deleteById(id);
                M.toast({ html: "Team Removed", classes: "rounded" });
                getFavourites();
            });
        });
    });
}

function getFavouriteById() {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    getById(idParam).then(function (data) {
        // parsing data ke elemen HTML
        document.querySelector(".section-title").innerHTML = data.shortName;
        document.querySelector(".team-name").innerHTML = data.shortName;
        document.querySelector(".team-area").innerHTML = data.area.name;
        document.querySelector(".team-colour").innerHTML = data.clubColors;
        document.querySelector(".team-website").innerHTML = `<a target="_blank" href="${data.website}">${data.website}</a>`;
        document.querySelector(".team-img").src = data.crestUrl;

        // Menyusun komponen card artikel secara dinamis
        let comp = '';
        data.activeCompetitions.forEach(function (el) {
            tgl = new Date(el.lastUpdated);
            comp += `
              <tr>
                <td>${el.name}</td>
                <td>${el.area.name}</td>
                <td>${getDay(tgl) + "-" + getMonth(tgl) + tgl.getFullYear()}</td>
              </tr>
              `;
        });
        document.getElementById("active-competitions").innerHTML = comp;

        let squad = '';
        data.squad.forEach(function (el) {
            tanggal = new Date(el.dateOfBirth);
            squad += `
              <tr>
                <td>${el.name} </td>
                <td>${el.position}</td>
                <td>${el.shirtNumber == null ? "" : el.shirtNumber}</td>
                <td>${el.role}</td>
                <td>${getDay(tanggal) + "-" + getMonth(tanggal) + "-" + tanggal.getFullYear()}</td>
                <td>${el.nationality}</td>
              </tr>
              `;
        });
        document.getElementById("team-squad").innerHTML = squad;
    });
}
