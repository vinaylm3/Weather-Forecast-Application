const searchCityBtn = document.getElementById('search-city-btn');
const useCurrentLocationBtn = document.getElementById('use-current-location-btn');

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
            // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
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
}

async function fetchDataByCoords(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cc8a426c15f687049c1626d5f6b41409&units=metric`);
    let data = await response.json();
    console.log(data);
}

async function fetchForecastData(city) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=cc8a426c15f687049c1626d5f6b41409&units=metric`);
    let data = await response.json();
    console.log(data);
}

async function fetchForecastDataByCoords(lat, lon) {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=cc8a426c15f687049c1626d5f6b41409&units=metric`);
    let data = await response.json();
    console.log(data);
}