const express = require("express");
const {
  NRIMemberSign,
  fetchReferredNRIMembers,
  NRILogin,
  getNRI,
  updateNRIDetails,
} = require("../Controllers/NriController");
const verifyNriToken = require("../middleWares/NriToken");

const router = express.Router();

// Route for NRI Member Registration
router.post("/register", NRIMemberSign);

// Route to fetch referred NRI members
router.get("/referred-members", fetchReferredNRIMembers);
router.post("/nrilogin", NRILogin);
router.get("/getnri", verifyNriToken, getNRI);
router.post("/updatenri", updateNRIDetails);

module.exports = router;
