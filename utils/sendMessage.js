const translateText = require("./translate");
const axios = require("axios");
const languageMappings = require("./languageCodes");

const sendTextWithImage = async (
  phone_number_id,
  from,
  msg_body,
  preferredLanguage = languageMappings.get("English")
) => {
  console.log("Sending image...");
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
          link: "https://images.unsplash.com/photo-1661961110218-35af7210f803?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
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
  console.log("Sending text only message");
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
  console.log(sections, sections.rows);
  sections = JSON.stringify(sections);
  const axiosData = {
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
  };
  const jsonData = JSON.stringify(axiosData);
  try {
    const resp = await axios({
      method: "POST",
      url:
        "https://graph.facebook.com/v15.0/" +
        phone_number_id +
        "/messages?access_token=" +
        process.env.WHATSAPP_TOKEN,
      data: axiosData,
    });

    const data = await resp.data;
    console.log(data.error);
  } catch (e) {
    console.log("Error occured while firing interactive message");
    console.log(e.response);
  }
};
module.exports = [sendTextWithImage, sendInteractiveMessage, sendText];
// {
//   "object": "whatsapp_business_account",
//   "entry": [
//     {
//       "id": "113415221605828",
//       "changes": [
//         {
//           "value": {
//             "messaging_product": "whatsapp",
//             "metadata": {
//               "display_phone_number": "919011545619",
//               "phone_number_id": "102405086054943"
//             },
//             "contacts": [
//               {
//                 "profile": {
//                   "name": "Raviraj Dulange"
//                 },
//                 "wa_id": "919595743489"
//               }
//             ],
//             "messages": [
//               {
//                 "from": "919595743489",
//                 "id": "wamid.HBgMOTE5NTk1NzQzNDg5FQIAEhgUM0VCMEJCRDYxOUNCRkI0NUM1MDQA",
//                 "timestamp": "1673802843",
//                 "text": {
//                   "body": "hey"
//                 },
//                 "type": "text"
//               }
//             ]
//           },
//           "field": "messages"
//         }
//       ]
//     }
//   ]
// }

// {
//     "object": "whatsapp_business_account",
//     "entry": [
//       {
//         "id": "113415221605828",
//         "changes": [
//           {
//             "value": {
//               "messaging_product": "whatsapp",
//               "metadata": {
//                 "display_phone_number": "919011545619",
//                 "phone_number_id": "102405086054943"
//               },
//               "contacts": [
//                 {
//                   "profile": {
//                     "name": "Raviraj Dulange"
//                   },
//                   "wa_id": "919595743489"
//                 }
//               ],
//               "messages": [
//                 {
//                   "from": "919595743489",
//                   "id": "wamid.HBgMOTE5NTk1NzQzNDg5FQIAEhgUM0VCMDkzNTBDQkZCQUE4NDQ3OTMA",
//                   "timestamp": "1673990895",
//                   "text": {
//                     "body": "Hey"
//                   },
//                   "type": "text"
//                 }
//               ]
//             },
//             "field": "messages"
//           }
//         ]
//       }
//     ]
//   }
