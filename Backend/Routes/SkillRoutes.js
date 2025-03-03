const express = require("express");
const {
  registerSkilledLabour,
  fetchSkilledLabours,
  fetchAddedSkillLAbours,
  fetchAdminSkill,
  deleteSkillLabour,
} = require("../Controllers/SkillController");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");
const verifyUser = require("../middleWares/VerifyUser");

const router = express.Router();

// Route to register a skilled labour
router.post("/register", registerSkilledLabour);

// Route to fetch all skilled labours
router.get("/list", fetchSkilledLabours);
router.get("/getmyskilllabour", verifyUser, fetchAddedSkillLAbours);
router.get("/AdminLabour", fetchAdminSkill);
router.delete("/delete/:id", deleteSkillLabour);

module.exports = router;
