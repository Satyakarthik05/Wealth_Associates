const express = require("express");
const SkilledLabour = require("../Models/SkillModel");

const registerSkilledLabour = async (req, res) => {
  const { FullName, SelectSkill, Location, MobileNumber } = req.body;

  try {
    const existingLabour = await SkilledLabour.findOne({ MobileNumber });
    if (existingLabour) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }

    const newLabour = new SkilledLabour({
      FullName,
      SelectSkill,
      Location,
      MobileNumber,
    });

    await newLabour.save();

    res.status(200).json({
      message: "Skilled Labour Registration successful",
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchSkilledLabours = async (req, res) => {
  try {
    const skilledLabours = await SkilledLabour.find();
    res.status(200).json({ message: "Your Skilled Labours", skilledLabours });
  } catch (error) {
    console.error("Error fetching skilled labours:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerSkilledLabour, fetchSkilledLabours };
