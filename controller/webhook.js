const [
  sendTextWithImage,
  sendInteractiveMessage,
] = require("../utils/sendMessage");
const [languageRows] = require("../utils/info");
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
    }
  }
  return { phone_number_id, from, msg_body };
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
  const { phone_number_id, msg_body, from } = getDetails(req);
  if (msg_body === "" || msg_body in ["hello", "hi", "hey"]) {
    await sendTextWithImage(
      phone_number_id,
      from,
      "Hey, did not get your instruction, please try again"
    );
    await sendInteractiveMessage(
      phone_number_id,
      from,
      "List of things",
      "Choose Language",
      languageRows,
      "Powered by *helloworld*"
    );
  }
};

module.exports.setLanguageGet = (req, res) => {
  sendTextWithImage();
};
