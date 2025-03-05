const express = require("express");
const {
  registerInvestors,
  fetchSkilledLabours,
  fetchAgentInvestors,
  fetchAdminInvestors,
  deleteInvestor,
  fetchInvestors,
} = require("../Controllers/InvestorController");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");
const verifyUser = require("../middleWares/VerifyUser");

const router = express.Router();

// Route to register a skilled labour
router.post("/register", registerInvestors);

// Route to fetch all skilled labours
router.get("/list", fetchInvestors);
router.get("/getagentinvestor", verifyUser, fetchAgentInvestors);
router.get("/AdminInvestor", fetchAdminInvestors);
router.delete("/delete/:id", deleteInvestor);

module.exports = router;
