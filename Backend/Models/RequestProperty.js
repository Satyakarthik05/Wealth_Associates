const mongoose = require("mongoose");

const RequestpropertySchema = new mongoose.Schema({
  propertyTitle: { type: String, required: true },
  propertyType: { type: String, required: true },
  location: { type: String, required: true },
  Budget: { type: Number, required: true },
  PostedBy: { type: String, required: true }, // Change from ObjectId to String
});

const requestProperty = mongoose.model(
  "RequestProperty",
  RequestpropertySchema
);

module.exports = requestProperty;
