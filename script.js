/* =========================================================
   ECE CENTRAL - RAILWAY DISPLAY
   FIREBASE + LIVE TIME SORTING
========================================================= */


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyB10_bGT07hinBy-Ua-cNk5-KrkQ9bS_D8",
    authDomain: "railway-display-f1762.firebaseapp.com",
    projectId: "railway-display-f1762",
    storageBucket: "railway-display-f1762.firebasestorage.app",
    messagingSenderId: "498931138295",
    appId: "1:498931138295:web:6324553c0bfde335c95df2"
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

    const parts = time.split(":");

    if (parts.length !== 2) {
        return 9999;
    }

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (
        isNaN(hours) ||
        isNaN(minutes)
    ) {
        return 9999;
    }

    return hours * 60 + minutes;
}


/* =========================================================
   SORT TRAINS BY DEPARTURE TIME
========================================================= */

function sortTrains(trains) {

    trains.sort(function(a, b) {

        const departureA =
            timeToMinutes(a.departure);

        const departureB =
            timeToMinutes(b.departure);

        return departureA - departureB;

    });

    return trains;
}


/* =========================================================
   GET TABLE BODY
========================================================= */

function getTableBody() {

    /*
       Try common IDs first.
       If your HTML has a normal <tbody>,
       use that automatically.
    */

    return (
        document.getElementById("train-list") ||
        document.getElementById("trainTableBody") ||
        document.querySelector("tbody")
    );
}


/* =========================================================
   DISPLAY TRAINS
========================================================= */

function displayTrains(trains) {

    const list = getTableBody();

    if (!list) {

        console.error(
            "❌ Could not find train display container."
        );

        return;
    }


    /* SORT */

    sortTrains(trains);


    /* CLEAR OLD ROWS */

    list.innerHTML = "";


    /* NO DATA */

    if (trains.length === 0) {

        list.innerHTML = `
            <tr>
                <td colspan="5"
                    style="
                        text-align:center;
                        padding:40px;
                    ">
                    NO TRAINS AVAILABLE
                </td>
            </tr>
        `;

        return;
    }


    /* CREATE ROWS */

    trains.forEach(function(train) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${train.number}
            </td>

            <td>
                ${train.name}
            </td>

            <td>
                ${train.arrival}
            </td>

            <td>
                ${train.departure}
            </td>

            <td>
                ${train.platform}
            </td>

        `;


        list.appendChild(row);

    });

}


/* =========================================================
   FIRESTORE LIVE LISTENER
========================================================= */

db.collection("TRAINS")
    .onSnapshot(

        function(snapshot) {

            const trains = [];


            snapshot.forEach(function(doc) {

                const data =
                    doc.data();


                /*
                   IMPORTANT:
                   Firebase fields are UPPERCASE.
                */

                trains.push({

                    id: doc.id,

                    number:
                        data.NUMBER || "",

                    name:
                        data.NAME || "",

                    arrival:
                        data.ARRIVAL || "***",

                    departure:
                        data.DEPARTURE || "***",

                    platform:
                        data.PLATFORM || "***"

                });

            });


            console.log(
                "Firebase trains:",
                trains
            );


            displayTrains(trains);

        },


        function(error) {

            console.error(
                "❌ Firebase error:",
                error
            );

        }

    );


/* =========================================================
   DONE
========================================================= */

console.log(
    "🚆 ECE CENTRAL Railway Display Started"
);
