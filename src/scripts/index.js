const city = document.body.querySelector('#city');


function displayTime() {
  const date = new Date();
  const dayOfWeek = date.toLocaleString('en-GB', { weekday: "long" });

  const hourAndMinute = date.toLocaleString('en-GB', {hour: '2-digit', minute: '2-digit'});

  const time = `${dayOfWeek}, ${hourAndMinute}`;
  const currentDate = document.body.querySelector("#current-date>strong");
  currentDate.innerText = time;
}

function displayWeather(response) {
  // console.log(response);
  const temp = Math.round(response.data.temperature.current);
  const cityName = response.data.city;
  const humidity = response.data.temperature.humidity;
  const windSpeed = response.data.wind.speed;
  const iconUrl = response.data.condition.icon_url;
  const description = response.data.condition.description;

  const currentTemp = document.body.querySelector("#current-temperature");
  const currentDescription = document.body.querySelector("#current-temperature-description");
  const currentIcon = document.body.querySelector("#current-temperature-icon");
  const currentHumidity = document.body.querySelector("#humidity>span");
  const currentWindSpeed = document.body.querySelector("#wind-speed>span");

  // const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const iconEl = document.createElement("img");
  iconEl.src = iconUrl;
  iconEl.classList.add("weather-icon");
  iconEl.alt = `${response.data.condition.icon} icon`;
  iconEl.style.width = "60px";

  const city = document.body.querySelector('#city');
  city.innerText = cityName;
  currentTemp.innerText = temp;
  currentDescription.innerText = description;
  currentIcon.innerHTML = '';
  currentIcon.appendChild(iconEl);

  currentHumidity.innerText = humidity;
  currentWindSpeed.innerText = windSpeed;
}

function getWeather(cityValue) {
  const apiKey = "be7of017954f4b25219t2327c4fa94c7";
  const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${cityValue}&key=${apiKey}&units=metric`;
  axios
    .get(`${apiUrl}`)
    .then(displayWeather)
    .catch(function (error) {
      console.log(error);
    });
}

function displayForecast(response) {
  // console.log(response.data.daily);
  const dailyForecast = response.data.daily;
  const blockForecastDays = document.body.querySelector('.weather-days');
  blockForecastDays.innerHTML = '';
  let forecastHTML = blockForecastDays.innerHTML;

  dailyForecast.forEach((d, idx) => {
    if (idx < 5) {
    const date = new Date(d.time * 1000);
    const day = date.toLocaleString('en-GB', { weekday: 'short', day: 'numeric' });

    forecastHTML += `<div class="weather-day col p-2 ps-3 align-self-end bg-light-subtle border-end border-dark-subtle shadow-sm" id='forecast-day-${idx}'>
      <h3 class="fs-5 fw-normal"> ${day}th</h3>
      <div class="row">
        <div class="col"><img src='${d.condition.icon_url}' alt='${d.condition.icon} icon' width='50'></div>
         <div class="col">
          <p class="fw-bold">${Math.round(d.temperature.maximum)}°</p>
          <p>${Math.round(d.temperature.minimum)}°</p>
        </div>
      </div>
    </div>`;
    }
  });

  blockForecastDays.innerHTML = forecastHTML;
}

function getForecast(cityValue) {
  const apiKey = "be7of017954f4b25219t2327c4fa94c7";
  const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${cityValue}&units=metric&key=${apiKey}`;

  axios
    .get(`${apiUrl}`)
    .then(displayForecast)
    .catch(function (error) {
      console.log(error);
    });

}

function displayHourlyForecast(response) {
  // console.log(response);
  const weatherDetails = document.querySelector('.weather-details');
  const forecast = response.data.list;
  weatherDetails.innerHTML = '';
  detailsHtml = weatherDetails.innerHTML;

  forecast.forEach((h, i) => {
    const date = new Date(h.dt * 1000);
    const time = date.toLocaleString('en-GB', {hour: '2-digit', minute: '2-digit'});
    const day = date.toLocaleString('en-GB', { weekday: 'short', day: 'numeric' });

    detailsHtml += `<div class="weather-hours col-1 border-end border-dark-subtle bg p-1">
      <h5 class="fw-normal text-secondary fs-6 text-center">
        <span class="fw-bold">${day}</span>
      </h5>
      <h4 class="fw-normal text-secondary fs-6 text-center">
        <span class="fw-bolder">${time}</span>
      </h4>
      <div class="row text-center">
        <div class="col-12">
          <img src='http://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png' alt='${h.weather[0].description} icon' width='30'>
        </div>
        <span class="col-12 mb-5">${Math.round(h.main.temp)}°</span>
        <span class="col-12"><i class="fa-solid fa-droplet"></i></span>
        <span class="col-12">${Math.round(h.main.humidity)}%</span>
      </div>
      </div>`;
  });

  weatherDetails.innerHTML = detailsHtml;
}

function getHourlyForecast(cityValue) {
  const apiKey = 'fc1413ef13107061f82b437eba029747';
  const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&appid=${apiKey}`;

  axios
    .get(`${geoApiUrl}`)
    .then((resp) => {
      const {lat, lon} = resp.data[0];
      const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=12&appid=${apiKey}&units=metric`;
      axios
        .get(apiUrl)
        .then(displayHourlyForecast);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function displayFullWeatherAndForecast(city) {
  getWeather(city);
  getForecast(city);
  getHourlyForecast(city);
}

function searchCity(event) {
  event.preventDefault();
  const searchInput = document.body.querySelector('#search');
  if (searchInput.value) {
    const value = searchInput.value.trim();
    displayFullWeatherAndForecast(value);
  }
  searchInput.value = "";
}

function showCurrentLocationWeather() {

  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const apiKey = "be7of017954f4b25219t2327c4fa94c7";
    const apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
    
    axios
      .get(`${apiUrl}`)
      .then((response) => displayFullWeatherAndForecast(response.data.city))
      .catch(function (error) {
        console.log(error);
      });
  });
}

const form = document.body.querySelector('#search-form');
form.addEventListener("submit", searchCity);

const locationBtn = document.body.querySelector('#location-btn');

locationBtn.addEventListener('click', showCurrentLocationWeather);

displayTime();
setInterval(displayTime, 60000);

displayFullWeatherAndForecast(city.innerText);