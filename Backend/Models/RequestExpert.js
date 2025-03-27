const mongoose = require("mongoose");

const RequestExpert = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  MobileNumber: {
    type: String,
    required: true,
  },
  ExpertType: {
    type: String,
    required: true,
  },
  ExpertName: {
    type: String,
    required: true,
  },
  RequestedBy: {
    type: String,
    required: true,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  resolvedAt: {
    type: Date,
  },
});

const reqexp = new mongoose.model("RequestedExperts", RequestExpert);

module.exports = reqexp;
