const mongoose = require("mongoose");

const ConstituencySchema = new mongoose.Schema({
  parliament: { type: String, required: true },
  assemblies: [{ type: String }],
});

module.exports = mongoose.model("DistrictsConstituency", ConstituencySchema);
