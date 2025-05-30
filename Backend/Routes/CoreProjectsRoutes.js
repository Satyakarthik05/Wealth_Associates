const express = require("express");
const multer = require("multer");
const CoreClientController = require("../Controllers/CoreProjectsController");

const router = express.Router();

// 📁 Multer storage for Core Projects
const coreStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./coreProjects");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const coreUpload = multer({
  storage: coreStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// 📁 Multer storage for Value Projects
const valueStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./valueProjects"); // ✅ Use separate folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const valueUpload = multer({
  storage: valueStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// ✅ Core Projects Routes
router.post(
  "/addCoreProjects",
  coreUpload.single("photo"),
  CoreClientController.createCoreProjects
);
router.get("/getallcoreprojects", CoreClientController.GetAllcoreProjects);

// ✅ Value Projects Routes
router.post(
  "/addValueProjects",
  valueUpload.single("photo"), // ✅ Use valueUpload here
  CoreClientController.createValueProjects
);
router.get("/getallValueprojects", CoreClientController.GetAllValueProjects);

module.exports = router;
