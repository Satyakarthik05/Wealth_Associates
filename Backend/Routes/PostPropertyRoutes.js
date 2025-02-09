const express = require("express");
const multer = require("multer");
const PostPropertyController = require("../Controllers/PostProperty");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// const upload = multer({ storage });
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set a 5MB file size limit
});

// Define routes
router.post(
  "/addProperty",
  upload.single("photo"),
  PostPropertyController.createProperty
);
// router.get("/", getAllProperties);

module.exports = router;
