const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const AgentRouter = require("./Routes/AgentRoutes");
const CustomerRoutes = require("./Routes/CustomerRoutes");
const propertyRoutes = require("./Routes/PostPropertyRoutes");
const RequestProperty = require("./Routes/RequestPropertyRoute");
const fs = require("fs");
const https = require("https");

const options = {
  key: fs.readFileSync("privatekey.pem"),
  cert: fs.readFileSync("certificate.pem"),
};

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(bodyParser.json({ limit: "50mb" })); // Increase as needed
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const corsOptions = {
  origin: "*",
  methods: ["POST", "GET", "DELETE", "PUT"],
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
app.use("/properties", propertyRoutes);
app.use("/requestProperty", RequestProperty);

app.get("/serverCheck", (req, res) => {
  res.send("Hello Welcome to my wealthAssociat server");
});

https.createServer(options, app).listen(443, () => {
  console.log("HTTPS Server running on port 443");
});

// Redirect HTTP (port 80) to HTTPS (optional)
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
