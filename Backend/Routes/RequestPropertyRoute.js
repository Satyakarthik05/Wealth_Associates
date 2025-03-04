const express = require("express");
const RequestProperty = require("../Controllers/RequestProperty");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");
const verifyUser = require("../middleWares/VerifyUser");

const app = express.Router();

app.post("/requestProperty", RequestProperty.PropertyRequest);
app.get("/getallrequestProperty", RequestProperty.GetRequsestedPropertys);
app.get(
  "/myrequestedPropertys",
  verifyUser,
  RequestProperty.GetMyRequestedPropertys
);
app.delete("/delete/:id", RequestProperty.DeleteRequestedProperty);

// New route for updating a requested property
app.put(
  "/updateProperty/:id",
  verifyUser,
  RequestProperty.UpdateRequestedProperty
);

module.exports = app;
