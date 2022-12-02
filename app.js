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
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  next();
});

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
      console.log("This is the card number", msg_body);
      try {
        voter = await Voter.find({ cardno: msg_body });
        console.log(voter[0]);
        voter = voter[0];
        if (voter) {
          msg_body = `This is your details:\nWard_no: ${voter.Ward_no}\nSLNO: ${voter.SLNO}\nHouse No: ${voter.houseno}\nName: ${voter.VNAME_ENGLISH}\nAge: ${voter.Age}\nCard No.: ${voter.cardno}`;
        } else {
          msg_body = "Voter not found";
        }

        console.log("Message Body = ", msg_body);
        const res = await axios({
          method: "POST",
          url:
            "https://graph.facebook.com/v15.0/" +
            process.env.WHATSAPP_PHONE_NUMBER_ID +
            "/messages?access_token=" +
            process.env.WHATSAPP_TOKEN,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: { body: "Ack: \n" + msg_body },
          },
        });
        await res.data;
        console.log("Axios data = ", res.data);
      } catch {
        console.log("Voter not found");
      }
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
