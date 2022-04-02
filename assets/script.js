let date = moment().format("MMMM,DD YYYY");
const SaveCityKey = "City";
const APIkey = "5a84980c7b7b783f90dce101ba33a6f6";

function climate(cityLabel) {
  if (cityLabel === "") {
    return;
  }
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityLabel}&units=metric&appid=${APIkey}`
  )
    .then((resp) => resp.json())
    .then((data) => {
      if (data.cod == "404") {
        cityLabel.value = "Invalid Entry";
        let cityLabel = document.getElementById("city");
      } else {
        loadForecast(data);
        SaveCityKey(cityLabel);
        UV_Title(data, cityLabel);
      }
    })
    .catch(() => {
      console.log("ERROR");
    });
}

async function UV_Title(data, cityLabel) {
  document.getElementById("yourCity").innerHTML = cityLabel;
  let latitude = data.city.coord.lat;
  let longitude = data.city.coord.lon;
  let UV_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily&appid=${APIkey}`;
  const response = await fetch(UV_URL);
  const UVData = await response.json();
  let UVIndex = UVData.current.uvi;
  UVShade(UVIndex);
}

function UVShade(UVIndex) {
  let level = "";
  if (UVIndex < 2) {
    level = "below";
  } else if ((UVIndex >= 2) & (UVIndex < 5)) {
    level = "moderate";
  } else {
    level = "strong";
  }
  let UVDiv = document.getElementById("UVIndex");
  UVDiv.innerHTML = `Current UV: ${UVIndex}`;
  UVDiv.classList.add(`${level}`);
}

function loadForecast(data) {
  if ($("#forecast").children().length == 0) {
    for (let i = 0; i < 6; i++) {
      let day = moment().add(i, "days").format("MMMM, DD YYYY");
      let icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.list[i].weather[0].icon}.svg`;
      $("#forecast").append(
        `<div class = 'dailyForecast' id = 'forecast${i}'></div>`
      );
      $(`#forecast${i}`).append(
        `<h4 class = 'forecastDate' id = 'date${i}'>${day}</h4>`
      );
      $(`#forecast${i}`).append(
        `<image class = 'forecastIcon' id = 'icon${i}' src = '${icon}'></image>`
      );
      $(`#forecast${i}`).append(
        `<p class = 'forecastText' id = 'temp${i}'>Temp: ${data.list[i].main.temp}°C</p>`
      );
      $(`#forecast${i}`).append(
        `<p class = 'forecastText' id = 'humid${i}'>Humidity: ${data.list[i].main.humidity}%</p>`
      );
      $(`#forecast${i}`).append(
        `<p class = 'forecastText' id = 'wind${i}'>Wind: ${data.list[i].wind.speed}KPH</p>`
      );
    }
  } else {
    for (let i = 0; i < 6; i++) {
      let day = moment().add(i, "days").format("MMMM, DD YYYY");
      let icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${data.list[i].weather[0].icon}.svg`;
      document.getElementById(`date${i}`).innerHTML = day;
      document.getElementById(`icon${i}`).src = icon;
      document.getElementById(
        `temp${i}`
      ).innerHTML = `Temp: ${data.list[i].main.temp}`;
      document.getElementById(
        `humid${i}`
      ).innerHTML = `Humidity: ${data.list[i].main.humidity}`;
      document.getElementById(
        `wind${i}`
      ).innerHTML = `Wind: ${data.list[i].wind.speed}`;
    }
  }
}

function saveCity(cityLabel) {
  let checkCityStorage = true;
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.getItem(SaveCityKey + i) == cityLabel) {
      checkCityStorage = false;
    }
  }
  if (checkCityStorage == true) {
    localStorage.setItem(SaveCityKey + localStorage.length, cityLabel);
    $("#buttons").append(
      `<button class = 'btn btn-primary btn-m' id = '${
        SaveCityKey + localStorage.length
      }'>${cityLabel}</button>`
    );
    newListener(SaveCityKey + localStorage.length);
  }
}

function loadPage() {
  let dateText = document.getElementById("date");
  dateText.innerHTML = date;
  for (let i = 0; i < localStorage.length; i++) {
    let savedCityLabel = localStorage.getItem(SaveCityKey + i);
    $("#buttons").append(
      `<button class = 'btn btn-primary btn-m' id = '${
        SaveCityKey + i
      }'>${savedCityLabel}</button>`
    );
    newListener(SaveCityKey + i);
  }
}

function newListener(cityKey) {
  document.getElementById(`${cityKey}`).addEventListener("click", function () {
    let newCityLabel = document.getElementById(`${cityKey}`).innerHTML;
    climate(newCityLabel);
  });
}

let newCity = document.getElementById("add-city");
newCity.addEventListener("click", function () {
  let cityLabel = document.getElementById("city").value;
  climate(cityLabel);
});

loadPage();
