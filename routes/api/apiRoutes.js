"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const api_controller_1 = require("./../../controller/api/api.controller");
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
exports.router.get("/contestant", api_controller_1.getContestants);
exports.router.post("/contestant/:id/subscribe", api_controller_1.subscribe);
exports.router.post("/contestant/:id/unsubscribe", api_controller_1.unSubscribe);
