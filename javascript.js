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
  let temperature = Math.round(response.data.main.temp);

  let degree = document.querySelector("#current-degree");
  degree.innerHTML = temperature;
  //console.log(response);
  lowDegree.innerHTML = Math.round(response.data.main.temp_min);
  highDegree.innerHTML = Math.round(response.data.main.temp_max);
  let description = document.querySelector("#weather-description");
  description.innerHTML = response.data.weather[0].description;
  let icon = document.querySelector("#weather-icon");
  window.city = document.querySelector("#city");

  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
  );
  if (flag !== "celsius") {
    flag = "celsius";
    toFahrenheit();
  }
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

function toFahrenheit(event) {
  if (!!event) {
    event.preventDefault();
  }

  if (flag !== "far") {
    currentDegree.innerHTML = Math.round(currentDegree.innerHTML * 1.8 + 32);
    lowDegree.innerHTML = Math.round(lowDegree.innerHTML * 1.8 + 32);
    highDegree.innerHTML = Math.round(highDegree.innerHTML * 1.8 + 32);
    flag = "far";
    flagChanged();
  }
}
function toCelsius(event) {
  if (!!event) {
    event.preventDefault();
  }

  if (flag !== "celsius") {
    currentDegree.innerHTML = Math.round(
      ((currentDegree.innerHTML - 32) * 5) / 9
    );
    lowDegree.innerHTML = Math.round(((lowDegree.innerHTML - 32) * 5) / 9);
    highDegree.innerHTML = Math.round(((highDegree.innerHTML - 32) * 5) / 9);
    flag = "celsius";
    flagChanged();
  }
}
let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", toCelsius);
let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", toFahrenheit);
let currentDegree = document.querySelector("#current-degree");
let flag = "celsius";
flagChanged();

function flagChanged() {
  if (flag === "celsius") {
    celsius.style.color = "darkgray";
    celsius.style.cursor = "default";
    fahrenheit.style.color = "blue";
    fahrenheit.style.cursor = "pointer";
  } else {
    celsius.style.color = "blue";
    celsius.style.cursor = "pointer";
    fahrenheit.style.color = "darkgray";
    fahrenheit.style.cursor = "default";
  }
}
//Current Location
let locationFlag = "";
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
