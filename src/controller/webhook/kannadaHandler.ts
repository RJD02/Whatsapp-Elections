import { Section } from "./../../utils/axiosDataInterface";
import {
  languageMappings,
  LanguageNames,
} from "./../../utils/languageMappings";

import { ContactNumber } from "./../../models/number";
import { kannadaInstructions } from "./../../language/kannadaInstructions";
import {
  sendTextWithImage,
  sendInteractiveMessage,
  sendText,
} from "./../../utils/sendMessage";
import { Voter } from "./../../models/voter";

export const kannadaTextMsgHandler = async (
  phoneNumberId: string,
  from: string,
  msgBody: string
) => {
  const voter = await Voter.findOne({ cardno: msgBody });
  if (
    voter &&
    voter.Ward_no &&
    voter.SLNO &&
    voter.VNAME_ENGLISH &&
    voter.houseno &&
    voter.cardno &&
    voter.Age
  ) {
    await sendTextWithImage(
      phoneNumberId,
      from,
      kannadaInstructions.detailsMessage(
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
      kannadaInstructions.wrongVoterIdMessage
    );
  }
  await sendInteractiveMessage(
    phoneNumberId,
    from,
    kannadaInstructions.interactiveMessage.header,
    kannadaInstructions.interactiveMessage.body,
    [
      kannadaInstructions.interactiveMessage.searchActions,
      kannadaInstructions.interactiveMessage.resetActions,
    ],
    kannadaInstructions.interactiveMessage.footer
  );
};

export const kannadaInteractiveMsgHandler = async (
  phoneNumberId: string,
  from: string,
  title: string | undefined
) => {
  let mobileNumberUser = await ContactNumber.findOne({ mobileNumber: from });
  if (!mobileNumberUser) {
    const newMobileNumberUser = new ContactNumber({
      mobileNumber: from,
      lastConnected: Date.now(),
      preferredLanguage: "Kannada",
    });
    await newMobileNumberUser.save();
    mobileNumberUser = newMobileNumberUser;
  }
  if (title && title === kannadaInstructions.Home) {
    await kannadaHomeHandler(phoneNumberId, from);
  } else if (title && title === kannadaInstructions.Search) {
    await sendText(
      phoneNumberId,
      from,
      kannadaInstructions.searchPromptMessage
    );
  } else if (
    title &&
    (Object.values(LanguageNames) as string[]).includes(title)
  ) {
    mobileNumberUser.preferredLanguage = title;
    await mobileNumberUser.save();
  }
};

const kannadaHomeHandler = async (phoneNumberId: string, from: string) => {
  await sendText(phoneNumberId, from, kannadaInstructions.welcomeMessage);
  await kannadaLanguageHandler(phoneNumberId, from);
};

const kannadaLanguageHandler = async (phoneNumberId: string, from: string) => {
  const rows: { id: string; title: string; description: string }[] = [];
  languageMappings.forEach((val, key) =>
    rows.push({
      id: key,
      title: key,
      description: `${key} ಆಯ್ಕೆಮಾಡಿ`,
    })
  );
  const langaugeMenu: Section = {
    title: kannadaInstructions.languageInteractive.header,
    rows,
  };
  await sendInteractiveMessage(
    phoneNumberId,
    from,
    kannadaInstructions.languageInteractive.header,
    kannadaInstructions.languageInteractive.body,
    [langaugeMenu],
    kannadaInstructions.languageInteractive.footer
  );
};
