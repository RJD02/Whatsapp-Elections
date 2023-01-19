"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
class Info {
    constructor(title, description) {
        this.languageInformation = { title: "", description: "", id: "" };
        this.allInfo = [this.languageInformation];
        this.languageInformation.title = title;
        this.languageInformation.description = description;
        const id = (0, crypto_1.randomUUID)().replace("-", "");
        this.languageInformation.id = id;
        this.allInfo = [this.languageInformation];
    }
    addInfo(title, description) {
        const id = String((0, crypto_1.randomUUID)()).replace("-", "");
        this.allInfo.push({ title, description, id });
    }
    getAllInfo() {
        return [...this.allInfo];
    }
}
// section 1: basic services
