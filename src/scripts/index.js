const city = document.body.querySelector('#city');


function displayTime() {

  const date = new Date();
  const dayOfWeek = date.toLocaleString('en-GB', { weekday: "long" });
  const hour = date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours();
  const minute = date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes();

  const time = `${dayOfWeek}, ${hour}:${minute}`;
  const currentDate = document.body.querySelector("#current-date>strong");
  currentDate.innerText = time;
}

function displayWeather(response) {
  console.log(response);
  const temp = Math.round(response.data.main.temp);
  const cityName = response.data.name;
  const humidity = response.data.main.humidity;
  const windSpeed = response.data.wind.speed;
  const iconCode = response.data.weather[0].icon;
  city.innerText = cityName;

  const currentTemp = document.body.querySelector("#current-temperature");
  const currentDescription = document.body.querySelector("#current-temperature-description");
  const currentIcon = document.body.querySelector("#current-temperature-icon");
  const currentHumidity = document.body.querySelector("#humidity>span");
  const currentWindSpeed = document.body.querySelector("#wind-speed>span");

  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const iconEl = document.createElement("img");
  iconEl.src = iconUrl;
  iconEl.classList.add("weather-icon");
  iconEl.alt = "weather icon";
  iconEl.style.width = "60px";

  console.log(iconCode, iconUrl);
  currentTemp.innerText = temp;
  currentDescription.innerText = response.data.weather[0].description;
  currentIcon.innerHTML = '';
  currentIcon.appendChild(iconEl);

  currentHumidity.innerText = humidity;
  currentWindSpeed.innerText = windSpeed;

  console.log(currentTemp, temp);
}

function getWeather(cityValue) {
  const apiKey = "fc1413ef13107061f82b437eba029747";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=metric`;
  axios
    .get(`${apiUrl}`)
    .then(displayWeather)
    .catch(function (error) {
      console.log(error);
    });
}

function searchCity(event) {
  event.preventDefault();
  const searchInput = document.body.querySelector('#search');
  if (searchInput.value) {
    getWeather(searchInput.value.trim());
  }
  searchInput.value = "";
}

function showCurrentLocationWeather() {

  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const apiKey = "fc1413ef13107061f82b437eba029747";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    axios
      .get(`${apiUrl}`)
      .then(displayWeather)
      .catch(function (error) {
        console.log(error);
      });
  });
}

const form = document.body.querySelector('#search-form');
form.addEventListener("submit", searchCity);

function convert(event) {
  event.preventDefault();
  const currentTemp = document.body.querySelector("#current-temperature");

  if (event.target.id === "celsius" && !currentTemp.classList.contains('temp-celsius')) {
    const currentTempValue = +currentTemp.innerText;
    const celsiusValue = Math.round((currentTempValue - 32) * 0.5556);
    currentTemp.innerText = celsiusValue;
    currentTemp.classList.remove('temp-fahrenheit');
    currentTemp.classList.add('temp-celsius');

  } else if (event.target.id === "fahrenheit" && !currentTemp.classList.contains('temp-fahrenheit')) {
    const currentTempValue = +currentTemp.innerText;
    const fahrenheitValue = Math.round((currentTempValue * 1.8) + 32);
    currentTemp.innerText = fahrenheitValue;
    currentTemp.classList.remove('temp-celsius');
    currentTemp.classList.add('temp-fahrenheit');
  }
}

const celsius = document.body.querySelector('#celsius');
const fahrenheit = document.body.querySelector('#fahrenheit');
celsius.addEventListener('click', convert);
fahrenheit.addEventListener('click', convert);

const locationBtn = document.body.querySelector('#location-btn');

locationBtn.addEventListener('click', showCurrentLocationWeather);

displayTime();
setInterval(displayTime, 60000);

getWeather(city.innerText, city);