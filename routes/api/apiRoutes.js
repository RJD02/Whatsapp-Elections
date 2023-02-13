"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const api_1 = require("./../../controller/api/api");
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
exports.router.get("/contestants", api_1.getContestants);
exports.router.post("/contestants", api_1.addContestant);
