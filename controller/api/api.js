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
exports.getContestants = exports.addContestant = void 0;
const contestant_1 = require("./../../models/contestant");
const addContestant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const newContestant = new contestant_1.Contestant({
            mobileNumber: body.mobileNumber,
            isSubscribed: body.isSubscribed,
            webhookURL: body.webhookURL,
            region: body.region,
        });
        yield newContestant.save();
        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
exports.addContestant = addContestant;
const getContestants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contestants = yield contestant_1.Contestant.find({});
        res.send({ data: contestants });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
exports.getContestants = getContestants;
