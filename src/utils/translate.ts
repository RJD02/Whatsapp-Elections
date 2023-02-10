import { languageMappings } from "./languageMappings";
import { Translate } from "free-translate";
import { Language } from "free-translate/lib/types/Language";
import { translate } from "free-translate";
import translatte from "translatte";

export const translateText = async (msg: string, to: Language) => {
  try {
    // const translatedText = await translate(msg, { from: "en", to: to });
    const translated = await translatte(msg, { from: "en", to });
    const text = await translated.text;
    return text;
  } catch (e) {
    console.log("Error while translating");
    console.log(e);
  }
  return "";
};
