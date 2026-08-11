import { describe, expect, it } from "vitest";
import { siteContent } from "@/content/site-content";

describe("siteContent", () => {
  it("provides both approved locales", () => {
    expect(Object.keys(siteContent).sort()).toEqual(["en", "zh-TW"]);
  });

  it("provides the three approved service slots in each locale", () => {
    for (const locale of Object.values(siteContent)) {
      expect(locale.services).toHaveLength(3);
      expect(locale.services.map((service) => service.id)).toEqual([
        "service-01",
        "service-02",
        "service-03",
      ]);
      expect(locale.services.map((service) => service.index)).toEqual(["01", "02", "03"]);
    }
  });

  it("marks every unprovided business fact as pending", () => {
    for (const locale of Object.values(siteContent)) {
      expect(locale.hero.statement.status).toBe("pending");
      expect(locale.about.person.status).toBe("pending");
      expect(locale.about.portrait.status).toBe("pending");
      expect(locale.contact.email.status).toBe("pending");
      expect(locale.footer.social.status).toBe("pending");
      expect(locale.footer.copyright.status).toBe("pending");
      expect(locale.footer.legal.status).toBe("pending");

      for (const service of locale.services) {
        expect(service.status.status).toBe("pending");
        expect(service.name.status).toBe("pending");
        expect(service.summary.status).toBe("pending");
        expect(service.audience.status).toBe("pending");
        expect(service.url.status).toBe("pending");
        expect(service.image.status).toBe("pending");
      }
    }
  });

  it("provides localized pending social labels", () => {
    expect(siteContent["zh-TW"].footer.social).toEqual({
      status: "pending",
      label: "社群資訊待提供",
    });
    expect(siteContent.en.footer.social).toEqual({
      status: "pending",
      label: "Social information pending",
    });
  });
});
