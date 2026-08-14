export type ContentState<T> =
  | { status: "ready"; value: T }
  | { status: "pending"; label: string };

export type ContentLocale = "zh-TW" | "en";

export type ServiceContent = {
  id: string;
  index: string;
  status: ContentState<string>;
  name: ContentState<string>;
  summary: ContentState<string>;
  audience: ContentState<string>;
  url: ContentState<string>;
  image: ContentState<string>;
};

export type LocaleContent<L extends ContentLocale = ContentLocale> = {
  locale: L;
  nav: {
    home: string;
    about: string;
    services: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    statement: ContentState<string>;
    scroll: string;
  };
  about: {
    brand: {
      label: string;
      headline: string;
      tagline: string;
      intro: string[];
    };
    person: {
      label: string;
      name: string;
      bio: string;
    };
    portrait: ContentState<string>;
  };
  servicesLabel: string;
  services: ServiceContent[];
  contact: {
    label: string;
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
    nav: { home: "首頁", about: "介紹", services: "服務", contact: "聯繫" },
    hero: {
      eyebrow: "KEIMA／桂馬數位",
      statement: ready("跨越既有路徑，連結新的可能。"),
      scroll: "向下探索",
    },
    about: {
      brand: {
        label: "桂馬資訊",
        headline: "跨越既有路徑，連結新的可能。",
        tagline: "Strategy, creativity, and connections for what comes next.",
        intro: [
          "KEIMA 桂馬數位，是一個以策略、創意與連結為核心的數位顧問品牌。",
          "我們相信好的解決方案不一定沿著既有路徑前進。就像桂馬跨越棋盤上的阻礙，KEIMA 從不同角度理解問題，串連產業、創作者、內容與數位工具，將分散的想法整理成可以真正執行的方向。",
          "從遊戲與數位娛樂、創作者經濟，到品牌、專案與新型態服務，我們不只是完成被交付的工作，而是與合作夥伴一起釐清問題、建立方法，並找到下一步。",
          "跨越既有路徑，連結新的可能。",
        ],
      },
      person: {
        label: "人物資訊",
        name: "桂馬數位 專案顧問 / 鄭祤呈",
        bio: "專案顧問，協助企業進行活動策劃、數位行銷及專案顧問，具10年活動企劃、8年群眾募資顧問經驗，累積舉辦及協力100場以上活動、為50家以上團隊專案顧問。",
      },
      portrait: pending("人物照片待提供"),
    },
    servicesLabel: "營運品牌",
    services: [
      {
        id: "service-01",
        index: "01",
        status: ready("營運中"),
        name: ready("INDIE-GUIDER"),
        summary: ready("獨立遊戲資訊站"),
        audience: ready("獨立遊戲開發者、玩家與產業觀察者"),
        url: ready("https://indie-guider.games/"),
        image: pending("服務圖片待提供"),
      },
      {
        id: "service-02",
        index: "02",
        status: ready("營運中"),
        name: ready("Jobsgame"),
        summary: ready("台灣遊戲產業職缺與外包資訊平台"),
        audience: ready("遊戲產業人才、團隊與外包合作夥伴"),
        url: ready("https://jobsgame.tw/"),
        image: pending("服務圖片待提供"),
      },
      {
        id: "service-03",
        index: "03",
        status: ready("營運中"),
        name: ready("GameCF"),
        summary: ready("數位遊戲群眾募資資訊站"),
        audience: ready("遊戲創作者、募資團隊與支持者"),
        url: ready("https://gamecf.tw/"),
        image: pending("服務圖片待提供"),
      },
    ],
    contact: { label: "商務聯繫", email: ready("service@pa023315.com") },
    footer: {
      social: pending("社群資訊待提供"),
      copyright: pending("版權資訊待提供"),
      legal: pending("法律資訊待提供"),
    },
  },
  en: {
    locale: "en",
    nav: { home: "Home", about: "About", services: "Services", contact: "Contact" },
    hero: {
      eyebrow: "KEIMA",
      statement: ready("Cross existing paths, connect new possibilities."),
      scroll: "Scroll to explore",
    },
    about: {
      brand: {
        label: "KEIMA",
        headline: "Cross existing paths, connect new possibilities.",
        tagline: "Strategy, creativity, and connections for what comes next.",
        intro: [
          "KEIMA is a digital consulting brand built around strategy, creativity, and connections.",
          "We believe strong solutions do not always follow the existing path. Like the knight piece crossing the board from unexpected angles, KEIMA reframes problems, connects industries, creators, content, and digital tools, and turns scattered ideas into executable direction.",
          "Across games and digital entertainment, the creator economy, brands, projects, and emerging services, we do more than complete assigned work. We clarify problems with partners, build practical methods, and find the next step together.",
          "Cross existing paths, connect new possibilities.",
        ],
      },
      person: {
        label: "Person",
        name: "KEIMA Project Consultant / Jheng Yu Cheng",
        bio: "Project consultant supporting event planning, digital marketing, and project advisory work. He brings 10 years of event planning experience and 8 years as a crowdfunding consultant, with more than 100 events organized or supported and advisory experience for over 50 project teams.",
      },
      portrait: pending("Portrait pending"),
    },
    servicesLabel: "Operating Brands",
    services: [
      {
        id: "service-01",
        index: "01",
        status: ready("Active"),
        name: ready("INDIE-GUIDER"),
        summary: ready("Independent game information site"),
        audience: ready("Independent game developers, players, and industry observers"),
        url: ready("https://indie-guider.games/"),
        image: pending("Service image pending"),
      },
      {
        id: "service-02",
        index: "02",
        status: ready("Active"),
        name: ready("Jobsgame"),
        summary: ready("Taiwan game industry jobs and outsourcing platform"),
        audience: ready("Game industry talent, teams, and outsourcing partners"),
        url: ready("https://jobsgame.tw/"),
        image: pending("Service image pending"),
      },
      {
        id: "service-03",
        index: "03",
        status: ready("Active"),
        name: ready("GameCF"),
        summary: ready("Digital game crowdfunding information site"),
        audience: ready("Game creators, crowdfunding teams, and supporters"),
        url: ready("https://gamecf.tw/"),
        image: pending("Service image pending"),
      },
    ],
    contact: { label: "Business Inquiry", email: ready("service@pa023315.com") },
    footer: {
      social: pending("Social information pending"),
      copyright: pending("Copyright information pending"),
      legal: pending("Legal information pending"),
    },
  },
};
