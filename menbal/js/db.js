var dbPromised = idb.open("menbal", 1, function (upgradeDb) {
    var teamsObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id"
    });
    teamsObjectStore.createIndex("name", "name", { unique: false });
});

function saveForLatter(team) {
    dbPromised
        .then(function (db) {
            var tx = db.transaction("teams", "readwrite");
            var store = tx.objectStore("teams");
            store.put(team);
            return tx.complete;
        })
        .then(function () {
            console.log("Artikel berhasil disimpan");
        });
}

function getAll() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.getAll();
            })
            .then(function (teams) {
                resolve(teams)
            })
    })
}

function getById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.get(parseInt(id));
            })
            .then(function (team) {
                resolve(team);
            });
    });
}

function deleteById(id) {
    dbPromised
        .then(function (db) {
            var tx = db.transaction("teams", "readwrite");
            var store = tx.objectStore("teams");
            return store.delete(parseInt(id));
        })
        .then(function () {
            console.log("Artikel berhasil dihapus");
        });
}
