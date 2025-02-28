const express = require("express");
const { registerExpert, getExperts } = require("../Controllers/ExpertController");

const router = express.Router();

// Route to register a new expert
router.post("/register",registerExpert);

// Route to get all experts
router.get("/list", getExperts);

module.exports = router;
