import {
  AxiosImageData,
  AxiosInteractiveData,
  AxiosTextData,
  Section,
} from "./axiosDataInterface";
import axios from "axios";

const getURL = (phoneNumberId: string): string => {
  const url =
    "https://graph.facebook.com/v15.0/" +
    phoneNumberId +
    "/messages?access_token=" +
    process.env.WHATSAPP_TOKEN;
  return url;
};

export const sendTextWithImage = async (
  phoneNumberId: string,
  from: string,
  msgBody: string
) => {
  try {
    // object to send
    const axiosData: AxiosImageData = {
      messaging_product: "whatsapp",
      to: from,
      type: "image",
      image: {
        link: "https://images.unsplash.com/photo-1511300636408-a63a89df3482?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbHBhcGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=2000&q=60",
        caption: "Ack: " + msgBody,
      },
      recipient_type: "individual",
    };
    // send the message with image
    const resp = await axios({
      method: "POST",
      url: getURL(phoneNumberId),
      data: axiosData,
      headers: { "Content-Type": "application/json" },
    });
    const data = await resp.data;
  } catch (e: any) {
    console.log("Error while sending text with image");
    console.log(e.response);
  }
};

export const sendText = async (
  phoneNumberId: string,
  from: String,
  msgBody: string
) => {
  try {
    // object to send
    const axiosData: AxiosTextData = {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: { body: msgBody },
      recipient_type: "individual",
    };
    const resp = await axios({
      method: "POST",
      url: getURL(phoneNumberId),
      data: JSON.stringify(axiosData),
      headers: { "Content-Type": "application/json" },
    });
    const data = await resp.data;
    // console.log(data);
  } catch (e: any) {
    console.log("Error while sending text");
    console.log(e.response);
  }
};

export const sendInteractiveMessage = async (
  phoneNumberId: string,
  from: string,
  title: string,
  msgBody: string,
  sections: Section[],
  footer: string
) => {
  const axiosData: AxiosInteractiveData = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: from,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: title,
      },
      body: {
        text: msgBody,
      },
      footer: {
        text: footer,
      },
      action: {
        button: "See actions",
        sections,
      },
    },
  };
  try {
    const resp = await axios({
      method: "POST",
      url: getURL(phoneNumberId),
      data: axiosData,
    });
    const data = await resp.data;
    // console.log(data);
  } catch (e: any) {
    console.log("Error while sending interactive message");
    console.log(e.response.data);
  }
};
