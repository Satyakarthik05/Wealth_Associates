const express = require("express");
const router = express.Router();
const Expert = require("../Models/Expert"); // Import the Expert model

/**
 * @route   POST /api/experts
 * @desc    Add a new expert
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { name, expertType, qualification, experience, location, mobile } = req.body;

    // Validate required fields
    if (!name || !expertType || !qualification || !experience || !location || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new expert entry
    const newExpert = new Expert({
      name,
      expertType,
      qualification,
      experience,
      location,
      mobile,
    });

    await newExpert.save();
    res.status(201).json({ message: "Expert added successfully", expert: newExpert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @route   GET /api/experts
 * @desc    Get all experts
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const experts = await Expert.find();
    res.json(experts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @route   GET /api/experts/:id
 * @desc    Get a single expert by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }
    res.json(expert);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @route   PUT /api/experts/:id
 * @desc    Update an expert's details
 * @access  Public
 */
router.put("/:id", async (req, res) => {
  try {
    const { name, expertType, qualification, experience, location, mobile } = req.body;
    const updatedExpert = await Expert.findByIdAndUpdate(
      req.params.id,
      { name, expertType, qualification, experience, location, mobile },
      { new: true }
    );
    if (!updatedExpert) {
      return res.status(404).json({ message: "Expert not found" });
    }
    res.json({ message: "Expert updated successfully", expert: updatedExpert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @route   DELETE /api/experts/:id
 * @desc    Delete an expert
 * @access  Public
 */
router.delete("/:id", async (req, res) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: "Expert not found" });
    }
    res.json({ message: "Expert deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
