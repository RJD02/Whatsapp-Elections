"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageNames = exports.languageMappings = void 0;
exports.languageMappings = new Map();
var LanguageNames;
(function (LanguageNames) {
    LanguageNames["ENGLISH"] = "English";
    LanguageNames["HINDI"] = "Hindi";
    LanguageNames["KANNADA"] = "Kannada";
})(LanguageNames = exports.LanguageNames || (exports.LanguageNames = {}));
const englishInstructions = {
    acknowledgementOfLanguage: "From here on you will recieve messages in English",
    acknowledgementOfNumberSave: "Now you can use our services",
    askForVoterID: "Please provide your voter id number",
    actionsBody: "Here are your options",
    messageTitle: "Options",
};
const kannadaInstructions = {
    acknowledgementOfLanguage: "ಇಲ್ಲಿಂದ ನೀವು ಕನ್ನಡದಲ್ಲಿ ಸಂದೇಶಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತೀರಿ",
    acknowledgementOfNumberSave: "ಈಗ ನೀವು ನಮ್ಮ ಸೇವೆಗಳನ್ನು ಬಳಸಬಹುದು",
    askForVoterID: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೋಟರ್ ಐಡಿ ಸಂಖ್ಯೆಯನ್ನು ಒದಗಿಸಿ",
    actionsBody: "ನಿಮ್ಮ ಆಯ್ಕೆಗಳು ಇಲ್ಲಿವೆ",
    messageTitle: "ಆಯ್ಕೆಗಳು",
};
const hindiInstruction = {
    acknowledgementOfLanguage: "यहां से आपको हिंदी में संदेश प्राप्त होंगे",
    acknowledgementOfNumberSave: "आपका नंबर सेव कर लिया है, अब आप हमारी सेवाओं का उपयोग कर सकते हैं",
    askForVoterID: "कृपया अपना वोटर आईडी नंबर प्रदान करें",
    actionsBody: "यहाँ आपके विकल्प हैं",
    messageTitle: "विकल्प",
};
exports.languageMappings.set(LanguageNames.ENGLISH, englishInstructions);
exports.languageMappings.set(LanguageNames.KANNADA, kannadaInstructions);
exports.languageMappings.set(LanguageNames.HINDI, hindiInstruction);
// languageMappings.set("Marathi", "mr");
// languageMappings.set("Telugu", "te");
// languageMappings.set("Urdu", "ur");
