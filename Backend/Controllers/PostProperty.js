const fs = require("fs");
const path = require("path");
const Property = require("../Models/Property");
const AgentSchema = require("../Models/AgentModel");
const CustomerSchema = require("../Models/Customer");
const CoreSchema = require("../Models/CoreModel");
const mongoose = require("mongoose");

// const createProperty = async (req, res) => {
//   try {
//     const { propertyType, location, price, PostedBy } = req.body;
//     console.log("PostedBy in request:", PostedBy);

//     if (!PostedBy) {
//       return res
//         .status(400)
//         .json({ message: "PostedBy (MobileNumber) is required." });
//     }

//     let photoPath = null;

//     if (req.file) {
//       photoPath = `/uploads/${req.file.filename}`;
//     } else {
//       return res.status(400).json({ message: "Photo is required." });
//     }

//     // Check if the agent exists using PostedBy (MobileNumber)
//     const agent = await AgentSchema.findOne({ MobileNumber: PostedBy });

//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found." });
//     }

//     // Create the new property
//     const newProperty = new Property({
//       propertyType,
//       location,
//       price,
//       photo: photoPath,
//       PostedBy: agent.MobileNumber, // Ensure it's stored correctly
//     });

//     await newProperty.save();

//     // Update the agent's PostedPropertys field by pushing the new property ID
//     agent.PostedPropertys.push(newProperty._id);
//     await agent.save();

//     // *Call NeoDove API after successfully posting the property*
//     const apiUrl = "https://00ce1e10-d2c6-4f0e-a94f-f590280055c6.neodove.com/integration/custom/961cec8f-9b5a-4d40-b653-115b74e12813/leads";

//     const payload = {
//       name: agent.FullName || "Unknown Agent", // Use agent's name if available
//       mobile: agent.MobileNumber,
//       email: agent.Email || "info@neodove.com",
//       detail1: `Property: ${propertyType}, Location: ${location}, Price: ${price},ReferralCode:${agent.MyRefferalCode}`
//     };

//     try {
//       const response = await axios.get(apiUrl, { params: payload });
//       console.log("NeoDove API Response:", response.data);
//     } catch (apiError) {
//       console.error("Failed to send data to NeoDove:", apiError);
//     }

//     res.status(200).json({ message: "Property added successfully", newProperty });
//   } catch (error) {
//     console.error("Error in createProperty:", error);
//     res.status(500).json({ message: "Error adding property", error });
//   }
// };

const createProperty = async (req, res) => {
  try {
    const { propertyType, location, price, PostedBy } = req.body;
    console.log("PostedBy in request:", PostedBy);

    if (!PostedBy) {
      return res
        .status(400)
        .json({ message: "PostedBy (MobileNumber) is required." });
    }

    let photoPath = null;

    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Photo is required." });
    }

    // Check if the user exists in AgentSchema, CoreSchema, or CustomerSchema using PostedBy (MobileNumber)
    const agent = await AgentSchema.findOne({ MobileNumber: PostedBy });
    const coreUser = await CoreSchema.findOne({ MobileNumber: PostedBy });
    const customerUser = await CustomerSchema.findOne({
      MobileNumber: PostedBy,
    });

    let postedByUser = null;
    let userType = "";

    // Determine which user type is posting the property
    if (agent) {
      postedByUser = agent;
      userType = "agent";
    } else if (coreUser) {
      postedByUser = coreUser;
      userType = "coreMember";
    } else if (customerUser) {
      postedByUser = customerUser;
      userType = "customerMember";
    } else {
      // If mobile number is not found in any database, mark as admin posted
      postedByUser = { MobileNumber: "998877" }; // Default admin number
      userType = "admin";
    }

    // Create the new property
    const newProperty = new Property({
      propertyType,
      location,
      price,
      photo: photoPath,
      PostedBy: postedByUser.MobileNumber, // Store the mobile number
      PostedUserType: userType, // Store the user type (agent, coreMember, customerMember, or admin)
    });

    await newProperty.save();

    // Update the user's PostedPropertys field by pushing the new property ID (if not admin)
    // if (agent) {
    //   agent.PostedPropertys.push(newProperty._id);
    //   await agent.save();
    // }
    // if (coreUser) {
    //   coreUser.PostedPropertys.push(newProperty._id);
    //   await coreUser.save();
    // }
    // if (customerUser) {
    //   customerUser.PostedPropertys.push(newProperty._id);
    //   await customerUser.save();
    // }

    res
      .status(200)
      .json({ message: "Property added successfully", newProperty });
  } catch (error) {
    console.error("Error in createProperty:", error);
    res.status(500).json({ message: "Error adding property", error });
  }
};

const GetAllPropertys = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Error fetching properties", error });
  }
};

const GetMyPropertys = async (req, res) => {
  try {
    const mobileNumber = req.mobileNumber; // Get mobile number from middleware
    const userType = req.userType; // Get user type from middleware

    // Fetch properties where PostedBy matches the user's MobileNumber
    const properties = await Property.find({ PostedBy: mobileNumber });

    if (!properties || properties.length === 0) {
      return res
        .status(200)
        .json({ message: "No properties found for this user", MyPosts: [] });
    }

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Error fetching properties", error });
  }
};

// router.get("/properties", async (req, res) => {
//   try {
//     const properties = await Property.find();
//     res.status(200).json(properties);
//   } catch (error) {
//     console.error("Error fetching properties:", error);
//     res.status(500).json({ message: "Error fetching properties", error });
//   }
// });

module.exports = { createProperty, GetAllPropertys, GetMyPropertys };
