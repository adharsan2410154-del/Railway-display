/* =========================================
   TRAIN TIMETABLE
   EDIT ONLY THIS SECTION
========================================= */

const trains = [

    {
        number: "12661",
        name: "Nelson VB",
        arrival: "17:05",
        departure: "17:15",
        platform: "**"
    },

   
    {
        number: "20635",
        name: "Annadurai EXPRESS",
        arrival: "17:20",
        departure: "17:25",
        platform: "***"
    },

   
    {
        number: "56721",
        name: "Hanis Passenger",
        arrival: "",
        departure: "17:15",
        platform: "***"
    },

   

    {
        number: "06013",
        name: "Devesh Special",
        arrival: "17:45",
        departure: "17:50",
        platform: "LATE"
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
