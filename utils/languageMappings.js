"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageMappings = void 0;
exports.languageMappings = new Map();
const englishInstructions = {
    acknowledgementOfLanguage: "From here on you will recieve messages in English",
    acknowledgementOfNumberSave: "Saved your number, now you can use our services",
    askForVoterID: "Please provide your voter id number",
    actionsBody: "Here are your options",
};
const kannadaInstructions = {
    acknowledgementOfLanguage: "ಇಲ್ಲಿಂದ ನೀವು ಕನ್ನಡದಲ್ಲಿ ಸಂದೇಶಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತೀರಿ",
    acknowledgementOfNumberSave: "ನಿಮ್ಮ ಸಂಖ್ಯೆಯನ್ನು ಉಳಿಸಲಾಗಿದೆ, ಈಗ ನೀವು ನಮ್ಮ ಸೇವೆಗಳನ್ನು ಬಳಸಬಹುದು",
    askForVoterID: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೋಟರ್ ಐಡಿ ಸಂಖ್ಯೆಯನ್ನು ಒದಗಿಸಿ",
    actionsBody: "ನಿಮ್ಮ ಆಯ್ಕೆಗಳು ಇಲ್ಲಿವೆ",
};
const hindiInstruction = {
    acknowledgementOfLanguage: "यहां से आपको हिंदी में संदेश प्राप्त होंगे",
    acknowledgementOfNumberSave: "आपका नंबर सेव कर लिया है, अब आप हमारी सेवाओं का उपयोग कर सकते हैं",
    askForVoterID: "कृपया अपना वोटर आईडी नंबर प्रदान करें",
    actionsBody: "यहाँ आपके विकल्प हैं",
};
exports.languageMappings.set("English", englishInstructions);
exports.languageMappings.set("Kannada", kannadaInstructions);
exports.languageMappings.set("Hindi", hindiInstruction);
// languageMappings.set("Marathi", "mr");
// languageMappings.set("Telugu", "te");
// languageMappings.set("Urdu", "ur");
