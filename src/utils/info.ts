import { randomUUID } from "crypto";

type langugageInfo = {
  title: string;
  description: string;
  id: string;
};

class Info {
  languageInformation: langugageInfo = { title: "", description: "", id: "" };
  allInfo: langugageInfo[] = [this.languageInformation];
  constructor(title: string, description: string) {
    this.languageInformation.title = title;
    this.languageInformation.description = description;
    const id = randomUUID().replace("-", "");
    this.languageInformation.id = id;
    this.allInfo = [this.languageInformation];
  }

  addInfo(title: string, description: string) {
    const id = String(randomUUID()).replace("-", "");
    this.allInfo.push({ title, description, id });
  }

  getAllInfo() {
    return [...this.allInfo];
  }
}

// section 1: basic services
