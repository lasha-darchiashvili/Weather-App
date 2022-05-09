//API key
const info = {
  key: "a8c1e0c836ff4e9693b04222220405",
};

//selectors
const form = document.querySelector("form");
const cities = document.querySelectorAll(".citt");

//displaying city after loading a page
fetchCityData("Tbilisi");

// eventListener on submit button, after submitting city data is written on the page
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const input = document.querySelector(".search");

  // fetching data and drawing on the table
  fetchCityData(input.value.trim());

  //reseting input value
  input.value = "";
});

// adding eventlistener for each city in navbar and then feching data and drawing on page
cities.forEach((city) =>
  city.addEventListener("click", function (e) {
    e.preventDefault();
    fetchCityData(city.innerText);
  })
);

// fetching data function which was used above for fetching and drawing data
function fetchCityData(city) {
  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${info.key}&q=${city}&days=8&aqi=no&alerts=no`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => showCity(data))
    .catch((err) => activatePopup()); // if error, popup activates
}

// showCity function takes API data and draws data on the page
function showCity(ctdata) {
  // selectors for current weather box
  const city = document.querySelector(".city");
  const displayDate = document.querySelector(".date");
  const temp = document.querySelector(".temp");
  const type = document.querySelector(".type");
  const humidity = document.querySelector(".humidity");
  const logo = document.querySelector(".logo");

  //setting city name in current weather box
  city.innerText = ctdata.location.name;

  //setting todays date in current weather box, formatDate formats current date in beautiful shape
  let today = new Date();
  displayDate.innerText = formatDate(today);

  // setting temperature in current weather box
  temp.innerHTML = `${Math.round(
    ctdata.current.feelslike_c
  )}<span> &#8451</span>`;

  //setting condition in current weather box
  type.innerText = ctdata.current.condition.text;

  //setting humidity in current weather box
  humidity.innerHTML = `Humidity - ${ctdata.current.humidity}%`;

  //setting weather type in current weather box
  let weatherType = ctdata.current.condition.text.toLowerCase();

  //setting weather icon in current weather box
  let icon = ctdata.current.condition.icon;
  logo.setAttribute("src", icon);

  // this selector takes all 3 forecast box
  const dayBoxes = document.querySelectorAll(".day");

  // for each forecast drawing data on page
  dayBoxes.forEach((dayBox, index) => {
    //taking forecast date from API data
    let date = new Date(ctdata.forecast.forecastday[index].date);
    //taking weekday from date
    let day = date.getDay();
    //taking weekday from "days" object, based on day variable and then setting that day in forecast weather box
    dayBox.querySelector(".weekday").innerText = days[day];

    // setting weather type in forecast weather box
    let weatherType =
      ctdata.forecast.forecastday[index].day.condition.text.toLowerCase();

    //setting icon in forecast weather box
    let icon = ctdata.forecast.forecastday[index].day.condition.icon;
    dayBox.querySelector(".dailylogo").setAttribute("src", icon);

    //setting temperature in forecast weather box
    dayBox.querySelector(".daytemp").innerHTML = `${Math.round(
      ctdata.forecast.forecastday[index].day.avgtemp_c
    )}<span> &#8451</span>`;
  });
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "thursday",
  "Friday",
  "Saturday",
];

//formats current date like this "Sunday 4 May 2020"
function formatDate(DateToF) {
  let day = DateToF.getDay();
  let date = DateToF.getDate();
  let month = DateToF.getMonth();
  let year = DateToF.getFullYear();

  return `${days[day]} ${date} ${months[month]} ${year}`;
}

// error popup activation function
function activatePopup() {
  const popup = document.querySelector(".popup");
  const overlay = document.querySelector(".overlay");

  popup.style.display = "block";
  overlay.classList.add("active");

  const close = document.querySelector(".close-popup");

  close.addEventListener("click", function () {
    popup.style.display = "none";
    overlay.classList.remove("active");
  });
}
