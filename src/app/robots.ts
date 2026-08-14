import type { MetadataRoute } from "next";

const siteBaseUrl = "https://keima.example";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteBaseUrl}/sitemap.xml`,
  };
}
