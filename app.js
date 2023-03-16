// hides api key
require("dotenv").config();
const riot_api_key = process.env.API_KEY;

const express = require("express");
const ejs = require("ejs");
const jsonpath = require("jsonpath");

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

app.listen(port, () => {});

function getRandomChampionsAndTitles() {}

function getRandomItems() {}

function checkItems(rawItemsData, item) {}
