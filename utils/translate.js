const { translate } = require("free-translate");

const languageMappings = require("./languageCodes");

const translateText = async (msg, to = "en") => {
  try {
    const translatedText = await translate(msg, { to });
    return translatedText;
  } catch (e) {
    return "";
  }
};

module.exports = translateText;
