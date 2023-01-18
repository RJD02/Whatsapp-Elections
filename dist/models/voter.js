"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const VoterSchema = new Schema({
    Ward_no: String,
    SLNO: String,
    houseno: String,
    VNAME_ENGLISH: String,
    cardno: String,
    Age: Number,
    PreferredLanguage: String,
    mobileNumber: String,
});
exports.Voter = mongoose_1.default.model("Voter", VoterSchema);
