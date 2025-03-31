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
const PushToken=require("./Models/NotificationToken")

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

https.createServer(options, app).listen(443, () => {
  console.log("HTTPS Server running on port 443");
});
app.post('/send-notification', async (req, res) => {
  try {
    const { title, message } = req.body;

    // Validate input
    if (!title || !message) {
      return res.status(400).json({ 
        success: false,
        message: "Both title and message are required" 
      });
    }

    // Get all registered push tokens
    const allTokens = await PushToken.find({});
    
    if (!allTokens.length) {
      return res.status(200).json({ 
        success: true,
        message: "No devices registered to receive notifications" 
      });
    }

    // Prepare notifications
    const notifications = allTokens.map((user) => ({
      to: user.expoPushToken,
      sound: "default",
      title: title,
      body: message,
      data: { 
        type: 'custom_notification',
        sentAt: new Date().toISOString() 
      }
    }));

    // Send notifications in chunks (Expo recommends max 100 per request)
    const chunkSize = 100;
    const chunks = [];
    
    for (let i = 0; i < notifications.length; i += chunkSize) {
      chunks.push(notifications.slice(i, i + chunkSize));
    }

    // Send each chunk
    for (const chunk of chunks) {
      try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(chunk),
        });

        const data = await response.json();
        console.log('Expo push response:', data);
      } catch (err) {
        console.error('Error sending push notification chunk:', err);
      }
    }

    res.status(200).json({ 
      success: true,
      message: `Notification sent to ${allTokens.length} devices`,
      data: {
        title,
        message,
        devices: allTokens.length
      }
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
});

const http = require("http");
http
  .createServer((req, res) => {
    res.writeHead(301, {
      Location: "https://" + req.headers["host"] + req.url,
    });
    res.end();
  })
  .listen(80, () => {
    console.log("Redirecting HTTP to HTTPS");
  });

// app.listen("3000", () => {
//   console.log("Server is running succssfully");
// });
