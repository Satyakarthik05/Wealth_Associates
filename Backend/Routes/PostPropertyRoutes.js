const express = require("express");
const multer = require("multer");
const PostPropertyController = require("../Controllers/PostProperty");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");
const CustomerToken = require("../middleWares/VerifyCustomerToken");
const CoreToken = require("../middleWares/VerifyCoreToken");
const verifyUser = require("../middleWares/VerifyUser");

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
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB file size limit
});

// ✅ **Add Property**
router.post(
  "/addProperty",
  upload.single("photo"),
  PostPropertyController.createProperty
);

// ✅ **Get All Properties**
router.get("/getallPropertys", PostPropertyController.GetAllPropertys);

// ✅ **Get Admin Properties**
router.get("/getAdminProperties", PostPropertyController.AdminProperties);

// ✅ **Delete Property**
router.delete("/delete/:id", PostPropertyController.deletProperty);

// ✅ **Get My Properties**
router.get(
  "/getMyPropertys",
  verifyUser,
  PostPropertyController.GetMyPropertys
);

// ✅ **Edit Property (Newly Added)**
router.put(
  "/editProperty/:id",
  upload.single("photo"),
  PostPropertyController.editProperty
);

module.exports = router;
