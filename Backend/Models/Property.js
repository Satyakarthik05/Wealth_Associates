const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyType: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    photo: { type: String, required: true },
    PostedBy: { type: Number, required: true }, // Adjust type if necessary
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
