require("dotenv").config();
const api_key = process.env.API_KEY;

const express = require("express");
const ejs = require("ejs");

const {
  Kayn,
  REGIONS
} = require('kayn')
const kayn = Kayn(api_key)(
  /*{
      region: REGIONS.NORTH_AMERICA,
      apiURLPrefix: 'https://%s.api.riotgames.com',
      locale: 'en_US',
      debugOptions: {
          isEnabled: true,
          showKey: false,
      },
      requestOptions: {
          shouldRetry: true,
          numberOfRetriesBeforeAbort: 3,
          delayBeforeRetry: 1000,
          burst: false,
          shouldExitOn403: false,
      },
      cacheOptions: {
          cache: null,
          timeToLives: {
              useDefault: false,
              byGroup: {},
              byMethod: {},
          },
      },
  }*/
);

const app = express();
const port = 3000;

app.set("view engine", "ejs");

let randomChampList = [];

app.get("/", (req, res) => {

  kayn.DDragon.Champion.list() // Implicitly targets 8.24.1
    .callback(function(error, champions) {

      let championList = Object.keys(champions.data);
      let randomChamp1 = championList[Math.floor(Math.random() * 161)];


      for (let i = 0; i < 5; i++) {

        let randomChamp = championList[Math.floor(Math.random() * 161)];
        console.log(randomChamp);

        randomChampList.push(randomChamp);

      }

      res.render("home", {
        champImg1: randomChampList[0],
        champImg2: randomChampList[1],
        champImg3: randomChampList[2],
        champImg4: randomChampList[3],
        champImg5: randomChampList[4],
      });
    });

    randomChampList = [];


});

app.use(express.static("public"));


app.listen(port, () => {
  console.log("app has begun on port " + port);
});
