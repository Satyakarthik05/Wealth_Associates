const express = require("express");
const bcrypt = require("bcrypt");
const AgentSchema = require("../Models/AgentModel");
const jwt = require("jsonwebtoken");

secret = "Wealth@123";

const AgentSign = async (req, res) => {
  const {
    FullName,
    MobileNumber,
    Password,
    Email,
    District,
    Contituency,
    Locations,
    Expertise,
    Experience,
    ReferralCode,
  } = req.body;

  try {
    const Signup = await AgentSchema.findOne({
      MobileNumber: MobileNumber,
    });
    if (Signup) {
      return res.status(400).json({ message: "mobile number already exists" });
    }

    const newAgent = new AgentSchema({
      FullName,
      MobileNumber,
      Password: "Wealth",
      Email,
      District,
      Contituency,
      Locations,
      Expertise,
      Experience,
      ReferralCode,
    });

    await newAgent.save();
    res
      .status(200)
      .json({ message: "New agent wealth associate registration successful" });
    console.log("Registration Success");
  } catch (error) {
    console.log(error);
  }
};

const AgentLogin = async (req, res) => {
  const { MobileNumber, Password } = req.body;

  try {
    const Agents = await AgentSchema.findOne({
      MobileNumber: MobileNumber,
      Password: Password,
    });
    if (!Agents) {
      return res
        .status(400)
        .json({ message: "Invalid MobileNumber or Password" });
    }

    const token = await jwt.sign({ AgentId: Agents._id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { AgentSign, AgentLogin };
