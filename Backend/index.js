const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const AgentRouter = require("./Routes/AgentRoutes");
const CustomerRoutes = require("./Routes/CustomerRoutes");
const CoreRoutes = require("./Routes/CoreRoutes");
const propertyRoutes = require("./Routes/PostPropertyRoutes");
const RequestProperty = require("./Routes/RequestPropertyRoute");
const fs = require("fs");
const https = require("https");
const DisConsExpert = require("./Routes/DisConsExpRoutes");
const District = require("./Models/Districts");
const ExpertRoutes = require("./Routes/ExpertRoute");
const NriRoutes = require("./Routes/NriRoute");
const SkillRoutes = require("./Routes/SkillRoutes");
const AllCounts = require("./Controllers/AllCollectionsCount");
const InvestorRoutes = require("./Routes/InvestorRouts");
const RequestExpertRoute = require("./Routes/RequstedExpertsRoutes");
const CoreClientRoutes = require("./Routes/CoreClientsRoutes");
const path = require("path");
const CoreProjectRoutes = require("./Routes/CoreProjectsRoutes");
const buyRoutes = require("./Routes/BuyPropertyRoutes");
const NotificationToken = require("./Routes/NoficationsRoutes");
const DistrictConstituency = require("./Routes/DistrictConsttuencyRoutes");
const Constituency = require("./Models/DistrictsConstituencysModel");
const ReqExp = require("./Routes/ReqExpRoutes");
const CallExecuteRoute = require("./Routes/CallExecutiveRouts");
const PushToken = require("./Models/NotificationToken");
const admin = require('firebase-admin');
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

const options = {
  key: fs.readFileSync("privatekey.pem"),
  cert: fs.readFileSync("certificate.pem"),
};

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/coreClients", express.static(path.join(__dirname, "coreClients")));
app.use("/coreProjects", express.static(path.join(__dirname, "coreProjects")));
app.use(
  "/ExpertMembers",
  express.static(path.join(__dirname, "ExpertMembers"))
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const corsOptions = {
  origin: "*",
  methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  credentials: true,
};

app.use(cors(corsOptions));

mongoose
  .connect(
    "mongodb+srv://wealthassociates:Admin%40123open@wealthassociate.ytdcd.mongodb.net/?retryWrites=true&w=majority&appName=wealthassociate/WealthAssociate"
  )
  .then(() => console.log("mongodb Connected Successfully"))
  .catch((error) => console.error());

app.use("/agent", AgentRouter);
app.use("/customer", CustomerRoutes);
app.use("/core", CoreRoutes);
app.use("/properties", propertyRoutes);
app.use("/requestProperty", RequestProperty);
app.use("/discons", DisConsExpert);
app.use("/expert", ExpertRoutes);
app.use("/skillLabour", SkillRoutes);
app.use("/count", AllCounts);
app.use("/nri", NriRoutes);
app.use("/investors", InvestorRoutes);
app.use("/requestexpert", RequestExpertRoute);
app.use("/coreclient", CoreClientRoutes);
app.use("/coreproject", CoreProjectRoutes);
app.use("/buy", buyRoutes);
app.use("/noti", NotificationToken);
app.use("/alldiscons", DistrictConstituency);
app.use("/direqexp", ReqExp);
app.use("/callexe", CallExecuteRoute);

app.get("/admindata", (req, res) => {
  const UserName = "1234567890";
  const Password = "1234";

  res.status(200).json({ UserName, Password });
});

app.get("/serverCheck", (req, res) => {
  res.send("Hello Welcome to my wealthAssociat server");
});

const serviceAccount = require('./wealthassociate-73b2e-firebase-adminsdk-fbsvc-8061ec845d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.post("/send-notification", async (req, res) => {
  try {
    const { title, message, data } = req.body;

    // Validate input
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Both title and message are required",
      });
    }

    // Get all registered push tokens
    const allTokens = await PushToken.find({});

    if (!allTokens.length) {
      return res.status(200).json({
        success: true,
        message: "No devices registered to receive notifications",
      });
    }

    // Separate Expo and FCM tokens
    const expoMessages = [];
    const fcmMessages = [];

    allTokens.forEach((user) => {
      const notificationData = {
        ...data,
        type: "custom_notification",
        sentAt: new Date().toISOString(),
      };

      if (Expo.isExpoPushToken(user.expoPushToken)) {
        // Expo push notification (iOS and some Android)
        expoMessages.push({
          to: user.expoPushToken,
          sound: "default",
          title,
          body: message,
          data: notificationData,
          ...(user.deviceType === "android" && {
            priority: "high",
            channelId: "default"
          })
        });
      } else {
        // FCM push notification (Android)
        fcmMessages.push({
          token: user.expoPushToken,
          notification: {
            title,
            body: message,
          },
          data: notificationData,
          android: {
            priority: "high",
            notification: {
              channelId: "default",
              sound: "default"
            }
          }
        });
      }
    });

    // Send Expo notifications
    const expoResults = await sendExpoNotifications(expoMessages);
    
    // Send FCM notifications
    const fcmResults = await sendFcmNotifications(fcmMessages);

    res.status(200).json({
      success: true,
      message: `Notifications processed for ${allTokens.length} devices`,
      data: {
        title,
        message,
        expoResults,
        fcmResults
      },
    });

  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Helper function for Expo notifications
async function sendExpoNotifications(messages) {
  if (!messages.length) return [];
  
  const chunks = expo.chunkPushNotifications(messages);
  const results = [];
  
  for (const chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      results.push(...receipts);
    } catch (error) {
      console.error('Error sending Expo chunk:', error);
      results.push({ error: error.message });
    }
  }
  
  return results;
}

// Helper function for FCM notifications
async function sendFcmNotifications(messages) {
  if (!messages.length) return [];
  
  const results = [];
  
  for (const message of messages) {
    try {
      const response = await admin.messaging().send(message);
      results.push({
        success: true,
        messageId: response
      });
    } catch (error) {
      console.error('Error sending FCM:', error);
      results.push({
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}
// https.createServer(options, app).listen(443, () => {
//   console.log("HTTPS Server running on port 443");
// });

// const http = require("http");
// http
//   .createServer((req, res) => {
//     res.writeHead(301, {
//       Location: "https://" + req.headers["host"] + req.url,
//     });
//     res.end();
//   })
//   .listen(80, () => {
  //     console.log("Redirecting HTTP to HTTPS");
  //   });

  app.listen("3000", () => {
  console.log("Server is running succssfully");
});
