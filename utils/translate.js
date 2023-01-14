const { translate } = require("@vitalets/google-translate-api");

const translateText = async (msg, to = "en") => {
  const { text } = await translate(msg, { to });
  return text;
};

module.exports = translateText;
