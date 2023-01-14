require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const Voter = require("./models/voters");
const mongoose = require("mongoose");
const sendMessage = require("./utils/sendMessage");
const webHookRouter = require("./routes/webhookRoutes");
const translateText = require("./utils/translate");
// const { getData, deleteAll, addData } = require("./addData");

mongoose.connect(
  `mongodb+srv://admin-raviraj:${process.env.MONGO_DB_PASSWORD}@cluster0.lkxsz.mongodb.net/whatsappIntegration?retryWrites=true&w=majority`,
  {
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind("Connection error!"));
db.once("open", () => {
  console.log("Database connected");
});
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/webhook", webHookRouter);

app.get("/", (req, res) => {
  console.log("got home route");
  res.send("It's RJ's turf");
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
