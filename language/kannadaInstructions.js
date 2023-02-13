"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kannadaInstructions = void 0;
const searchActions = {
    title: "ಸೇವೆಗಳು",
    rows: [
        {
            id: "1",
            title: "ಹುಡುಕಿ",
            description: "ವೋಟರ್ ಐಡಿ ಮೂಲಕ ಹುಡುಕಿ",
        },
    ],
};
const resetActions = {
    title: "ಮರುಹೊಂದಿಸಿ",
    rows: [
        {
            id: "2",
            title: "ಮನೆ",
            description: "ಭಾಷೆಯನ್ನು ಮರುಹೊಂದಿಸಿ",
        },
    ],
};
exports.kannadaInstructions = {
    languageInteractive: {
        header: "ಭಾಷಾ ಆಯ್ಕೆ",
        body: "ದಯವಿಟ್ಟು ಒಂದು ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ",
        footer: "Powered by RRS",
    },
    welcomeMessage: "ನಮಸ್ಕಾರ, ಸ್ವಾಗತ",
    detailsMessage(ward_no, slno, houseNumber, name, cardNo, age) {
        return `ಮತದಾರರ ವಿವರ ಇಲ್ಲಿದೆ
Ward_no: ${ward_no}
SLNO: ${slno}
House no: ${houseNumber}
Name: ${name}
Card no: ${cardNo}
Age: ${age}`;
    },
    Home: "ಮನೆ",
    Search: "ಹುಡುಕಿ",
    language: "Kannada",
    languageCode: "kn",
    searchPromptMessage: "ದಯವಿಟ್ಟು ವೋಟರ್ ಐಡಿಯನ್ನು ನಮೂದಿಸಿ",
    wrongVoterIdMessage: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ವೋಟರ್ ಐಡಿಯನ್ನು ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಕೆಳಗಿನ ಕ್ರಿಯೆಗಳಿಂದ ಆಯ್ಕೆಮಾಡಿ",
    languageSelectionMessage: "ನಿಮ್ಮ ಭಾಷೆಯ ಆದ್ಯತೆಯನ್ನು ಸಂಗ್ರಹಿಸಲಾಗಿದೆ",
    interactiveMessage: {
        header: "ನಿಮ್ಮ ಆಯ್ಕೆಗಳು ಇಲ್ಲಿವೆ",
        body: "ಸೇವೆಗಳನ್ನು ಬಳಸಲು ಪ್ರಾರಂಭಿಸಲು ಒಂದನ್ನು ಆರಿಸಿ",
        footer: "Powered by RSS",
        resetActions,
        searchActions,
    },
};
