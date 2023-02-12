import { Section } from "./../utils/axiosDataInterface";
import { Instruction } from "./instructionInterface";

const searchActions: Section = {
  title: "Services",
  rows: [
    {
      id: "1",
      title: "Search",
      description: "Search by voter id",
    },
  ],
};
const resetActions: Section = {
  title: "Reset",
  rows: [
    {
      id: "2",
      title: "Home",
      description: "Reset the language",
    },
  ],
};

export const englishInstructions: Instruction = {
  languageInteractive: {
    header: "Language Option",
    body: "Please select an option",
    footer: "Powered by RRS",
  },
  welcomeMessage: "Hello there, welcome",
  detailsMessage: (ward_no, slno, houseNumber, name, cardno, age) => {
    return `Here are the details of the voter
Ward_no: ${ward_no}
SLNO: ${slno}
House no.: ${houseNumber}
Name: ${name}
Card no: ${cardno}
Age: ${age}`;
  },
  Home: "Home",
  Search: "Search",
  language: "English",
  languageCode: "en",
  wrongVoterIdMessage:
    "Please try a valid voter id or choose from the below actions",
  languageSelectionMessage: "Your language preference has been stored",
  interactiveMessage: {
    header: "Here are your options",
    body: "Pick one to start using the services",
    footer: "Powered by RSS",
    resetActions,
    searchActions,
  },
};
