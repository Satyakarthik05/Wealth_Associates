const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyType: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    photo: { type: String, required: true },
    PostedBy: { type: Number, required: true },
    propertyDetails: { type: String, required: true },
    Constituency: { type: String },
    PostedUserType: { type: String },
    editedAt: { type: Date },

    // New field to store dynamic data
    dynamicData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    strict: false, // This allows the model to accept any additional fields
  }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
