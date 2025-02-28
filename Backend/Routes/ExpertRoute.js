const express = require("express");
const ExpertController = require("../Controllers/ExpertController");

const app = express.Router();

app.post("/registerExpert", ExpertController.registerExpert);
app.get("/getexpert/:expertType", ExpertController.getExpertsByType);

module.exports = app;
