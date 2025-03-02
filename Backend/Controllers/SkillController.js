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
    // Ensure AgentId is provided
    if (!req.AgentId) {
      return res.status(400).json({ error: "Agent ID is missing in request" });
    }

    // Find the authenticated agent
    const authenticatedAgent = await AgentSchema.findById(req.AgentId).lean();
    if (!authenticatedAgent) {
      return res.status(404).json({ error: "Authenticated agent not found" });
    }

    // Get the agent's mobile number
    const myMobileNumber = authenticatedAgent.MobileNumber;
    if (!myMobileNumber) {
      return res.status(400).json({ error: "Agent mobile number not found" });
    }

    // Fetch skilled labours added by the agent
    const referredAgents = await SkilledLabour.find({
      AddedBy: myMobileNumber,
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

module.exports = {
  registerSkilledLabour,
  fetchSkilledLabours,
  fetchAddedSkillLAbours,
};
