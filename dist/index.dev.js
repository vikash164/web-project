"use strict";

require('dotenv').config();

var http = require("http");

var fs = require("fs");

var requests = require("requests");

var homeFile = fs.readFileSync("home.html", "utf-8");

var replaceVal = function replaceVal(tempVal, orgVal) {
  var temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};

var server = http.createServer(function (req, res) {
  if (req.url == "/") {
    requests("http://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=30bf5dd1f076e58c71ed24ce1332a84e").on("data", function (chunk) {
      var objdata = JSON.parse(chunk);
      var arrData = [objdata]; // console.log(arrData[0].main.temp);

      var realTimeData = arrData.map(function (val) {
        return replaceVal(homeFile, val);
      }).join("");
      res.write(realTimeData); // console.log(realTimeData);
    }).on("end", function (err) {
      if (err) return console.log("connection closed due to errors", err);
      res.end();
    });
  } else {
    res.end("File not found");
  }
});
server.listen(8000, "127.0.0.1");