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

let itemList = [];
let itemNameList = [];

// HOME PAGE

app.get("/", (req, res) => {

  res.render("home");

});

// TEAM NAME GENERATOR

app.get("/itemsgenerator", (req, res) => {

  getRandomItems();

  res.render("itemsgenerator", {
    itemImg1: itemList[0],
    itemImg2: itemList[1],
    itemImg3: itemList[2],
    itemImg4: itemList[3],
    itemImg5: itemList[4],
    itemImg6: itemList[5],

    itemName1: itemNameList[0],
    itemName2: itemNameList[1],
    itemName3: itemNameList[2],
    itemName4: itemNameList[3],
    itemName5: itemNameList[4],
    itemName6: itemNameList[5],
  });

  itemList = [];
  itemNameList = [];

});

app.post("/itemsgenerator", (req, res) => {
  res.redirect("itemsgenerator");
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
  championTypeList = [];

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
    .callback((error, champions) => {

      // turn champions.data json into array to get champion names
      let championNameData = Object.keys(champions.data);

      // choose 5 random champions and add them to randomChampList
      for (let i = 0; i < 5; i++) {

        let randomChamp;

        // prevents duplicate champions from appearing
        do {
          randomChamp = championNameData[Math.floor(Math.random() * 161)];
        } while (champImgList.indexOf(randomChamp) !== -1);

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

function getRandomItems() {

  kayn.DDragon.Item.list()
    .callback((error, items) => {

      let itemData = Object.keys(items.data);

      for (let i = 0; i < 6; i++) {

        let randomItem;

        do {
          randomItem = itemData[Math.floor(Math.random() * 254)];

        } while (itemList.indexOf(randomItem) !== -1);

        // if it's in the store, it's allowed
        // if it's consumable, it's not allowed
        // if it's on summoners rift, it's allowed
        // if it needs ornn, it's not allowed
        // if it is fiddlestick's item, it's not allowed
        // if it includes trinket or consumable in tags, it's not allowed
        // if it has no plaintext, it's probably not allowed
        // if it is hidden, it's probably not allowed
        // if its price is less than 1450, it's not allowed UNLESS it's a support item OR it's boots
        let inStore = jsonpath.query(items, '$.data.' + randomItem + '.inStore')[0];
        let consumable = jsonpath.query(items, '$.data.' + randomItem + '.consumed')[0];
        let onSummonersRift = jsonpath.query(items, '$.data.' + randomItem + '.maps.11')[0];
        let ornn = jsonpath.query(items, '$.data.' + randomItem + '.requiredAlly')[0];
        let fiddle = jsonpath.query(items, '$.data.' + randomItem + '.requiredChampion')[0];
        let tag = jsonpath.query(items, '$.data.' + randomItem + '.tags')[0];
        let plaintext = jsonpath.query(items, '$.data.' + randomItem + '.plaintext')[0];
        let hidden = jsonpath.query(items, '$.data.' + randomItem + '.hideFromAll')[0];
        let price = jsonpath.query(items, '$.data.' + randomItem + '.gold.total')[0];

        if (inStore !== undefined || inStore === false) {
          i--;
          continue;
        }

        if (consumable !== undefined || consumable === true) {
          i--;
          continue;
        }

        if (onSummonersRift !== true) {
          i--;
          continue;
        }

        if (ornn !== undefined || ornn === "Ornn") {
          i--;
          continue;
        }

        if (fiddle !== undefined || fiddle === "FiddleSticks") {
          i--;
          continue;
        }

        if (plaintext === "") {
          i--;
          continue;
        }

        if (tag.includes("Trinket") || tag.includes("Consumable")) {
          i--;
          continue;
        }

        if (hidden === true) {
          i--;
          continue;
        }

        if (price <= 1450 && !tag.includes("GoldPer") && !tag.includes("Boots")) {
          i--;
          continue;
        }

        let itemName = jsonpath.query(items, '$.data.' + randomItem + '.name').toString();

        itemList.push(randomItem);
        itemNameList.push(itemName);
      }
    });
}

function checkItems(rawItemsData, item) {

}
