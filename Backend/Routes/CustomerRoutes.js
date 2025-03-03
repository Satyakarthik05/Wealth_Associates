const express = require("express");
const CustomerController = require("../Controllers/CustomerControlller");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");
const verifCustomerToken = require("../middleWares/VerifyCustomerToken");
// const ForgetPassword = require("../Controllers/ForgetPasswordController");

const app = express.Router();

app.post("/CustomerRegister", CustomerController.CustomerSign);
// app.post("/AgentLogin", AgentController.AgentLogin);
app.get("/getcustomer", verifCustomerToken, CustomerController.getCustomer);
app.get(
  "/myCustomers",
  verifyAgentToken,
  CustomerController.fetchReferredCustomers
);
app.get("/allcustomers", CustomerController.getAllCustomers);
app.delete("/deletecustomer/:id", CustomerController.deleteCustomer);

app.post("/CustomerLogin", CustomerController.customerLogin);
// app.post("/ForgetPassword", ForgetPassword.ForgetPassword);

module.exports = app;
