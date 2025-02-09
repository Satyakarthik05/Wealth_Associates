const fs = require("fs");
const path = require("path");
const Property = require("../Models/Property");

const createProperty = async (req, res) => {
  try {
    const { propertyType, location, price, photo } = req.body;
    let photoPath = null;

    if (req.file) {
      // Case: Mobile app sends an actual file
      photoPath = req.file.path;
    } else if (photo.startsWith("data:image")) {
      // Case: Web sends a Base64 string
      const base64Data = photo.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");
      const imageName = `property_${Date.now()}.jpg`;
      const imagePath = path.join(__dirname, "../uploads", imageName);
      fs.writeFileSync(imagePath, imageBuffer);
      photoPath = `/uploads/${imageName}`;
    }

    // Save property to database
    const newProperty = new Property({
      propertyType,
      location,
      price,
      photo: photoPath,
    });

    await newProperty.save();
    res
      .status(200)
      .json({ message: "Property added successfully", newProperty });
  } catch (error) {
    res.status(500).json({ message: "Error adding property", error });
  }
};

module.exports = { createProperty };
