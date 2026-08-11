import { describe, expect, it } from "vitest";
import { siteContent } from "@/content/site-content";

describe("siteContent", () => {
  it("provides both approved locales", () => {
    expect(Object.keys(siteContent).sort()).toEqual(["en", "zh-TW"]);
  });

  it("marks every unprovided business fact as pending", () => {
    for (const locale of Object.values(siteContent)) {
      expect(locale.hero.statement.status).toBe("pending");
      expect(locale.about.person.status).toBe("pending");
      expect(locale.services.every((service) => service.status === "pending")).toBe(true);
      expect(locale.contact.email.status).toBe("pending");
    }
  });
});
