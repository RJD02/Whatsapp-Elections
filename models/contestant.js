"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contestant = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const contestantSchema = new mongoose_1.default.Schema({
    mobileNumber: String,
    conversationNumber: {
        type: Number,
        required: true,
    },
    isSubscribed: {
        type: Boolean,
        default: true,
        required: true,
    },
    voterIdSearchNumber: {
        type: Number,
        required: true,
    },
    webhookURL: String,
    region: String,
});
exports.Contestant = mongoose_1.default.model("Contestant", contestantSchema);
