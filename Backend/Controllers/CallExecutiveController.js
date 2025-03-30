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
    // Get the raw data directly from MongoDB
    const db = mongoose.connection.db;
    const executive = await db
      .collection("callexecutives")
      .findOne(
        { _id: new mongoose.Types.ObjectId(req.AgentId) },
        { projection: { assignedUsers: 1, name: 1, phone: 1 } }
      );

    // Check if the executive exists
    if (!executive) {
      return res.status(404).json({
        success: false,
        message: "Executive not found",
      });
    }

    console.log("Direct DB data:", JSON.stringify(executive, null, 2));

    // Filter valid assignments for customers
    const validAssignments =
      executive.assignedUsers?.filter(
        (a) =>
          a.userType === "Customers" &&
          a.userId &&
          mongoose.Types.ObjectId.isValid(a.userId)
      ) || [];

    console.log("Valid assignments:", validAssignments);

    // Return if no valid assignments are found
    if (validAssignments.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: "No valid customer assignments found",
        debug: {
          rawAssignments: executive.assignedUsers || [],
          executiveId: req.AgentId,
        },
      });
    }

    // Get customer IDs from valid assignments
    const customerIds = validAssignments.map(
      (a) => new mongoose.Types.ObjectId(a.userId)
    );

    // Fetch customer data from the database
    const customers = await db
      .collection("customers")
      .find(
        { _id: { $in: customerIds } },
        {
          projection: {
            FullName: 1,
            MobileNumber: 1,
            District: 1,
            Contituency: 1,
            Occupation: 1,
            MyRefferalCode: 1,
            CallExecutiveCall: 1,
          },
        }
      )
      .toArray();

    // Prepare the final response data
    const responseData = validAssignments
      .map((assignment) => {
        const customer = customers.find((c) => c._id.equals(assignment.userId));
        if (customer) {
          return {
            ...customer,
            assignmentId: assignment._id,
            assignedAt: assignment.assignedAt,
          };
        }
        return null;
      })
      .filter(Boolean);

    // Send the final response
    res.json({
      success: true,
      data: responseData,
      executiveInfo: {
        name: executive.name,
        phone: executive.phone,
      },
    });
  } catch (error) {
    console.error("Final error:", error);
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
};
