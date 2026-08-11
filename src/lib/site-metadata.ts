import type { Metadata } from "next";

import type { Locale } from "@/lib/locales";

const metadataByLocale: Record<Locale, Pick<Metadata, "title" | "description">> = {
  "zh-TW": {
    title: "KEIMA／桂馬數位｜品牌資訊待補",
    description: "KEIMA 桂馬數位企業形象網站，正式品牌文案待提供。",
  },
  en: {
    title: "KEIMA | Brand information pending",
    description: "KEIMA corporate brand site. Final brand copy is pending.",
  },
};

export function createSiteMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL("https://keima.example"),
    ...metadataByLocale[locale],
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        "zh-TW": "/zh-TW/",
        en: "/en/",
      },
    },
    icons: "/favicon.svg",
    robots: {
      index: false,
      follow: false,
    },
  };
}
