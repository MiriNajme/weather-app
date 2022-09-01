function currentTime() {
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let time = document.querySelector("#current-time");
  let day = days[now.getDay()];
  let hour = now.getHours().toString().padStart(2, "0");
  let minute = now.getMinutes().toString().padStart(2, "0");

  return `${day} ${hour}:${minute}`;
}

let time = document.querySelector("#current-time");
time.innerHTML = currentTime();

function showTemp(response) {
  console.log(response);
  celsiusTemp = Math.round(response.data.main.temp);

  let degree = document.querySelector("#current-degree");

  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = Math.round(response.data.wind.speed) + " m/s";
  degree.innerHTML = celsiusTemp;

  lowCelsiusTemp = Math.round(response.data.main.temp_min);
  lowDegree.innerHTML = lowCelsiusTemp;
  highCelsiusTemp = Math.round(response.data.main.temp_max);
  highDegree.innerHTML = highCelsiusTemp;
  let description = document.querySelector("#weather-description");
  description.innerHTML = response.data.weather[0].description;
  let icon = document.querySelector("#weather-icon");
  window.city = document.querySelector("#city");
  if (celsiusLink.className !== "clicked") {
    fahrenheitLink.classList.remove("clicked");
    celsiusLink.classList.add("clicked");
  }

  tempUnitHigh.innerHTML = "°C";
  tempUnitLow.innerHTML = "°C";
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
  );

  time.innerHTML = currentTime();
  if (locationFlag === "search") {
    city.innerHTML = response.data.name;
  }
}
let lowDegree = document.querySelector("span.low-degree");
let highDegree = document.querySelector("span.high-degree");
let form = document.querySelector("#weather-form");
let apiKey = "8b5dee79ecf0c909b3e67b3b6230efa2";
form.addEventListener("submit", function (event) {
  event.preventDefault();
  locationFlag = "search";
  let searchText = document.querySelector("#search-text");
  if (searchText.value) {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchText.value}&units=metric&APPID=${apiKey}`;
    axios.get(apiUrl).then(showTemp);
  }
});

//Changing Celsius to Fahrenheit and viceversa
let tempUnitHigh = document.querySelector("#temp-unit-high");
let tempUnitLow = document.querySelector("#temp-unit-low");

function toFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("clicked");
  fahrenheitLink.classList.add("clicked");
  currentDegree.innerHTML = Math.round(celsiusTemp * 1.8 + 32);
  lowDegree.innerHTML = Math.round(lowCelsiusTemp * 1.8 + 32);
  highDegree.innerHTML = Math.round(highCelsiusTemp * 1.8 + 32);
  tempUnitHigh.innerHTML = "°F";
  tempUnitLow.innerHTML = "°F";
}
function toCelsius(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("clicked");
  celsiusLink.classList.add("clicked");
  currentDegree.innerHTML = celsiusTemp;
  lowDegree.innerHTML = lowCelsiusTemp;
  highDegree.innerHTML = highCelsiusTemp;
  tempUnitHigh.innerHTML = "°C";
  tempUnitLow.innerHTML = "°C";
}

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", toCelsius);
let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", toFahrenheit);
let currentDegree = document.querySelector("#current-degree");
let celsiusTemp = "";
let lowCelsiusTemp = "";
let highCelsiusTemp = "";

//Current Location
let locationFlag = "";
getCurrentPosition(); //To have the current position's temperature onload
function getCity(response) {
  city.innerHTML = response.data[0].name;
}

function retrievePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "8b5dee79ecf0c909b3e67b3b6230efa2";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  let reverseUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&APPID=${apiKey}`;

  axios.get(reverseUrl).then(getCity);
  axios.get(url).then(showTemp);

  let searchText = document.querySelector("#search-text");
  searchText.value = "";
  time.innerHTML = currentTime();
}
function getCurrentPosition(event) {
  locationFlag = "current";
  navigator.geolocation.getCurrentPosition(retrievePosition);
}
let currentLocationElement = document.querySelector("#current-location-btn");
currentLocationElement.addEventListener("click", getCurrentPosition);
