const express = require("express");
const Investors = require("../Models/InvestorModel");
const AgentSchema = require("../Models/AgentModel");

const registerInvestors = async (req, res) => {
  const {
    FullName,
    SelectSkill,
    Location,
    MobileNumber,
    AddedBy,
    RegisteredBy,
  } = req.body;

  try {
    const existingInvestor = await Investors.findOne({ MobileNumber });
    if (existingInvestor) {
      return res
        .status(400)
        .json({ message: "Mobile number already registered" });
    }

    const newInvestor = new Investors({
      FullName,
      SelectSkill,
      Location,
      MobileNumber,
      AddedBy,
      RegisteredBy,
    });

    await newInvestor.save();

    res.status(200).json({
      message: "Investor Registration successful",
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchInvestors = async (req, res) => {
  try {
    const skilledLabours = await Investors.find();
    res.status(200).json({ message: "Your Skilled Labours", skilledLabours });
  } catch (error) {
    console.error("Error fetching skilled labours:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const fetchAgentInvestors = async (req, res) => {
  try {
    const mobileNumber = req.mobileNumber; // Get mobile number from middleware
    const userType = req.userType;

    // Fetch skilled labours added by the agent
    const referredAgents = await Investors.find({
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

const fetchAdminInvestors = async (req, res) => {
  try {
    const mobileNumber = req.mobileNumber; // Get mobile number from middleware
    const userType = req.userType;

    // Fetch skilled labours added by the agent
    const referredAgents = await Investors.find({
      AddedBy: "Admin",
    }).lean();

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

const deleteInvestor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLabour = await Investors.findByIdAndDelete(id);
    if (!deletedLabour) {
      return res.status(404).json({ message: "Labour not found" });
    }
    res.status(200).json({ message: "Labour deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting labour", error });
  }
};

module.exports = {
  registerInvestors,
  fetchAdminInvestors,
  fetchInvestors,
  deleteInvestor,
  fetchAgentInvestors,
};
