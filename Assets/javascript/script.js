//Variables
var weatherButton = document.querySelector("#search-button");
var city = document.querySelector("#city")
var currentWeather = document.querySelector("#current-weather")

function getProperDate(date) {
    var tempTime = date * 1000;
    var dateObject = new Date(tempTime);
    var converterdDate = dateObject.toLocaleString("en-US", { timeZoneName: "short" });
    var properDate = converterdDate.split(",");
    return properDate[0];
}

function makeElements(date, temp, wind, hum, uvi, section) {
    var mydiv = document.createElement("div");
    var mydate = document.createElement("p");
    mydate.textContent = date;
    mydiv.appendChild(mydate)

    var theTemp = document.createElement("p")
    theTemp.textContent = "Temp: " + temp
    mydiv.appendChild(theTemp)

    var theWind = document.createElement("p")
    theWind.textContent = "WindSpeed: " + wind
    mydiv.appendChild(theWind)

    var theHum = document.createElement("p")
    theHum.textContent = "Humidity: " + hum
    mydiv.appendChild(theHum)

    var theUvi = document.createElement("p")
    theUvi.textContent = "UV Index: " + uvi
    mydiv.appendChild(theUvi)


    section.appendChild(mydiv)
}

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
            makeElements(getProperDate(weatherInfo.mydate), weatherInfo.temp, weatherInfo.windSpeed, weatherInfo.humidity, weatherInfo.uvIndex, currentWeather)
        })
}

weatherButton.addEventListener("click", apiGrab)

