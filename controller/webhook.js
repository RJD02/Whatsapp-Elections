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

  const details = getDetails(req);
  // console.log(details);
  try {
    const rows = (await languageRows).getAllInfo();
    console.log(rows);
    if (
      details &&
      details.msg_body &&
      details.phone_number_id &&
      details.from
    ) {
      await sendTextWithImage(
        details.phone_number_id,
        details.from,
        "Hey there"
      );
      await sendInteractiveMessage(
        details.phone_number_id,
        details.from,
        "Choose a language",
        "Choose one language from below languages",
        rows,
        "Powered by *JS*"
      );
    }
  } catch (e) {
    console.log("error occurred when trying posting request");
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
