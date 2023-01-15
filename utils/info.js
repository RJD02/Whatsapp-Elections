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
const languageRows = new Info(
  "Kannada",
  async () =>
    await translateText(
      "Set your language to Kannada",
      languageMappings.get("Kannada")
    )
);
languageRows.addInfo(
  "English",
  async () =>
    await translateText(
      "Set your language to English(default)",
      languageMappings.get("English")
    )
);
languageRows.addInfo(
  "Hindi",
  async () =>
    await translateText(
      "Set your language to Hindi",
      languageMappings.get("Hindi")
    )
);
languageRows.addInfo(
  "Marathi",
  async () =>
    await translateText(
      "Set your language to Marathi",
      languageMappings.get("Marathi")
    )
);
languageRows.addInfo(
  "Telugu",
  async () =>
    await translateText(
      "Set your language to Telugu",
      languageMappings.get("Telugu")
    )
);
languageRows.addInfo(
  "Urdu",
  async () =>
    await translateText(
      "Set your language to Telugu",
      languageMappings.get("Urdu")
    )
);

module.exports = [basicRows, campaignRows, languageRows];
