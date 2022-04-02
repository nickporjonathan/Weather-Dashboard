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
