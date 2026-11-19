export type ContentState<T> =
  | { status: "ready"; value: T }
  | { status: "pending"; label: string };

export type ContentLocale = "zh-TW" | "en";
export type ProjectId = "jobsgame" | "virtual-vector";

export type NavSectionId = "home" | "about" | "approach" | "in-motion" | "profile" | "contact";

export type ApproachItem = {
  id: string;
  index: string;
  title: string;
  label: string;
  description: string;
};

export type ProjectContent = {
  id: ProjectId;
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
    copyright: string;
  };
};

const ready = (value: string): ContentState<string> => ({ status: "ready", value });

export const siteContent: { [L in ContentLocale]: LocaleContent<L> } = {
  "zh-TW": {
    locale: "zh-TW",
    nav: {
      home: "首頁",
      about: "關於桂馬",
      approach: "合作方式",
      "in-motion": "進行中專案",
      profile: "顧問介紹",
      contact: "聯繫",
    },
    hero: {
      statement: ready("跨越既有路徑，連結新的可能。"),
      supporting: "Beyond the expected path.",
    },
    about: {
      eyebrow: "數位策略與專案",
      title: "桂馬數位服務定位",
      display: "WE CONNECT\nIDEAS,\nPEOPLE\nAND\nPOSSIBILITIES.",
      intro:
        "桂馬數位以數位策略顧問與專案推進為核心，協助遊戲、數位娛樂與創作者經濟團隊規劃服務方向、整合內容與產業資源，並透過商務合作將新計畫落地。",
      belief: "好的解決方案，不一定沿著既有路徑前進。",
    },
    approach: {
      eyebrow: "Approach",
      title: "HOW WE MOVE",
      intro:
        "從數位策略規劃、專案企劃到跨界合作，KEIMA 協助團隊釐清方向、整合資源並推進執行。",
      items: [
        {
          id: "strategy",
          index: "01",
          title: "STRATEGY",
          label: "數位策略與方向規劃",
          description: "整理複雜資訊、需求與目標，找出值得投入的問題與可執行方向。",
        },
        {
          id: "projects",
          index: "02",
          title: "PROJECTS",
          label: "專案企劃與推進",
          description: "把數位服務與內容構想轉成可規劃、協作與執行的專案。",
        },
        {
          id: "connections",
          index: "03",
          title: "CONNECTIONS",
          label: "產業資源與跨界合作",
          description: "串連創作者、企業、遊戲與數位娛樂產業的內容、資源與合作夥伴。",
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
          id: "virtual-vector",
          index: "02",
          title: "VIRTUAL VECTOR",
          label: "虛擬向量計劃",
          description: "跨越次元，與你相遇。",
          url: ready("https://virtual-vector.com/"),
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
      copyright: "Copyright © 2026 桂馬數位股份有限公司 All Rights Reserved.",
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
      eyebrow: "Digital Strategy & Projects",
      title: "KEIMA services and positioning",
      display: "WE CONNECT\nIDEAS,\nPEOPLE\nAND\nPOSSIBILITIES.",
      intro:
        "KEIMA provides digital strategy consulting and project direction for teams in games, digital entertainment, and the creator economy, connecting content and industry resources to move new ideas into execution.",
      belief: "Strong solutions do not always follow the expected path.",
    },
    approach: {
      eyebrow: "Approach",
      title: "HOW WE MOVE",
      intro:
        "From digital strategy and project planning to cross-industry partnerships, KEIMA helps teams clarify direction, connect resources, and move work forward.",
      items: [
        {
          id: "strategy",
          index: "01",
          title: "STRATEGY",
          label: "Digital strategy and direction",
          description: "Sort through complex information, needs, and goals to identify a practical next step.",
        },
        {
          id: "projects",
          index: "02",
          title: "PROJECTS",
          label: "Project planning and delivery",
          description: "Turn digital service and content ideas into projects that can be planned, shared, and delivered.",
        },
        {
          id: "connections",
          index: "03",
          title: "CONNECTIONS",
          label: "Industry resources and partnerships",
          description: "Connect creators, companies, and partners across games and digital entertainment.",
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
          id: "virtual-vector",
          index: "02",
          title: "VIRTUAL VECTOR",
          label: "Virtual Vector Project",
          description: "Across dimensions, we meet.",
          url: ready("https://virtual-vector.com/"),
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
      copyright: "Copyright © 2026 桂馬數位股份有限公司 All Rights Reserved.",
    },
  },
};
