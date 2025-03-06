const express = require("express");
const SkilledLabour = require("../Models/SkillModel");
const AgentSchema = require("../Models/AgentModel");

const registerSkilledLabour = async (req, res) => {
  const {
    FullName,
    SelectSkill,
    Location,
    MobileNumber,
    AddedBy,
    RegisteredBy,
  } = req.body;

  try {
    const existingLabour = await SkilledLabour.findOne({ MobileNumber });
    if (existingLabour) {
      return res
        .status(400)
        .json({ message: "Mobile number already registered" });
    }

    const newLabour = new SkilledLabour({
      FullName,
      SelectSkill,
      Location,
      MobileNumber,
      AddedBy,
      RegisteredBy,
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

const fetchAddedSkillLAbours = async (req, res) => {
  try {
    const mobileNumber = req.mobileNumber; // Get mobile number from middleware
    const userType = req.userType;

    // Fetch skilled labours added by the agent
    const referredAgents = await SkilledLabour.find({
      AddedBy: mobileNumber,
    }).lean();

    // Return response
    return res.status(200).json({
      message: "Your Referred Skilled Labour",
      count: referredAgents.length,
      data: referredAgents,
    });
  } catch (error) {
    console.error("Error fetching referred agents:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const fetchAdminSkill = async (req, res) => {
  try {
    const mobileNumber = req.mobileNumber; // Get mobile number from middleware
    const userType = req.userType;

    // Fetch skilled labours added by the agent
    const referredAgents = await SkilledLabour.find({
      AddedBy: "Admin",
    }).lean();

    // Return response
    return res.status(200).json({
      message: "Your Referred Skilled Labour",
      count: referredAgents.length,
      data: referredAgents,
    });
  } catch (error) {
    console.error("Error fetching referred agents:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteSkillLabour = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLabour = await SkilledLabour.findByIdAndDelete(id);
    if (!deletedLabour) {
      return res.status(404).json({ message: "Labour not found" });
    }
    res.status(200).json({ message: "Labour deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting labour", error });
  }
};

module.exports = {
  registerSkilledLabour,
  fetchSkilledLabours,
  fetchAddedSkillLAbours,
  fetchAdminSkill,
  deleteSkillLabour,
};
