import type { MetadataRoute } from "next";

const siteBaseUrl = "https://keima.tw";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteBaseUrl}/sitemap.xml`,
  };
}
