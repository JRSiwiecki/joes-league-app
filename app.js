require("dotenv").config();
const api_key = process.env.API_KEY;

const express = require("express");
const ejs = require("ejs");

const {
  Kayn,
  REGIONS
} = require('kayn')
const kayn = Kayn(api_key)();

const app = express();
const port = 3000;

app.set("view engine", "ejs");

let randomChampList = [];

app.get("/", (req, res) => {

res.render("home");

});

app.get("/teamnamegenerator", (req, res) => {
  res.render("teamnamegenerator");
});

app.get("/teambuilder", (req, res) => {
  kayn.DDragon.Champion.list() // Implicitly targets 8.24.1
    .callback(function(error, champions) {

      let championNameList = Object.keys(champions.data);

      for (let i = 0; i < 5; i++) {

        let randomChamp;

        do {
          randomChamp = championNameList[Math.floor(Math.random() * 161)];
        } while (randomChampList.indexOf(randomChamp) !== -1)

        randomChampList.push(randomChamp);

      }

      res.render("teambuilder", {
        champName1: randomChampList[0],
        champName2: randomChampList[1],
        champName3: randomChampList[2],
        champName4: randomChampList[3],
        champName5: randomChampList[4],
      });
    });

  randomChampList = [];
});

app.post("/teambuilder", (req, res) => {
  res.redirect("teambuilder");
});

app.use(express.static("public"));


app.listen(port, () => {
  console.log("app has begun on port " + port);
});
