const { randomUUID } = require("crypto");
const languageMappings = require("./languageCodes");
const translateText = require("./translate");

class Info {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    const id = String(randomUUID()).replace("-", "");
    this.allInfo = [{ title, description, id }];
  }

  addInfo(title, description) {
    const id = String(randomUUID()).replace("-", "");
    this.allInfo.push({ title, description, id });
  }
  getAllInfo() {
    return [...this.allInfo];
  }
}

// section 1 basic services
const basicRows = new Info(
  "Search your voter id",
  "Enter a voter id and search if it exists"
);
basicRows.addInfo("See your family members", "Get list of your family members");

// console.log(basicRows.getAllInfo());

// section 2 for campaign related services
const campaignRows = new Info(
  "Get campaign leaflet",
  "Get latest campaign info through leaflet"
);
campaignRows.addInfo("Get party's info", "Get all latest updates");

// console.log(campaignRows.getAllInfo());

// section 3 for service config
const getLanguageRows = async () => {
  const kannadaDesc = await translateText(
    "Set your language to Kannada",
    languageMappings.get("Kannada")
  );
  const englishDesc = await translateText(
    "Set your language to English(default)",
    languageMappings.get("English")
  );
  const hindiDesc = await translateText(
    "Set your languge to Hindi",
    languageMappings.get("Hindi")
  );
  const teluguDesc = await translateText(
    "Set your language to Telugu",
    languageMappings.get("Telugu")
  );
  const marathiDesc = await translateText(
    "Set your language to Marathi",
    languageMappings.get("Marathi")
  );
  const urduDesc = await translateText(
    "Set your language to Urdu",
    languageMappings.get("Urdu")
  );

  const languageRows = new Info("Kannada", kannadaDesc);
  languageRows.addInfo("English", englishDesc);

  languageRows.addInfo("Hindi", hindiDesc);

  languageRows.addInfo("Marathi", marathiDesc);
  languageRows.addInfo("Telugu", teluguDesc);
  languageRows.addInfo("Urdu", urduDesc);

  return languageRows;
};

const languageRows = getLanguageRows();

module.exports = { basicRows, campaignRows, languageRows };
