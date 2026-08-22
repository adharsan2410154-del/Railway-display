/* =========================================================
   ECE CENTRAL - RAILWAY DISPLAY
   FIREBASE + LIVE TIME SORTING
========================================================= */


/* =========================================================
   FIREBASE CONFIG
   USE THE CONFIG FROM YOUR RAILWAY FIREBASE PROJECT
========================================================= */

const firebaseConfig = {
    apiKey: "YOUR_RAILWAY_FIREBASE_API_KEY",
    authDomain: "YOUR_RAILWAY_PROJECT.firebaseapp.com",
    projectId: "YOUR_RAILWAY_PROJECT_ID",
    storageBucket: "YOUR_RAILWAY_STORAGE_BUCKET",
    messagingSenderId: "YOUR_RAILWAY_SENDER_ID",
    appId: "YOUR_RAILWAY_APP_ID"
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

    const clock =
        document.getElementById("clock");

    const date =
        document.getElementById("date");


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
   CONVERT HH:MM TO MINUTES
========================================================= */

function timeToMinutes(time) {

    if (!time) {
        return 9999;
    }


    time = String(time).trim();


    /*
       *** means time unavailable.
       Put such trains at the bottom.
    */

    if (
        time === "***" ||
        time === "--:--"
    ) {

        return 9999;

    }


    const parts =
        time.split(":");


    if (parts.length !== 2) {

        return 9999;

    }


    const hours =
        parseInt(parts[0], 10);

    const minutes =
        parseInt(parts[1], 10);


    if (
        isNaN(hours) ||
        isNaN(minutes)
    ) {

        return 9999;

    }


    return (
        hours * 60 +
        minutes
    );

}


/* =========================================================
   GET DISPLAY TIME
========================================================= */

function getDisplayTime(time) {

    if (!time) {
        return "***";
    }

    return time;

}


/* =========================================================
   SORT TRAINS BY DEPARTURE TIME
========================================================= */

function sortTrains(trains) {

    return trains.sort(function(a, b) {

        const timeA =
            timeToMinutes(
                a.departure
            );


        const timeB =
            timeToMinutes(
                b.departure
            );


        return timeA - timeB;

    });

}


/* =========================================================
   DISPLAY TRAINS
========================================================= */

function displayTrains(trains) {

    const list =
        document.getElementById(
            "train-list"
        );


    if (!list) {

        console.error(
            "train-list element not found."
        );

        return;

    }


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


    /* Sort automatically */

    sortTrains(trains);


    /* Create rows */

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

                ${getDisplayTime(
                    train.arrival
                )}

            </div>


            <div class="train-departure">

                ${getDisplayTime(
                    train.departure
                )}

            </div>


            <div class="train-platform">

                ${train.platform || "***"}

            </div>

        `;


        list.appendChild(row);

    });

}


/* =========================================================
   FIRESTORE LIVE LISTENER
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


            /*
               Firebase data can be in ANY order.
               displayTrains() sorts it by departure.
            */

            displayTrains(trains);

        },


        function(error) {

            console.error(
                "Firebase error:",
                error
            );


            const list =
                document.getElementById(
                    "train-list"
                );


            if (list) {

                list.innerHTML = `

                    <div style="
                        text-align:center;
                        padding:40px;
                        color:#ff4444;
                        font-size:22px;
                    ">

                        DATABASE CONNECTION ERROR

                    </div>

                `;

            }

        }

    );


/* =========================================================
   RE-CHECK SORTING EVERY 30 SECONDS
========================================================= */

setInterval(function() {

    db.collection("trains")
        .get()

        .then(function(snapshot) {

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


            displayTrains(trains);

        })

        .catch(function(error) {

            console.error(
                "Refresh error:",
                error
            );

        });

}, 30000);
