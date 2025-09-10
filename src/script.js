const searchCityBtn = document.getElementById('search-city-btn');
const useCurrentLocationBtn = document.getElementById('use-current-location-btn');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastHeader = document.getElementById('forecast');
const forecastDiv = document.getElementById('forecast-container');

let convertToFahrenheitBtn = document.getElementById('convert-to-fahrenheit');
let convertToCelsiusBtn = document.getElementById('convert-to-celsius');
let currentTempP = document.getElementById('current-temp');

convertToFahrenheitBtn.addEventListener('click', convertToFahrenheit);
convertToCelsiusBtn.addEventListener('click', convertToCelsius);

searchCityBtn.addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    console.log(`Searching weather for city: ${city}`);
    // Add functionality to fetch and display weather for the entered city
    fetchData(city);
    fetchForecastData(city);
})

useCurrentLocationBtn.addEventListener('click', () => {
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

async function fetchData(city) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=cc8a426c15f687049c1626d5f6b41409&units=metric`);
    let data = await response.json();
    console.log(data);
    updateCurrentWeatherUI(data)
}

async function fetchDataByCoords(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cc8a426c15f687049c1626d5f6b41409&units=metric`);
    let data = await response.json();
    console.log(data);
    updateCurrentWeatherUI(data)
}

async function fetchForecastData(city) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=cc8a426c15f687049c1626d5f6b41409&units=metric`);
    let data = await response.json();
    console.log(data);
    updateForecastUI(data)
}

async function fetchForecastDataByCoords(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=cc8a426c15f687049c1626d5f6b41409&units=metric`);
    let data = await response.json();
    console.log(data);
    updateForecastUI(data)
}

function updateCurrentWeatherUI(data) {
    currentWeatherDiv.innerHTML = ''; // Clear previous current weather data
    // Update the current weather section with fetched data
    currentWeatherDiv.innerHTML = `
        <div class="flex flex-col m-6 items-center justify-between border-black p-4 rounded-4xl shadow-2xl shadow-black bg-gray-800">
            <img src=${updateWeatherIcon(data.weather[0].description)} alt="${data.weather[0].description} icon" class="w-30 h-30">
            <div class="flex flex-col gap-4">
                <h3 class="text-center text-2xl">${data.name}</h3>
                <p id="current-temp" class="text-center text-3xl">${data.main.temp} °C</p>
                <button id="convert-to-fahrenheit" class="bg-white text-black pl-4 pr-4 p-2 rounded-4xl">Convert to Fahrenheit (°F)</button>
                <button id="convert-to-celsius" class="bg-white text-black pl-4 pr-4 p-2 rounded-4xl hidden">Convert to Celsius (°C)</button>
                <div class="flex gap-16 mt-4">
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-4 items-center">
                            <i class="fa-solid fa-water fa-2xl" style="color: #ffffff;"></i>
                            <p>${data.main.humidity} %</p>
                        </div>
                        <p class="text-center">Humidity</p>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-4 items-center">
                            <i class="fa-solid fa-wind fa-2xl" style="color: #ffffff;"></i>
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

function reassignTempAndButtons() {
    convertToFahrenheitBtn = document.getElementById('convert-to-fahrenheit');
    convertToCelsiusBtn = document.getElementById('convert-to-celsius');
    currentTempP = document.getElementById('current-temp');
    convertToFahrenheitBtn.addEventListener('click', convertToFahrenheit);
    convertToCelsiusBtn.addEventListener('click', convertToCelsius);
}

function updateForecastUI(data) {
    forecastHeader.classList.remove('hidden');
    forecastDiv.innerHTML = ''; // Clear previous forecast data
    // Update the forecast section with fetched data
    for (let i=5; i<data.list.length; i+=8) {
        //console.log(data.list[i]);
        const newforecast = document.createElement('div');
        newforecast.innerHTML = `
            <div class="flex m-2 items-center justify-between border-black p-4 rounded-4xl shadow-2xl shadow-black bg-gray-800">
                <div class="flex flex-col gap-2">
                    <h3><i class="fa-solid fa-calendar fa-lg mr-4" style="color: #ffffff;"></i>${data.list[i].dt_txt.split(' ')[0]}</h3>
                    <p><i class="fa-solid fa-temperature-high fa-lg mr-4" style="color: #ffffff;"></i>${data.list[i].main.temp} °C</p>
                    <p><i class="fa-solid fa-water fa-lg mr-4" style="color: #ffffff;"></i>${data.list[i].main.humidity} %</p>
                    <p><i class="fa-solid fa-wind fa-lg mr-4" style="color: #ffffff;"></i>${data.list[i].wind.speed} m/sec</p>
                </div>
                <img src=${updateWeatherIcon(data.list[i].weather[0].description)} alt="${data.list[i].weather[0].description} icon" class="w-30 h-30">
            </div>
        `;
        forecastDiv.appendChild(newforecast);
    }
}

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
            return "https://openweathermap.org/img/wn/09d@2x.png";
        case 'light rain':
        case 'moderate rain':
        case 'heavy intensity rain':
        case 'very heavy rain':
        case 'extreme rain':
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

function convertToFahrenheit(){
    console.log('Converting to Fahrenheit');
    if (currentTempP.textContent === '-- °C') {
        currentTempP.textContent = '-- °F';
    }
    else {
        let currentTempC = parseFloat(currentTempP.textContent);
        let currentTempF = ((currentTempC * 9/5) + 32).toFixed(2);
        currentTempP.textContent = `${currentTempF} °F`;
    }
    convertToFahrenheitBtn.classList.add('hidden');
    convertToCelsiusBtn.classList.remove('hidden');
}

function convertToCelsius() {
    console.log('Converting to Celsius');
    if (currentTempP.textContent === '-- °F') {
        currentTempP.textContent = '-- °C';
    }
    else {
        let currentTempF = parseFloat(currentTempP.textContent);
        let currentTempC = ((currentTempF - 32) * 5/9).toFixed(2);
        currentTempP.textContent = `${currentTempC} °C`;
    }
    convertToCelsiusBtn.classList.add('hidden');
    convertToFahrenheitBtn.classList.remove('hidden');
}