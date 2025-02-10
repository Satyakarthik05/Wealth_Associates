const requestProperty = require("../Models/RequestProperty");
const AgentSchema = require("../Models/AgentModel");

const PropertyRequest = async (req, res) => {
  const { propertyTitle, propertyType, location, Budget, PostedBy } = req.body;
  try {
    const newrequestProperty = new requestProperty({
      propertyTitle,
      propertyType,
      location,
      Budget,
      PostedBy,
    });

    if (newrequestProperty) {
      await newrequestProperty.save();
      res
        .status(200)
        .json({
          message: "Requested property Successfully",
          newrequestProperty,
        });
    } else {
      res.status(400).json({ message: "Failed to Request property" });
    }
  } catch (error) {
    console.error("Error while requesting property:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const GetMyRequestedPropertys = async (req, res) => {
  try {
    // Find the authenticated agent using AgentId
    const authenticatedAgent = await AgentSchema.findById(req.AgentId);
    if (!authenticatedAgent) {
      return res.status(404).json({ error: "Authenticated agent not found" });
    }

    // Retrieve the MobileNumber (used as PostedBy) of the authenticated agent
    const PostedBy = authenticatedAgent.MobileNumber;

    // Fetch all properties where PostedBy matches the authenticated agent's MobileNumber
    const MyPosts = await requestProperty.find({ PostedBy });

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

module.exports = { PropertyRequest, GetMyRequestedPropertys };
