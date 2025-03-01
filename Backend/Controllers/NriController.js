const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const NRIMember = require("../Models/NriModel");

const secret = "NRI@Secure123";

const NRIMemberSign = async (req, res) => {
  const { Name, Country, Locality, Occupation, MobileIN, MobileCountryNo } = req.body;

  try {
    const existingMember = await NRIMember.findOne({ MobileIN });
    if (existingMember) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }

    const newMember = new NRIMember({
      Name,
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

const fetchReferredNRIMembers = async (req, res) => {
  try {
    const referredMembers = await NRIMember.find();
    res.status(200).json({ message: "Your NRI Members", referredMembers });
  } catch (error) {
    console.error("Error fetching referred members:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { NRIMemberSign, fetchReferredNRIMembers };
