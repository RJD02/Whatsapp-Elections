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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInteractiveMessage = exports.sendText = exports.sendTextWithImage = void 0;
const axios_1 = __importDefault(require("axios"));
const getURL = (phoneNumberId) => {
    const url = "https://graph.facebook.com/v15.0/" +
        phoneNumberId +
        "/messages?access_token=" +
        process.env.WHATSAPP_TOKEN;
    return url;
};
const sendTextWithImage = (phoneNumberId, from, msgBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // object to send
        const axiosData = {
            messaging_product: "whatsapp",
            to: from,
            type: "image",
            image: {
                link: "https://images.unsplash.com/photo-1661961110218-35af7210f803?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
                caption: "Ack: " + msgBody,
            },
            recipient_type: "individual",
        };
        // send the message with image
        const resp = yield (0, axios_1.default)({
            method: "POST",
            url: getURL(phoneNumberId),
            data: axiosData,
            headers: { "Content-Type": "application/json" },
        });
        const data = yield resp.data;
    }
    catch (e) {
        console.log("Error while sending text with image");
        console.log(e.response);
    }
});
exports.sendTextWithImage = sendTextWithImage;
const sendText = (phoneNumberId, from, msgBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // object to send
        const axiosData = {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: { body: msgBody },
            recipient_type: "individual",
        };
        const resp = yield (0, axios_1.default)({
            method: "POST",
            url: getURL(phoneNumberId),
            data: JSON.stringify(axiosData),
            headers: { "Content-Type": "application/json" },
        });
        const data = yield resp.data;
        console.log(data);
    }
    catch (e) {
        console.log("Error while sending text");
        console.log(e.response);
    }
});
exports.sendText = sendText;
const sendInteractiveMessage = (phoneNumberId, from, title, msgBody, sections, footer) => __awaiter(void 0, void 0, void 0, function* () {
    const axiosData = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        type: "interactive",
        interactive: {
            type: "list",
            header: {
                type: "text",
                text: title,
            },
            body: {
                text: msgBody,
            },
            footer: {
                text: footer,
            },
            action: {
                button: "See actions",
                sections,
            },
        },
    };
    try {
        const resp = yield (0, axios_1.default)({
            method: "POST",
            url: getURL(phoneNumberId),
            data: axiosData,
        });
        const data = yield resp.data;
        console.log(data);
    }
    catch (e) {
        console.log("Error while sending interactive message");
        console.log(e.any);
    }
});
exports.sendInteractiveMessage = sendInteractiveMessage;
