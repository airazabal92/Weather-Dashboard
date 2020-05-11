/* Global Variables 
-----------------------------------------------------*/
// Keep track of user input
var userCityInput;

// City lat & lon from current weather data api to pass to uv index api
var cityLon;
var cityLat;

/* Logic & Functions 
-----------------------------------------------------*/

$(document).ready(function () {
  // On click event for submit button
  $("#citySearchSubmit").click(function () {
    // Clear all values
    clearValues();

    // Set user input to variable
    userCityInput = $("#userCityInput").val();
    console.log(userCityInput);

    // Get the current weather of user inputted city
    getCurrentWeather();
  });

  // Connect to the OpenWeather Current Weather Data API
  function getCurrentWeather() {
    // Clear all values
    clearValues();

    var queryURL =
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      userCityInput +
      "&appid=4f8e55cc1da3ca266b20bb0a49484fa9";

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      // Add city name to current weather card
      var cityName = response.name;
      $("#cityName").text(cityName);

      // Add current date next to city name in current weather card
      var currentDate = moment().format("M/D/YYYY");
      console.log(currentDate);
      $("#cityName").append(" (" + currentDate + ")");

      // Convert temperature from Kelvin to Fahrenheit - round to 1 decimal
      var tempF = (response.main.temp * (9 / 5) - 459.67).toFixed(1);

      // Add temperature to current weather card
      $("#temperature").append(tempF + " °F");

      // Add humidity to current weather card
      var humidity = response.main.humidity;
      $("#humidity").append(humidity + "%");

      // Convert wind speed from meters/sec to mph
      var windSpeed = (response.wind.speed * 2.236936).toFixed(1);

      // Add wind speed to current weather card
      $("#windSpeed").append(windSpeed + " MPH");

      // Set the city longitude and latitude to be sent to UV index API call
      cityLon = response.coord.lon;
      cityLat = response.coord.lat;

      // Get the UV Index
      getUVIndex();

      getFiveDayForecast();

      addToSearchHistory();
    });
  }

  // Connect to the OpenWeather UV Index API
  function getUVIndex() {
    var queryURL =
      "http://api.openweathermap.org/data/2.5/uvi?lat=" +
      cityLat +
      "&lon=" +
      cityLon +
      "&appid=4f8e55cc1da3ca266b20bb0a49484fa9";

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log("UV", response);

      var UVIndex = response.value;

      // Add UV index to current weather card
      $("#UVIndex").append(UVIndex);

      // Style the span that contains the UV index
      $("#UVIndex").css("padding", "5px");
      $("#UVIndex").css("border-radius", "5px");
      $("#UVIndex").css("color", "white");

      // Add color to UV index to indicate severity level
      // Green = favorable, Orange = moderate, Red = severe
      if (UVIndex >= 0 && UVIndex <= 2) {
        $("#UVIndex").css("background-color", "green");
      } else if (UVIndex >= 3 && UVIndex <= 7) {
        $("#UVIndex").css("background-color", "orange");
      } else if (UVIndex >= 8) {
        $("#UVIndex").css("background-color", "red");
      }
    });
  }

  // Add city to search history on click
  function addToSearchHistory() {
    var newInputLi = $("<li>").text(userCityInput);
    newInputLi.addClass("list-group-item searchItem");
    $("#searchHistoryUl").prepend(newInputLi);
  }

  // When dynamically added li is clicked, use the city value to show the corresponding info
  $(document).on("click", "li.searchItem", function () {
    userCityInput = $(this).text();
    getCurrentWeather();
  });

  // Clear all value fields
  function clearValues() {
    $("#cityName").empty();
    $("#temperature").empty();
    $("#humidity").empty();
    $("#windSpeed").empty();
    $("#UVIndex").empty();
  }
});

// Add information for 5-Day forecast
function getFiveDayForecast() {
  var queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    userCityInput +
    "&units=imperial" +
    "&appid=4f8e55cc1da3ca266b20bb0a49484fa9";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log("5DAY ", response);

    // Day 1 -----

    // Set day 1 date to variable
    var day1Text = response.list[0].dt_txt.slice(0, 10);
    // Send to function to conver to MM/DD/YYYY format
    var day1Date = convertDate(day1Text);
    // Add day 1 date to first 5-Day forecast card
    $("#day1Date").text(day1Date);

    // Set day 1 temp to variable
    var day1temp = "Temp: " + response.list[0].main.temp.toFixed(1) + " °F";
    // Add day 1 temp to first 5-Day forecast card
    $("#day1Temp").text(day1temp);

    // Set day 1 humidity to variable
    var day1Humidity = "Humidity: " + response.list[0].main.humidity;
    // Add day 1 humidity to first 5-Day forecast card
    $("#day1Humidity").text(day1Humidity);

    // Day 2 -----

    // Set day 2 date to variable
    var day2Text = response.list[8].dt_txt.slice(0, 10);
    // Send to function to conver to MM/DD/YYYY format
    var day2Date = convertDate(day2Text);
    // Add day 2 date to first 5-Day forecast card
    $("#day2Date").text(day2Date);

    // Set day 2 temp to variable
    var day2temp = "Temp: " + response.list[8].main.temp.toFixed(1) + " °F";
    // Add day 2 temp to first 5-Day forecast card
    $("#day2Temp").text(day2temp);

    // Set day 2 humidity to variable
    var day2Humidity = "Humidity: " + response.list[8].main.humidity;
    // Add day 2 humidity to first 5-Day forecast card
    $("#day2Humidity").text(day2Humidity);

    // Day 3 -----

    // Set day 3 date to variable
    var day3Text = response.list[16].dt_txt.slice(0, 10);
    // Send to function to conver to MM/DD/YYYY format
    var day3Date = convertDate(day3Text);
    // Add day 3 date to first 5-Day forecast card
    $("#day3Date").text(day3Date);

    // Set day 3 temp to variable
    var day3temp = "Temp: " + response.list[16].main.temp.toFixed(1) + " °F";
    // Add day 3 temp to first 5-Day forecast card
    $("#day3Temp").text(day3temp);

    // Set day 3 humidity to variable
    var day3Humidity = "Humidity: " + response.list[16].main.humidity;
    // Add day 3 humidity to first 5-Day forecast card
    $("#day3Humidity").text(day3Humidity);

    // Day 4 -----

    // Set day 4 date to variable
    var day4Text = response.list[24].dt_txt.slice(0, 10);
    // Send to function to conver to MM/DD/YYYY format
    var day4Date = convertDate(day4Text);
    // Add day 4 date to first 5-Day forecast card
    $("#day4Date").text(day4Date);

    // Set day 4 temp to variable
    var day4temp = "Temp: " + response.list[24].main.temp.toFixed(1) + " °F";
    // Add day 4 temp to first 5-Day forecast card
    $("#day4Temp").text(day4temp);

    // Set day 4 humidity to variable
    var day4Humidity = "Humidity: " + response.list[24].main.humidity;
    // Add day 4 humidity to first 5-Day forecast card
    $("#day4Humidity").text(day4Humidity);

    // Day 5 -----

    // Set day 5 date to variable
    var day5Text = response.list[32].dt_txt.slice(0, 10);
    // Send to function to conver to MM/DD/YYYY format
    var day5Date = convertDate(day5Text);
    // Add day 5 date to first 5-Day forecast card
    $("#day5Date").text(day5Date);

    // Set day 5 temp to variable
    var day5temp = "Temp: " + response.list[32].main.temp.toFixed(1) + " °F";
    // Add day 5 temp to first 5-Day forecast card
    $("#day5Temp").text(day5temp);

    // Set day 5 humidity to variable
    var day5Humidity = "Humidity: " + response.list[32].main.humidity;
    // Add day 5 humidity to first 5-Day forecast card
    $("#day5Humidity").text(day5Humidity);

    // Converts date to MM/DD/YYYY format
    function convertDate(dayText) {
      var dayArray = dayText.split("-");

      var dayMonth = dayArray[1];
      var dayNum = dayArray[2];
      var dayYear = dayArray[0];

      if (dayMonth.charAt(0) == 0) {
        dayMonth = dayMonth.charAt(1);
      }

      var dayDate = dayMonth + "/" + dayNum + "/" + dayYear;

      return dayDate;
    }
  });
}
