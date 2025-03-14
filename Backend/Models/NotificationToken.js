const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  expoPushToken: { type: String, unique: true },
});

const TokenModel = mongoose.model("Token", TokenSchema);

module.exports = TokenModel;
