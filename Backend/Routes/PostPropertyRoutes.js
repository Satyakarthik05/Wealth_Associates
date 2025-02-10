const express = require("express");
const multer = require("multer");
const PostPropertyController = require("../Controllers/PostProperty");
const verifyAgentToken = require("../middleWares/VerifyAgentToken");

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
router.get(
  "/getMyPropertys",
  verifyAgentToken,
  PostPropertyController.GetMyPropertys
);

module.exports = router;
