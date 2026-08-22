alert("SCRIPT IS WORKING");

/* =========================================
   FIREBASE CONFIGURATION
========================================= */

const firebaseConfig = {
    apiKey: "AIzaSyB10_bGT07hinBy-Ua-cNk5-KrkQ9bS_D8",
    authDomain: "railway-display-f1762.firebaseapp.com",
    projectId: "railway-display-f1762",
    storageBucket: "railway-display-f1762.firebasestorage.app",
    messagingSenderId: "498931138295",
    appId: "1:498931138295:web:6324553c0bfde335c95df2"
};


/* =========================================
   LIVE CLOCK
========================================= */

function updateClock() {

    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("en-IN", {
            hour12: false
        });

    document.getElementById("date").textContent =
        now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
}

updateClock();

setInterval(updateClock, 1000);


/* =========================================
   FIREBASE + FIRESTORE
========================================= */

try {

    firebase.initializeApp(firebaseConfig);

    const db = firebase.firestore();

    console.log("Firebase connected successfully");


    /* =====================================
       LOAD TRAINS FROM FIRESTORE
    ===================================== */

    const trainList =
        document.getElementById("train-list");


    db.collection("trains").onSnapshot(

        function(snapshot) {

            trainList.innerHTML = "";

            snapshot.forEach(function(doc) {

                const train = doc.data();

                const row =
                    document.createElement("div");

                row.className = "train-row";

                row.innerHTML = `

                    <div class="train-number">
                        ${train.number || ""}
                    </div>

                    <div class="train-name">
                        ${train.name || ""}
                    </div>

                    <div class="train-arrival">
                        ${train.arrival || ""}
                    </div>

                    <div class="train-departure">
                        ${train.departure || ""}
                    </div>

                    <div class="train-platform">
                        ${train.platform || ""}
                    </div>

                `;

                trainList.appendChild(row);

            });

            console.log(
                "Train data loaded:",
                snapshot.size
            );

        },

        function(error) {

            console.error(
                "Firestore error:",
                error
            );

        }

    );

}
catch (error) {

    console.error(
        "Firebase error:",
        error
    );

}
