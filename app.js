// hides api key
require("dotenv").config();
const api_key = process.env.API_KEY;

const express = require("express");
const ejs = require("ejs");
const jsonpath = require("jsonpath");

// kayn api configurations
// api key may not be necessary to use kayn api? doesn't seem like it is
const {
  Kayn,
  REGIONS
} = require('kayn')
const kayn = Kayn(api_key)({
  region: REGIONS.NORTH_AMERICA,
  locale: 'en_US',
  debugOptions: {
    isEnabled: true,
    showKey: false,
  },
  requestOptions: {}, // Doesn't apply to DDragon requests
});

const app = express();
const port = 3000;

app.set("view engine", "ejs");

let champImgList = [];
let champNameList = [];
let champTitleList = [];

// HOME PAGE

app.get("/", (req, res) => {

  res.render("home");

});

// TEAM NAME GENERATOR

app.get("/teamnamegenerator", (req, res) => {
  res.render("teamnamegenerator");
});

// TEAM COMPOSITION BUILDER

app.get("/teambuilder", (req, res) => {

    getRandomChampionsAndTitles();

    res.render("teambuilder", {
      champImg1: champImgList[0],
      champImg2: champImgList[1],
      champImg3: champImgList[2],
      champImg4: champImgList[3],
      champImg5: champImgList[4],

      champName1: champNameList[0],
      champName2: champNameList[1],
      champName3: champNameList[2],
      champName4: champNameList[3],
      champName5: champNameList[4],

      champTitle1: champTitleList[0],
      champTitle2: champTitleList[1],
      champTitle3: champTitleList[2],
      champTitle4: champTitleList[3],
      champTitle5: champTitleList[4],
    });

    // get new set of champs and titles
    champImgList = [];
    champNameList = [];
    champTitleList = [];
});

app.post("/teambuilder", (req, res) => {
  res.redirect("teambuilder");
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log("app has begun on port " + port);
});

function getRandomChampionsAndTitles() {

  // use kayn api to get list of champions as a .json
  kayn.DDragon.Champion.list()
    .callback(function(error, champions) {

      // turn champions.data json into array to get champion names
      let championNameList = Object.keys(champions.data);

      // choose 5 random champions and add them to randomChampList
      for (let i = 0; i < 5; i++) {

        let randomChamp;

        // prevents duplicate champions from appearing
        do {
          randomChamp = championNameList[Math.floor(Math.random() * 161)];

        } while (champImgList.indexOf(randomChamp) !== -1)

        // retreives title for champion from the random champion
        // couldnt figure out how to do this without jsonpath library
        let champName = jsonpath.query(champions, '$.data.' + randomChamp + '.name')
        let champTitle = jsonpath.query(champions, '$.data.' + randomChamp + '.title');

        // push the random champ and their titles
        champImgList.push(randomChamp);
        champNameList.push(champName);
        champTitleList.push(champTitle);
      }
    });
}
