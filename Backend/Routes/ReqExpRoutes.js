const express = require("express");
const ReqExp = require("../Controllers/ExpReqController");

const app = express.Router();

app.post("/direqexp", ReqExp.RequestExpert);

module.exports = app;
