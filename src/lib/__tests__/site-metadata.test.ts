import { describe, expect, it } from "vitest";

import { createSiteMetadata } from "@/lib/site-metadata";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("createSiteMetadata", () => {
  it("sets English canonical, language alternates, and social metadata", () => {
    const metadata = createSiteMetadata("en");

    expect(metadata.alternates).toEqual({
      canonical: "/en/",
      languages: {
        "zh-TW": "/zh-TW/",
        en: "/en/",
      },
    });
    expect(metadata.icons).toEqual({ icon: "/favicon.svg" });
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      locale: "en_US",
      url: "/en/",
      siteName: "KEIMA",
    });
  });

  it("keeps unfinished local metadata out of the search index", () => {
    const metadata = createSiteMetadata("zh-TW");

    expect(metadata.metadataBase).toEqual(new URL("https://pa023315.com"));
    expect(metadata.title).toBe("KEIMA／桂馬數位｜跨越既有路徑，連結新的可能。");
    expect(metadata.description).toBe("KEIMA 桂馬數位，是一個以策略、創意與連結為核心的數位顧問品牌。");
    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.openGraph).toMatchObject({
      locale: "zh_TW",
      url: "/zh-TW/",
      siteName: "KEIMA",
    });
  });
});

describe("metadata routes", () => {
  it("lists both locale routes in the sitemap", () => {
    expect(sitemap()).toEqual([
      { url: "https://pa023315.com/zh-TW/", changeFrequency: "monthly", priority: 1 },
      { url: "https://pa023315.com/en/", changeFrequency: "monthly", priority: 1 },
    ]);
  });

  it("allows crawling but points crawlers at the generated sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://pa023315.com/sitemap.xml",
    });
  });
});
