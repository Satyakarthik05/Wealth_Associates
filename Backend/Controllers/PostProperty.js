const fs = require("fs");
const path = require("path");
const Property = require("../Models/Property");
const AgentSchema = require("../Models/AgentModel");
const CustomerSchema = require("../Models/Customer");
const CoreSchema = require("../Models/CoreModel");
const mongoose = require("mongoose");

// Create a new property
const createProperty = async (req, res) => {
  try {
    let { propertyType, location, price, PostedBy } = req.body;
    console.log("PostedBy in request:", PostedBy);

    // Validate PostedBy
    if (!PostedBy) {
      return res
        .status(400)
        .json({ message: "PostedBy (MobileNumber) is required." });
    }

    // Validate photo
    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Photo is required." });
    }

    // Clean and validate price
    if (typeof price === "string") {
      price = price.replace(/,/g, "").trim();

      const parts = price.split(".");
      if (parts.length > 2) {
        price = parts[0] + "." + parts[1]; // Keep only the first decimal part
      }
    }

    // Convert to number
    price = parseFloat(price);
    if (isNaN(price)) {
      return res.status(400).json({ message: "Invalid price format." });
    }

    // Find user by PostedBy number
    const agent = await AgentSchema.findOne({ MobileNumber: PostedBy });
    const coreUser = await CoreSchema.findOne({ MobileNumber: PostedBy });
    const customerUser = await CustomerSchema.findOne({
      MobileNumber: PostedBy,
    });

    let postedByUser = null;
    let userType = "";

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
      postedByUser = {
        MobileNumber: "998877",
        FullName: "Admin",
        Email: "",
        MyRefferalCode: "",
      };
      userType = "admin";
    }

    // Create and save new property
    const newProperty = new Property({
      propertyType,
      location,
      price,
      photo: photoPath,
      PostedBy: postedByUser.MobileNumber,
      PostedUserType: userType,
    });

    await newProperty.save();

    // Optional: Send data to call center API
    try {
      const callCenterResponse = await axios.get(
        "https://00ce1e10-d2c6-4f0e-a94f-f590280055c6.neodove.com/integration/custom/86b467c1-3e77-48c2-8c52-821ba2d27eb4/leads",
        {
          params: {
            name: postedByUser.FullName,
            mobile: postedByUser.MobileNumber,
            email: postedByUser.Email,
            detail1: `PropertyType:${propertyType}, Location:${location}, Price:${price}, ReferralCode:${postedByUser.MyRefferalCode}`,
          },
        }
      );
      console.log("Call center API response:", callCenterResponse.data);
    } catch (apiError) {
      console.error("Failed to call call center API:", apiError.message);
    }

    return res.status(200).json({
      message: "Property added successfully",
      newProperty,
    });
  } catch (error) {
    console.error("Error in createProperty:", error);
    return res.status(500).json({
      message: "Error adding property",
      error,
    });
  }
};

// module.exports = { createProperty };

// Get all properties
const GetAllPropertys = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Error fetching properties", error });
  }
};

// Get properties posted by the logged-in user
const GetMyPropertys = async (req, res) => {
  try {
    const mobileNumber = req.mobileNumber;
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

// Get properties posted by admin
const AdminProperties = async (req, res) => {
  try {
    const properties = await Property.find({ PostedUserType: "admin" });

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

// Delete a property
const deletProperty = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received delete request for ID:", id);

    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// **Edit Property Controller**
const editProperty = async (req, res) => {
  try {
    const { id } = req.params; // Property ID
    const { propertyType, location, price } = req.body;

    let updatedFields = { propertyType, location, price };

    // Handle photo update
    if (req.file) {
      updatedFields.photo = `/uploads/${req.file.filename}`;
    }

    // Update the property in the database
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res
      .status(200)
      .json({ message: "Property updated successfully", updatedProperty });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: "Error updating property", error });
  }
};

const updatePropertyAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProperty = await Property.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createProperty,
  GetAllPropertys,
  GetMyPropertys,
  AdminProperties,
  deletProperty,
  editProperty,
  updatePropertyAdmin,
};
