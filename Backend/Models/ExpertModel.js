const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema({
  Name: { type: String, require: true },
  Experttype: { type: String, require: true },
  Qualification: { type: String, require: true },
  Experience: { type: String, require: true },
  Locations: { type: String, require: true },
  Mobile: { type: String, require: true },
});

const expert = new mongoose.model("expertpanel", expertSchema);

module.exports = expert;