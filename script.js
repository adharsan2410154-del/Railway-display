/* =========================================
   TRAIN TIMETABLE
   EDIT ONLY THIS SECTION
========================================= */

const trains = [

    {
        number: "12661",
        name: "POTHIGAI SUPERFAST EXPRESS",
        arrival: "07:38",
        departure: "07:45",
        platform: "4"
    },

   
    {
        number: "20635",
        name: "ANANTHAPURI EXPRESS",
        arrival: "08:20",
        departure: "08:25",
        platform: "2"
    },

   
    {
        number: "",
        name: "",
        arrival: "",
        departure: "",
        platform: ""
    },

   

    {
        number: "",
        name: "",
        arrival: "",
        departure: "",
        platform: ""
    },

   
    

];


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
