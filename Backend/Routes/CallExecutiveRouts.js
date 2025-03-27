const express = require("express");
const {
  addCallExecutive,
  getCallExecutives,
  deleteCallExecutive,
  updateCallExecutive,
  CallExecutiveLogin,
} = require("../Controllers/CallExecutiveController");

const router = express.Router();

// Routes for call executives
router.post("/addcall-executives", addCallExecutive);
router.post("/logincall-executives", CallExecutiveLogin);

router.get("/call-executives", getCallExecutives);
router.put("/call-executives/:id", updateCallExecutive);
router.delete("/call-executives/:id", deleteCallExecutive);

module.exports = router;
