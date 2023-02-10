import { Voter } from "./../models/voter";
import { sendText, sendTextWithImage } from "./../utils/sendMessage";
import { languageMappings } from "./../utils/languageMappings";
import { Request, Response } from "express";
import { Section } from "../utils/axiosDataInterface";
import { sendInteractiveMessage } from "./../utils/sendMessage";

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
                text: {
                  body: string;
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
        body.entry[0].changes[0].value.messages[0]
      ) {
        // extract basic information
        const phoneNumberId =
          body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from;
        const msgBody = body.entry[0].changes[0].value.messages[0].text.body;

        // get voter if exists
        const voter = await Voter.findOne({ mobileNumber: from });

        // if voter exisits and the current message is a language request
        if (voter && languageMappings.get(msgBody.split("\n")[0])) {
          // send acknowledgement that now on he will get messages in this language
          const language = msgBody.split("\n")[0];
          voter.PreferredLanguage = language;
          await voter.save();

          await sendText(
            phoneNumberId,
            from,
            languageMappings.get(language).acknowledgementOfLanguage
          );
        } else if (voter) {
          // voter with this mobile is present
          const sampleSection: Section = {
            title: "First row",
            rows: [
              {
                title: "Something",
                description: "Something describing",
                id: "1234",
              },
            ],
          };
          const sections = [sampleSection];

          await sendInteractiveMessage(
            phoneNumberId,
            from,
            languageMappings.get("Hindi").title,
            languageMappings.get("Hindi").actionsBody,
            sections,
            "Powered by *RJ*"
          );
        } else if (msgBody) {
          const user = await Voter.findOne({ cardno: msgBody });
          if (user) {
            user.mobileNumber = from;
            await user.save();
            await sendText(
              phoneNumberId,
              from,
              languageMappings.get("Hindi").acknowledgementOfNumberSave
            );
          } else {
            await sendText(
              phoneNumberId,
              from,
              languageMappings.get("Hindi").askForVoterID
            );
          }
        }

        return res.sendStatus(200);
      } else {
        return res.sendStatus(200);
      }
    }
  } catch (e) {
    console.log("Error responding in webhook post");
  }
  res.sendStatus(200);
};
