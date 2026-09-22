import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { About } from "@/components/about";
import { Approach } from "@/components/approach";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Profile } from "@/components/profile";
import { ProjectList } from "@/components/project-list";
import { siteContent, type LocaleContent } from "@/content/site-content";

const zhContent = siteContent["zh-TW"];

class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly scrollMargin = "";
  readonly thresholds = [];

  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Hero", () => {
  it("uses the official logo as the hero display and keeps the statement as a subtitle", () => {
    render(<Hero content={zhContent} />);

    const hero = screen.getByRole("region", { name: "跨越既有路徑，連結新的可能。" });
    expect(hero).toHaveAttribute("data-motion-intensity", "enhanced");
    expect(within(hero).queryByText("KEIMA／桂馬數位")).not.toBeInTheDocument();
    expect(within(hero).getByRole("img", { name: "KEIMA 桂馬數位" })).toHaveClass(
      "hero-logo",
    );
    expect(
      within(hero).getByRole("img", { name: "KEIMA 桂馬數位" }).closest(".hero-mark"),
    ).toBeInTheDocument();
    expect(within(hero).getByRole("heading", { name: "跨越既有路徑，連結新的可能。" })).toHaveClass(
      "hero-reveal",
      "hero-subtitle",
    );
    expect(within(hero).getByText("Beyond the expected path.")).toHaveClass("hero-supporting");
    expect(within(hero).queryByText("STRATEGY / PROJECTS / CONNECTIONS / DIGITAL")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /向下探索/ })).not.toBeInTheDocument();
  });
});

describe("About", () => {
  it("presents KEIMA positioning as an editorial brand statement", () => {
    render(<About content={zhContent} />);

    expect(screen.queryByText("人物介紹")).not.toBeInTheDocument();
    expect(screen.queryByText("桂馬資訊")).not.toBeInTheDocument();
    expect(screen.queryByText("運作中服務")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "跨越既有路徑，連結新的可能。" }),
    ).not.toBeInTheDocument();

    const about = screen.getByRole("region", {
      name: "Positioning",
    });
    expect(within(about).getByRole("heading", { name: /WE CONNECT/ })).toHaveClass(
      "positioning-display",
    );
    expect(
      within(about).getByText(
        "桂馬數位以策略與專案為核心，串連創作者、內容、產業與數位工具，將分散的想法整理成可以真正執行的方向。",
      ),
    ).toBeVisible();
    expect(within(about).getByText("好的解決方案，不一定沿著既有路徑前進。")).toHaveClass(
      "positioning-belief",
    );
  });
});

describe("Approach", () => {
  it("renders HOW WE MOVE as full-width editorial rows instead of service cards", () => {
    render(<Approach content={zhContent} />);

    const section = screen.getByRole("region", { name: "HOW WE MOVE" });
    expect(within(section).getByRole("heading", { name: "HOW WE MOVE" })).toHaveClass(
      "approach-title",
    );
    const rows = section.querySelectorAll(".approach-row");

    expect(rows).toHaveLength(3);
    expect(within(section).getByRole("heading", { name: "STRATEGY" })).toBeVisible();
    expect(within(section).getByRole("heading", { name: "PROJECTS" })).toBeVisible();
    expect(within(section).getByRole("heading", { name: "CONNECTIONS" })).toBeVisible();
    expect(within(section).queryByRole("heading", { name: "DIGITAL" })).not.toBeInTheDocument();
    expect(section.querySelector(".service-card")).not.toBeInTheDocument();
  });
});

describe("ProjectList", () => {
  it("renders the three real projects as large linked cards", () => {
    render(<ProjectList content={zhContent} />);

    const section = screen.getByRole("region", { name: "CURRENTLY IN MOTION" });
    const cards = section.querySelectorAll(".project-card");
    const media = section.querySelectorAll(".project-media");

    expect(cards).toHaveLength(3);
    expect(media).toHaveLength(3);
    expect(section.querySelector(".project-row")).not.toBeInTheDocument();
    expect(within(section).getByRole("link", { name: /JOBSGAME/ })).toHaveAttribute(
      "href",
      "https://jobsgame.tw/",
    );
    expect(within(section).getByRole("link", { name: /INDIE GUIDER/ })).toHaveAttribute(
      "href",
      "https://indie-guider.games/",
    );
    expect(within(section).getByRole("link", { name: /GAMECF/ })).toHaveAttribute(
      "href",
      "https://gamecf.tw/",
    );
    expect(section.querySelector(".project-card--jobsgame .project-media")).toBeInTheDocument();
    expect(
      section.querySelector(".project-card--indie-guider .project-media"),
    ).toBeInTheDocument();
    expect(section.querySelector(".project-card--gamecf .project-media")).toBeInTheDocument();
    expect(within(section).queryByText("CREATOR ERP")).not.toBeInTheDocument();
    expect(within(section).queryByText("CONSULTING")).not.toBeInTheDocument();
  });
});

describe("Profile", () => {
  it("introduces Ian without becoming a resume", () => {
    render(<Profile content={zhContent} />);

    const section = screen.getByRole("region", { name: "Who is behind KEIMA" });
    expect(within(section).getByRole("heading", { name: "IAN / 祤呈" })).toBeVisible();
    expect(within(section).getByText("Consultant / Project Director")).toBeVisible();
    expect(within(section).getByText("Strategy")).toBeVisible();
    expect(within(section).getByText("Game & Digital Entertainment")).toBeVisible();
    expect(within(section).queryByText("10年活動企劃")).not.toBeInTheDocument();
    expect(within(section).queryByText("8年群眾募資顧問經驗")).not.toBeInTheDocument();
  });
});

describe("Contact", () => {
  it("shows a pending business email as text rather than a mail link", () => {
    render(<Contact content={zhContent} />);

    expect(screen.getByRole("region", { name: "WHAT'S YOUR NEXT MOVE?" })).toHaveAttribute(
      "data-motion-accent",
      "contact-finale",
    );
    expect(screen.getByRole("link", { name: /service@pa023315.com/ })).toHaveAttribute(
      "href",
      "mailto:service@pa023315.com",
    );
  });

  it("links a business email only when it is ready", () => {
    const readyContent: LocaleContent = {
      ...zhContent,
      contact: { ...zhContent.contact, email: { status: "ready", value: "hello@keima.test" } },
    };

    render(<Contact content={readyContent} />);

    expect(screen.getByRole("link", { name: /hello@keima.test/ })).toHaveAttribute(
      "href",
      "mailto:hello@keima.test",
    );
  });
});

describe("Footer", () => {
  it("uses the official logo, localized navigation, and approved copyright line", () => {
    render(<Footer content={zhContent} />);

    expect(screen.getByRole("img", { name: "KEIMA" })).toHaveAttribute(
      "src",
      "/brand/keima-lockup.svg",
    );
    const footerNavigation = screen.getByRole("navigation", { name: "頁尾導覽" });
    const expectedLinks = [
      ["首頁", "#home"],
      ["關於桂馬", "#about"],
      ["合作方式", "#approach"],
      ["進行中專案", "#in-motion"],
      ["顧問介紹", "#profile"],
      ["聯繫", "#contact"],
    ] as const;

    for (const [label, href] of expectedLinks) {
      expect(within(footerNavigation).getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    }

    expect(
      screen.getByText("Copyright © 2026 桂馬數位股份有限公司 All Rights Reserved."),
    ).toBeVisible();
    expect(screen.queryByText("社群資訊待提供")).not.toBeInTheDocument();
    expect(screen.queryByText("版權資訊待提供")).not.toBeInTheDocument();
    expect(screen.queryByText("法律資訊待提供")).not.toBeInTheDocument();
  });
});
