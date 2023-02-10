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
const voter_1 = require("./../models/voter");
const sendMessage_1 = require("./../utils/sendMessage");
const languageMappings_1 = require("./../utils/languageMappings");
const sendMessage_2 = require("./../utils/sendMessage");
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
    console.log("Got /webhook post req");
    const body = req.body;
    try {
        if (body.object) {
            if (body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0] &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]) {
                // extract basic information
                const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
                const from = body.entry[0].changes[0].value.messages[0].from;
                const msgBody = body.entry[0].changes[0].value.messages[0].text.body;
                // get voter if exists
                const voter = yield voter_1.Voter.findOne({ mobileNumber: from });
                // if voter exisits and the current message is a language request
                if (voter && languageMappings_1.languageMappings.get(msgBody.split("\n")[0])) {
                    // send acknowledgement that now on he will get messages in this language
                    const language = msgBody.split("\n")[0];
                    voter.PreferredLanguage = languageMappings_1.languageMappings.get(language);
                    yield voter.save();
                    yield (0, sendMessage_1.sendText)(phoneNumberId, from, languageMappings_1.languageMappings.get(language).acknowledgementOfLanguage);
                }
                else if (voter) {
                    // voter with this mobile is present
                    const sampleSection = {
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
                    yield (0, sendMessage_2.sendInteractiveMessage)(phoneNumberId, from, languageMappings_1.languageMappings.get("Hindi").actionsBody, sections, "Powered by *RJ*");
                }
                else if (msgBody) {
                    const user = yield voter_1.Voter.findOne({ cardno: msgBody });
                    if (user) {
                        user.mobileNumber = from;
                        yield user.save();
                        yield (0, sendMessage_1.sendText)(phoneNumberId, from, languageMappings_1.languageMappings.get("Hindi").acknowledgementOfNumberSave);
                    }
                    else {
                        yield (0, sendMessage_1.sendText)(phoneNumberId, from, languageMappings_1.languageMappings.get("Hindi").askForVoterID);
                    }
                }
                return res.sendStatus(200);
            }
            else {
                return res.sendStatus(200);
            }
        }
    }
    catch (e) {
        console.log("Error responding in webhook post");
    }
    res.sendStatus(200);
});
exports.postHome = postHome;
