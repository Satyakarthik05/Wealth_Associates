const express = require("express");
const axios = require("axios");
const Expert = require("../Models/ExpertModel");

// const sendNotification = async (MobileNumber, message) => {
//   try {
//     const apiUrl = process.env.NOTIFICATION_API_URL || "http://example.com/api/send";
//     const params = {
//       apiKey: process.env.NOTIFICATION_API_KEY || "your-api-key",
//       mobile: MobileNumber,
//       message,
//     };

//     const response = await axios.post(apiUrl, params);
//     if (response.data.success) {
//       console.log("Notification sent successfully:", response.data);
//       return response.data;
//     } else {
//       throw new Error("Failed to send notification");
//     }
//   } catch (error) {
//     console.error("Error in sendNotification function:", error.message);
//     throw new Error("Notification sending failed");
//   }
// };

const registerExpert = async (req, res) => {
  const { Name, Qualification, Experience, Location, Mobile, ExpertType } = req.body;

  try {
    const existingExpert = await Expert.findOne({ Mobile });
    if (existingExpert) {
      return res.status(400).json({ message: "Mobile number already exists" });
    }

    const newExpert = new Expert({
      Name,
      Qualification,
      Experience,
      Location,
      Mobile,
      ExpertType,
    });

    await newExpert.save();
    // await sendNotification(Mobile, "Welcome to our expert panel!");

    res.status(201).json({ message: "Expert registered successfully" });
  } catch (error) {
    console.error("Error during expert registration:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getExpertsByType = async (req, res) => {
  try {
    const { ExpertType } = req.params;
    const experts = await Expert.find({ ExpertType: ExpertType });

    if (experts.length > 0) {
      res.status(200).json({ success: true, experts });
    } else {
      res.status(404).json({ success: false, message: "No experts found for this type" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { registerExpert, getExpertsByType };