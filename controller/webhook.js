const [
  sendTextWithImage,
  sendInteractiveMessage,
] = require("../utils/sendMessage");
const { languageRows } = require("../utils/info");
const Voter = require("../models/voters");

const VERIFY_TOKEN = "helloworldthisiswhatsappelectionswebhookintesting";

const getDetails = (req) => {
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
      return { phone_number_id, from, msg_body };
    }
  }
  // return null;
};

module.exports.getHome = (req, res) => {
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
};

module.exports.postHome = async (req, res) => {
  console.log("post request");
  // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v15.0/" +
          phone_number_id +
          "/messages?access_token=" +
          process.env.WHATSAPP_TOKEN,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Ack: " + msg_body },
        },
        headers: { "Content-Type": "application/json" },
      });
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
  res.sendStatus(200);
};

module.exports.setLanguageGet = (req, res) => {
  // sendTextWithImage();
};

// const test = async () => {
//   await sendTextWithImage("102405086054943", "919595743489", "Hello World");
//   const rows = (await languageRows).getAllInfo();
//   await sendInteractiveMessage(
//     "102405086054943",
//     "919595743489",
//     "Choose from",
//     "Title",
//     rows,
//     "This is footer"
//   );
//   console.log("Testing");
// };

// test();
