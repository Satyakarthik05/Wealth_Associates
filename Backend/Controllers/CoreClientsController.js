const CoreClient = require("../Models/CoreClientsModel");

const createCoreClient = async (req, res) => {
  try {
    const { companyName, officeAddress, city, website } = req.body;

    let photoPath = null;
    if (req.file) {
      photoPath = `/coreClients/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: "Photo is required." });
    }

    const newProperty = new CoreClient({
      companyName,
      officeAddress,
      city,
      website,
      photo: photoPath,
    });

    await newProperty.save();
    res
      .status(200)
      .json({ message: "Property added successfully", newProperty });
  } catch (error) {
    console.error("Error in createProperty:", error);
    res.status(500).json({ message: "Error adding property", error });
  }
};

module.exports = { createCoreClient };
