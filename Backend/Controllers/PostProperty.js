const fs = require("fs");
const path = require("path");
const Property = require("../Models/Property");
const AgentSchema = require("../Models/AgentModel");

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

    // Check if the agent exists using PostedBy (MobileNumber)
    const agent = await AgentSchema.findOne({ MobileNumber: PostedBy });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found." });
    }

    // Create the new property
    const newProperty = new Property({
      propertyType,
      location,
      price,
      photo: photoPath,
      PostedBy: agent.MobileNumber, // Ensure it's stored correctly
    });

    await newProperty.save();

    // Update the agent's PostedPropertys field by pushing the new property ID
    agent.PostedPropertys.push(newProperty._id);
    await agent.save();

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
    // Find the authenticated agent using AgentId
    const authenticatedAgent = await AgentSchema.findById(req.AgentId);
    if (!authenticatedAgent) {
      return res.status(404).json({ error: "Authenticated agent not found" });
    }

    // Retrieve the MobileNumber (used as PostedBy) of the authenticated agent
    const PostedBy = authenticatedAgent.MobileNumber;

    // Fetch all properties where PostedBy matches the authenticated agent's MobileNumber
    const MyPosts = await Property.find({ PostedBy });

    // If no posts are found, return an empty array
    if (!MyPosts || MyPosts.length === 0) {
      return res
        .status(200)
        .json({ message: "No properties found", MyPosts: [] });
    }

    // Return the found properties
    res.status(200).json(MyPosts);
  } catch (error) {
    console.error("Error fetching properties:", error.message);
    return res.status(500).json({ error: "Internal server error" });
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
