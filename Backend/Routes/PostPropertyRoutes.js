const express = require("express");
const multer = require("multer");
const PostPropertyController = require("../Controllers/PostProperty");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");
const CustomerToken = require("../middleWares/VerifyCustomerToken");
const CoreToken = require("../middleWares/VerifyCoreToken");
const verifyUser = require("../middleWares/VerifyUser");

const router = express.Router();

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
  limits: { fileSize: 20 * 1024 * 1024 }, // Increase the file size limit to 10MB
});

router.post(
  "/addProperty",
  upload.single("photo"),
  PostPropertyController.createProperty
);
router.get("/getallPropertys", PostPropertyController.GetAllPropertys);
router.get("/getAdminProperties", PostPropertyController.AdminProperties);
router.delete("/delete/:id", PostPropertyController.deletProperty);
router.get(
  "/getMyPropertys",
  verifyUser,
  PostPropertyController.GetMyPropertys
);

module.exports = router;
