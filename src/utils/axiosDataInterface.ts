interface WhatsappData {
  messaging_product: String;
  to: String;
  type: "interactive" | "text" | "image";
  recipient_type: "individual";
}

export interface AxiosImageData extends WhatsappData {
  image: {
    link: String;
    caption?: String;
  };
}

export interface AxiosTextData extends WhatsappData {
  text: {
    body: String;
  };
}
export type Section = {
  title: string;
  rows: {
    id: string;
    title: string;
    description: string;
  }[];
};
export interface AxiosInteractiveData extends WhatsappData {
  interactive: {
    type: "list" | "button";
    header: {
      type: string;
      text: string;
    };
    body: {
      text: string;
    };
    footer: {
      text: string;
    };
    action: {
      button: string;
      sections: Section[];
    };
  };
}
