"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const webhook_1 = require("../../controller/webhook/webhook");
exports.router = express_1.default.Router();
exports.router.get("/", webhook_1.getHome);
exports.router.post("/", webhook_1.postHome);
