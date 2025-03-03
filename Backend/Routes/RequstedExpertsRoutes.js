const express = require("express");
const router = express.Router();
const {
  registerExpertRequest,
  getAllRequestedExperts,
} = require("../Controllers/RequestedExperts");

// Route to register a new expert request
router.post("/register", registerExpertRequest);

// Route to fetch all requested experts
router.get("/all", getAllRequestedExperts);

module.exports = router;
