const express = require("express");
const AgentController = require("../Controllers/AgentController");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");
const ForgetPassword = require("../Controllers/ForgetPasswordController");

const app = express.Router();

app.post("/AgentRegister", AgentController.AgentSign);
app.post("/AgentLogin", AgentController.AgentLogin);
app.get("/AgentDetails", verifyAgentToken, AgentController.getAgent);
app.get("/myAgents", verifyAgentToken, AgentController.fetchReferredAgents);
app.post("/ForgetPassword", ForgetPassword.ForgetPassword);

module.exports = app;
