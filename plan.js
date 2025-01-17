const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

let aqi1 = null;
let aqi2 = null;
let temp1 = null;
let temp2 = null;
let weatherDescription1 = null;
let weatherDescription2 = null;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  entended: true
}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/plan.html");
});

app.post("/", function(req, res) {

  const query1 = req.body.cityName;
  const query2 = req.body.cityName2;

  const key = "cf0358801e80d8542089c2334f5803c2";
  // const url1 = ("https://api.openweathermap.org/geo/1.0/direct?q=" + query1 + "&appid=" + key);
  // const url2 = ("https://api.openweathermap.org/geo/1.0/direct?q=" + query2 + "&appid=" + key);
  const url5 = ("https://api.openweathermap.org/data/2.5/weather?q=" + query1 + "&appid=" + key + "&units=metric");
  const url6 = ("https://api.openweathermap.org/data/2.5/weather?q=" + query2 + "&appid=" + key + "&units=metric");


  https.get(url5, function(response) {

    response.on("data", function(data) {

      const weatherData = JSON.parse(data);
      const temp1 = weatherData.main.temp;
      const weatherDescription1 = weatherData.weather[0].description;
      res.write("<h1>The temp of " + query1 + " is " + temp1 + "</h1>");
      res.write("<h1>The weather of " + query1 + " is " + weatherDescription1 + "</h1>");

    });
  });

  https.get(url6, function(response) {

    response.on("data", function(data) {

      const weatherData = JSON.parse(data);
      const temp2 = weatherData.main.temp;
      const weatherDescription2 = weatherData.weather[0].description;
      res.write("<h1>The temp of " + query2 + " is " + temp2 + "</h1>");
      res.write("<h1>The weather of " + query2 + " is " + weatherDescription2 + "</h1>");


    });
  });


  https.get(url5, function(response) {

    // console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);

      const lat1 = weatherData.coord.lat;
      const lon1 = weatherData.coord.lon;
      const url3 = ("https://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat1 + "&lon=" + lon1 + "&appid=" + key);
      // console.log(temp);
      // console.log(weatherDescription);

      https.get(url3, function(response) {

        // console.log(response.statusCode);

        response.on("data", function(data) {
          const airQuality1 = JSON.parse(data)
          aqi1 = airQuality1.list[0].main.aqi;

        });
      });
    });

  });

  https.get(url6, function(response) {

    // console.log(response.statusCode);

    response.on("data", function(data) {

      const weatherData = JSON.parse(data);

      const lat2 = weatherData.coord.lat;
      const lon2 = weatherData.coord.lon;
      const url4 = ("https://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat2 + "&lon=" + lon2 + "&appid=" + key);
      // console.log(weatherDescription);

      https.get(url4, function(response) {

        // console.log(response.statusCode);

        response.on("data", function(data) {

          const airQuality2 = JSON.parse(data)

          aqi2 = airQuality2.list[0].main.aqi;

          res.write("<h1>The aqi of " + query1 + " is " + aqi1 + "</h1>");
          res.write("<h1>The aqi of " + query2 + " is " + aqi2 + "</h1>");

          if(aqi2>aqi1){
            res.write("<h1>the air quantity index condition is not favourable for you take precautions.<h1>");
          }
          if(weatherDescription1!=weatherDescription2){
          res.write("<h1>the weather conditions are different take precautions.<h1>");
          }
          var diff = Math.abs(temp1-temp2);
          if(diff>10){
            res.write("<h1>the difference in temp is greater than 10 degree C take precautions.<h1>");
          }
          res.send();
        });
      });

    });

  });

});


app.listen("3000", function() {
  console.log("Server is runnign on port 3000");
});
