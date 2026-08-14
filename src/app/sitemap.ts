import type { MetadataRoute } from "next";

import { locales } from "@/lib/locales";

const siteBaseUrl = "https://pa023315.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteBaseUrl}/${locale}/`,
    changeFrequency: "monthly",
    priority: 1,
  }));
}
