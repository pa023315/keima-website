import type { MetadataRoute } from "next";

import { locales } from "@/lib/locales";

const siteBaseUrl = "https://keima.tw";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteBaseUrl}/${locale}/`,
    changeFrequency: "monthly",
    priority: 1,
  }));
}
