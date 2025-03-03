const express = require("express");
const {
  registerSkilledLabour,
  fetchSkilledLabours,
  fetchAddedSkillLAbours,
} = require("../Controllers/SkillController");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");
const verifyUser = require("../middleWares/VerifyUser");

const router = express.Router();

// Route to register a skilled labour
router.post("/register", registerSkilledLabour);

// Route to fetch all skilled labours
router.get("/list", fetchSkilledLabours);
router.get("/getmyskilllabour", verifyUser, fetchAddedSkillLAbours);

module.exports = router;
