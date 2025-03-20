const Notification = require("../Models/NotificationToken");

const NotificationToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: "Token is required" });

  const existing = await Notification.findOne({ expoPushToken: token });

  if (!existing) {
    await Notification.create({ expoPushToken: token });
    console.log("Token saved:", token);
  } else {
    console.log("Token already exists");
  }

  res.status(200).json({ message: "Token stored successfully" });
};

module.exports = { NotificationToken };
