const express = require("express");
const RequestedExpert = require("../Models/RequestExpert");

// Register a new requested expert
const registerExpertRequest = async (req, res) => {
  try {
    const { Name, MobileNumber, ExpertType, ExpertName, RequestedBy } =
      req.body;

    if (!Name || !MobileNumber || !ExpertType || !ExpertName || !RequestedBy) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newRequest = new RequestedExpert({
      Name,
      MobileNumber,
      ExpertType,
      ExpertName,
      RequestedBy,
    });

    await newRequest.save();
    res
      .status(200)
      .json({ message: "Expert request registered successfully.", newRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch all requested experts
const getAllRequestedExperts = async (req, res) => {
  try {
    const experts = await RequestedExpert.find();
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { registerExpertRequest, getAllRequestedExperts };
