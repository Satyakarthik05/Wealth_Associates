const express = require("express");
const { NRIMemberSign, fetchReferredNRIMembers } = require("../Controllers/NriController");

const router = express.Router();

// Route for NRI Member Registration
router.post("/register", NRIMemberSign);

// Route to fetch referred NRI members
router.get("/referred-members", fetchReferredNRIMembers);

module.exports = router;
