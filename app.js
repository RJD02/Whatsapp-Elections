require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const Voter = require("./models/voters");
const mongoose = require("mongoose");

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

const VERIFY_TOKEN = "c5fcf44f-5faa-4a46-ad78-1504fa531781";

app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode == "subscribe" && token == VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post("/webhook", async (req, res) => {
  const body = req.body;
  console.log(JSON.stringify(body, null, 2));
  if (req.body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from;
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
      let voter = null;
      try {
        voter = await Voter.find({ cardno: msg_body });
      } catch {
        console.log("Voter not found");
      }
      if (voter) {
        msg_body = `This is your details:
        Ward_no: ${voter["Ward_no"]}
        SLNO: ${voter["SLNO"]}
        House No: ${voter["houseno"]}
        Name: ${voter["VNAME_ENGLISH"]}
        Age: ${voter["Age"]}
        Card No.: ${voter["cardno"]}`;
      } else {
        msg_body = "Voter not found";
      }
      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id +
          "/messages?access_token=" +
          process.env.WHATSAPP_TOKEN,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Ack: \n" + msg_body },
          headers: { "Content-Type": "application/json" },
        },
      });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get("/", (req, res) => {
  res.send("It's RJ");
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
