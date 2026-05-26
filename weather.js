
let btn = document.getElementById("getWeather");

btn.addEventListener("click", async function () {
  let city = document.getElementById("cityInput").value.trim();

  if (city === "") {
    alert("Please Enter a City");
    return;
  }

  let res = await fetch(`/api/weather?city=${city}`);
  let data = await res.json();

  let weather = data.weather;
  let forecast = data.forecast;

  // ❗ check error
  if (weather.cod !== 200) {
    alert(weather.message);
    return;
  }

  renderCities();

  let condition = weather.weather[0].main;

  document.getElementById("city").innerText = weather.name;

  document.getElementById("temp").innerText =
    weather.main.temp.toFixed(1) + "°C";

  document.getElementById("condition").innerText = "Condition: " + condition;

  document.getElementById("icon").innerHTML = getWeatherIcon(condition);

  document.getElementById("humidity").innerText = weather.main.humidity + "%";

  document.getElementById("visibility").innerText =
    (weather.visibility / 1000).toFixed(1) + " km";

  document.getElementById("wind").innerText =
    (weather.wind.speed * 3.6).toFixed(1) + " km/h";

  setWeatherBackground(condition);

  // ✅ forecast from backend
  renderForecast(forecast);
  renderHourlyForecast(forecast);
});

let saveBtn = document.getElementById("saveCity");

saveBtn.addEventListener("click", async function () {
  let city = document.getElementById("city").innerText;

  if (!city) {
    alert("No city to save");
    return;
  }

let res = await fetch("/api/saveCity", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ city }),
});

if (!res.ok) {
  alert("Failed to save city");
  return;
}

  renderCities(); // refresh list
});

// ✅ OUTSIDE (IMPORTANT)
async function renderCities() {
  let res = await fetch("/api/getCities");

  if (!res.ok) {
    console.log("Server error while fetching cities");
    return; // stop crash
  }

  let data = await res.json();

  let list = document.getElementById("history");
  list.innerHTML = "";

  data.forEach((item) => {
    let div = document.createElement("div");
    div.className = "history-card";

    div.innerHTML = `
      <span onclick="loadCity('${item.city}')">
        <i class="fa-solid fa-location-dot"></i> ${item.city}
      </span>
      <button onclick="deleteCity('${item.city}')">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    list.appendChild(div);
  });
}

async function loadCity(city) {
  document.getElementById("cityInput").value = city;

  let res = await fetch(`/api/weather?city=${city}`);
  let data = await res.json();

  let weather = data.weather;
  let forecast = data.forecast;

  if (weather.cod !== 200) {
    alert(weather.message);
    return;
  }

  let condition = weather.weather[0].main;

  document.getElementById("city").innerText = weather.name;
  document.getElementById("temp").innerText = weather.main.temp.toFixed(1) + "°C";

  document.getElementById("condition").innerText = "Condition: " + condition;

  document.getElementById("icon").innerHTML = getWeatherIcon(condition);

  document.getElementById("humidity").innerText = weather.main.humidity + "%";

  document.getElementById("visibility").innerText =
    (weather.visibility / 1000).toFixed(1) + " km";

  document.getElementById("wind").innerText =
    (weather.wind.speed * 3.6).toFixed(1) + " km/h";

  setWeatherBackground(condition);

  renderForecast(forecast);
  renderHourlyForecast(forecast);
}

// Delete Cities
async function deleteCity(city) {
  await fetch("/api/deleteCity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ city }),
  });

  renderCities(); // refresh UI
}

// Get Weather Icons
function getWeatherIcon(condition) {
  if (condition === "Clear") {
    return `<i class="fa-solid fa-sun sun"></i>`;
  } else if (condition === "Clouds") {
    return `<i class="fa-solid fa-cloud clouds"></i>`;
  } else if (condition === "Rain") {
    return `<i class="fa-solid fa-cloud-rain rain"></i>`;
  } else if (condition === "Mist" || condition === "Fog") {
    return `<i class="fa-solid fa-smog mist"></i>`;
  } else if (condition === "Haze" || condition === "Smoke") {
    return `<i class="fa-solid fa-smog haze"></i>`;
  } else {
    return `<i class="fa-solid fa-globe"></i>`;
  }
}

// ✅ Load on start
renderCities();

// Renders Forecast Data
function renderForecast(data) {
  let box = document.getElementById("forecast");
  box.innerHTML = "";

  for (let i = 0; i < data.list.length; i += 8) {
    let day = data.list[i];

    let div = document.createElement("div");
    div.className = "forecast-card";

    let date = new Date(day.dt * 1000);
    let dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    div.innerHTML = `
      <h4>${dayName}</h4>
      <div class="icon">${getWeatherIcon(day.weather[0].main)}</div>
      <p>${day.main.temp.toFixed(1)}°C</p>
      <small>${day.weather[0].main}</small>
    `;

    box.appendChild(div);
  }
}

function setWeatherBackground(condition) {
  let body = document.body;

  // Remove all previous classes
  body.classList.remove(
    "sunny-bg",
    "cloudy-bg",
    "rainy-bg",
    "mist-bg",
    "thunder-bg",
    "default-bg",
  );

  if (condition === "Clear") {
    body.classList.add("sunny-bg");
  } else if (condition === "Clouds") {
    body.classList.add("cloudy-bg");
  } else if (condition === "Rain") {
    body.classList.add("rainy-bg");
  } else if (condition === "Thunderstorm") {
    body.classList.add("thunder-bg");
  } else if (
    condition === "Mist" ||
    condition === "Fog" ||
    condition === "Haze" ||
    condition === "Smoke"
  ) {
    body.classList.add("mist-bg");
  } else {
    body.classList.add("default-bg");
  }
}

function getUserLocationWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async function (position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      console.log("Accurate coords:", lat, lon);

      // 🌤️ CURRENT WEATHER
      let res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      let data = await res.json();

      let weather = data.weather;
      let forecast = data.forecast;

      // ✅ Correct check
      if (weather.cod !== 200) {
        alert(weather.message);
        return;
      }

      let condition = weather.weather[0].main;

      // ✅ Use city name directly
      let cityName = weather.name;

      document.getElementById("city").innerText = cityName;

      document.getElementById("temp").innerText =
        weather.main.temp.toFixed(1) + "°C";

      document.getElementById("condition").innerText =
        "Condition: " + condition;

      document.getElementById("icon").innerHTML = getWeatherIcon(condition);

      document.getElementById("humidity").innerText =
        weather.main.humidity + "%";

      document.getElementById("visibility").innerText =
        (weather.visibility / 1000).toFixed(1) + " km";

      document.getElementById("wind").innerText =
        (weather.wind.speed * 3.6).toFixed(1) + " km/h";

      // 🌈 Background
      setWeatherBackground(condition);

      // 📅 FORECAST
      renderForecast(forecast);
      renderHourlyForecast(forecast);

      // ✅ Max / Min from next 24 hours
      let temps = forecast.list.slice(0, 8).map((item) => item.main.temp);

      let max = Math.max(...temps);
      let min = Math.min(...temps);

      document.getElementById("tempRange").innerText =
        `${max.toFixed(1)}°C / ${min.toFixed(1)}°C`;
    },

    function (error) {
      console.log(error);

      if (error.code === 1) {
        alert("Permission denied. Please allow location access.");
      } else if (error.code === 2) {
        alert("Location unavailable.");
      } else if (error.code === 3) {
        alert("Location request timed out.");
      } else {
        alert("Unknown error occurred.");
      }
    },

    // 🔥 THIS PART MAKES IT MORE ACCURATE
    {
      enableHighAccuracy: true, // 👈 VERY IMPORTANT
      timeout: 10000, // wait up to 10 sec
      maximumAge: 0, // no cached location
    },
  );
}

getUserLocationWeather();

function renderHourlyForecast(data) {
  let box = document.getElementById("hourly");
  box.innerHTML = "";

  let now = new Date();

  let closestIndex = 0;
  let minDiff = Infinity;

  // Find closest forecast time
  for (let i = 0; i < data.list.length; i++) {
    let forecastTime = new Date(data.list[i].dt * 1000);
    let diff = Math.abs(forecastTime - now);

    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }
  let currentHour = now.getHours();

  for (let i = 0; i < 8; i++) {
    let hour = data.list[closestIndex + i];
    let time = new Date(hour.dt * 1000);

    let isNow = i === closestIndex;

    let hourTime = isNow
      ? "Now"
      : time
          .toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
          })
          .replace(":00", "");

    let div = document.createElement("div");
    div.className = "hour-card";

    if (isNow) {
      div.classList.add("active-hour");
    }

    div.innerHTML = `
    <p>${hourTime}</p>
    <div>${getWeatherIcon(hour.weather[0].main)}</div>
    <p>${hour.main.temp.toFixed(1)}°C</p>
  `;

    box.appendChild(div);
  }
}
