const ExpReq = require("../Models/ReqExp");

const RequestExpert = async (req, res) => {
  const { expertType, reason, WantedBy, UserType } = req.body;

  // Validate required fields
  if (!expertType || !WantedBy || !UserType) {
    return res
      .status(400)
      .json({ message: "Expert type, wantedBy, and userType are required." });
  }

  try {
    // Create a new expert request document
    const newRequest = new ExpReq({
      expertType,
      reason,
      WantedBy,
      UserType,
    });

    // Save the document to the database
    await newRequest.save();

    res.status(201).json({ message: "Request submitted successfully!" });
  } catch (error) {
    console.error("Error saving request:", error);
    res.status(500).json({ message: "Failed to submit request." });
  }
};

module.exports = { RequestExpert };
