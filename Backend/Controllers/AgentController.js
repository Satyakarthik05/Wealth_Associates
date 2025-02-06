const express = require("express");
const bcrypt = require("bcrypt");
const AgentSchema = require("../Models/AgentModel");
const jwt = require("jsonwebtoken");
const axios = require("axios");

secret = "Wealth@123";

const sendSMS = async (
  MobileNumber,
  FullName,
  Password,
  ReferralCode,
  refferedby
) => {
  try {
    const apiUrl =
      process.env.SMS_API_URL || "http://bulksms.astinsoft.com/api/v2/sms/Send";
    const params = {
      UserName: process.env.SMS_API_USERNAME || "wealthassociates",
      APIKey: process.env.SMS_API_KEY || "88F40D9F-0172-4D25-9CF5-5823211E67E7",
      MobileNo: MobileNumber,
      Message: `Welcome to Wealth Associates\nThank you for registering\n\nLogin Details:\nID: ${FullName}\nPassword: ${Password}\nReferral Code: ${ReferralCode}\n you referred by :${refferedby}\nFor Any Query - 7796356789`,
      SenderName: process.env.SMS_SENDER_NAME || "WTHASC",
      TemplateId: process.env.SMS_TEMPLATE_ID || "1707173279362715516",
      MType: 1,
    };

    const response = await axios.get(apiUrl, { params });

    if (
      response.data &&
      response.data.toLowerCase().includes("sms sent successfully")
    ) {
      console.log("SMS Sent Successfully:", response.data);
      return response.data;
    } else {
      console.error("SMS API Error:", response.data || response);
      throw new Error(response.data || "Failed to send SMS");
    }
  } catch (error) {
    console.error("Error in sendSMS function:", error.message);
    throw new Error("SMS sending failed");
  }
};

const AgentSign = async (req, res) => {
  const {
    FullName,
    MobileNumber,
    Email,
    District,
    Contituency,
    Locations,
    Expertise,
    Experience,
    ReferralCode,
    RefferedBy,
  } = req.body;

  try {
    const existingAgent = await AgentSchema.findOne({ MobileNumber });
    if (existingAgent) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }
    const Password = "WealthAssociation";
    const random = Math.floor(1000000 + Math.random() * 9000000);
    const refferedby = `${RefferedBy}${random}`;
    const newAgent = new AgentSchema({
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
      RefferedBy: refferedby,
    });

    let smsResponse;
    try {
      smsResponse = await sendSMS(
        MobileNumber,
        FullName,
        Password,
        ReferralCode,
        refferedby
      );
    } catch (error) {
      console.error("Failed to send SMS:", error.message);
      smsResponse = "SMS sending failed";
    }

    await newAgent.save();
    res.status(200).json({
      message: "Registration successful",
      smsResponse,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
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
