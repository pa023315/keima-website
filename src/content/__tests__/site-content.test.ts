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

  it("stores the provided KEIMA brand, person, service, and contact facts as ready content", () => {
    const zh = siteContent["zh-TW"];

    expect(zh.hero.statement).toEqual({
      status: "ready",
      value: "跨越既有路徑，連結新的可能。",
    });
    expect(zh.about.brand.headline).toBe("跨越既有路徑，連結新的可能。");
    expect(zh.about.brand.tagline).toBe(
      "Strategy, creativity, and connections for what comes next.",
    );
    expect(zh.about.person.name).toBe("桂馬數位 專案顧問 / 鄭祤呈");
    expect(zh.contact.email).toEqual({ status: "ready", value: "service@pa023315.com" });
    expect(zh.services.map((service) => service.url)).toEqual([
      { status: "ready", value: "https://indie-guider.games/" },
      { status: "ready", value: "https://jobsgame.tw/" },
      { status: "ready", value: "https://gamecf.tw/" },
    ]);
  });

  it("marks only still-unprovided business facts as pending", () => {
    for (const locale of Object.values(siteContent)) {
      expect(locale.about.portrait.status).toBe("pending");
      expect(locale.footer.social.status).toBe("pending");
      expect(locale.footer.copyright.status).toBe("pending");
      expect(locale.footer.legal.status).toBe("pending");

      for (const service of locale.services) {
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
