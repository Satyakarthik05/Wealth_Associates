const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const NRIMember = require("../Models/NriModel");

const secret = "Wealth@123";

const NRIMemberSign = async (req, res) => {
  const { Name, Country, Locality, Occupation, MobileIN, MobileCountryNo } =
    req.body;

  try {
    const existingMember = await NRIMember.findOne({ MobileIN });
    if (existingMember) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }

    const newMember = new NRIMember({
      Name,
      Password: "wa1234",
      Country,
      Locality,
      Occupation,
      MobileIN,
      MobileCountryNo,
    });

    await newMember.save();

    res.status(200).json({
      message: "NRI Member Registration successful",
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const NRILogin = async (req, res) => {
  const { MobileNumber, Password } = req.body;

  try {
    const Nri = await NRIMember.findOne({
      MobileIN: MobileNumber,
      Password: Password,
    });
    if (!Nri) {
      return res
        .status(400)
        .json({ message: "Invalid MobileNumber or Password" });
    }

    const token = await jwt.sign({ NriId: Nri._id }, secret, {
      expiresIn: "30d",
    });

    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.log(error);
  }
};

const getNRI = async (req, res) => {
  try {
    const agentDetails = await NRIMember.findById(req.NriId);
    if (!agentDetails) {
      return res.status(200).json({ message: "Agent not found" });
    } else {
      res.status(200).json(agentDetails);
    }
  } catch (error) {
    console.log(error);
  }
};

const updateNRIDetails = async (req, res) => {
  const { MobileIN, Name, Country, Locality, Password, Occupation } = req.body;

  try {
    const existingAgent = await NRIMember.findOne({ MobileIN });
    if (!existingAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Update agent details
    existingAgent.Name = Name || existingAgent.Name;
    existingAgent.Password = Password || existingAgent.Password;
    existingAgent.Country = Country || existingAgent.Country;
    existingAgent.Locality = Locality || existingAgent.Locality;
    existingAgent.Occupation = Occupation || existingAgent.Occupation;

    await existingAgent.save();

    res.status(200).json({ message: "Nri details updated successfully" });
  } catch (error) {
    console.error("Error updating agent details:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchReferredNRIMembers = async (req, res) => {
  try {
    const referredMembers = await NRIMember.find();
    res.status(200).json({ message: "Your NRI Members", referredMembers });
  } catch (error) {
    console.error("Error fetching referred members:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  NRIMemberSign,
  fetchReferredNRIMembers,
  getNRI,
  updateNRIDetails,
  NRILogin,
};
