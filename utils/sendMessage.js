const translateText = require("./translate");
const axios = require("axios");
const languageMappings = require("./languageCodes");

const sendTextWithImage = async (
  phone_number_id,
  from,
  msg_body,
  preferredLanguage = languageMappings.get("English")
) => {
  msg_body = await translateText(msg_body, preferredLanguage);
  try {
    const resp = await axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v15.0/" +
        phone_number_id +
        "/messages?access_token=" +
        process.env.WHATSAPP_TOKEN,
      data: {
        messaging_product: "whatsapp",
        to: from,
        type: "image",
        image: {
          link: "https://images.unsplash.com/photo-1673731215529-a45181460626?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=749&q=80",
          caption: "Ack: " + msg_body,
        },
      },
      headers: { "Content-Type": "application/json" },
    });
    const data = await resp.data;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

const sendText = async (
  phone_number_id,
  from,
  msg_body,
  preferredLanguage = languageMappings.get("English")
) => {
  msg_body = await translateText(msg_body, preferredLanguage);
  try {
    const resp = await axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url:
        "https://graph.facebook.com/v15.0/" +
        phone_number_id +
        "/messages?access_token=" +
        process.env.WHATSAPP_TOKEN,
      data: {
        messaging_product: "whatsapp",
        to: from,
        text: { body: msg_body },
      },
    });
    const data = await resp.data;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

const sendInteractiveMessage = async (
  phone_number_id,
  from,
  msg_body,
  sections,
  footer
) => {
  console.log(rows);
  try {
    const resp = await axios({
      method: "POST",
      url:
        "https://graph.facebook.com/v15.0/" +
        phone_number_id +
        "/messages?access_token=" +
        process.env.WHATSAPP_TOKEN,
      data: {
        messaging_product: "whatsapp",
        to: from,
        recipient_type: "individual",
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "Actions",
          },
          body: {
            text: `${msg_body}`,
          },
          footer: {
            text: `${footer}`,
          },
          action: {
            button: "See Actions",
            sections: sections,
          },
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await resp.data;
    console.log(data);
  } catch (e) {
    console.log("Error occured while firing interactive message");
    console.log(e);
  }
};
module.exports = [sendTextWithImage, sendInteractiveMessage, sendText];
