const [
  sendTextWithImage,
  sendInteractiveMessage,
  sendText,
] = require("../utils/sendMessage");
const { languageRows, basicRows, campaignRows } = require("../utils/info");
const Voter = require("../models/voters");
const axios = require("axios");
const languageMappings = require("../utils/languageCodes");
const translateText = require("../utils/translate");

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

      const voter = await Voter.findOne({ mobileNumber: from });
      if (voter && msg_body.split("\n")[0] in languageMappings.keys()) {
        // voter with this mobile number is present and has requested to change default language
        const language = msg_body.split("\n")[0];
        voter.PreferredLanguage = languageMappings.get(language);
        await voter.save();

        await sendText(
          phone_number_id,
          from,
          "From here on you will receive messages in " + language,
          voter.PreferredLanguage
        );
        return res.sendStatus(200);
      } else if (voter) {
        // voter with this mobile number is present
        const languageRowsList = (await languageRows).getAllInfo();
        const basicRowsList = basicRows.getAllInfo();
        const campaignRowsList = campaignRows.getAllInfo();
        const languagePreferenceTitle = await translateText(
          "Language Preference",
          voter.PreferredLanguage
        );
        const basicServicesTitle = await translateText(
          "Basic Services",
          voter.PreferredLanguage
        );
        const campaignServicesTitle = await translateText(
          "Campaign Info",
          voter.PreferredLanguage
        );
        const sections = [
          { title: languagePreferenceTitle, rows: languageRowsList },
          {
            title: basicServicesTitle,
            rows: basicRowsList,
          },
          { title: campaignServicesTitle, rows: campaignRowsList },
        ];
        await sendInteractiveMessage(
          phone_number_id,
          from,
          msg_body,
          sections,
          footer
        );
        return res.sendStatus(200);
      } else if (msg_body) {
        const user = await Voter.findOne({ cardno: msg_body });
        if (user) {
          // card number exists
          user.mobileNumber = from;
          await user.save();
          return res.sendStatus(200);
        } else {
          await sendText(
            phone_number_id,
            from,
            "The card number is invalid, please try again"
          );
        }
      } else {
        // ask to mention his card
        await sendText(phone_number_id, from, "Please enter your voter card");
      }
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
};

module.exports.setLanguageGet = (req, res) => {
  // sendTextWithImage();
};

// const test = async () => {
//   // await sendTextWithImage("102405086054943", "919595743489", "Hello");
//   // const rows = (await languageRows).getAllInfo();
//   // await sendText("102405086054943", "9595743489", "Hello World");
//   const sections = [
//     {
//       title: "Hello World",
//       rows: [{ id: "12", title: "First", description: "First one" }],
//     },
//   ];
//   await sendInteractiveMessage(
//     "102405086054943",
//     "919595743489",
//     "Hey",
//     sections,
//     "Footer"
//   );
//   console.log("Testing");
// };

// test();
