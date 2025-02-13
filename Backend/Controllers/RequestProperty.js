const Agent = require("../Models/AgentModel");
const RequestProperty = require("../Models/RequestProperty"); // Ensure you import the correct model

const PropertyRequest = async (req, res) => {
  try {
    const { propertyTitle, propertyType, location, Budget, PostedBy } =
      req.body;

    if (!PostedBy) {
      return res
        .status(400)
        .json({ message: "PostedBy (MobileNumber) is required." });
    }

    // Find the agent using MobileNumber
    const agent = await Agent.findOne({ MobileNumber: PostedBy });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found." });
    }

    // Create the new requested property
    const newRequestProperty = new RequestProperty({
      propertyTitle,
      propertyType,
      location,
      Budget,
      PostedBy: agent.MobileNumber,
    });

    await newRequestProperty.save();

    // Ensure RequestdPropertys is an array before pushing
    if (!Array.isArray(agent.RequestdPropertys)) {
      agent.RequestdPropertys = [];
    }

    agent.RequestdPropertys.push(newRequestProperty._id);
    await agent.save();

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
    const authenticatedAgent = await Agent.findById(req.AgentId);
    if (!authenticatedAgent) {
      return res.status(404).json({ error: "Authenticated agent not found" });
    }

    const PostedBy = authenticatedAgent.MobileNumber;
    const MyPosts = await RequestProperty.find({ PostedBy });

    // If no posts are found, return an empty array
    if (!MyPosts || MyPosts.length === 0) {
      return res
        .status(200)
        .json({ message: "No properties found", MyPosts: [] });
    }

    res.status(200).json(MyPosts);
  } catch (error) {
    console.error("Error fetching properties:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { PropertyRequest, GetMyRequestedPropertys };
