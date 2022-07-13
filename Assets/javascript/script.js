//Variables
var weatherButton = document.querySelector("#search-button");
var city = document.querySelector("#city")

function apiGrab() {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city.value + "&limit=5&appid=053a26026344ad16c7761daa0c147b49", {})
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var coordinates = {
                lat: data[0].lat,
                lon: data[0].lon
            }
            return coordinates;
        })
        .then(function (coords) {
            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + coords.lat + "&lon=" + coords.lon + "&units=imperial&appid=053a26026344ad16c7761daa0c147b49", {})
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data)
            var weatherInfo = {
                mydate: data.daily[0].dt,
                temp: data.daily[0].temp.day,
                windSpeed: data.daily[0].wind_speed,
                humidity: data.daily[0].humidity,
                uvIndex: data.daily[0].uvi
            }
        })

}

weatherButton.addEventListener("click", apiGrab)

