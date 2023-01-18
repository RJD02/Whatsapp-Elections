import { languageMappings } from "./languageMappings";
import { Translate } from "free-translate";
import { Language } from "free-translate/lib/types/Language";
import { translate } from "free-translate";

export const translateText = async (msg: string, to: Language) => {
  try {
    const translatedText = await translate(msg, { from: "en", to: to });
    return translatedText;
  } catch (e) {
    console.log("Error while translating");
    console.log(e);
  }
  return "";
};
