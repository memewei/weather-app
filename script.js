const form = document.querySelector('form');
const submitBtn = document.querySelector('.submit-button');
const error = document.querySelector('.error');

form.addEventListener('submit', checkSubmit);
submitBtn.addEventListener('click', checkSubmit);

function checkSubmit(e){
    e.preventDefault();
    fetchData();
}

function fetchData(){
    const input = document.querySelector('input');
    const userInput = input.value;
    getWeatherData(userInput);
}

async function getWeatherData(location){
    const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=46999a6be94c4b1090b73058231409&q=${location}`,
        {mode : 'cors',}
    );
    if(response.status === 400){
        error.className = 'error-active';
        throwError();
    }else{
        error.style.display = 'none';
        const weatherData = await response.json();
        const newData = processData(weatherData);
        displayData(newData);
        resetForm();
    }
}

function throwError(){
    if(error.className === 'error-active'){
        error.style.display = 'block';
    }else{
        error.style.display = 'none';
        error.className = 'error';
    }
    
}

function processData(weatherData){
    const data = {
        condition: weatherData.current.condition.text,
        feelsLike:{
            f: Math.round(weatherData.current.feelslike_f),
            c: Math.round(weatherData.current.feelslike_c),
        },
        currentTemp:{
            f: Math.round(weatherData.current.temp_f),
            c: Math.round(weatherData.current.temp_c),
        },
        uvIndex: weatherData.current.uv,
        humidity: weatherData.current.humidity,
        location: weatherData.location.name,
    }

    if(weatherData.location.country === 'United States of America'){
        data['region'] = weatherData.location.region;
    }else{
        data['region'] = weatherData.location.country;
    }

    return data;
}

function displayData(newData){
    const weatherInfo = document.querySelectorAll(".info");
    document.querySelector('.condition').textContent = newData.condition;
    document.querySelector('.location').textContent = `${newData.location}, ${newData.region}`;
    document.querySelector('.temperature').textContent = `${newData.currentTemp.c}°C`;
    document.querySelector('.feels-like').textContent = `Feels like: ${newData.feelsLike.c}°C`;
    document.querySelector('.uv-index').textContent = `UV Index: ${newData.uvIndex}`;
    document.querySelector('.humidity').textContent = `Humidity: ${newData.humidity}%`;
}

function resetForm(){
    form.reset();
}