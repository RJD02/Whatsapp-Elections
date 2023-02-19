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
exports.postHome = exports.contestantMiddleware = exports.getHome = void 0;
const contestant_1 = require("./../../models/contestant");
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
const getFrom = (req) => {
    const body = req.body;
    if (body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0].type === "text" &&
        body.entry[0].changes[0].value.messages[0].text) {
        return body.entry[0].changes[0].value.messages[0].from;
    }
    else if (body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0] &&
        body.entry[0].changes[0].value.messages[0].type === "interactive") {
        return body.entry[0].changes[0].value.messages[0].from;
    }
};
const contestantMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("inside contestant middle ware");
    const contestant = yield contestant_1.Contestant.findById(req.params.id);
    const from = getFrom(req);
    const user = yield number_1.ContactNumber.findOne({ mobileNumber: from });
    if (user && contestant) {
        if (!contestant.isSubscribed) {
            return res.sendStatus(200);
        }
        const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
        if (yesterday < user.lastConnected) {
            contestant.conversationNumber += 1;
        }
        else {
            user.lastConnected = new Date();
        }
        yield contestant.save();
        next();
    }
    else if (contestant) {
        contestant.conversationNumber += 1;
        yield contestant.save();
        next();
    }
});
exports.contestantMiddleware = contestantMiddleware;
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
                const contestant = yield contestant_1.Contestant.findById(req.params.id);
                if (contestant) {
                    contestant.voterIdSearchNumber += 1;
                    yield contestant.save();
                }
                switch (mobileNumberUser.preferredLanguage) {
                    case englishInstructions_1.englishInstructions.language:
                        (0, englishHandler_1.englishTextMsgHandler)(phoneNumberId, from, msgBody).then(() => console.log("Message done"));
                        break;
                    case kannadaInstructions_1.kannadaInstructions.language:
                        yield (0, kannadaHandler_1.kannadaTextMsgHandler)(phoneNumberId, from, msgBody);
                        break;
                }
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
