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
        "x-default": "/zh-TW/",
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

  it("makes the finished localized pages eligible for indexing", () => {
    const metadata = createSiteMetadata("zh-TW");

    expect(metadata.metadataBase).toEqual(new URL("https://keima.tw"));
    expect(metadata.title).toBe("桂馬數位 KEIMA｜數位策略顧問與專案推進");
    expect(metadata.description).toContain("遊戲與數位娛樂、創作者經濟");
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.twitter).toMatchObject({
      card: "summary",
      title: metadata.title,
      description: metadata.description,
    });
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
      { url: "https://keima.tw/zh-TW/", changeFrequency: "monthly", priority: 1 },
      { url: "https://keima.tw/en/", changeFrequency: "monthly", priority: 1 },
    ]);
  });

  it("allows crawling but points crawlers at the generated sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://keima.tw/sitemap.xml",
    });
  });
});
