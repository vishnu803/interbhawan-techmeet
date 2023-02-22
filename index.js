const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const fileUpload = require('express-fileupload');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(fileUpload());


app.listen(process.env.PORT || 4000, function () {
    console.log("Listening to the server 4000");
});

app.get("/", function (req, res) {


    res.render("home");
});

app.get("/leaderboard", function (req, res) {

    //get leaderboard data in json format from strapi

    //sort based on total points

    res.render("leaderboard");
});

app.get("/team", function (req, res) {

    //fetch team details 

    //group them cell wise

    
    res.render("home");
});

app.get("/ps", function (req, res) {

    //fetch problem statement details
    
    res.render("home");
});