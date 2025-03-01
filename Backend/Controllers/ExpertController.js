const expertModel = require("../Models/ExpertModel");

const registerExpert = async (req, res) => {
  const { Name, Experttype, Qualification, Experience, Locations, Mobile } =
    req.body;
  const newExpert = new expertModel({
    Name,
    Experttype,
    Qualification,
    Experience,
    Locations,
    Mobile,
  });

  newExpert.save()

  if (newExpert) {
    res.status(200).json({ message: "Expert Registered successfully" });
  } else {
    return res.status(400).json({ message: "Expert not Registered" });
  }
};

const getExpertsByType = async (req, res) => {
  try {
    const { expertType } = req.params;
    const experts = await expertModel.find({ Experttype: expertType });

    if (experts.length > 0) {
      res.status(200).json({ success: true, experts });
    } else {
      res.status(404).json({ success: false, message: "No experts found for this type" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


module.exports = { registerExpert ,getExpertsByType };