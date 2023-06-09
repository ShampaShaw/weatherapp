const dotenv = require('./')
require('dotenv').config()
const express = require("express");
const mongoose = require('mongoose')
const cors = require('cors');
const https = require('https');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('./models/user.model');

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true}));
app.use(cors());

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
       const imageURL = process.env.IMAGE_URL + icon +"@2x.png"

       res.write("<p> The Weather is currently " + weatherDes  + "</p>");
       res.write("<h1>The temperature of "+ query +" is " +temp + " degree celcius.</h1>");
       res.write("<img src="+ imageURL + ">");
        res.send();
     })
    })  
})


const connection_url = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect( connection_url, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen( PORT, () => console.log(`Server is running on port: ${PORT}`)))
    .catch((error) => console.log(error));

app.post('/api/register', async(req,res) => {
    console.log(req.body)
    try {
        const newPassword = await bcrypt.hash(req.body.passWord, 7)

        await User.create (
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: newPassword,
            }
        )
        res.json({ status: "successfully login"})
    } catch (error) {
        res.json({error})
    }
})
