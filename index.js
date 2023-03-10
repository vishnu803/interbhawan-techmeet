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


app.listen(process.env.PORT || 3000, function () {
    console.log("Listening to the server 3000");
});

app.get("/", function (req, res) {

    res.render("home");
});

const BASEURL = 'http://localhost:1337';

function doRequest(url) {

    const options = {

        method: 'GET',
        url: url,
        headers: {
            Authorization: 'Bearer /*YOUR API KEY*/'
        }

    };

    return new Promise(function (resolve, reject) {
        request(options, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                // console.log("Here", body);
                resolve(body);
            } else {
                // console.log("You are in rejection state!!", res.statusCode);
                reject(error);
            }
        });
    });

}

async function getRecords(url) {

    try {
        const resp = await doRequest(url);
        const records = JSON.parse(resp);
        return records;

    } catch (error) {
        console.error(error);
    }

}

app.get("/leaderboard", function (req, res) {

    let option = "bhawan";
    
    if(req.query.filter!=null){
        option = req.query.filter;
    }
    let data = {}; 
    getRecords('http://localhost:1337/api/leader-boards')
    .then((resp1) => {
        data = resp1.data;
    })
    .catch(error => {
        console.log(error);
    })
    .finally(()=>{

        if(option==="bhawan"){

            const result = {};
            // console.log(data);
            for (const obj of data) {

                const bhawanName = obj.attributes.bhawanName;
                const medal = obj.attributes.medal;
                const pointsAdded = obj.attributes.pointsAdded;

                if (!result[bhawanName]) {
                    result[bhawanName] = { name: bhawanName, Gold: 0, Silver: 0, Bronze: 0, points : 0 };
                }
                if (medal === 'Gold') {
                    result[bhawanName].Gold++;
                } else if (medal === 'Silver') {
                    result[bhawanName].Silver++;
                } else if (medal === 'Bronze') {
                    result[bhawanName].Bronze++;
                }

                result[bhawanName].points=result[bhawanName].points+pointsAdded;

            }

            const finalResult = Object.values(result);
            finalResult.sort((a, b) => b.points - a.points);
            console.log(finalResult);
            
            res.render("leaderboard", {data : finalResult});

        }
        else{
            const filteredData = data.filter((data) => data.attributes.psName===option);
            const sortedData = filteredData.sort((a, b) => b.attributes.pointsAdded - a.attributes.pointsAdded);
            console.log(sortedData);
            
            res.render("leaderboard", {data : sortedData});

        }
        
    });

});

app.get("/team", function (req, res) {
    getRecords('http://localhost:1337/api/teams?populate=*')
    .then((resp)=>{
        let data = resp.data;
        const result = {};
        // console.log(data);
        for (const obj of data) {

            const cellname = obj.attributes.cellname;
            const name = obj.attributes.name;
            const gmail = obj.attributes.gmail;
            const linkedin = obj.attributes.linkedin;
            const imageurl = obj.attributes.photo.data[0].attributes.url;

            if (!result[cellname]) {
                result[cellname] = { cellname: cellname, members : [] };
            }
            result[cellname]['members'].push({name : name, gmail : gmail, linkedin : linkedin, imageurl : imageurl});

        }
        const finalResult = Object.values(result);
        // console.log(finalResult);
        res.render("team", {data : finalResult, BASEURL : BASEURL});
    });
});

app.get("/ps", function (req, res) {

    getRecords('http://localhost:1337/api/problem-statements?populate=*')
    .then((resp)=>{
        res.render("ps", {data : resp.data, BASEURL : BASEURL});
    });

});

