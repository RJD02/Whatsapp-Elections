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
exports.kannadaInteractiveMsgHandler = exports.kannadaTextMsgHandler = void 0;
const languageMappings_1 = require("./../../utils/languageMappings");
const number_1 = require("./../../models/number");
const kannadaInstructions_1 = require("./../../language/kannadaInstructions");
const sendMessage_1 = require("./../../utils/sendMessage");
const voter_1 = require("./../../models/voter");
const kannadaTextMsgHandler = (phoneNumberId, from, msgBody) => __awaiter(void 0, void 0, void 0, function* () {
    const voter = yield voter_1.Voter.findOne({ cardno: msgBody });
    if (voter &&
        voter.Ward_no &&
        voter.SLNO &&
        voter.VNAME_ENGLISH &&
        voter.houseno &&
        voter.cardno &&
        voter.Age) {
        yield (0, sendMessage_1.sendTextWithImage)(phoneNumberId, from, kannadaInstructions_1.kannadaInstructions.detailsMessage(voter.Ward_no, voter.SLNO, voter.houseno, voter.VNAME_ENGLISH, voter.cardno, voter.Age.toString()));
    }
    else {
        yield (0, sendMessage_1.sendText)(phoneNumberId, from, kannadaInstructions_1.kannadaInstructions.wrongVoterIdMessage);
    }
    yield (0, sendMessage_1.sendInteractiveMessage)(phoneNumberId, from, kannadaInstructions_1.kannadaInstructions.interactiveMessage.header, kannadaInstructions_1.kannadaInstructions.interactiveMessage.body, [
        kannadaInstructions_1.kannadaInstructions.interactiveMessage.searchActions,
        kannadaInstructions_1.kannadaInstructions.interactiveMessage.resetActions,
    ], kannadaInstructions_1.kannadaInstructions.interactiveMessage.footer);
});
exports.kannadaTextMsgHandler = kannadaTextMsgHandler;
const kannadaInteractiveMsgHandler = (phoneNumberId, from, title) => __awaiter(void 0, void 0, void 0, function* () {
    let mobileNumberUser = yield number_1.ContactNumber.findOne({ mobileNumber: from });
    if (!mobileNumberUser) {
        const newMobileNumberUser = new number_1.ContactNumber({
            mobileNumber: from,
            lastConnected: Date.now(),
            preferredLanguage: "Kannada",
        });
        yield newMobileNumberUser.save();
        mobileNumberUser = newMobileNumberUser;
    }
    if (title && title === kannadaInstructions_1.kannadaInstructions.Home) {
        yield kannadaHomeHandler(phoneNumberId, from);
    }
    else if (title && title === kannadaInstructions_1.kannadaInstructions.Search) {
        yield (0, sendMessage_1.sendText)(phoneNumberId, from, kannadaInstructions_1.kannadaInstructions.searchPromptMessage);
    }
    else if (title &&
        Object.values(languageMappings_1.LanguageNames).includes(title)) {
        mobileNumberUser.preferredLanguage = title;
        yield mobileNumberUser.save();
    }
});
exports.kannadaInteractiveMsgHandler = kannadaInteractiveMsgHandler;
const kannadaHomeHandler = (phoneNumberId, from) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sendMessage_1.sendText)(phoneNumberId, from, kannadaInstructions_1.kannadaInstructions.welcomeMessage);
    yield kannadaLanguageHandler(phoneNumberId, from);
});
const kannadaLanguageHandler = (phoneNumberId, from) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = [];
    languageMappings_1.languageMappings.forEach((val, key) => rows.push({
        id: key,
        title: key,
        description: `${key} ಆಯ್ಕೆಮಾಡಿ`,
    }));
    const langaugeMenu = {
        title: kannadaInstructions_1.kannadaInstructions.languageInteractive.header,
        rows,
    };
    yield (0, sendMessage_1.sendInteractiveMessage)(phoneNumberId, from, kannadaInstructions_1.kannadaInstructions.languageInteractive.header, kannadaInstructions_1.kannadaInstructions.languageInteractive.body, [langaugeMenu], kannadaInstructions_1.kannadaInstructions.languageInteractive.footer);
});
