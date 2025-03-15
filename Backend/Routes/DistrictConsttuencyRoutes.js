const express = require("express");
const ConstituencyController = require("../Controllers/DistrictConstituecyController");

const app = express.Router();

app.get("/alldiscons", ConstituencyController.getConstDistrict);

module.exports = app;
