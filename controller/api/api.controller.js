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
exports.getContestants = exports.subscribe = exports.unSubscribe = void 0;
const contestant_1 = require("./../../models/contestant");
const unSubscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contestant = yield contestant_1.Contestant.findById(req.params.id);
        if (contestant) {
            contestant.isSubscribed = false;
            yield contestant.save();
            return res.sendStatus(200);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
});
exports.unSubscribe = unSubscribe;
const subscribe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contestant = yield contestant_1.Contestant.findById(req.params.id);
        if (contestant) {
            contestant.isSubscribed = true;
            yield contestant.save();
            return res.sendStatus(200);
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
});
exports.subscribe = subscribe;
const getContestants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contestants = yield contestant_1.Contestant.find();
        if (contestants) {
            return res.status(200).send({ contestants });
        }
        else {
            return res.sendStatus(404);
        }
    }
    catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
});
exports.getContestants = getContestants;
