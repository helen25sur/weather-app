document.addEventListener('DOMContentLoaded', () => {
  const week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const date = new Date();
  const dayOfWeek = date.getDay();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const time = `${week[dayOfWeek]}, ${hour}:${minute}`;
  const currentDate = document.body.querySelector("#current-date>strong");
  currentDate.innerText = time;
})

function searchCity(event) {
  event.preventDefault();
  const searchInput = document.body.querySelector('#search');
  const city = document.body.querySelector('#city');
  if (searchInput.value) {
    city.innerText = searchInput.value.trim();
  }
  searchInput.value = "";
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