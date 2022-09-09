function currentTime() {
  let now = new Date();
  let time = document.querySelector("#current-time");
  let day = days[now.getDay()];
  let hour = now.getHours().toString().padStart(2, "0");
  let minute = now.getMinutes().toString().padStart(2, "0");

  return `${day} ${hour}:${minute}`;
}
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
time.innerHTML = currentTime();

function showTemp(response) {
  // console.log(response);
  celsiusTemp = Math.round(response.data.main.temp);

  let degree = document.querySelector("#current-degree");

  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = Math.round(response.data.wind.speed) + " m/s";
  degree.innerHTML = celsiusTemp;
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
  // console.log(response);
  getForecast(response.data.coord);
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
  let allForecasttemps = document.querySelectorAll(
    ".weather-forecast-temperature"
  );
  allForecasttemps.forEach(function (item, i) {
    item.querySelector(".weather-forecast-temp-min").innerHTML =
      Math.round(forecastTemps[i].min * 1.8 + 32) + "°";
    item.querySelector(".weather-forecast-temp-max").innerHTML =
      Math.round(forecastTemps[i].max * 1.8 + 32) + "°";
  });
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
  let allForecasttemps = document.querySelectorAll(
    ".weather-forecast-temperature"
  );
  allForecasttemps.forEach(function (item, i) {
    item.querySelector(".weather-forecast-temp-min").innerHTML =
      forecastTemps[i].min + "°";
    item.querySelector(".weather-forecast-temp-max").innerHTML =
      forecastTemps[i].max + "°";
  });
}

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", toCelsius);
let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", toFahrenheit);
let currentDegree = document.querySelector("#current-degree");
let celsiusTemp = "";

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

//5-DAY FORECAST
function getForecast(coordinate) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinate.lat}&lon=${coordinate.lon}&exclude=hourly,minutely&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
  axios.get(apiUrl).then(getCurrentDayMinMaxTemp);
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  return days[day];
}
function showForecast(response) {
  console.log(response);
  let forecast = document.querySelector("#forecast");
  let dailyForecast = response.data.daily;
  console.log(dailyForecast);
  let forecastHTML = "";
  dailyForecast.forEach(function (forecastDay, index) {
    if (index === 0) {
      lowCelsiusTemp = Math.round(forecastDay.temp.min);
      highCelsiusTemp = Math.round(forecastDay.temp.max);
      document.querySelector(".high-degree").innerHTML = highCelsiusTemp;
      document.querySelector(".low-degree").innerHTML = lowCelsiusTemp;
    } else if (index < 6) {
      let lowCelsiusForecastTemp = Math.round(forecastDay.temp.min);
      let highCelsiusForecastTemp = Math.round(forecastDay.temp.max);
      forecastTemps.push({
        min: lowCelsiusForecastTemp,
        max: highCelsiusForecastTemp,
      });
      forecastHTML += `<div class="col-2 forecast-details">
                    <div class="weather-forecast-date">${formatDay(
                      forecastDay.dt
                    )}</div>
                    <img
                      src="http://openweathermap.org/img/wn/${
                        forecastDay.weather[0].icon
                      }.png"
                      id="weather-icon"
                      alt=""
                      width="42px"
                    />
                    <div class="weather-forecast-temperature">
                      <span class="weather-forecast-temp-min">${lowCelsiusForecastTemp}°</span>
                      <span class="weather-forecast-temp-max">${highCelsiusForecastTemp}°</span>
                    </div>
                  </div>`;
    }
  });

  forecast.innerHTML = forecastHTML;
}
let lowCelsiusTemp = "";
let highCelsiusTemp = "";

let forecastTemps = [];
