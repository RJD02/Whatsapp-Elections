import { Section } from "../../utils/axiosDataInterface";
import mongoose from "mongoose";
import { ContactNumber } from "../../models/number";
import { englishInstructions } from "../../language/englishInstructions";
import {
  sendInteractiveMessage,
  sendText,
  sendTextWithImage,
} from "../../utils/sendMessage";
import { Voter } from "../../models/voter";
import { languageMappings, LanguageNames } from "../../utils/languageMappings";

export const englishTextMsgHandler = async (
  phoneNumberId: string,
  from: string,
  msgBody: string
) => {
  const voter = await Voter.findOne({ cardno: msgBody });
  if (
    voter &&
    voter.Ward_no &&
    voter.SLNO &&
    voter.houseno &&
    voter.VNAME_ENGLISH &&
    voter.cardno &&
    voter.Age
  ) {
    await sendTextWithImage(
      phoneNumberId,
      from,
      englishInstructions.detailsMessage(
        voter.Ward_no,
        voter.SLNO,
        voter.houseno,
        voter.VNAME_ENGLISH,
        voter.cardno,
        voter.Age.toString()
      )
    );
  } else {
    await sendText(
      phoneNumberId,
      from,
      englishInstructions.wrongVoterIdMessage
    );
  }

  await sendInteractiveMessage(
    phoneNumberId,
    from,
    englishInstructions.interactiveMessage.header,
    englishInstructions.interactiveMessage.body,
    [
      englishInstructions.interactiveMessage.searchActions,
      englishInstructions.interactiveMessage.resetActions,
    ],
    englishInstructions.interactiveMessage.footer
  );
};

export const englishInteractiveMsgHandler = async (
  phoneNumberId: string,
  from: string,
  title: string | undefined
) => {
  let mobileNumberUser = await ContactNumber.findOne({ mobileNumber: from });
  if (!mobileNumberUser) {
    const newMobileNumberUser = new ContactNumber({
      mobileNumber: from,
      lastConnected: Date.now(),
      preferredLanguage: "English",
    });
    await newMobileNumberUser.save();
    mobileNumberUser = newMobileNumberUser;
  }
  if (title && title === englishInstructions.Home) {
    await englishHomeHandler(phoneNumberId, from);
  } else if (title && title === englishInstructions.Search) {
    await sendText(
      phoneNumberId,
      from,
      englishInstructions.searchPromptMessage
    );
  } else if (
    title &&
    (Object.values(LanguageNames) as string[]).includes(title)
  ) {
    mobileNumberUser.preferredLanguage = title;
    await mobileNumberUser.save();
    await sendText(
      phoneNumberId,
      from,
      englishInstructions.languageSelectionMessage
    );
  }
  console.log("end");
};

export const englishHomeHandler = async (
  phoneNumberId: string,
  from: string
) => {
  await sendText(phoneNumberId, from, englishInstructions.welcomeMessage);
  await englishLanguageHandler(phoneNumberId, from);
};

export const englishLanguageHandler = async (
  phoneNumberId: string,
  from: string
) => {
  const rows: { id: string; title: string; description: string }[] = [];
  languageMappings.forEach((val, key) =>
    rows.push({
      id: key,
      title: key,
      description: `Select ${key} as your default language`,
    })
  );

  const languageMenu: Section = {
    title: englishInstructions.languageInteractive.header,
    rows,
  };
  console.log(languageMenu);
  await sendInteractiveMessage(
    phoneNumberId,
    from,
    englishInstructions.languageInteractive.header,
    englishInstructions.languageInteractive.body,
    [languageMenu],
    englishInstructions.languageInteractive.footer
  );
};
