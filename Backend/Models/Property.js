const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    propertyType: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    photos: { 
      type: [String], 
      required: true,
      validate: {
        validator: function(array) {
          return array.length > 0 && array.length <= 6;
        },
        message: "Must have between 1 and 6 photos"
      }
    },
    PostedBy: { type: String, required: true },
    fullName: { type: String },
    mobile: { type: String },
    propertyDetails: { type: String },
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

// Indexes for better query performance
propertySchema.index({ propertyType: 1 });
propertySchema.index({ location: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ PostedBy: 1 });
propertySchema.index({ createdAt: -1 });

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;