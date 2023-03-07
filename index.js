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

function doRequest(url) {

    const options = {

        method: 'GET',
        url: url,
        headers: {
            Authorization: 'Bearer 34db27ec7d8990e5a5059dbd38bcfeec388bc47c80aecb67cb6a878e63ec22ac9eccacb6b672bb03bc13d6eaddc4894129f6f272e7a210d653c4159f7f3cec5012889f487fe043e520bafc1def725a0995a2e003de273c7abd428bda58fe21bbb4c0031adbfeab554b18297c4567337648e36927781df2235ef73d335d55db6f'
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

            for (const obj of data) {

                const bhawanName = obj.attributes.bhawanName;
                const medal = obj.attributes.medal;

                if (!result[bhawanName]) {
                    result[bhawanName] = { name: bhawanName, Gold: 0, Silver: 0, Bronze: 0 };
                }
                if (medal === 'Gold') {
                    result[bhawanName].Gold++;
                } else if (medal === 'Silver') {
                    result[bhawanName].Silver++;
                } else if (medal === 'Bronze') {
                    result[bhawanName].Bronze++;
                }

            }

            const finalResult = Object.values(result);

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

    //fetch team details 

    //group them cell wise

    
    res.render("team");
});

app.get("/ps", function (req, res) {

    //fetch problem statement details
    
    res.render("ps");
});


            // const bhawanwisedata = data.reduce((acc, curr) => {
            //     if (acc[curr.attributes.bhawanName]){
                    
            //       acc[curr.attributes.bhawanName].push(curr.attributes.medal);
            //     } else {
            //       acc[curr.attributes.bhawanName] = [curr.attributes.medal];
            //     }
            //     return acc;
            // }, {});
            // console.log(bhawanwisedata);

            // const result = [];
            
            // for (const [name, medals] of Object.entries(bhawanwisedata)) {
            // const medalCounts = {
            //     Gold: 0,
            //     Silver: 0,
            //     Bronze: 0,
            // };
            
            // for (const medal of medals) {
            //     if (medal === 'Gold') {
            //     medalCounts.Gold++;
            //     } else if (medal === 'Silver') {
            //     medalCounts.Silver++;
            //     } else if (medal === 'Bronze') {
            //     medalCounts.Bronze++;
            //     }
            // }
            
            // result.push({
            //     name,
            //     ...medalCounts,
            // });
            // }
            
            // console.log(result);