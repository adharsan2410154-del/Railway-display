/* =========================================================
   ECE CENTRAL - RAILWAY DISPLAY
   FIREBASE + DEPARTURE TIME SORTING
========================================================= */


/* =========================================================
   FIREBASE CONFIG
   ⚠️ KEEP YOUR ORIGINAL WORKING RAILWAY CONFIG HERE
========================================================= */

const firebaseConfig = {
    apiKey: "YOUR_EXISTING_RAILWAY_API_KEY",
    authDomain: "YOUR_EXISTING_RAILWAY_AUTH_DOMAIN",
    projectId: "YOUR_EXISTING_RAILWAY_PROJECT_ID",
    storageBucket: "YOUR_EXISTING_RAILWAY_STORAGE_BUCKET",
    messagingSenderId: "YOUR_EXISTING_RAILWAY_SENDER_ID",
    appId: "YOUR_EXISTING_RAILWAY_APP_ID"
};


/* =========================================================
   INITIALIZE FIREBASE
========================================================= */

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


/* =========================================================
   LIVE CLOCK
========================================================= */

function updateClock() {

    const now = new Date();

    const clock = document.getElementById("clock");
    const date = document.getElementById("date");

    if (clock) {

        clock.textContent =
            now.toLocaleTimeString("en-IN", {
                hour12: false
            });

    }

    if (date) {

        date.textContent =
            now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            });

    }

}

updateClock();

setInterval(updateClock, 1000);


/* =========================================================
   CONVERT TIME TO MINUTES
========================================================= */

function timeToMinutes(time) {

    if (!time) {
        return 9999;
    }

    time = String(time).trim();

    if (
        time === "***" ||
        time === "--:--"
    ) {
        return 9999;
    }

    const match =
        time.match(/^(\d{1,2}):(\d{2})/);

    if (!match) {
        return 9999;
    }

    const hours =
        parseInt(match[1], 10);

    const minutes =
        parseInt(match[2], 10);

    if (
        isNaN(hours) ||
        isNaN(minutes)
    ) {
        return 9999;
    }

    return hours * 60 + minutes;

}


/* =========================================================
   SORT BY DEPARTURE TIME
========================================================= */

function sortTrains(trains) {

    trains.sort(function(a, b) {

        return (
            timeToMinutes(a.departure) -
            timeToMinutes(b.departure)
        );

    });

}


/* =========================================================
   DISPLAY TRAINS
========================================================= */

function displayTrains(trains) {

    const list =
        document.getElementById("train-list");

    if (!list) {

        console.error(
            "train-list element not found"
        );

        return;

    }


    /* Sort BEFORE displaying */

    sortTrains(trains);


    list.innerHTML = "";


    if (trains.length === 0) {

        list.innerHTML = `

            <div style="
                text-align:center;
                padding:40px;
                color:#aaa;
                font-size:24px;
            ">

                NO TRAINS AVAILABLE

            </div>

        `;

        return;

    }


    trains.forEach(function(train) {

        const row =
            document.createElement("div");

        row.className =
            "train-row";


        row.innerHTML = `

            <div class="train-number">
                ${train.number || ""}
            </div>

            <div class="train-name">
                ${train.name || ""}
            </div>

            <div class="train-arrival">
                ${train.arrival || "***"}
            </div>

            <div class="train-departure">
                ${train.departure || "***"}
            </div>

            <div class="train-platform">
                ${train.platform || "***"}
            </div>

        `;


        list.appendChild(row);

    });

}


/* =========================================================
   FIREBASE LIVE DATA
========================================================= */

db.collection("trains")

    .onSnapshot(

        function(snapshot) {

            const trains = [];


            snapshot.forEach(function(doc) {

                const data =
                    doc.data();


                trains.push({

                    id: doc.id,

                    number:
                        data.number || "",

                    name:
                        data.name || "",

                    arrival:
                        data.arrival || "",

                    departure:
                        data.departure || "",

                    platform:
                        data.platform || "***"

                });

            });


            console.log(
                "Trains received:",
                trains
            );


            displayTrains(trains);

        },


        function(error) {

            console.error(
                "Firebase error:",
                error
            );

        }

    );
