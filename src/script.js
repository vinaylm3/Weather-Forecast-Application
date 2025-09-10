// Populate the dropdown when the page loads
document.addEventListener('DOMContentLoaded', populateHistoryDropdown);

// Get references to DOM elements
const searchCityBtn = document.getElementById('search-city-btn');
const useCurrentLocationBtn = document.getElementById('use-current-location-btn');
const searchCityInput = document.getElementById('city-input')
const historyDropDown = document.getElementById('history-drop-down');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastHeader = document.getElementById('forecast');
const forecastDiv = document.getElementById('forecast-container');
const overlay = document.getElementById("popup-overlay");
const closeBtn = document.getElementById("close-popup");
const popupMessage = document.getElementById("popup-message");

// Initial references for temperature conversion
let currentWeatherCard = document.getElementById('current-weather-card');
let currentTempP = document.getElementById('current-temp');
let feelsLikeTempP = document.getElementById('feels-like-temp');

// Toggle Button for Temperature Units
let toggleBtn = document.getElementById('toggleBtn');
let toggleCircle = document.getElementById('toggleCircle');
let isOn = false;

// Event listener for toggle button
toggleBtn.addEventListener("click", toggleTemperatureUnits);

// Event listener for history dropdown selection
historyDropDown.addEventListener("change", historyOptionSelected);

// Close popup when clicking the close button
closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
});

// Close when clicking outside the popup
overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
    overlay.classList.add("hidden");
    }
});

// Event listener for using search button
searchCityBtn.addEventListener("click", () => {
    let city = document.getElementById('city-input').value.trim();
    if (!city) {
        // alert('Please enter a city name.');
        popupMessage.innerHTML = "Please enter a city name.";
        overlay.classList.remove("hidden");
        return;
    }
    else {
        console.log(`Searching weather for city : ${city}`);
        // Add functionality to fetch and display weather for the entered city
        city = convertToPascalCase(city);
        // console.log(`Converted city name to Pascal Case: ${city}`);
        fetchData(city);
        fetchForecastData(city);
        searchCityInput.value = ''; // Clear input field after search
    }
})

// Event listener for using current location button
useCurrentLocationBtn.addEventListener("click", () => {
    console.log('Fetching weather for current location');
    // Add functionality to fetch and display weather for the current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            // Fetch weather data using latitude and longitude
            fetchDataByCoords(latitude, longitude);
            fetchForecastDataByCoords(latitude, longitude);
        }, (error) => {
            console.error('Error fetching location:', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
})

// Function to fetch weather data from OpenWeatherMap API
async function fetchData(city) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=cc8a426c15f687049c1626d5f6b41409&units=metric`);
    if (!response.ok) {
        // alert('City not found. Please enter a valid city name.');
        popupMessage.innerHTML = "City not found.<br>Please enter a valid city name.";
        overlay.classList.remove("hidden");
        return;
    }
    let data = await response.json();
    console.log(data);
    updateCurrentWeatherUI(data);
    addToHistory(city);
}

// Function to fetch weather data using coordinates
async function fetchDataByCoords(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cc8a426c15f687049c1626d5f6b41409&units=metric`);
    let data = await response.json();
    console.log(data);
    updateCurrentWeatherUI(data)
}

// Function to fetch 5-day forecast data from OpenWeatherMap API
async function fetchForecastData(city) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=cc8a426c15f687049c1626d5f6b41409&units=metric`);
    let data = await response.json();
    console.log(data);
    updateForecastUI(data)
}

// Function to fetch forecast data using coordinates
async function fetchForecastDataByCoords(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=cc8a426c15f687049c1626d5f6b41409&units=metric`);
    let data = await response.json();
    console.log(data);
    updateForecastUI(data)
}

// Function to handle selection from history dropdown
function historyOptionSelected() {
    let selectedCity = historyDropDown.value;
    if (selectedCity) {
        console.log(`Selected city from history: ${selectedCity}`);
        fetchData(selectedCity);
        fetchForecastData(selectedCity);
        searchCityInput.value = ''; // Clear input field after search
    }
}

// Function to toggle temperature units
function toggleTemperatureUnits() {
    isOn = !isOn;
    if (isOn) {
        toggleCircle.classList.add('translate-x-10');
        toggleCircle.innerHTML = "&deg;F";
        updateToFahrenheit();
    } else {
        toggleCircle.classList.remove('translate-x-10');
        toggleCircle.innerHTML = "&deg;C";
        updateToCelsius();
    }
}

// Function to add a new item to the history
function addToHistory(city) {
    let history = JSON.parse(localStorage.getItem('dropdownHistory')) || [];
    // Avoid duplicates
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
    // Add the new item to the beginning of the array (most recent first)
    history.unshift(city);
    // Limit the history to a certain number of items (e.g., 10)
    history = history.slice(0, 10);
    localStorage.setItem('dropdownHistory', JSON.stringify(history));
    populateHistoryDropdown();
}

// Function to populate the dropdown with history
function populateHistoryDropdown() {
    historyDropDown.innerHTML = ''; // Clear existing options

    let history = JSON.parse(localStorage.getItem('dropdownHistory')) || [];

    if (history.length === 0) {
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'No history available';
        defaultOption.value = '';
        historyDropDown.appendChild(defaultOption);
    } else {
        history.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item;
            option.value = item;
            historyDropDown.appendChild(option);
        });
    }
}

// Function to update the current weather UI
function updateCurrentWeatherUI(data) {
    currentWeatherDiv.innerHTML = ''; // Clear previous current weather data
    // Update the current weather section with fetched data
    currentWeatherDiv.innerHTML = `
        <div id="current-weather-card"
            class="flex flex-col mt-3 ml-6 mr-6 mb-6 items-center justify-between border-black pl-4 pr-4 pb-4 rounded-4xl shadow-2xl shadow-black bg-gray-800">
            <div class="flex justify-center relative mb-2">
                <img src=${updateWeatherIcon(data.weather[0].description)} alt="${data.weather[0].description} icon"
                    class="w-30 h-30" />
                <p class="absolute bottom-0">${convertToPascalCase(data.weather[0].description)}</p>
            </div>
            <div class="flex flex-col gap-4 justify-center items-center">
                <h3 class="text-2xl">${data.name}</h3>
                <p id="current-temp" class="text-3xl">${data.main.temp} &deg;C</p>
                <p id="feels-like-temp">Feels Like : ${data.main.feels_like} &deg;C</p>
                <!-- Toggle Button -->
                <button id="toggleBtn"
                    class="relative inline-flex items-center w-20 h-10 px-1 transition bg-gray-700 rounded-full focus:outline-none">
                    <span id="toggleCircle"
                        class="flex items-center justify-center w-8 h-8 text-sm font-bold text-gray-700 transition transform bg-white rounded-full">
                        &deg;C
                    </span>
                </button>
                <div class="flex gap-16 mt-4">
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-4 items-center">
                            <i class="fa-solid fa-water fa-2xl" style="color: #ffffff"></i>
                            <p>${data.main.humidity} %</p>
                        </div>
                        <p class="text-center">Humidity</p>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-4 items-center">
                            <i class="fa-solid fa-wind fa-2xl" style="color: #ffffff"></i>
                            <p>${data.wind.speed} m/sec</p>
                        </div>
                        <p class="text-center">Wind Speed</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    reassignTempAndButtons();
}

// Function to reassign temperature elements and buttons after updating the UI
function reassignTempAndButtons() {
    currentWeatherCard = document.getElementById('current-weather-card');
    currentTempP = document.getElementById('current-temp');
    feelsLikeTempP = document.getElementById('feels-like-temp');
    toggleBtn = document.getElementById('toggleBtn');
    toggleCircle = document.getElementById('toggleCircle');
    isOn = false;
    toggleBtn.addEventListener('click', toggleTemperatureUnits);
}

// Function to update the forecast UI
function updateForecastUI(data) {
    forecastHeader.classList.remove('hidden');
    forecastDiv.innerHTML = ''; // Clear previous forecast data
    // Update the forecast section with fetched data
    for (let i=5; i<data.list.length; i+=8) {
        const newforecast = document.createElement('div');
        newforecast.innerHTML = `
            <div class="flex m-2 pl-4 pr-4 pb-4 items-center justify-between border-black rounded-4xl shadow-2xl shadow-black bg-gray-800">
                <div class="flex flex-col gap-2 mt-4">
                    <h3><i class="fa-solid fa-calendar fa-lg mr-4" style="color: #ffffff;"></i>${data.list[i].dt_txt.split(' ')[0]}</h3>
                    <p><i class="fa-solid fa-temperature-high fa-lg mr-4" style="color: #ffffff;"></i>${data.list[i].main.temp} &deg;C</p>
                    <p><i class="fa-solid fa-water fa-lg mr-4" style="color: #ffffff;"></i>${data.list[i].main.humidity} %</p>
                    <p><i class="fa-solid fa-wind fa-lg mr-4" style="color: #ffffff;"></i>${data.list[i].wind.speed} m/sec</p>
                </div>
                <div class="flex justify-center relative">
                    <img src=${updateWeatherIcon(data.list[i].weather[0].description)} alt="${data.list[i].weather[0].description} icon" class="w-30 h-30" />
                    <p class="absolute bottom-0">${convertToPascalCase(data.list[i].weather[0].description)}</p>
                </div>
            </div>
        `;
        const forecastcard = newforecast.querySelector('div');
        if (data.list[i].weather[0].description.includes('rain') || data.list[i].weather[0].description.includes('drizzle') || data.list[i].weather[0].description.includes('thunderstorm'))
        {
            forecastcard.classList.add("bg-[url('img/rain-background.jpeg')]", "bg-cover", "bg-center");
        }
        forecastDiv.appendChild(newforecast);
    }
}

// Function to update weather icon based on description
function updateWeatherIcon(description) {
    switch(description) {
        case 'clear sky':
            return "https://openweathermap.org/img/wn/01d@2x.png";
        case 'few clouds':
            return "https://openweathermap.org/img/wn/02d@2x.png";
        case 'scattered clouds':
            return "https://openweathermap.org/img/wn/03d@2x.png";
        case 'broken clouds':
        case 'overcast clouds':
            return "https://openweathermap.org/img/wn/04d@2x.png";
        case 'shower rain':
        case 'light intensity shower rain':
        case 'heavy intensity shower rain':
        case 'ragged shower rain':
        case 'light intensity drizzle':
        case 'drizzle':
        case 'heavy intensity drizzle':
        case 'light intensity drizzle rain':
        case 'drizzle rain':
        case 'heavy intensity drizzle rain':
        case 'shower rain and drizzle':
        case 'heavy shower rain and drizzle':
        case 'shower drizzle':
            currentWeatherCard.classList.add("bg-[url('img/rain-background.jpeg')]", "bg-cover", "bg-center");
            return "https://openweathermap.org/img/wn/09d@2x.png";
        case 'light rain':
        case 'moderate rain':
        case 'heavy intensity rain':
        case 'very heavy rain':
        case 'extreme rain':
            currentWeatherCard.classList.add("bg-[url('img/rain-background.jpeg')]", "bg-cover", "bg-center");
            return "https://openweathermap.org/img/wn/10d@2x.png";
        case 'thunderstorm with light rain':
        case 'thunderstorm with rain':
        case 'thunderstorm with heavy rain':
        case 'light thunderstorm':
        case 'thunderstorm':
        case 'heavy thunderstorm':
        case 'ragged thunderstorm':
        case 'thunderstorm with light drizzle':
        case 'thunderstorm with drizzle':
        case 'thunderstorm with heavy drizzle':
            currentWeatherCard.classList.add("bg-[url('img/rain-background.jpeg')]", "bg-cover", "bg-center");
            return "https://openweathermap.org/img/wn/11d@2x.png";
        case 'light snow':
        case 'snow':
        case 'heavy snow':
        case 'sleet':
        case 'light shower sleet':
        case 'shower sleet':
        case 'light rain and snow':
        case 'rain and snow':
        case 'light shower snow':
        case 'shower snow':
        case 'heavy shower snow':
        case 'freezing rain':
            return "https://openweathermap.org/img/wn/13d@2x.png";
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'sand/dust whirls':
        case 'fog':
        case 'sand':
        case 'dust':
        case 'volcanic ash':
        case 'squalls':
        case 'tornado':
            return "https://openweathermap.org/img/wn/50d@2x.png";
        default:
            console.log('Weather icon not found, returning few clouds icon.');
            return "https://openweathermap.org/img/wn/02d@2x.png"; // Default icon
    }
}

// Function to update temperature to Fahrenheit
function updateToFahrenheit(){
    console.log('Converting to Fahrenheit');
    if (currentTempP.innerHTML === '-- &deg;C') {
        currentTempP.innerHTML = '-- &deg;F';
    }
    else {
        let currentTempC = parseFloat(currentTempP.textContent);
        let currentTempF = convertToFahrenheit(currentTempC);
        currentTempP.innerHTML = `${currentTempF} &deg;F`;

        let feelsLikeTempC = parseFloat(feelsLikeTempP.textContent.split(':')[1]);
        let feelsLikeTempF = convertToFahrenheit(currentTempC);
        feelsLikeTempP.innerHTML = `Feels Like : ${feelsLikeTempF} &deg;F`;
    }
}

// Function to update temperature to Celsius
function updateToCelsius() {
    console.log('Converting to Celsius');
    if (currentTempP.innerHTML === '-- &deg;F') {
        currentTempP.innerHTML = '-- &deg;C';
    }
    else {
        let currentTempF = parseFloat(currentTempP.textContent);
        let currentTempC = convertToCelsius(currentTempF);
        currentTempP.innerHTML = `${currentTempC} &deg;C`;

        let feelsLikeTempF = parseFloat(feelsLikeTempP.textContent.split(':')[1]);
        let feelsLikeTempC = convertToCelsius(currentTempF);
        feelsLikeTempP.innerHTML = `Feels Like : ${feelsLikeTempC} &deg;C`;
    }
}

// Function to convert temperature to Fahrenheit
function convertToFahrenheit(temp) {
    return ((temp * 9/5) + 32).toFixed(2);
}

// Function to convert temperature to Celsius
function convertToCelsius(temp) {
    return ((temp - 32) * 5/9).toFixed(2);
}

// Function to convert city name to Pascal Case
function convertToPascalCase(text) {
    return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}