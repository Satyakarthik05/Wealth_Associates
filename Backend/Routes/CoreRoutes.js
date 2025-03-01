const express = require("express");
const CoreController = require("../Controllers/CoreController");
const verifyCoreToken = require("../middleWares/VerifyCoreToken");

const app = express.Router();

app.post("/CoreRegister", CoreController.CoreSign);
app.get("/getcore", verifyCoreToken, CoreController.getCore);
// app.post("/ForgetPassword", ForgetPassword.ForgetPassword);
app.post("/coreLogin", CoreController.coreLogin);

module.exports = app;
