import { describe, expect, it } from "vitest";
import { siteContent } from "@/content/site-content";

describe("siteContent", () => {
  it("provides both approved locales", () => {
    expect(Object.keys(siteContent).sort()).toEqual(["en", "zh-TW"]);
  });

  it("provides the approved approach and in-motion structures in each locale", () => {
    for (const locale of Object.values(siteContent)) {
      expect(locale.approach.items).toHaveLength(4);
      expect(locale.approach.items.map((item) => item.id)).toEqual([
        "strategy",
        "projects",
        "connections",
        "digital",
      ]);
      expect(locale.inMotion.projects).toHaveLength(4);
      expect(locale.inMotion.projects.map((project) => project.id)).toEqual([
        "jobsgame",
        "indie-guider",
        "creator-erp",
        "consulting",
      ]);
      expect(locale.inMotion.projects.map((project) => project.index)).toEqual([
        "01",
        "02",
        "03",
        "04",
      ]);
    }
  });

  it("stores the provided KEIMA brand, profile, project, and contact facts as ready content", () => {
    const zh = siteContent["zh-TW"];

    expect(zh.hero.statement).toEqual({
      status: "ready",
      value: "跨越既有路徑，連結新的可能。",
    });
    expect(zh.hero.supporting).toBe("Beyond the expected path.");
    expect(zh.nav).toEqual({
      home: "首頁",
      about: "About",
      approach: "Approach",
      "in-motion": "In Motion",
      profile: "Profile",
      contact: "聯繫",
    });
    expect(zh.about.display).toBe("WE CONNECT\nIDEAS,\nPEOPLE\nAND\nPOSSIBILITIES.");
    expect(zh.profile.name).toBe("IAN / 祤呈");
    expect(zh.profile.role).toBe("Consultant / Project Director");
    expect(zh.contact.email).toEqual({ status: "ready", value: "service@pa023315.com" });
    expect(zh.inMotion.projects.map((project) => project.url)).toEqual([
      { status: "ready", value: "https://jobsgame.tw/" },
      { status: "ready", value: "https://indie-guider.games/" },
      { status: "pending", label: "連結待提供" },
      { status: "pending", label: "連結待提供" },
    ]);
  });

  it("keeps unprovided project links pending instead of inventing URLs", () => {
    const zh = siteContent["zh-TW"];

    expect(zh.inMotion.projects.find((project) => project.id === "creator-erp")?.url).toEqual(
      { status: "pending", label: "連結待提供" },
    );
    expect(zh.inMotion.projects.find((project) => project.id === "consulting")?.url).toEqual(
      { status: "pending", label: "連結待提供" },
    );
  });

  it("marks only still-unprovided business facts as pending", () => {
    for (const locale of Object.values(siteContent)) {
      expect(locale.footer.social.status).toBe("pending");
      expect(locale.footer.copyright.status).toBe("pending");
      expect(locale.footer.legal.status).toBe("pending");
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
