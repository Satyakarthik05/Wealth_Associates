const express = require("express");
const CustomerController = require("../Controllers/CustomerControlller");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");
// const ForgetPassword = require("../Controllers/ForgetPasswordController");

const app = express.Router();

app.post("/CustomerRegister", CustomerController.CustomerSign);
// app.post("/AgentLogin", AgentController.AgentLogin);
// app.get("/AgentDetails", verifyAgentToken, AgentController.getAgent);
app.get(
  "/myCustomers",
  verifyAgentToken,
  CustomerController.fetchReferredCustomers
);
// app.post("/ForgetPassword", ForgetPassword.ForgetPassword);

module.exports = app;
