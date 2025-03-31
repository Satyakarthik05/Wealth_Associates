const express = require("express");
const {
  addCallExecutive,
  getCallExecutives,
  deleteCallExecutive,
  updateCallExecutive,
  CallExecutiveLogin,
  myagents,
  myCustomers,
  myProperties
  ,getCallExe
} = require("../Controllers/CallExecutiveController");
const callcentertoken = require("../middleWares/callcentertoken");

const router = express.Router();

// Routes for call executives
router.post("/addcall-executives", addCallExecutive);
router.post("/logincall-executives", CallExecutiveLogin);
router.get("/getcallexe",callcentertoken, getCallExe);

router.get("/call-executives", getCallExecutives);
router.put("/call-executives/:id", updateCallExecutive);
router.delete("/call-executives/:id", deleteCallExecutive);
router.get("/myagents", callcentertoken, myagents);
router.get("/mycustomers", callcentertoken, myCustomers);
router.get("/myproperties", callcentertoken,  myProperties);

module.exports = router;
