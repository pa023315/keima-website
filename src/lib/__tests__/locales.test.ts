import { describe, expect, it } from "vitest";

import { alternateLocale, isLocale } from "@/lib/locales";

describe("isLocale", () => {
  it.each(["zh-TW", "en"])("accepts the supported locale %s", (locale) => {
    expect(isLocale(locale)).toBe(true);
  });

  it("rejects an unsupported locale", () => {
    expect(isLocale("fr")).toBe(false);
  });
});

describe("alternateLocale", () => {
  it("switches between the supported locales", () => {
    expect(alternateLocale("zh-TW")).toBe("en");
    expect(alternateLocale("en")).toBe("zh-TW");
  });
});
