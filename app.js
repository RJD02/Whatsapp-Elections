require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const Voter = require("./models/voters");
const mongoose = require("mongoose");
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

const VERIFY_TOKEN = "helloworldthisiswhatsappelectionswebhookintesting";

const sendMessage = async (phone_number_id, from, msg_body) => {
  const response = await axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url: "https://graph.facebook.com/v13.0/" + phone_number_id + "/messages",
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "image",
      image: {
        link: "https://images.unsplash.com/photo-1670031652376-e2b853e67390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
        caption: "Ack: " + msg_body,
      },
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    },
  });
  const data = await response.data;
  console.log('Axios data', data);
};

app.get("/webhook", (req, res) => {
  console.log("get request");
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post("/webhook", async (req, res) => {
  console.log("post request");
  const body = req.body;
  const challenge = req.query["hub.challenge"];
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
      let msg_body = "";
      if (req.body.entry[0].changes[0].value.messages[0].text)
        msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
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

        await sendMessage(phone_number_id, from, msg_body);
      } catch {
        console.log("Voter not found");
      }
    }
    res.sendStatus(200).send(challenge);
  } else {
    res.sendStatus(404);
  }
});

app.get("/", (req, res) => {
  console.log("got home route");
  res.send("It's RJ's turf");
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
