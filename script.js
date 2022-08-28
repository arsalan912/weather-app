"use strict";

const input = document.querySelector(".input");
const form = document.querySelector("form");
const mainD = document.querySelector("#main");
const windSpeedD = document.querySelector("#wind");
const rainD = document.querySelector("#rain");
const humidityD = document.querySelector("#humidity");
const currentDegD = document.querySelector(".current__deg");
const currentIcon = document.querySelector(".current__icon");
const currentContainer = document.querySelector(".current");
const nextContainer = document.querySelector(".next");
const nextCards = document.querySelectorAll(".next>div");
const nextdayD = document.querySelectorAll(".days");
const typeD = document.querySelectorAll(".type span");

const apiKey = "ac186db648a29654f16583cf76f0e682";

const dayNames = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

const weatherDisplay = () => {
  const city = input.value;

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${
      typeD[0].classList.contains("active") ? "imperial" : "metric"
    }&appid=ac186db648a29654f16583cf76f0e682`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.cod !== "404") {
        const now = new Date();
        const day = now.getDay() + 1;
        const nowDay = [];
        const nextDays = [];
        const dayList = data.list;
        document.querySelectorAll(".days").forEach((d, i) => {
          d.innerHTML = dayNames[i + day];
        });

        dayList.forEach((dt) => {
          const curday = new Date(
            dt.dt_txt.split(" ").shift().split("-").join(",")
          );
          if (now - curday > 0) {
            nowDay.push(dt);
          }
        });
        dayList.forEach((dt) => {
          const nextDate = new Date(
            dt.dt_txt.split(" ").shift().split("-").join(",")
          );
          if (nextDate - now > 0) {
            nextDays.push(dt);
          }
        });
        const day0 = nowDay[0];
        const day1 = nextDays[4];
        const day2 = nextDays[12];
        const day3 = nextDays[20];
        const day4 = nextDays[28];
        const days = [day1, day2, day3, day4];

        // get current data
        const [{ main }] = day0.weather;
        const { temp, temp_max, temp_min, humidity } = day0.main;
        const { speed } = day0.wind;
        const tempo = Math.floor((temp_min + temp_max) / 2);
        // display current data
        mainD.innerHTML = main;
        currentDegD.innerHTML = `              
        <h1>${tempo}°</h1>
        <p><span>${Math.floor(temp_min)}°</span>/<span>${Math.floor(
          temp_max
        )}°</span></p>`;
        humidityD.innerHTML = humidity;
        windSpeedD.innerHTML = Number(speed).toFixed(1);

        // cur icon
        if (main.toLowerCase() === "clear") {
          currentIcon.innerHTML = icons[0];
          currentIcon.style = "background-color: rgba(231, 208, 155, 0.3)";
        }
        if (main.toLowerCase() === "clouds") {
          currentIcon.innerHTML = icons[1];
          currentIcon.style = "background-color: rgba(231, 208, 155, 0.3)";
        }
        if (main.toLowerCase() === "rain") {
          currentIcon.innerHTML = icons[2];
          currentIcon.style = "background-color: rgba(155, 185, 231, 0.3)";
        }
        // ///////////////////////////////////////
        // next days
        nextCards.forEach((card, i) => {
          const temp = Math.round(days[card.dataset.tab - 1].main.temp);

          document.querySelectorAll(".next__card span")[
            card.dataset.tab - 1
          ].innerHTML = `${temp}°`;

          if (
            days[card.dataset.tab - 1].weather[0].main.toLowerCase() === "clear"
          ) {
            document.querySelectorAll(".next__card--icon")[
              card.dataset.tab - 1
            ].innerHTML = nextDayIcons[0];
          }
          if (
            days[card.dataset.tab - 1].weather[0].main.toLowerCase() ===
            "clouds"
          ) {
            document.querySelectorAll(".next__card--icon")[
              card.dataset.tab - 1
            ].innerHTML = nextDayIcons[1];
          }
          if (
            days[card.dataset.tab - 1].weather[0].main.toLowerCase() === "rain"
          ) {
            document.querySelectorAll(".next__card--icon")[
              card.dataset.tab - 1
            ].innerHTML = nextDayIcons[2];
          }
        });
      } else {
        console.log("error");
        input.style.background = "#f5ac9f";
        input.value = "error";
        input.style.width = "100px";
      }
    });
};

typeD.forEach((t) =>
  t.addEventListener("click", function () {
    typeD.forEach((type) => type.classList.remove("active"));
    t.classList.add("active");
    weatherDisplay();
  })
);

form.addEventListener("submit", function (e) {
  e.preventDefault();

  //
  nextContainer.classList.add("undraw");
  currentContainer.classList.add("undraw");

  // load information

  setTimeout(weatherDisplay, 1000);

  setTimeout(() => {
    nextContainer.classList.remove("undraw");
    currentContainer.classList.remove("undraw");
  }, 2000);
});

input.addEventListener("click", () => {
  input.style.background = "none";
  input.style.width = "20px";
  input.value = "";
});
let current = 0;

input.addEventListener("keyup", function () {
  input.style.width = `${20 + input.value.length * 10}px`;
});

// loading animation
