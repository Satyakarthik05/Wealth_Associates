const express = require("express");
const { registerSkilledLabour, fetchSkilledLabours } = require("../Controllers/SkillController");

const router = express.Router();

// Route to register a skilled labour
router.post("/register", registerSkilledLabour);

// Route to fetch all skilled labours
router.get("/list", fetchSkilledLabours);

module.exports = router;
