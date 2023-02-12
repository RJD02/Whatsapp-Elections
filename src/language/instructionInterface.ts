import { Section } from "./../utils/axiosDataInterface";
export interface Instruction {
  language: string;
  languageCode: string;
  languageInteractive: {
    header: string;
    body: string;
    footer: string;
  };
  //   searchActions: Section;
  //   resetActions: Section;
  Home: string;
  Search: string;
  welcomeMessage: string;
  languageSelectionMessage: string;
  detailsMessage: (
    ward_no: string,
    slno: string,
    houseNumber: string,
    name: string,
    cardNo: string,
    age: string
  ) => string;
  wrongVoterIdMessage: string;
  interactiveMessage: {
    header: string;
    body: string;
    searchActions: Section;
    resetActions: Section;
    footer: string;
  };
}
