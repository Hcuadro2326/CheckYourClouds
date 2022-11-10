const APIKey = "818a74417384dcdcda67ec49319e6bd4";

$(document).on("click", "#search-button", () => {
    let x = $("#search-input").val();
    //console.log(x);
    currentWeather(x);
});

function currentWeather(search) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?appid=${APIKey}&q=${search}`;

    //console.log(url);
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                alert("broken");
            }
        })
        .then(function (data) {
            // let weatherData = data
            //console.log(data);
            document.getElementById("currentCity").innerHTML = data.city.name;
            document.getElementById("currentTime").innerHTML = new Date();
            //console.log(data.list[0].weather[0].icon);
            let icon = data.list[0].weather[0].icon;
            let focusImg = document.getElementById("currentIcon").setAttribute("src", `http://openweathermap.org/img/wn/${icon}@2x.png`);
            document.getElementById("currentTemp").innerHTML = "Temperature: " + Math.round((data.list[0].main.temp - 273.15) * 1.8 + 32);
            document.getElementById("currentWind").innerHTML = "Wind Speed: " + data.list[0].wind.speed + "MPH";
            document.getElementById("currentHumidity").innerHTML = "Humidity: " + data.list[0].main.humidity;

            let lat = data.city.coord.lat;
            let lon = data.city.coord.lon;
            let UVRequestURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";

            // Nested function to find UV Index and change background color based on that value
            fetch(UVRequestURL)
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        alert("broken");
                    }
                })
                .then(function (data) {
                    //console.log(data);
                    let UVIndex = document.createElement("span");

                    if (data[0].value < 4) {
                        UVIndex.setAttribute("class", "badge badge-success");
                    } else if (data[0].value < 8) {
                        UVIndex.setAttribute("class", "badge badge-warning");
                    } else {
                        UVIndex.setAttribute("class", "badge badge-danger");
                    }
                    UVIndex.innerHTML = data[0].value;
                    document.getElementById("currentUV").innerHTML = "UV Index: ";
                    document.getElementById("currentUV").appendChild(UVIndex);
                });
            // Nested function to pull 5 day data
            let cityID = data.city.id;
            //console.log(cityID);
            let forecastRequestURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            fetch(forecastRequestURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    //console.log(data);
                    const forecastEl = document.querySelectorAll(".fiveday");
                    for (i = 0; i < forecastEl.length; i++) {
                        forecastEl[i].innerHTML = "";
                        let forecastIndex = i * 8 + 4;

                        let forecastDate = document.createElement("p");
                        forecastDate.innerHTML = data.list[forecastIndex].dt_txt;
                        forecastEl[i].appendChild(forecastDate);
                        let forecastIcon = document.createElement("img");
                        forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
                        forecastIcon.setAttribute("alt", data.list[forecastIndex].weather[0].description);
                        forecastEl[i].append(forecastIcon);
                        let forecastTemp = document.createElement("p");
                        forecastTemp.innerHTML = "Temperature: " + Math.round((data.list[forecastIndex].main.temp - 273.15) * 1.8 + 32);
                        forecastEl[i].appendChild(forecastTemp);
                        let forecastHumidity = document.createElement("p");
                        forecastHumidity.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity;
                        forecastEl[i].appendChild(forecastHumidity);
                    }
                });
        });
}
