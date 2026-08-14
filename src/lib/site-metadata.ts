import type { Metadata } from "next";

import type { Locale } from "@/lib/locales";

type LocaleMetadata = {
  title: string;
  description: string;
};

const metadataByLocale: Record<Locale, LocaleMetadata> = {
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
  const metadata = metadataByLocale[locale];
  const isZh = locale === "zh-TW";

  return {
    metadataBase: new URL("https://keima.example"),
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
