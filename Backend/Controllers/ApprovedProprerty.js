const Property = require("../Models/Property");
const ApprovedProperty = require("../Models/ApprovedPropertys");
const PushToken = require("../Models/NotificationToken");

const approveProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the property by ID
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    // 2. Create an approved property entry
    const approvedProperty = new ApprovedProperty({
      propertyType: property.propertyType,
      location: property.location,
      price: property.price,
      photo: property.photo,
      PostedBy: property.PostedBy,
      PostedUserType: property.PostedUserType,
    });

    await approvedProperty.save();
    await Property.findByIdAndDelete(id);

    // 3. Fetch all user push tokens
    const allTokens = await PushToken.find({});

    if (!allTokens.length) {
      return res.status(200).json({
        message: "Property approved, but no push tokens found to notify users.",
        approvedProperty,
      });
    }

    // 4. Construct notification message
    const title = "Wealth Associates\nNew Property Nearby";

    const body = `New ${property.propertyType} posted nearby you for ₹${property.price} in ${property.location}`;

    const notifications = allTokens.map((user) => ({
      to: user.expoPushToken,
      sound: "default",
      title,
      body,
    }));

    const chunks = [];
    while (notifications.length) {
      chunks.push(notifications.splice(0, 100));
    }

    for (const chunk of chunks) {
      try {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chunk),
        });

        const data = await response.json();
        console.log("Expo push response:", data);
      } catch (err) {
        console.error("Error sending push notification chunk:", err);
      }
    }

    // 6. Send final response
    res.status(200).json({
      message: "Property approved and push notifications sent to users",
      approvedProperty,
    });
  } catch (error) {
    console.error("Error approving property:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// module.exports = approveProperty;
const GetAllApprovdPropertys = async (req, res) => {
  try {
    const properties = await ApprovedProperty.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Error fetching properties", error });
  }
};
module.exports = { approveProperty, GetAllApprovdPropertys };
