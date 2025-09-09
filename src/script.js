const searchCityBtn = document.getElementById('search-city-btn');
const useCurrentLocationBtn = document.getElementById('use-current-location-btn');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastHeader = document.getElementById('forecast');
const forecastDiv = document.getElementById('forecast-container');

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
    // Update the current weather section with fetched data
    currentWeatherDiv.innerHTML = `
        <div class="flex flex-col m-6 items-center justify-between border-black p-4 rounded-4xl shadow-2xl shadow-black bg-gray-800">
            <img src=${updateWeatherIcon(data.weather[0].description)} alt="${data.weather[0].description} icon" class="w-30 h-30">
            <div class="flex flex-col gap-4">
                <p class="text-center text-3xl">${data.main.temp} °C</p>
                <h3 class="text-center text-2xl">${data.name}</h3>
                <div class="flex gap-16 mt-4">
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-4 items-center">
                            <img src="img/humidity.png" alt="Humidity Icon" class="w-8 h-8">
                            <p>${data.main.humidity} %</p>
                        </div>
                        <p class="text-center">Humidity</p>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-4 items-center">
                        <img src="img/wind.png" alt="Wind Icon" class="w-8 h-8">
                        <p>${data.wind.speed} m/sec</p>
                        </div>
                        <p class="text-center">Wind Speed</p>
                    </div>
                </div>
            </div>
        </div>
    `;
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
                <div>
                    <h3>Date : ${data.list[i].dt_txt.split(' ')[0]}</h3>
                    <p>Temperature : ${data.list[i].main.temp} °C</p>
                    <p>Humidity : ${data.list[i].main.humidity} %</p>
                    <p>Wind : ${data.list[i].wind.speed} m/sec</p>
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