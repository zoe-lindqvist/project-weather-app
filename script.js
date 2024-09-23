// Select DOM elements
const tempToday = document.getElementById("tempToday");
const cityName = document.getElementById("cityName");
const localTime = document.getElementById("localTime");
const weatherDescription = document.getElementById("weatherDescription");
const mainIcon = document.getElementById("mainIcon");
const sunriseText = document.getElementById("sunriseText");
const sunsetText = document.getElementById("sunsetText");

const inputField = document.getElementById("inputField");
const searchBtn = document.getElementById("searchBtn");
const searchMenuBtn = document.getElementById("searchMenuBtn");
const closeSearchMenu = document.getElementById("closeSearchMenu");
const searchToggler = document.getElementById("search-toggler");

const forecastContainer = document.getElementById("weatherForecast");

// Function to fetch current weather data based on city name
const fetchWeatherData = (city) => {
  const apiKey = "0c5116ff347d8ce8d78e8d3c18029dd7"; // Replace with your actual API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`City ${city} not found`);
      }
      return response.json();
    })
    .then((data) => {
      displayWeatherData(data);
    })
    .catch((error) => {
      alert(error.message);
    });
};

// Function to fetch weather forecast data based on city name
const fetchWeatherForecast = (city) => {
  const apiKey = "0c5116ff347d8ce8d78e8d3c18029dd7"; // Replace with your actual API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`City ${city} not found`);
      }
      return response.json();
    })
    .then((data) => {
      displayWeatherForecast(data);
    })
    .catch((error) => {
      alert(error.message);
    });
};

// Function to display fetched current weather data
const displayWeatherData = (data) => {
  tempToday.textContent = `${Math.round(data.main.temp)}°C`;
  cityName.textContent = data.name;
  weatherDescription.textContent = capitalizeFirstLetter(
    data.weather[0].description
  );

  // Correct calculation for local time using UTC and timezone offset
  const timezoneOffset = data.timezone; // Timezone offset in seconds
  const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000; // Current UTC time in milliseconds
  const localTimeDate = new Date(utcTime + timezoneOffset * 1000); // Local time of the city in milliseconds
  localTime.textContent = localTimeDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }); // Display local time in HH:MM format

  // Set weather icon
  const iconCode = data.weather[0].icon;
  mainIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${data.weather[0].description}" />`;

  // Set sunrise and sunset time without seconds
  const sunriseTime = new Date((data.sys.sunrise + data.timezone) * 1000);
  const sunsetTime = new Date((data.sys.sunset + data.timezone) * 1000);
  sunriseText.textContent = `Sunrise: ${sunriseTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  sunsetText.textContent = `Sunset: ${sunsetTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

// Function to display fetched weather forecast data
const displayWeatherForecast = (data) => {
  // Clear previous forecast data
  forecastContainer.innerHTML = "";

  // Filter forecast data to show only the forecast for 12:00 PM each day
  const forecastList = data.list.filter((forecast) =>
    forecast.dt_txt.includes("12:00:00")
  );

  // Display the forecast for the next 4 days
  forecastList.slice(0, 5).forEach((forecast) => {
    const date = new Date(forecast.dt_txt).toLocaleDateString(undefined, {
      weekday: "short",
    });
    const temp = `${Math.round(forecast.main.temp)}°C`;
    const windSpeed = `${forecast.wind.speed.toFixed(1)} m/s`;
    const iconCode = forecast.weather[0].icon;

    // Create a table row for each day's forecast
    const forecastRow = document.createElement("tr");
    forecastRow.innerHTML = `
      <td class="forecast-category">${date}</td>
      <td class="forecast-category icon">
        <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${forecast.weather[0].description}">
      </td>
      <td class="forecast-category">${temp}</td>
      <td class="forecast-category">${windSpeed}</td>
    `;
    forecastContainer.appendChild(forecastRow);
  });
};

// Function to capitalize the first letter of the description
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to toggle the search bar visibility
const toggleSearchBar = () => {
  searchToggler.classList.toggle("hidden");
  searchMenuBtn.classList.toggle("hidden");
  closeSearchMenu.classList.toggle("hidden");
};

// Event listener for the search button to fetch both current weather and forecast data
searchBtn.addEventListener("click", () => {
  const city = inputField.value.trim();
  if (city) {
    fetchWeatherData(city);
    fetchWeatherForecast(city);
    toggleSearchBar(); // Hide search bar after search
  } else {
    alert("Please enter a city name.");
  }
});

// Event listener to open the search bar
searchMenuBtn.addEventListener("click", () => {
  toggleSearchBar();
});

// Event listener to close the search bar
closeSearchMenu.addEventListener("click", () => {
  toggleSearchBar();
});

// Default weather data and forecast for a sample city
fetchWeatherData("Stockholm"); // Replace with a default city of your choice
fetchWeatherForecast("Stockholm"); // Replace with a default city of your choice
