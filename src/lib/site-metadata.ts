import type { Metadata } from "next";

import type { Locale } from "@/lib/locales";

type LocaleMetadata = {
  title: string;
  description: string;
};

const metadataByLocale: Record<Locale, LocaleMetadata> = {
  "zh-TW": {
    title: "桂馬數位 KEIMA｜數位策略顧問與專案推進",
    description:
      "桂馬數位（KEIMA）提供數位策略顧問、專案企劃與推進，串連遊戲與數位娛樂、創作者經濟的內容、產業資源與合作夥伴，協助團隊把新想法落實為可執行的計畫。",
  },
  en: {
    title: "KEIMA | Digital Strategy Consulting & Project Direction",
    description:
      "KEIMA provides digital strategy consulting and project direction for games, digital entertainment, and the creator economy, connecting people and resources to move new ideas into execution.",
  },
};

export function createSiteMetadata(locale: Locale): Metadata {
  const metadata = metadataByLocale[locale];
  const isZh = locale === "zh-TW";

  return {
    metadataBase: new URL("https://keima.tw"),
    ...metadata,
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        "zh-TW": "/zh-TW/",
        en: "/en/",
        "x-default": "/zh-TW/",
      },
    },
    icons: { icon: "/favicon.svg" },
    openGraph: {
      type: "website",
      locale: isZh ? "zh_TW" : "en_US",
      title: metadata.title,
      description: metadata.description,
      url: `/${locale}/`,
      siteName: "KEIMA",
    },
    robots: {
      index: true,
      follow: true,
    },
    twitter: {
      card: "summary",
      title: metadata.title,
      description: metadata.description,
    },
  };
}
