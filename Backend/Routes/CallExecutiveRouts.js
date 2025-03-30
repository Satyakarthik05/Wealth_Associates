const express = require("express");
const {
  addCallExecutive,
  getCallExecutives,
  deleteCallExecutive,
  updateCallExecutive,
  CallExecutiveLogin,
  myagents,
} = require("../Controllers/CallExecutiveController");
const callcentertoken = require("../middleWares/callcentertoken");

const router = express.Router();

// Routes for call executives
router.post("/addcall-executives", addCallExecutive);
router.post("/logincall-executives", CallExecutiveLogin);

router.get("/call-executives", getCallExecutives);
router.put("/call-executives/:id", updateCallExecutive);
router.delete("/call-executives/:id", deleteCallExecutive);
router.get("/myagents", callcentertoken, myagents);
router.get("/mycustomers", callcentertoken, myCustomers);

module.exports = router;
