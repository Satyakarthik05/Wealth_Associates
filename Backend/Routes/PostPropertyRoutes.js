const express = require("express");
const multer = require("multer");
const PostPropertyController = require("../Controllers/PostProperty");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");
const CustomerToken = require("../middleWares/VerifyCustomerToken");
const CoreToken = require("../middleWares/VerifyCoreToken");
const verifyUser = require("../middleWares/VerifyUser");
const CoreClients = require("../Controllers/CoreClientsController");
const ApprovedProperty = require("../Controllers/ApprovedProprerty");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 20 * 1024 * 1024, // 20MB per file
    files: 6 // Maximum 6 files
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.match(/image\/(jpeg|jpg|png|gif)$/)) {
      return cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'), false);
    }
    cb(null, true);
  }
});

// ✅ *Add Property with Multiple Photos*
// Accept both single and multiple under 'photo'
router.post(
  "/addProperty",
  (req, res, next) => {
    upload.any()(req, res, next); // Accept any files
  },
  PostPropertyController.createProperty
);

router.post(
  "/addcoreclient",
  upload.single("photo"),
  CoreClients.createCoreClient
);

router.get("/getallPropertys", PostPropertyController.GetAllPropertys);
router.get("/getreqreff/:PostedBy", PostPropertyController.getReferrerDetails);

router.get("/getAdminProperties", PostPropertyController.AdminProperties);

router.delete("/delete/:id", PostPropertyController.deletProperty);
router.delete("/approvedelete/:id", ApprovedProperty.deletProperty);

router.get(
  "/getMyPropertys",
  verifyUser,
  PostPropertyController.GetMyPropertys
);
router.put(
  "/editProperty/:id",
  upload.single("photo"),
  PostPropertyController.editProperty
);
router.put("/update/:id", PostPropertyController.updatePropertyAdmin);
router.put("/approveupdate/:id", ApprovedProperty.updatePropertyAdmin);
router.get("/getApproveProperty", ApprovedProperty.GetAllApprovdPropertys);
router.post("/getlikedproperties", ApprovedProperty.GetlikedPropertys);
router.get("/getalllikedproperties", ApprovedProperty.GetAlllikedPropertys);
router.put("/callDone/:id", ApprovedProperty.callDoneforliked);
router.delete("/likeddelete/:id", ApprovedProperty.LikedDelete);
router.get("/getsoldProperty", ApprovedProperty.GetAllSoldedPropertys);
router.post("/approve/:id", ApprovedProperty.approveProperty);
router.post("/like", ApprovedProperty.LikeProperty);
router.post("/sold/:id", ApprovedProperty.SoldProperty);
router.get("/nearby/:constituency", PostPropertyController.getNearbyProperties);
router.post('/get-referral-data', PostPropertyController.getReferralAndPostedData);
router.post(
  "/getPropertyreffered",
  PostPropertyController.getReferredByDetails
);
// updateDynamicData;
router.patch("/:id/dynamic", PostPropertyController.updateDynamicData);

module.exports = router;
