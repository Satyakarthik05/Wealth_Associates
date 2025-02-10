const express = require("express");
const RequestProperty = require("../Controllers/RequestProperty");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");

const app = express.Router();

app.post("/requestProperty", RequestProperty.PropertyRequest);
app.get(
  "/myrequestedPropertys",
  verifyAgentToken,
  RequestProperty.GetMyRequestedPropertys
);

module.exports = app;
