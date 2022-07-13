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

function insertCityName(city, place) {
    var mycity = document.createElement("p")
    mycity.textContent = city
    place.appendChild(mycity)
}

function makeElements(date, temp, wind, hum, uvi, img, desc, section) {
    var mydiv = document.createElement("div");
    var mydate = document.createElement("p");
    mydate.textContent = date;
    mydiv.appendChild(mydate)

    var theIcon = document.createElement("img")
    theIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + img + "@2x.png")
    theIcon.setAttribute("alt", desc)
    mydiv.appendChild(theIcon)

    var theTemp = document.createElement("p")
    theTemp.textContent = "Temp: " + temp
    mydiv.appendChild(theTemp)

    var theWind = document.createElement("p")
    theWind.textContent = "WindSpeed: " + wind
    mydiv.appendChild(theWind)

    var theHum = document.createElement("p")
    theHum.textContent = "Humidity: " + hum
    mydiv.appendChild(theHum)

    // var theUvi = document.createElement("p")
    // theUvi.textContent = "UV Index: " + uvi


    var myUVContainer = document.createElement("div");
    var myUVFillerText = document.createElement("p");
    var myIndexContainer = document.createElement("div")
    var myUVIndex = document.createElement("p");

    myUVFillerText.textContent = "UV Index: "
    myUVIndex.textContent = uvi;
    myIndexContainer.appendChild(myUVIndex);
    myUVContainer.appendChild(myUVFillerText);
    myUVContainer.appendChild(myIndexContainer);
    mydiv.appendChild(myUVContainer)

    section.appendChild(mydiv)
}

function apiGrab() {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city.value + "&limit=5&appid=053a26026344ad16c7761daa0c147b49", {})
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var coordinates = {
                lat: data[0].lat,
                lon: data[0].lon
            }
            insertCityName(data[0].name, currentWeather)
            return coordinates;
        })
        .then(function (coords) {
            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + coords.lat + "&lon=" + coords.lon + "&units=imperial&appid=053a26026344ad16c7761daa0c147b49", {})
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var weatherInfo = {
                mydate: data.daily[0].dt,
                temp: data.daily[0].temp.day,
                windSpeed: data.daily[0].wind_speed,
                humidity: data.daily[0].humidity,
                uvIndex: data.daily[0].uvi,
                icon: data.daily[0].weather[0].icon,
                desc: data.daily[0].weather[0].description
            }
            makeElements(getProperDate(weatherInfo.mydate), weatherInfo.temp, weatherInfo.windSpeed, weatherInfo.humidity, weatherInfo.uvIndex, weatherInfo.icon, weatherInfo.desc, currentWeather)
        })
}

weatherButton.addEventListener("click", apiGrab)

