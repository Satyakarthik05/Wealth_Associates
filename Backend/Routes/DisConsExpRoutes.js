const express = require("express");
const DistrictData = require("../Controllers/DisConsExpert");
const app = express.Router();

app.get("/districts", DistrictData.district);
app.get("/constituencys", DistrictData.constituency);
app.get("/expertise", DistrictData.Expertis);
app.get("/occupations", DistrictData.Occupations);

module.exports = app;
