const express = require("express");
const { registerExpert, getExpertsByType } = require("../Controllers/ExpertController");

const router = express.Router();

// Route to register a new expert
router.post("/register",registerExpert);

// Route to get all experts
router.get("/getexpert/:ExpertType",getExpertsByType);

module.exports = router;
