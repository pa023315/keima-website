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
    label: string;
    person: ContentState<string>;
    portrait: ContentState<string>;
  };
  servicesLabel: string;
  services: ServiceContent[];
  contact: {
    label: string;
    email: ContentState<string>;
  };
  footer: {
    copyright: ContentState<string>;
    legal: ContentState<string>;
  };
};

const pending = (label: string): ContentState<string> => ({ status: "pending", label });

export const siteContent: { [L in ContentLocale]: LocaleContent<L> } = {
  "zh-TW": {
    locale: "zh-TW",
    nav: { home: "首頁", about: "介紹", services: "服務", contact: "聯繫" },
    hero: {
      eyebrow: "KEIMA／桂馬數位",
      statement: pending("品牌定位文案待提供"),
      scroll: "向下探索",
    },
    about: {
      label: "人物介紹",
      person: pending("人物資料待提供"),
      portrait: pending("人物照片待提供"),
    },
    servicesLabel: "運作中服務",
    services: ["01", "02", "03"].map((index) => ({
      id: `service-${index}`,
      index,
      status: pending("目前狀態待提供"),
      name: pending("服務名稱待提供"),
      summary: pending("服務簡介待提供"),
      audience: pending("目標客群待提供"),
      url: pending("服務網址待提供"),
      image: pending("服務圖片待提供"),
    })),
    contact: { label: "商務聯繫", email: pending("商務 Email 待提供") },
    footer: {
      copyright: pending("版權資訊待提供"),
      legal: pending("法律資訊待提供"),
    },
  },
  en: {
    locale: "en",
    nav: { home: "Home", about: "About", services: "Services", contact: "Contact" },
    hero: {
      eyebrow: "KEIMA",
      statement: pending("Brand statement pending"),
      scroll: "Scroll to explore",
    },
    about: {
      label: "Profile",
      person: pending("Profile content pending"),
      portrait: pending("Portrait pending"),
    },
    servicesLabel: "Active Services",
    services: ["01", "02", "03"].map((index) => ({
      id: `service-${index}`,
      index,
      status: pending("Current status pending"),
      name: pending("Service name pending"),
      summary: pending("Service summary pending"),
      audience: pending("Audience pending"),
      url: pending("Service URL pending"),
      image: pending("Service image pending"),
    })),
    contact: { label: "Business Inquiry", email: pending("Business email pending") },
    footer: {
      copyright: pending("Copyright information pending"),
      legal: pending("Legal information pending"),
    },
  },
};
