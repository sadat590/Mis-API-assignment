const searchBar = document.getElementById('search-bar');
const countryCardsContainer = document.getElementById('country-cards');
const modal = new bootstrap.Modal(document.getElementById('detailsModal'));

// Modal Elements
const countryFlag = document.getElementById('country-flag');
const countryName = document.getElementById('country-name');
const countryPopulation = document.getElementById('country-population');
const countryCapital = document.getElementById('country-capital');
const countryWeather = document.getElementById('country-weather');

// Fetch Country Data
async function fetchCountryData(query) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    if (!response.ok) {
        alert('Country not found!');
        return [];
    }
    return response.json();
}

// Fetch Weather Data
async function fetchWeatherData(city) {
    const apiKey = '226d5ad27b664aae45e4f54383bb019b';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
        countryWeather.textContent = 'Weather data not available';
        return null;
    }

    const weatherData = await response.json();
    const temperature = (weatherData.list[0].main.temp - 273.15).toFixed(2); // Convert from Kelvin to Celsius
    const description = weatherData.list[0].weather[0].description;

    countryWeather.textContent = `${temperature}°C, ${description}`;
}

// Display Countries
async function displayCountries(query) {
    const countries = await fetchCountryData(query);
    countryCardsContainer.innerHTML = '';

    countries.forEach(country => {
        const card = document.createElement('div');
        card.className = 'col-md-4 country-card';
        card.innerHTML = `
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
            <div class="card-body">
                <h5>${country.name.common}</h5>
                <p>${country.region}</p>
                <button class="btn btn-primary" onclick="showDetails('${country.name.common}', '${country.capital ? country.capital[0] : ''}', '${country.population}', '${country.flags.png}')">More Details</button>
            </div>
        `;
        countryCardsContainer.appendChild(card);
    });
}

// Show Details in Modal
async function showDetails(name, capital, population, flag) {
    countryName.textContent = name;
    countryCapital.textContent = capital || 'N/A';
    countryPopulation.textContent = parseInt(population).toLocaleString();
    countryFlag.src = flag;

    await fetchWeatherData(capital || name); // Fetch weather using capital or country name
    modal.show();
}

// Search Event Listener
searchBar.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 2) {
        displayCountries(query);
    } else {
        countryCardsContainer.innerHTML = '';
    }
});
