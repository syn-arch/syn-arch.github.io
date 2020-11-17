const webPush = require("web-push");

const vapidKeys = {
    publicKey:
        "BPLUaT7XSMdbtcnKlplsIbWAINTDyB9JBYrM0FGNx0HzJRqHSbiUQXaunsm8irWSsaNUUDii0P8jvaVpKpxg2gk",
    privateKey: "EUtO26Q-ywbFQRoBSQ70qKjkRHXy8EIBSuQik4ghskE",
};

webPush.setVapidDetails(
    "mailto:edo.billy@gmail.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
var pushSubscription = {
    endpoint:
        "https://fcm.googleapis.com/fcm/send/cZMP_a4hIus:APA91bHZG3th4GXmDhyNzgm5-IGtjv2g8foBTD3Q5GlwgoKaRUR0Qq_noAOPZf6qM3k2z4P1LK9RFrNoQw40Gz6jtAJBZP6Zbhu_POLKkhxwjOlke-ggY0Hu1MX6gwEhbR4pRm5wcQIS",
    keys: {
        p256dh:
            "BJ2do5MxFhpDVjwGv1bbFTyAuc98wfTnfZxDR7AaLo+U56ks+NBOW0kpQ6qh8aB4rmc0u2jKjTWPXpOw/fmUJRk=",
        auth: "ssPzKfFPdHESt69AMDRzUg==",
    },
};
var payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

var options = {
    gcmAPIKey: "646711999890",
    TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
