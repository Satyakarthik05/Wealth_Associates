const express = require("express");
const CoreController = require("../Controllers/CoreController");
const verifyCoreToken = require("../middleWares/VerifyCoreToken");

const app = express.Router();

app.post("/CoreRegister", CoreController.CoreSign);
app.get("/getcore", verifyCoreToken, CoreController.getCore);
app.get("/getallcoremembers", CoreController.getAllCoreMembers);
app.post("/coreLogin", CoreController.coreLogin);
app.get("/myagents", verifyCoreToken, CoreController.fetchReferredAgents);
app.get("/mycustomers", verifyCoreToken, CoreController.fetchReferredCustomers);

module.exports = app;
