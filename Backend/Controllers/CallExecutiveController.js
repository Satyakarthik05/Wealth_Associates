const CallExecutive = require("../Models/CallExecutiveModel");

const addCallExecutive = async (req, res) => {
  try {
    const { name, phone, location, password } = req.body;

    // Validate input
    if (!name || !phone || !location || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if phone number already exists
    const existingExecutive = await CallExecutive.findOne({ phone });
    if (existingExecutive) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    // Create and save the new executive
    const newExecutive = new CallExecutive({ name, phone, location, password });
    await newExecutive.save();

    res.status(201).json({ message: "Call executive added successfully" });
  } catch (error) {
    console.error("Error adding call executive:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const CallExecutiveLogin = async (req, res) => {
  const { MobileNumber, Password } = req.body;

  try {
    const Agents = await CallExecutive.findOne({
      phone: MobileNumber,

      password: Password,
    });
    if (!Agents) {
      return res
        .status(400)
        .json({ message: "Invalid MobileNumber or Password" });
    }

    // const token = await jwt.sign({ AgentId: Agents._id }, secret, {
    //   expiresIn: "30d",
    // });

    res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    console.log(error);
  }
};

const getCallExecutives = async (req, res) => {
  try {
    const executives = await CallExecutive.find();
    res.status(200).json(executives);
  } catch (error) {
    console.error("Error fetching call executives:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateCallExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, location, password } = req.body;

    // Check if executive exists
    const existingExecutive = await CallExecutive.findById(id);
    if (!existingExecutive) {
      return res.status(404).json({
        success: false,
        message: "Call executive not found",
      });
    }

    // Check if phone number is being changed to an existing number
    if (phone && phone !== existingExecutive.phone) {
      const phoneExists = await CallExecutive.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists",
        });
      }
    }

    // Update fields
    if (name) existingExecutive.name = name;
    if (phone) existingExecutive.phone = phone;
    if (location) existingExecutive.location = location;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      existingExecutive.password = await bcrypt.hash(password, salt);
    }

    const updatedExecutive = await existingExecutive.save();

    // Remove password from response
    const executiveData = updatedExecutive.toObject();
    delete executiveData.password;

    res.status(200).json({
      success: true,
      message: "Call executive updated successfully",
      data: executiveData,
    });
  } catch (error) {
    console.error("Error updating call executive:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete call executive
const deleteCallExecutive = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExecutive = await CallExecutive.findByIdAndDelete(id);

    if (!deletedExecutive) {
      return res.status(404).json({
        success: false,
        message: "Call executive not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Call executive deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting call executive:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
module.exports = {
  addCallExecutive,
  getCallExecutives,
  deleteCallExecutive,
  updateCallExecutive,
  CallExecutiveLogin,
};
