//Variables
var weatherButton = document.querySelector("#search-button");
var city = document.querySelector("#city")
var currentWeather = document.querySelector("#current-weather")
var fiveDay = document.querySelector("#five-day")
var recentCities = document.querySelector("#recent-searches")

function getProperDate(date) {
    var tempTime = date * 1000;
    var dateObject = new Date(tempTime);
    var converterdDate = dateObject.toLocaleString("en-US", { timeZoneName: "short" });
    var properDate = converterdDate.split(",");
    return properDate[0];
}

function resetContainers() {
    var numCities = recentCities.children.length;
    for (var i = 0; i < numCities; i++) {
        recentCities.children[0].remove();
    }
    var numWeather = currentWeather.children.length;
    for (var i = 0; i < numWeather; i++) {
        currentWeather.children[0].remove();
    }
    var numDay = fiveDay.children.length;
    for (var i = 0; i < numDay; i++) {
        fiveDay.children[0].remove();
    }
}

function isLocalStorage() {
    if (localStorage.getItem("myRecentSearches") !== null) {
        return true;
    } else {
        return false;
    }
}

function addbuttons(city, container) {
    var myButton = document.createElement("button")
    myButton.textContent = city;
    myButton.setAttribute("class", "recent")
    container.appendChild(myButton)
}

function showSearchResults(container) {
    var myLocalStorage = JSON.parse(localStorage.getItem("myRecentSearches"))
    for (var i = 0; i < myLocalStorage.length; i++) {
        addbuttons(myLocalStorage[i], container)
    }
}

function storedSearches(city, element) {
    var tempArray = []
    if (isLocalStorage()) {
        var suitcase = JSON.parse(localStorage.getItem("myRecentSearches"))
        if (suitcase.includes(city)) {
            showSearchResults(element);
            return;
        }
        for (var i = 0; i < suitcase.length; i++) {
            tempArray.push(suitcase[i]);
        }
        tempArray.push(city)
        if (tempArray.length > 7) {
            tempArray.shift();
        }

        localStorage.setItem("myRecentSearches", JSON.stringify(tempArray));
        showSearchResults(element)
        return
    }
    //if local storage doesnt exist 
    tempArray.push(city);
    addbuttons(tempArray[0], element)
    localStorage.setItem("myRecentSearches", JSON.stringify(tempArray));
}

function insertCityName(city, place) {
    var mycity = document.createElement("p")
    mycity.textContent = city
    place.appendChild(mycity)
}

function uvNotification(uvi, uvColor) {
    if (uvi >= 0.0 && uvi < 3.0) {
        uvColor.style.backgroundColor = 'green';
        uvColor.style.color = 'white';
    } else if (uvi >= 3.0 && uvi < 6.0) {
        uvColor.style.backgroundColor = 'yellow';
        uvColor.style.color = 'black';
    } else if (uvi >= 6.0 && uvi < 8.0) {
        uvColor.style.backgroundColor = 'orange';
        uvColor.style.color = 'black';
    } else if (uvi >= 8.0 && uvi < 11.0) {
        uvColor.style.backgroundColor = 'red';
        uvColor.style.color = 'white';
    } else {
        uvColor.style.backgroundColor = 'purple';
        uvColor.style.color = 'white';
    }
}

function makeElements(date, temp, wind, hum, uvi, img, desc, section) {
    var mydiv = document.createElement("div");
    mydiv.setAttribute("id", "weatherData")
    var mydate = document.createElement("p");
    mydate.textContent = date;
    mydiv.appendChild(mydate)

    var theIcon = document.createElement("img")
    theIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + img + "@2x.png")
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

    if (uvi !== null) {
        var myUVContainer = document.createElement("div");
        var myUVFillerText = document.createElement("p");
        var myIndexContainer = document.createElement("div")
        myIndexContainer.setAttribute("id", "indexcolor")
        var myUVIndex = document.createElement("p");
        myUVFillerText.textContent = "UV Index: "
        myUVIndex.textContent = uvi;
        myIndexContainer.appendChild(myUVIndex);
        uvNotification(uvi, myIndexContainer)
        myUVContainer.appendChild(myUVFillerText);
        myUVContainer.appendChild(myIndexContainer);
        mydiv.appendChild(myUVContainer)
    }
    section.appendChild(mydiv)
}

function apiGrab() {
    resetContainers();
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city.value + "&limit=5&appid=053a26026344ad16c7761daa0c147b49", {})
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var coordinates = {
                lat: data[0].lat,
                lon: data[0].lon
            }
            insertCityName(data[0].name, currentWeather)
            storedSearches(data[0].name, recentCities)
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
            for (var i = 1; i < 6; i++) {
                var nextDate = getProperDate(data.daily[i].dt)
                var nextTemp = data.daily[i].temp.day
                var nextWind = data.daily[i].wind_speed
                var nextHum = data.daily[i].humidity
                var nextIcon = data.daily[i].weather[0].icon
                var nextDesc = data.daily[i].weather[0].description
                makeElements(nextDate, nextTemp, nextWind, nextHum, null, nextIcon, nextDesc, fiveDay)
            }
        })
}

//Event Delegate for Recent Cities section
recentCities.onclick = function (event) {
    var buttonClick = event.target

    if (buttonClick.classList.contains("recent")) {
        city.value = buttonClick.textContent;
        city.setAttribute("placeholder", buttonClick.textContent)
        apiGrab();
    }
}

if (isLocalStorage()) {
    showSearchResults(recentCities)
}

weatherButton.addEventListener("click", apiGrab)

