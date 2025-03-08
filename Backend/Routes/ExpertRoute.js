const express = require("express");
const ExpertController = require("../Controllers/ExpertController");

const app = express.Router();

app.post("/registerExpert", ExpertController.registerExpert);
app.get("/getexpert/:expertType", ExpertController.getExpertsByType);
app.put("/update/:id", ExpertController.modifyExpert);
app.delete("/delete/:id", ExpertController.deleteExpert);

module.exports = app;
