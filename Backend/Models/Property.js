const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyType: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    photo: { type: String, required: true },
    PostedBy: { type: Number, required: true },
    PostedUserType: { type: String }, // agent, coreMember, customerMember, admin
    editedAt: { type: Date }, // Stores the last edit timestamp
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
