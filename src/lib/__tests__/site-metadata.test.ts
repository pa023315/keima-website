import { describe, expect, it } from "vitest";

import { createSiteMetadata } from "@/lib/site-metadata";

describe("createSiteMetadata", () => {
  it("sets English canonical and language alternate URLs", () => {
    const metadata = createSiteMetadata("en");

    expect(metadata.alternates).toEqual({
      canonical: "/en/",
      languages: {
        "zh-TW": "/zh-TW/",
        en: "/en/",
      },
    });
  });
});
