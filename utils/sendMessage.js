const translateText = require("./translate");
const axios = require("axios");

const sendTextWithImage = async (phone_number_id, from, msg_body) => {
  // msg_body = await translateText(msg_body, "kn");
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
          link: "https://images.unsplash.com/photo-1673731215529-a45181460626?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60https://images.unsplash.com/photo-1670031652377-e2b853e67390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60https://images.unsplash.com/photo-1673731215529-a45181460626?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
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

const sendInteractiveMessage = async (
  phone_number_id,
  from,
  msg_body,
  title,
  rows,
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
            sections: [
              {
                title: title,
                rows,
              },
            ],
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
module.exports = [sendTextWithImage, sendInteractiveMessage];
