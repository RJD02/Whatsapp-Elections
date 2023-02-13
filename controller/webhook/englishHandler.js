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
exports.englishLanguageHandler = exports.englishHomeHandler = exports.englishInteractiveMsgHandler = exports.englishTextMsgHandler = void 0;
const number_1 = require("../../models/number");
const englishInstructions_1 = require("../../language/englishInstructions");
const sendMessage_1 = require("../../utils/sendMessage");
const voter_1 = require("../../models/voter");
const languageMappings_1 = require("../../utils/languageMappings");
const englishTextMsgHandler = (phoneNumberId, from, msgBody) => __awaiter(void 0, void 0, void 0, function* () {
    const voter = yield voter_1.Voter.findOne({ cardno: msgBody });
    if (voter &&
        voter.Ward_no &&
        voter.SLNO &&
        voter.houseno &&
        voter.VNAME_ENGLISH &&
        voter.cardno &&
        voter.Age) {
        yield (0, sendMessage_1.sendTextWithImage)(phoneNumberId, from, englishInstructions_1.englishInstructions.detailsMessage(voter.Ward_no, voter.SLNO, voter.houseno, voter.VNAME_ENGLISH, voter.cardno, voter.Age.toString()));
    }
    else {
        yield (0, sendMessage_1.sendText)(phoneNumberId, from, englishInstructions_1.englishInstructions.wrongVoterIdMessage);
    }
    yield (0, sendMessage_1.sendInteractiveMessage)(phoneNumberId, from, englishInstructions_1.englishInstructions.interactiveMessage.header, englishInstructions_1.englishInstructions.interactiveMessage.body, [
        englishInstructions_1.englishInstructions.interactiveMessage.searchActions,
        englishInstructions_1.englishInstructions.interactiveMessage.resetActions,
    ], englishInstructions_1.englishInstructions.interactiveMessage.footer);
});
exports.englishTextMsgHandler = englishTextMsgHandler;
const englishInteractiveMsgHandler = (phoneNumberId, from, title) => __awaiter(void 0, void 0, void 0, function* () {
    let mobileNumberUser = yield number_1.ContactNumber.findOne({ mobileNumber: from });
    if (!mobileNumberUser) {
        const newMobileNumberUser = new number_1.ContactNumber({
            mobileNumber: from,
            lastConnected: Date.now(),
            preferredLanguage: "English",
        });
        yield newMobileNumberUser.save();
        mobileNumberUser = newMobileNumberUser;
    }
    if (title && title === englishInstructions_1.englishInstructions.Home) {
        yield (0, exports.englishHomeHandler)(phoneNumberId, from);
    }
    else if (title && title === englishInstructions_1.englishInstructions.Search) {
        yield (0, sendMessage_1.sendText)(phoneNumberId, from, englishInstructions_1.englishInstructions.searchPromptMessage);
    }
    else if (title &&
        Object.values(languageMappings_1.LanguageNames).includes(title)) {
        mobileNumberUser.preferredLanguage = title;
        yield mobileNumberUser.save();
        yield (0, sendMessage_1.sendText)(phoneNumberId, from, englishInstructions_1.englishInstructions.languageSelectionMessage);
    }
    console.log("end");
});
exports.englishInteractiveMsgHandler = englishInteractiveMsgHandler;
const englishHomeHandler = (phoneNumberId, from) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sendMessage_1.sendText)(phoneNumberId, from, englishInstructions_1.englishInstructions.welcomeMessage);
    yield (0, exports.englishLanguageHandler)(phoneNumberId, from);
});
exports.englishHomeHandler = englishHomeHandler;
const englishLanguageHandler = (phoneNumberId, from) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = [];
    languageMappings_1.languageMappings.forEach((val, key) => rows.push({
        id: key,
        title: key,
        description: `Select ${key} as your default language`,
    }));
    const languageMenu = {
        title: englishInstructions_1.englishInstructions.languageInteractive.header,
        rows,
    };
    console.log(languageMenu);
    yield (0, sendMessage_1.sendInteractiveMessage)(phoneNumberId, from, englishInstructions_1.englishInstructions.languageInteractive.header, englishInstructions_1.englishInstructions.languageInteractive.body, [languageMenu], englishInstructions_1.englishInstructions.languageInteractive.footer);
});
exports.englishLanguageHandler = englishLanguageHandler;
