// const url = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={818a74417384dcdcda67ec49319e6bd4}';
const APIKey = '818a74417384dcdcda67ec49319e6bd4';



// const getIt = function() {
// const weatherURL = 'https://api.openweathermap.org'
//     fetch(weatherURL).then(function(response){
//       response.json().then(function(data){
//             console.log(data)
//         });
//     });
// };
// console.log("hello");


// getIt();


const nameEl = document.getElementById('nameEl');
const currentTime = document.getElementById('currentTime');


function currentWeather(search) {
    //let url = "https://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=" + APIKey;
    let url = `https://api.openweathermap.org/data/2.5/forecast?appid=${APIKey}&q=${search}`

    console.log(url);
    fetch(url)
        .then(function (response) {
            if(response.ok){
                return response.json();
            } else {
                alert("broken");
            }
        })
        .then(function (data) {
            // let weatherData = data
            console.log(data);
            nameEl.innerHTML = data.city.name;
            currentTime.innerHTML = new Date();
            let weatherIcon = data.weather[0].icon;
            console.log(weatherIcon);
            let focusImg = currentIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
            currentTemp.innerHTML = "Temperature: " + Math.round(((data.main.temp - 273.15) * 1.8) + 32);
            currentWind.innerHTML = "Wind Speed: " + data.wind.speed + "MPH";
            currentHumidity.innerHTML = "Humidity: " + data.main.humidity;

            let lat = data.coord.lat;
            let lon = data.coord.lon;
            let UVRequestURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";

// Nested function to find UV Index and change background color based on that value
            fetch(UVRequestURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    let UVIndex = document.createElement("span")

                    if (data[0].value < 4 ) {
                        UVIndex.setAttribute("class", "badge badge-success");
                    }
                    else if (data[0].value < 8) {
                        UVIndex.setAttribute("class", "badge badge-warning");
                    }
                    else {
                        UVIndex.setAttribute("class", "badge badge-danger");
                    }
                    UVIndex.innerHTML= (data[0].value);
                    currentUV.innerHTML = "UV Index: ";
                    currentUV.appendChild(UVIndex);
                })
// Nested function to pull 5 day data
                let cityID = data.id;
                let forecastRequestURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                fetch(forecastRequestURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    const forecastEl = document.querySelectorAll("#fiveday")
                    for (i=0; i < forecastEl.length; i++){
                        forecastEl[i].innerHTML="";
                        let forecastIndex = i * 8 + 4;

                        let forecastDate = document.createElement("p");
                        forecastDate.innerHTML = data.list[forecastIndex].dt_txt;
                        forecastEl[i].appendChild(forecastDate)
                        let forecastIcon = document.createElement("img");
                        forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
                        forecastIcon.setAttribute("alt", data.list[forecastIndex].weather[0].description);
                        forecastEl[i].append(forecastIcon);
                        let forecastTemp = document.createElement("p");
                        forecastTemp.innerHTML = "Temperature: " + Math.round(((data.list[forecastIndex].main.temp - 273.15) * 1.8) + 32);
                        forecastEl[i].appendChild(forecastTemp);
                        let forecastHumidity = document.createElement("p");
                        forecastHumidity.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity;
                        forecastEl[i].appendChild(forecastHumidity);
                    }
                })
        });

}

$(document).on('click', '#search-button', () => {
    let x = $('#search-input').val();
    currentWeather(x);
})
