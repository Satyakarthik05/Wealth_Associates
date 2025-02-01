const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const AgentRouter = require("./Routes/AgentRoutes");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const corsOptions = {
  origin: ["http//:localhost:5173"],
  methods: ["POST", "GET", "DELETE", "PUT"],
  // allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => console.log("mongodb Connected Successfully"))
  .catch((error) => console.error());

app.use("/agent", AgentRouter);

app.listen(3000, () => {
  console.log("server is running successfully");
});
