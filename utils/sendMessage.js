const translateText = require("./translate");
const axios = require("axios");

const sendTextWithImage = async (phone_number_id, from, msg_body) => {
  msg_body = translateText(msg_body, "kn");
  const response = await axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url: "https://graph.facebook.com/v12.0/" + phone_number_id + "/messages",
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "image",
      image: {
        link: "https://images.unsplash.com/photo-1670031652377-e2b853e67390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
        caption: "Ack: " + msg_body,
      },
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    },
  });
  const data = await response.data;
  console.log("Axios data", data);
};

const sendInteractiveMessage = async (
  phone_number_id,
  from,
  msg_body,
  title,
  rows,
  footer
) => {
  const response = await axios({
    method: "POST",
    url: "https://graph.facebook.com/v12.0/" + phone_number_id + "/messages",
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "interactive",
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: title,
        },
        body: {
          text: msg_body,
        },
        footer: {
          text: footer,
        },
        action: {
          button: "See List",
          sections: [
            {
              title: title,
              rows: rows,
            },
          ],
        },
      },
    },
  });
};
module.exports = [sendTextWithImage, sendInteractiveMessage];
