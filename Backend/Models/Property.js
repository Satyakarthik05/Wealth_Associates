const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyType: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    photo: { type: String, required: true },
    PostedBy: { type: Number, required: true },
    propertyDetails: { type: String, required: true },
    Constituency: { type: String, required: true },
    PostedUserType: { type: String },
    editedAt: { type: Date },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
