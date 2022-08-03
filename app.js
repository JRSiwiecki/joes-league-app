const express = require("express");
const ejs = require("ejs");
require("dotenv").config();

const app = express();
const port = 3000;

app.set("view engine", "ejs");

const api_key = process.env.API_KEY;

app.get("/", (req, res) => {
  res.render("home");
});


app.use(express.static("public"));

app.listen(port, () => {
  console.log("app has begun on port " + port);
});
