import { Document } from "mongoose";
import { Contestant, ContestantInterface } from "./../../models/contestant";
import {
  kannadaTextMsgHandler,
  kannadaInteractiveMsgHandler,
} from "./kannadaHandler";
import { englishInstructions } from "../../language/englishInstructions";
import { ContactNumber } from "../../models/number";
import { Voter } from "../../models/voter";
import { sendText, sendTextWithImage } from "../../utils/sendMessage";
import { languageMappings, LanguageNames } from "../../utils/languageMappings";
import { NextFunction, Request, Response } from "express";
import { Section } from "../../utils/axiosDataInterface";
import { sendInteractiveMessage } from "../../utils/sendMessage";
import {
  englishInteractiveMsgHandler,
  englishTextMsgHandler,
} from "./englishHandler";
import { kannadaInstructions } from "../../language/kannadaInstructions";

const VERIFY_TOKEN = "helloworldthisiswhatsappelectionswebhookintesting";

export const getHome = (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified!");
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(200);
};

interface UserInitiatedMessageBody {
  object: {};
  entry: [
    {
      changes: [
        {
          value: {
            messages: [
              {
                from: string;
                text?: {
                  body: string;
                };
                type?: "interactive" | "text";
                interactive?: {
                  type: "list_reply";
                  list_reply: {
                    title: string;
                  };
                };
              }
            ];
            metadata: {
              phone_number_id: string;
            };
          };
        }
      ];
    }
  ];
}

const getFrom = (req: Request) => {
  const body: UserInitiatedMessageBody = req.body;
  if (
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0] &&
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.messages[0].type === "text" &&
    body.entry[0].changes[0].value.messages[0].text
  ) {
    return body.entry[0].changes[0].value.messages[0].from;
  } else if (
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0] &&
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.messages[0] &&
    body.entry[0].changes[0].value.messages[0].type === "interactive"
  ) {
    return body.entry[0].changes[0].value.messages[0].from;
  }
};

export const contestantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("inside contestant middle ware");
  const contestant = await Contestant.findById(req.params.id);
  const from = getFrom(req);
  const user = await ContactNumber.findOne({ mobileNumber: from });
  if (user && contestant) {
    if (!contestant.isSubscribed) {
      return res.sendStatus(200);
    }
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    if (yesterday > user.lastConnected) {
      contestant.conversationNumber += 1;
    } else {
      user.lastConnected = new Date();
    }
    await contestant.save();
    next();
  } else if (contestant) {
    contestant.conversationNumber += 1;
    await contestant.save();
    next();
  }
};
export const postHome = async (req: Request, res: Response) => {
  console.log("Got /webhook post req");
  const body: UserInitiatedMessageBody = req.body;
  try {
    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0].type === "text" &&
        body.entry[0].changes[0].value.messages[0].text
      ) {
        // extract basic information
        const phoneNumberId =
          body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from;
        const msgBody = body.entry[0].changes[0].value.messages[0].text.body;

        // if the number is new and the msg body doesn't contain home
        // then show the welcome message
        let mobileNumberUser = await ContactNumber.findOne({
          mobileNumber: from,
        });
        if (!mobileNumberUser) {
          const newMobileNumberUser = new ContactNumber({
            mobileNumber: from,
            lastConnected: Date.now(),
            preferredLanguage: "English",
          });
          await newMobileNumberUser.save();
          mobileNumberUser = newMobileNumberUser;
        }
        const contestant = await Contestant.findById(req.params.id);
        if (contestant) {
          contestant.voterIdSearchNumber += 1;
          await contestant.save();
        }
        switch (mobileNumberUser.preferredLanguage) {
          case englishInstructions.language:
            englishTextMsgHandler(phoneNumberId, from, msgBody).then(() =>
              console.log("Message done")
            );
            break;
          case kannadaInstructions.language:
            await kannadaTextMsgHandler(phoneNumberId, from, msgBody);
            break;
        }
      } else if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0] &&
        body.entry[0].changes[0].value.messages[0].type === "interactive"
      ) {
        const phoneNumberId =
          body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from;
        const title =
          body.entry[0].changes[0].value.messages[0].interactive?.list_reply
            .title;
        let mobileNumberUser = await ContactNumber.findOne({
          mobileNumber: from,
        });
        if (!mobileNumberUser) {
          const newMobileNumberUser = new ContactNumber({
            mobileNumber: from,
            lastConnected: Date.now(),
            preferredLanguage: "English",
          });
          await newMobileNumberUser.save();
          mobileNumberUser = newMobileNumberUser;
        }

        switch (mobileNumberUser.preferredLanguage) {
          case englishInstructions.language:
            englishInteractiveMsgHandler(phoneNumberId, from, title).then(() =>
              console.log("Interactive message done")
            );
            break;
          case kannadaInstructions.language:
            await kannadaInteractiveMsgHandler(phoneNumberId, from, title);
            break;
        }
      }
    }
  } catch (e) {
    console.log("Error responding in webhook post");
    console.log(e);
  }
  res.sendStatus(200);
};
