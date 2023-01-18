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
exports.translateText = void 0;
const free_translate_1 = require("free-translate");
const translateText = (msg, to) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const translatedText = yield (0, free_translate_1.translate)(msg, { from: "en", to: to });
        return translatedText;
    }
    catch (e) {
        console.log("Error while translating");
        console.log(e);
    }
    return "";
});
exports.translateText = translateText;
