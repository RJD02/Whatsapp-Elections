"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactNumber = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const numberSchema = new mongoose_1.default.Schema({
    mobileNumber: {
        type: String,
        required: true,
    },
    preferredLanguage: { type: String, required: true },
    lastConnected: { type: Date, required: true },
});
exports.ContactNumber = mongoose_1.default.model("Contact", numberSchema);
