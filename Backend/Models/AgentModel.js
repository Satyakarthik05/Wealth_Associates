const mongoose = require("mongoose");

const AgentScheme = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
  },
  MobileNumber: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  District: {
    type: String,
    required: true,
  },
  Contituency: {
    type: String,
    required: true,
  },
  Locations: {
    type: String,
    required: true,
  },
  Expertise: {
    type: String,
    required: true,
  },
  Experience: {
    type: String,
    required: true,
  },
  ReferredBy: {
    type: String,
  },
  MyRefferalCode: {
    type: String,
  },
  Otp: {
    type: String,
  },
  PostedPropertys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
  RequestdPropertys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestProperty",
    },
  ],
  MyCustomers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
    },
  ],
});

const Agent = mongoose.model("Agent_Wealth_Associate", AgentScheme);
module.exports = Agent;
