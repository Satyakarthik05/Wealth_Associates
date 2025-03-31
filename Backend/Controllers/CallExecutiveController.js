const CallExecutive = require("../Models/CallExecutiveModel");
const Agent = require("../Models/AgentModel");
const jwt = require("jsonwebtoken");
secret = "Wealth@123";
const mongoose = require("mongoose");

const addCallExecutive = async (req, res) => {
  try {
    const { name, phone, location, password, assignedType } = req.body;

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
    const newExecutive = new CallExecutive({
      name,
      phone,
      location,
      password,
      assignedType,
    });
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

    const token = await jwt.sign({ AgentId: Agents._id }, secret, {
      expiresIn: "30d",
    });

    res.status(200).json({ message: "Login Successful", token });
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

const getCallExe = async (req, res) => {
  try {
    const agentDetails = await CallExecutive.findById(req.AgentId);
    if (!agentDetails) {
      return res.status(200).json({ message: "Agent not found" });
    } else {
      res.status(200).json(agentDetails);
    }
  } catch (error) {
    console.log(error);
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
const myagents = async (req, res) => {
  try {
    // 1. Validate and convert AgentId
    if (!mongoose.Types.ObjectId.isValid(req.AgentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Agent ID format",
        receivedId: req.AgentId,
      });
    }

    const executiveId = new mongoose.Types.ObjectId(req.AgentId);

    // 2. Clean up invalid assignments first
    const cleanupResult = await CallExecutive.updateOne(
      { _id: executiveId },
      { $pull: { assignedUsers: { userId: null } } }
    );
    console.log(`Cleaned ${cleanupResult.modifiedCount} invalid assignments`);

    // 3. Get executive with valid agents
    const executive = await CallExecutive.aggregate([
      { $match: { _id: executiveId } },
      { $unwind: "$assignedUsers" },
      {
        $match: {
          "assignedUsers.userType": "Agent_Wealth_Associate",
          "assignedUsers.userId": { $exists: true, $ne: null },
        },
      },
      {
        $lookup: {
          from: "agent_wealth_associates",
          localField: "assignedUsers.userId",
          foreignField: "_id",
          as: "agentDetails",
        },
      },
      { $unwind: "$agentDetails" },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          phone: { $first: "$phone" },
          agents: {
            $push: {
              agent: "$agentDetails",
              assignmentId: "$assignedUsers._id",
              assignedAt: "$assignedUsers.assignedAt",
            },
          },
        },
      },
    ]);

    if (!executive || executive.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No valid agent assignments found",
      });
    }

    // 4. Format the response
    const result = executive[0];
    const assignedAgents = result.agents.map((item) => ({
      ...item.agent,
      assignmentId: item.assignmentId,
      assignedAt: item.assignedAt,
    }));

    res.json({
      success: true,
      data: assignedAgents,
      executiveInfo: {
        name: result.name,
        phone: result.phone,
      },
    });
  } catch (error) {
    console.error("Error in myagents:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
const myCustomers = async (req, res) => {
  try {
    // 1. Validate and convert AgentId
    if (!mongoose.Types.ObjectId.isValid(req.AgentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Agent ID format",
        receivedId: req.AgentId,
      });
    }

    const executiveId = new mongoose.Types.ObjectId(req.AgentId);

    // 2. Get executive with valid customers and populate all necessary fields
    const executive = await CallExecutive.aggregate([
      { $match: { _id: executiveId } },
      { $unwind: "$assignedUsers" },
      {
        $match: {
          "assignedUsers.userType": "Customers",
          "assignedUsers.userId": { $exists: true, $ne: null },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "assignedUsers.userId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      { $unwind: "$customerDetails" },
      {
        $project: {
          _id: 0,
          customer: {
            $mergeObjects: [
              "$customerDetails",
              {
                assignmentId: "$assignedUsers._id",
                assignedAt: "$assignedUsers.assignedAt",
              },
            ],
          },
          executiveInfo: {
            name: "$name",
            phone: "$phone",
          },
        },
      },
      {
        $group: {
          _id: null,
          customers: { $push: "$customer" },
          executiveInfo: { $first: "$executiveInfo" },
        },
      },
    ]);

    if (!executive || executive.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No valid customer assignments found",
      });
    }

    // 3. Format the response with all customer details
    const result = executive[0];
    
    res.json({
      success: true,
      data: result.customers,
      executiveInfo: result.executiveInfo,
    });
  } catch (error) {
    console.error("Error in myCustomers:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const myProperties = async (req, res) => {
  try {
    // 1. Get executiveId from authenticated user (should come from token)
    const executiveId = req.AgentId; // Make sure your auth middleware sets this
    
    if (!mongoose.Types.ObjectId.isValid(executiveId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Executive ID format",
      });
    }

    const executiveObjectId = new mongoose.Types.ObjectId(executiveId);

    // 2. Clean up invalid assignments
    await CallExecutive.updateOne(
      { _id: executiveObjectId },
      { $pull: { assignedUsers: { userId: null } } }
    );

    // 3. Get executive with property details
    const executive = await CallExecutive.aggregate([
      { $match: { _id: executiveObjectId } },
      { $unwind: "$assignedUsers" },
      {
        $match: {
          "assignedUsers.userType": "Property",
          "assignedUsers.userId": { $exists: true, $ne: null },
        },
      },
      {
        $lookup: {
          from: "properties",
          localField: "assignedUsers.userId",
          foreignField: "_id",
          as: "propertyDetails",
        },
      },
      { $unwind: "$propertyDetails" },
      {
        $project: {
          name: 1,
          phone: 1,
          property: "$propertyDetails",
          assignmentId: "$assignedUsers._id",
          assignedAt: "$assignedUsers.assignedAt"
        }
      }
    ]);

    if (!executive || executive.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No valid property assignments found",
      });
    }

    // Format the response to match frontend expectations
    const response = {
      success: true,
      data: executive.map(item => ({
        ...item.property,
        assignmentId: item.assignmentId,
        assignedAt: item.assignedAt,
        // Ensure these fields are included if needed by frontend
        PostedBy: item.property.PostedBy,
        PostedUserType: item.property.PostedUserType
      })),
      executiveInfo: {
        name: executive[0]?.name || '',
        phone: executive[0]?.phone || ''
      }
    };

    res.json(response);
    
  } catch (error) {
    console.error("Final error:", error);
    console.error("Error in myProperties:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve customers",
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
  myagents,
  myCustomers,
  myProperties,
  getCallExe
};
