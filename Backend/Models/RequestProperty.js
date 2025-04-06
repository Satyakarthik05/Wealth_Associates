const mongoose = require("mongoose");

const RequestpropertySchema = new mongoose.Schema({
  propertyTitle: { type: String, required: true },
  propertyType: { type: String, required: true },
  location: { type: String, required: true },
  Budget: { type: String, required: true },
  PostedBy: { type: String, required: true }, 
  Approved: {
    type: String,
    enum: ["Pending", "Done"], // Add this to enforce specific values
    default: "Pending",
  },
});

const requestProperty = mongoose.model(
  "RequestProperty",
  RequestpropertySchema
);

module.exports = requestProperty;
