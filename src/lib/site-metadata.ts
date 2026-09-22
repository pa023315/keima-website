import type { Metadata } from "next";

import type { Locale } from "@/lib/locales";

type LocaleMetadata = {
  title: string;
  description: string;
};

const metadataByLocale: Record<Locale, LocaleMetadata> = {
  "zh-TW": {
    title: "KEIMA／桂馬數位｜跨越既有路徑，連結新的可能。",
    description: "KEIMA 桂馬數位，是一個以策略、創意與連結為核心的數位顧問品牌。",
  },
  en: {
    title: "KEIMA | Cross existing paths, connect new possibilities.",
    description: "KEIMA is a digital consulting brand built around strategy, creativity, and connections.",
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
      index: false,
      follow: false,
    },
  };
}
