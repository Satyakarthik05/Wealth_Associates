const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  propertyType: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
});

const Property = mongoose.model("PostProperty", PropertySchema);
module.exports = Property;
