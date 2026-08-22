const firebaseConfig = {
    apiKey: "AIzaSyB10_bGT07hinBy-Ua-cNk5-KrkQ9bS_D8",
    authDomain: "railway-display-f1762.firebaseapp.com",
    projectId: "railway-display-f1762",
    storageBucket: "railway-display-f1762.firebasestorage.app",
    messagingSenderId: "498931138295",
    appId: "1:498931138295:web:6324553c0bfde335c95df2"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

/* =========================================
   TRAIN TIMETABLE
   EDIT ONLY THIS SECTION
========================================= */

const trainList = document.getElementById("train-list");

function displayTrains(trains) {

    trainList.innerHTML = "";

    trains.forEach(function(train) {

        const row = document.createElement("div");

        row.className = "train-row";

        row.innerHTML = `
            <div class="train-number">
                ${train.number}
            </div>

            <div class="train-name">
                ${train.name}
            </div>

            <div class="train-arrival">
                ${train.arrival}
            </div>

            <div class="train-departure">
                ${train.departure}
            </div>

            <div class="train-platform">
                ${train.platform}
            </div>
        `;

        trainList.appendChild(row);
    });
}


/* FIREBASE LIVE DATABASE */

db.collection("trains").onSnapshot(function(snapshot) {

    const trains = [];

    snapshot.forEach(function(doc) {

        trains.push(doc.data());

    });

    displayTrains(trains);

});



/* =========================================
   LIVE CLOCK
========================================= */

function updateClock() {

    const now = new Date();

    const time =
        now.toLocaleTimeString("en-IN", {
            hour12: false
        });

    const date =
        now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

    document.getElementById("clock").textContent = time;

    document.getElementById("date").textContent = date;
}

updateClock();

setInterval(updateClock, 1000);


/* =========================================
   DISPLAY TRAIN ROWS
========================================= */

const trainList =
    document.getElementById("train-list");


function displayTrains() {

    trainList.innerHTML = "";

    trains.forEach(function(train) {

        const row =
            document.createElement("div");

        row.className = "train-row";

        row.innerHTML = `
            <div class="train-number">
                ${train.number}
            </div>

            <div class="train-name">
                ${train.name}
            </div>

            <div class="train-arrival">
                ${train.arrival}
            </div>

            <div class="train-departure">
                ${train.departure}
            </div>

            <div class="train-platform">
                ${train.platform}
            </div>
        `;

        trainList.appendChild(row);

    });

}

displayTrains();


/* =========================================
   AUTOMATIC TRAIN SCROLL
========================================= */

let scrollPosition = 0;

const scrollSpeed = 0.30;


function scrollTrainList() {

    const trainWindow =
        document.querySelector(".train-window");

    if (!trainWindow) {
        return;
    }

    const visibleHeight =
        trainWindow.clientHeight;

    const totalHeight =
        trainList.scrollHeight;


    if (totalHeight > visibleHeight) {

        scrollPosition += scrollSpeed;


        if (
            scrollPosition >=
            totalHeight
        ) {

            scrollPosition = 0;

        }


        trainList.style.transform =
            "translateY(-" +
            scrollPosition +
            "px";

    }

}


setInterval(
    scrollTrainList,
    30
);
