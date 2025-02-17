const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Agent = require("../Models/AgentModel");
const CustomerSchema = require("../Models/Customer");

secret = "Wealth@123";

const sendSMS = async (MobileNumber, Password, refferedby) => {
  try {
    const apiUrl =
      process.env.SMS_API_URL || "http://bulksms.astinsoft.com/api/v2/sms/Send";
    const params = {
      UserName: process.env.SMS_API_USERNAME || "wealthassociates",
      APIKey: process.env.SMS_API_KEY || "88F40D9F-0172-4D25-9CF5-5823211E67E7",
      MobileNo: MobileNumber,
      Message: `Welcome to Wealth Associates\nThank you for registering\n\nLogin Details:\nID: ${MobileNumber}\nPassword: ${Password}\nReferral code: ${refferedby}\nFor Any Query - 7796356789`,
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

const CustomerSign = async (req, res) => {
  const {
    FullName,
    MobileNumber,
    District,
    Contituency,
    Locations,
    Occupation,
    ReferredBy,
    MyRefferalCode,
  } = req.body;

  try {
    const existingCustomer = await CustomerSchema.findOne({ MobileNumber });
    if (existingCustomer) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }

    const Password = "WealthAssociation";
    const random = Math.floor(1000000 + Math.random() * 9000000);
    const refferedby = `${MyRefferalCode}${random}`;

    const finalReferredBy = ReferredBy || "WA0000000001";

    const newCustomer = new CustomerSchema({
      FullName,
      MobileNumber,
      Password,
      District,
      Contituency,
      Locations,
      Occupation,
      ReferredBy: finalReferredBy,
      MyRefferalCode: refferedby,
    });

    let smsResponse;
    try {
      smsResponse = await sendSMS(
        MobileNumber,
        FullName,
        Password,
        finalReferredBy,
        refferedby
      );
    } catch (error) {
      console.error("Failed to send SMS:", error.message);
      smsResponse = "SMS sending failed";
    }

    await newCustomer.save();

    const agent = await Agent.findOne({ MyRefferalCode: ReferredBy });

    if (agent) {
      if (!Array.isArray(agent.MyCustomers)) {
        agent.MyCustomers = [];
      }

      agent.MyCustomers.push(newCustomer._id);
      await agent.save();
    }
    try {
      const callCenterResponse = await axios.get(
        "https://00ce1e10-d2c6-4f0e-a94f-f590280055c6.neodove.com/integration/custom/9e7ab9c6-ae34-428a-9820-81a8009aa6c9/leads",
        {
          params: {
            name: FullName,
            mobile: MobileNumber,
            email: "wealthassociation.com@gmail.com",
            detail1: `RefereralCode:${refferedby},ReferredBy:${finalReferredBy}`, // Adjust this as necessary
          },
        }
      );

      console.log("Call center API response:", callCenterResponse.data);
    } catch (error) {
      console.error("Failed to call call center API:", error.message);
    }

    res.status(200).json({
      message: "Customer Registration successful",
      smsResponse,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchReferredCustomers = async (req, res) => {
  try {
    const authenticatedAgent = await Agent.findById(req.AgentId);
    if (!authenticatedAgent) {
      return res.status(404).json({ error: "Authenticated agent not found" });
    }

    const myReferralCode = authenticatedAgent.MyRefferalCode;

    const referredAgents = await CustomerSchema.find({
      ReferredBy: myReferralCode,
    });

    res.status(200).json({ message: "Your Agents", referredAgents });
  } catch (error) {
    console.error("Error fetching referred agents:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { CustomerSign, fetchReferredCustomers };
