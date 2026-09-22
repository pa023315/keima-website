export type ContentState<T> =
  | { status: "ready"; value: T }
  | { status: "pending"; label: string };

export type ContentLocale = "zh-TW" | "en";

export type NavSectionId = "home" | "about" | "approach" | "in-motion" | "profile" | "contact";

export type ApproachItem = {
  id: string;
  index: string;
  title: string;
  label: string;
  description: string;
};

export type ProjectContent = {
  id: string;
  index: string;
  title: string;
  label: string;
  description: string;
  url: ContentState<string>;
};

export type LocaleContent<L extends ContentLocale = ContentLocale> = {
  locale: L;
  nav: Record<NavSectionId, string>;
  hero: {
    statement: ContentState<string>;
    supporting: string;
  };
  about: {
    eyebrow: string;
    title: string;
    display: string;
    intro: string;
    belief: string;
  };
  approach: {
    eyebrow: string;
    title: string;
    intro: string;
    items: ApproachItem[];
  };
  inMotion: {
    eyebrow: string;
    title: string;
    intro: string;
    projects: ProjectContent[];
  };
  profile: {
    label: string;
    title: string;
    name: string;
    role: string;
    fields: string[];
    bio: string[];
  };
  contact: {
    label: string;
    title: string;
    body: string;
    cta: string;
    email: ContentState<string>;
  };
  footer: {
    social: ContentState<string>;
    copyright: ContentState<string>;
    legal: ContentState<string>;
  };
};

const pending = (label: string): ContentState<string> => ({ status: "pending", label });
const ready = (value: string): ContentState<string> => ({ status: "ready", value });

export const siteContent: { [L in ContentLocale]: LocaleContent<L> } = {
  "zh-TW": {
    locale: "zh-TW",
    nav: {
      home: "首頁",
      about: "About",
      approach: "Approach",
      "in-motion": "In Motion",
      profile: "Profile",
      contact: "聯繫",
    },
    hero: {
      statement: ready("跨越既有路徑，連結新的可能。"),
      supporting: "Beyond the expected path.",
    },
    about: {
      eyebrow: "Positioning",
      title: "Positioning",
      display: "WE CONNECT\nIDEAS,\nPEOPLE\nAND\nPOSSIBILITIES.",
      intro:
        "桂馬數位以策略與專案為核心，串連創作者、內容、產業與數位工具，將分散的想法整理成可以真正執行的方向。",
      belief: "好的解決方案，不一定沿著既有路徑前進。",
    },
    approach: {
      eyebrow: "Approach",
      title: "HOW WE MOVE",
      intro: "KEIMA 擅長處理橫跨不同領域、沒有標準答案的問題。",
      items: [
        {
          id: "strategy",
          index: "01",
          title: "STRATEGY",
          label: "策略與方向整理",
          description: "從複雜資訊與不同需求之間，找出真正值得處理的問題與下一步。",
        },
        {
          id: "projects",
          index: "02",
          title: "PROJECTS",
          label: "專案推進",
          description: "把想法轉換成可以被規劃、協作與執行的專案。",
        },
        {
          id: "connections",
          index: "03",
          title: "CONNECTIONS",
          label: "產業連結",
          description: "串連創作者、企業、內容、資源與合作關係。",
        },
      ],
    },
    inMotion: {
      eyebrow: "In Motion",
      title: "CURRENTLY IN MOTION",
      intro: "目前正在運作與推進的計畫。",
      projects: [
        {
          id: "jobsgame",
          index: "01",
          title: "JOBSGAME",
          label: "Game Industry Career Platform",
          description: "台灣遊戲產業職缺與職涯資訊平台。",
          url: ready("https://jobsgame.tw/"),
        },
        {
          id: "indie-guider",
          index: "02",
          title: "INDIE GUIDER",
          label: "Independent Game Media",
          description: "關注獨立遊戲、產業與開發者的媒體計畫。",
          url: ready("https://indie-guider.games/"),
        },
        {
          id: "gamecf",
          index: "03",
          title: "GAMECF",
          label: "Digital Game Crowdfunding",
          description: "數位遊戲群眾募資資訊站。",
          url: ready("https://gamecf.tw/"),
        },
      ],
    },
    profile: {
      label: "Who is behind KEIMA",
      title: "Who is behind KEIMA",
      name: "IAN / 祤呈",
      role: "Consultant / Project Director",
      fields: ["Strategy", "Projects", "Creative Economy", "Game & Digital Entertainment"],
      bio: [
        "長期參與遊戲、娛樂、創作者經濟、群眾募資與數位服務相關專案，工作橫跨策略規劃、專案推進、商務合作與新服務建立。",
        "相較於提供單一領域的標準答案，更關注如何整理複雜問題、串連不同資源，並將想法推進至實際執行。",
      ],
    },
    contact: {
      label: "Contact",
      title: "WHAT'S YOUR NEXT MOVE?",
      body: "有新的想法？我們可以一起找下一步。",
      cta: "START A CONVERSATION →",
      email: ready("service@pa023315.com"),
    },
    footer: {
      social: pending("社群資訊待提供"),
      copyright: pending("版權資訊待提供"),
      legal: pending("法律資訊待提供"),
    },
  },
  en: {
    locale: "en",
    nav: {
      home: "Home",
      about: "About",
      approach: "Approach",
      "in-motion": "In Motion",
      profile: "Profile",
      contact: "Contact",
    },
    hero: {
      statement: ready("Cross existing paths, connect new possibilities."),
      supporting: "Beyond the expected path.",
    },
    about: {
      eyebrow: "Positioning",
      title: "Positioning",
      display: "WE CONNECT\nIDEAS,\nPEOPLE\nAND\nPOSSIBILITIES.",
      intro:
        "KEIMA connects creators, content, industries, and digital tools through strategy and project direction, turning scattered ideas into executable paths.",
      belief: "Strong solutions do not always follow the expected path.",
    },
    approach: {
      eyebrow: "Approach",
      title: "HOW WE MOVE",
      intro: "KEIMA works on cross-domain problems without standard answers.",
      items: [
        {
          id: "strategy",
          index: "01",
          title: "STRATEGY",
          label: "Direction framing",
          description: "Clarify the real problem and the next step among complex needs.",
        },
        {
          id: "projects",
          index: "02",
          title: "PROJECTS",
          label: "Project movement",
          description: "Turn ideas into plans, collaboration systems, and executable projects.",
        },
        {
          id: "connections",
          index: "03",
          title: "CONNECTIONS",
          label: "Industry connection",
          description: "Connect creators, companies, content, resources, and partnerships.",
        },
      ],
    },
    inMotion: {
      eyebrow: "In Motion",
      title: "CURRENTLY IN MOTION",
      intro: "Projects currently operating or being developed.",
      projects: [
        {
          id: "jobsgame",
          index: "01",
          title: "JOBSGAME",
          label: "Game Industry Career Platform",
          description: "A Taiwan game industry jobs and career information platform.",
          url: ready("https://jobsgame.tw/"),
        },
        {
          id: "indie-guider",
          index: "02",
          title: "INDIE GUIDER",
          label: "Independent Game Media",
          description: "A media project focused on indie games, industry, and developers.",
          url: ready("https://indie-guider.games/"),
        },
        {
          id: "gamecf",
          index: "03",
          title: "GAMECF",
          label: "Digital Game Crowdfunding",
          description: "A digital game crowdfunding information site.",
          url: ready("https://gamecf.tw/"),
        },
      ],
    },
    profile: {
      label: "Who is behind KEIMA",
      title: "Who is behind KEIMA",
      name: "IAN / Yu Cheng",
      role: "Consultant / Project Director",
      fields: ["Strategy", "Projects", "Creative Economy", "Game & Digital Entertainment"],
      bio: [
        "Ian works across games, entertainment, the creator economy, crowdfunding, and digital services, spanning strategy, project direction, business collaboration, and new service development.",
        "Instead of offering a single-domain answer, he focuses on organizing complex problems, connecting resources, and moving ideas into execution.",
      ],
    },
    contact: {
      label: "Contact",
      title: "WHAT'S YOUR NEXT MOVE?",
      body: "Have a new idea? We can find the next move together.",
      cta: "START A CONVERSATION →",
      email: ready("service@pa023315.com"),
    },
    footer: {
      social: pending("Social information pending"),
      copyright: pending("Copyright information pending"),
      legal: pending("Legal information pending"),
    },
  },
};
