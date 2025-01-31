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
  ReferralCode: {
    type: String,
    required: true,
  },
});

const Agent = mongoose.model("Agent_Wealth_Associate", AgentScheme);
module.exports = Agent;
