const {
  District,
  Constituency,
  Expertise,
  Occupation,
  PropertyType,
} = require("../Models/Districts");

const district = async (req, res) => {
  try {
    const districts = await District.find();
    res.json(districts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching districts", error: error.message });
  }
};
const constituency = async (req, res) => {
  try {
    const districts = await Constituency.find();
    res.json(districts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching districts", error: error.message });
  }
};

const Expertis = async (req, res) => {
  try {
    const districts = await Expertise.find();
    res.json(districts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching districts", error: error.message });
  }
};

const Occupations = async (req, res) => {
  try {
    const districts = await Occupation.find();
    res.json(districts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching districts", error: error.message });
  }
};

const PropertyTypes = async (req, res) => {
  try {
    const districts = await PropertyType.find();
    res.json(districts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching districts", error: error.message });
  }
};

module.exports = {
  district,
  constituency,
  Expertis,
  Occupations,
  PropertyTypes,
};
