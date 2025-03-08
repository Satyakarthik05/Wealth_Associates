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

  newExpert.save();

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
      res
        .status(404)
        .json({ success: false, message: "No experts found for this type" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const modifyExpert = async (req, res) => {
  const { id } = req.params; // Get the expert ID from the URL params
  const { Name, Experttype, Qualification, Experience, Locations, Mobile } =
    req.body; // Get updated data from the request body

  try {
    const updatedExpert = await expertModel.findByIdAndUpdate(
      id,
      {
        Name,
        Experttype,
        Qualification,
        Experience,
        Locations,
        Mobile,
      },
      { new: true } // Return the updated document
    );

    if (updatedExpert) {
      res.status(200).json({
        success: true,
        message: "Expert updated successfully",
        expert: updatedExpert,
      });
    } else {
      res.status(404).json({ success: false, message: "Expert not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteExpert = async (req, res) => {
  const { id } = req.params; // Get the expert ID from the URL params

  try {
    const deletedExpert = await expertModel.findByIdAndDelete(id);

    if (deletedExpert) {
      res.status(200).json({
        success: true,
        message: "Expert deleted successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "Expert not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  registerExpert,
  getExpertsByType,
  modifyExpert,
  deleteExpert,
};
