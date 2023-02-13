"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postHome = exports.getHome = void 0;
const kannadaHandler_1 = require("./kannadaHandler");
const englishInstructions_1 = require("../../language/englishInstructions");
const number_1 = require("../../models/number");
const englishHandler_1 = require("./englishHandler");
const kannadaInstructions_1 = require("../../language/kannadaInstructions");
const VERIFY_TOKEN = "helloworldthisiswhatsappelectionswebhookintesting";
const getHome = (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("Webhook verified!");
            return res.status(200).send(challenge);
        }
        else {
            return res.sendStatus(403);
        }
    }
    return res.sendStatus(200);
};
exports.getHome = getHome;
const postHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Got /webhook post req");
    const body = req.body;
    try {
        if (body.object) {
            if (body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0] &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0].type === "text" &&
                body.entry[0].changes[0].value.messages[0].text) {
                // extract basic information
                const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
                const from = body.entry[0].changes[0].value.messages[0].from;
                const msgBody = body.entry[0].changes[0].value.messages[0].text.body;
                // if the number is new and the msg body doesn't contain home
                // then show the welcome message
                let mobileNumberUser = yield number_1.ContactNumber.findOne({
                    mobileNumber: from,
                });
                if (!mobileNumberUser) {
                    const newMobileNumberUser = new number_1.ContactNumber({
                        mobileNumber: from,
                        lastConnected: Date.now(),
                        preferredLanguage: "English",
                    });
                    yield newMobileNumberUser.save();
                    mobileNumberUser = newMobileNumberUser;
                }
                switch (mobileNumberUser.preferredLanguage) {
                    case englishInstructions_1.englishInstructions.language:
                        (0, englishHandler_1.englishTextMsgHandler)(phoneNumberId, from, msgBody).then(() => console.log("Message done"));
                        break;
                    case kannadaInstructions_1.kannadaInstructions.language:
                        yield (0, kannadaHandler_1.kannadaTextMsgHandler)(phoneNumberId, from, msgBody);
                        break;
                }
                //           const welcomeMessage = "Hello there, welcome";
                //           await sendText(phoneNumberId, from, welcomeMessage);
                //           const rows: { id: string; title: string; description: string }[] = [];
                //           languageMappings.forEach((val, key) =>
                //             rows.push({
                //               id: key,
                //               title: key,
                //               description: "Select " + key + " as your default language",
                //             })
                //           );
                //           const languageMenu: Section = {
                //             title: "Select your option",
                //             rows,
                //           };
                //           await sendInteractiveMessage(
                //             phoneNumberId,
                //             from,
                //             "Language Options",
                //             "Please select an option",
                //             [languageMenu],
                //             "Powered by RRS"
                //           );
                //         } else if (mobileNumberUser) {
                //           // provide for voter search feature
                //           const voter = await Voter.findOne({ cardno: msgBody });
                //           if (voter) {
                //             // voter card number is valid
                //             await sendTextWithImage(
                //               phoneNumberId,
                //               from,
                //               `Here are the details of the voter
                // Ward_no: ${voter.Ward_no}
                // SLNO: ${voter.SLNO}
                // House No.: ${voter.houseno}
                // Name: ${voter.VNAME_ENGLISH}
                // Card no.: ${voter.cardno}
                // Age: ${voter.Age}`
                //             );
                //           } else {
                //             // this is not a valid voter card number
                //             await sendText(
                //               phoneNumberId,
                //               from,
                //               "Please try a valid voter id or choose from below actions"
                //             );
                //             await sendInteractiveMessage(
                //               phoneNumberId,
                //               from,
                //               "Here are your options",
                //               "Pick one to start using the services",
                //               [searchActions, resetActions],
                //               "Powered by RSS"
                //             );
                //           }
                // }
            }
            else if (body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0] &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0] &&
                body.entry[0].changes[0].value.messages[0].type === "interactive") {
                const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
                const from = body.entry[0].changes[0].value.messages[0].from;
                const title = (_a = body.entry[0].changes[0].value.messages[0].interactive) === null || _a === void 0 ? void 0 : _a.list_reply.title;
                let mobileNumberUser = yield number_1.ContactNumber.findOne({
                    mobileNumber: from,
                });
                if (!mobileNumberUser) {
                    const newMobileNumberUser = new number_1.ContactNumber({
                        mobileNumber: from,
                        lastConnected: Date.now(),
                        preferredLanguage: "English",
                    });
                    yield newMobileNumberUser.save();
                    mobileNumberUser = newMobileNumberUser;
                }
                switch (mobileNumberUser.preferredLanguage) {
                    case englishInstructions_1.englishInstructions.language:
                        (0, englishHandler_1.englishInteractiveMsgHandler)(phoneNumberId, from, title).then(() => console.log("Interactive message done"));
                        break;
                    case kannadaInstructions_1.kannadaInstructions.language:
                        yield (0, kannadaHandler_1.kannadaInteractiveMsgHandler)(phoneNumberId, from, title);
                        break;
                }
                //check home
                // if ((title && title === MenuActionTitles.HOME) || !mobileNumberUser) {
                //   if (!mobileNumberUser) {
                //     const newMobileNumberUser = new ContactNumber({
                //       mobileNumber: from,
                //       lastConnected: Date.now(),
                //       preferredLanguage: "Hindi",
                //     });
                //     await newMobileNumberUser.save();
                //   }
                //   const welcomeMessage = "Hello there, welcome";
                //   await sendText(phoneNumberId, from, welcomeMessage);
                //   const rows: { id: string; title: string; description: string }[] = [];
                //   languageMappings.forEach((val, key) =>
                //     rows.push({
                //       id: key,
                //       title: key,
                //       description: `Select ${key} as your default language`,
                //     })
                //   );
                //   const languageMenu: Section = {
                //     title: "Select your option",
                //     rows,
                //   };
                //   await sendInteractiveMessage(
                //     phoneNumberId,
                //     from,
                //     "Lanuage Option",
                //     "Please select an option",
                //     [languageMenu],
                //     "Powered by RRS"
                //   );
                // } else if (
                //   title &&
                //   (Object.values(LanguageNames) as string[]).includes(title)
                // ) {
                //   // check language
                //   mobileNumberUser.preferredLanguage = title;
                //   await mobileNumberUser.save();
                //   await sendText(phoneNumberId, from, "Your language has been stored");
                //   await sendInteractiveMessage(
                //     phoneNumberId,
                //     from,
                //     "Here are your option",
                //     "Pick one to start using our services",
                //     [searchActions, resetActions],
                //     "Powered by RRS"
                //   );
                // } else if (title && title === MenuActionTitles.SEARCH) {
                //   // check search
                //   await sendText(phoneNumberId, from, "Enter voter id to search");
                // }
            }
        }
    }
    catch (e) {
        console.log("Error responding in webhook post");
        console.log(e);
    }
    res.sendStatus(200);
});
exports.postHome = postHome;
