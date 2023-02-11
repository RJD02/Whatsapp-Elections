import { ContactNumber } from "./../models/number";
import { Voter } from "./../models/voter";
import { sendText, sendTextWithImage } from "./../utils/sendMessage";
import { languageMappings, LanguageNames } from "./../utils/languageMappings";
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

const searchActions: Section = {
  title: "Services",
  rows: [
    {
      id: "1",
      title: "Search",
      description: "Search by voter id",
    },
  ],
};
const resetActions: Section = {
  title: "Reset",
  rows: [
    {
      id: "2",
      title: "Home",
      description: "Reset the language",
    },
  ],
};

enum MenuActionTitles {
  HOME = "Home",
  SEARCH = "Search",
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
        let msgBody = body.entry[0].changes[0].value.messages[0].text.body;
        if (msgBody) {
          msgBody = msgBody.split("\n")[0];
        }

        // if the number is new and the msg body doesn't contain home
        // then show the welcome message
        const mobileNumberUser = await ContactNumber.findOne({
          mobileNumber: from,
        });
        if (msgBody === MenuActionTitles.HOME || !mobileNumberUser) {
          if (!mobileNumberUser) {
            const newMobileNumberUser = new ContactNumber({
              mobileNumber: from,
              lastConnected: Date.now(),
              preferredLanguage: "Hindi",
            });
            await newMobileNumberUser.save();
          }
          const welcomeMessage = "Hello there, welcome";
          await sendText(phoneNumberId, from, welcomeMessage);
          const rows: { id: string; title: string; description: string }[] = [];
          languageMappings.forEach((val, key) =>
            rows.push({
              id: key,
              title: key,
              description: "Select " + key + " as your default language",
            })
          );
          const languageMenu: Section = {
            title: "Select your option",
            rows,
          };
          await sendInteractiveMessage(
            phoneNumberId,
            from,
            "Language Options",
            "Please select an option",
            [languageMenu],
            "Powered by RRS"
          );
        } else if (
          (Object.values(LanguageNames) as string[]).includes(msgBody)
        ) {
          // store the preferred language
          mobileNumberUser.preferredLanguage = msgBody;
          await mobileNumberUser.save();
          await sendText(phoneNumberId, from, "Your language has been stored");
          await sendInteractiveMessage(
            phoneNumberId,
            from,
            "Here are your options",
            "Pick one to start using the services",
            [searchActions, resetActions],
            "Powered by RRS"
          );
        } else if (mobileNumberUser && msgBody === MenuActionTitles.SEARCH) {
          // send a message saying to enter a voter card number
          await sendText(phoneNumberId, from, "Enter voter id to search");
        } else if (mobileNumberUser) {
          // provide for voter search feature
          const voter = await Voter.findOne({ cardno: msgBody });
          if (voter) {
            // voter card number is valid
            await sendTextWithImage(
              phoneNumberId,
              from,
              `Here are the details of the voter
Ward_no: ${voter.Ward_no}
SLNO: ${voter.SLNO}
House No.: ${voter.houseno}
Name: ${voter.VNAME_ENGLISH}
Card no.: ${voter.cardno}
Age: ${voter.Age}`
            );
          } else {
            // this is not a valid voter card number
            await sendText(
              phoneNumberId,
              from,
              "Please try a valid voter id or choose from below actions"
            );
            await sendInteractiveMessage(
              phoneNumberId,
              from,
              "Here are your options",
              "Pick one to start using the services",
              [searchActions, resetActions],
              "Powered by RSS"
            );
          }
        }
      } else {
        return res.sendStatus(200);
      }
    }
  } catch (e) {
    console.log("Error responding in webhook post");
    console.log(e);
  }
  res.sendStatus(200);
};
