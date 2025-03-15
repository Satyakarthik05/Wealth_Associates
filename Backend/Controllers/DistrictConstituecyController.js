const mongoose = require("mongoose");
const Constituency = require("../Models/DistrictsConstituencysModel");

const getConstDistrict = async (req, res) => {
  try {
    const data = await Constituency.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getConstDistrict };
