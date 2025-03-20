const mongoose = require("mongoose");

const ApprovedpropertySchema = new mongoose.Schema(
  {
    propertyType: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    photo: { type: String, required: true },
    PostedBy: { type: Number, required: true },
    PostedUserType: { type: String },
    editedAt: { type: Date },
  },
  { timestamps: true }
);

const ApprovedProperty = mongoose.model(
  "ApprovedProperty",
  ApprovedpropertySchema
);

module.exports = ApprovedProperty;
