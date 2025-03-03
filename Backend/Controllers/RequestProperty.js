const Agent = require("../Models/AgentModel");
const RequestProperty = require("../Models/RequestProperty");
const axios = require("axios");

const PropertyRequest = async (req, res) => {
  try {
    const { propertyTitle, propertyType, location, Budget, PostedBy } =
      req.body;

    if (!PostedBy) {
      return res
        .status(400)
        .json({ message: "PostedBy (MobileNumber) is required." });
    }

    let agent;
    if (PostedBy === "Admin") {
      // Use default admin details
      agent = {
        FullName: "Admin",
        MobileNumber: "0000000000", // Default admin mobile number
        Email: "admin@wealthassociation.com", // Default admin email
      };
    } else {
      // Find the agent using MobileNumber
      agent = await Agent.findOne({ MobileNumber: PostedBy });

      if (!agent) {
        return res.status(404).json({ message: "Agent not found." });
      }
    }

    // Create the new requested property
    const newRequestProperty = new RequestProperty({
      propertyTitle,
      propertyType,
      location,
      Budget,
      PostedBy: PostedBy,
    });

    await newRequestProperty.save();

    try {
      const callCenterResponse = await axios.get(
        "https://00ce1e10-d2c6-4f0e-a94f-f590280055c6.neodove.com/integration/custom/e811c9e8-53b4-457f-8c09-e4511b22c584/leads", // Use environment variable for API URL
        {
          params: {
            name: agent.FullName,
            mobile: agent.MobileNumber,
            email: agent.Email || "wealthassociation.com@gmail.com",
            detail1: `PropertyType:${propertyType},Location:${location},Budget:${Budget}`,
          },
        }
      );
      console.log("Call center API response:", callCenterResponse.data);
    } catch (error) {
      console.error("Failed to call call center API:", error.message);
      // Optionally, return an error response if the API call is critical
      // return res.status(500).json({ message: "Failed to call call center API", error: error.message });
    }

    res.status(200).json({
      message: "Requested property successfully",
      newRequestProperty,
    });
  } catch (error) {
    console.error("Error while requesting property:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const GetMyRequestedPropertys = async (req, res) => {
  try {
    // Find the authenticated agent using AgentId
    const mobileNumber = req.mobileNumber; // Get mobile number from middleware
    const userType = req.userType; // Get user type from middleware

    // Fetch properties where PostedBy matches the user's MobileNumber
    const properties = await RequestProperty.find({ PostedBy: mobileNumber });

    // If no posts are found, return an empty array
    if (!properties || properties.length === 0) {
      return res
        .status(200)
        .json({ message: "No properties found", properties: [] });
    }

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const GetRequsestedPropertys = async (req, res) => {
  try {
    const properties = await RequestProperty.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Error fetching properties", error });
  }
};

const DeleteRequestedProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  PropertyRequest,
  GetMyRequestedPropertys,
  GetRequsestedPropertys,
  DeleteRequestedProperty,
};
