const express = require("express");
const AgentController = require("../Controllers/AgentController");

const app = express.Router();

app.post("/AgentRegister", AgentController.AgentSign);
app.post("/AgentLogin", AgentController.AgentLogin);

module.exports = app;
