const dotenv = require('./')
require('dotenv').config()
const express = require("express");
const https = require('https');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
      
    res.sendFile(__dirname + "/index.html");
})

app.post("/",function(req,res){
    
    const query =req.body.cityName;
    const apiKey = process.env.API_KEY;
    const units = "metric";
    const url = process.env.URL + query + "&appid=" + apiKey + "&units=" + units ;

    https.get(url, function(response){
    console.log(response.statusCode);

     response.on("data",function(data){
       const weatherData = JSON.parse(data);
       
       const temp = weatherData.main.temp;
       const weatherDes = weatherData.weather[0].description;
       const icon = weatherData.weather[0].icon;
       const imageURL = "http://openweathermap.org/img/wn/" + icon +"@2x.png"

       res.write("<p> The Weather is currently " + weatherDes  + "</p>");
       res.write("<h1>The temperature of "+ query +" is " +temp + " degree celcius.</h1>");
       res.write("<img src="+ imageURL + ">");
        res.send();
     })
    })  
})



app.listen(3000,function(){
    console.log("Server is running on port 3000");
});