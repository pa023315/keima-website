import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
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

function renderReadyServiceUrl(value: string) {
  const content: LocaleContent = {
    ...zhContent,
    services: [
      {
        ...zhContent.services[0],
        url: { status: "ready", value },
      },
    ],
  };

  render(<Services content={content} />);
}

describe("Hero", () => {
  it("marks the first viewport elements for a layered entrance sequence", () => {
    render(<Hero content={zhContent} />);

    const hero = screen.getByRole("region", { name: "跨越既有路徑，連結新的可能。" });
    expect(hero).toHaveAttribute("data-motion-intensity", "enhanced");
    expect(screen.getByText(/KEIMA/).closest(".hero-reveal")).toHaveClass("hero-reveal--eyebrow");
    expect(screen.getByRole("heading", { name: "跨越既有路徑，連結新的可能。" })).toHaveClass(
      "hero-reveal",
      "hero-reveal--title",
    );
    expect(screen.getByRole("link", { name: /向下探索/ })).toHaveClass(
      "hero-reveal",
      "hero-reveal--scroll",
    );
  });
});

describe("About", () => {
  it("presents brand information first and person information in a separate following block", () => {
    render(<About content={zhContent} />);

    expect(screen.queryByText("人物介紹")).not.toBeInTheDocument();
    expect(screen.queryByText("桂馬資訊")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "跨越既有路徑，連結新的可能。" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Strategy, creativity, and connections for what comes next."),
    ).not.toBeInTheDocument();

    const about = screen.getByRole("region", {
      name: "KEIMA 桂馬數位，是一個以策略、創意與連結為核心的數位顧問品牌。",
    });
    const brandPanel = about.querySelector(".about-brand-panel");
    const personPanel = about.querySelector(".about-person-panel");

    expect(brandPanel).toBeInTheDocument();
    expect(personPanel).toBeInTheDocument();
    expect(brandPanel?.compareDocumentPosition(personPanel as Element)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(
      screen.getByText("KEIMA 桂馬數位，是一個以策略、創意與連結為核心的數位顧問品牌。"),
    ).toBeVisible();
    expect(screen.getByText("人物資訊")).toBeVisible();
    expect(screen.getByRole("heading", { name: "桂馬數位 專案顧問 / 鄭祤呈" })).toBeVisible();
    expect(screen.getByText(/具10年活動企劃、8年群眾募資顧問經驗/)).toBeVisible();
    expect(screen.getByRole("img", { name: "人物照片待提供" }).closest(".about-portrait")).toHaveClass(
      "about-portrait--compact",
    );
  });
});

describe("Services", () => {
  it("renders the three sourced operating brands without a visible section title", () => {
    render(<Services content={zhContent} />);

    expect(screen.queryByText("運作中服務")).not.toBeInTheDocument();
    const section = screen.getByRole("region", { name: "營運品牌" });
    const services = within(section).getAllByRole("listitem");

    expect(services).toHaveLength(3);
    expect(within(section).getByRole("heading", { name: "INDIE-GUIDER" })).toBeVisible();
    expect(within(section).getByRole("heading", { name: "Jobsgame" })).toBeVisible();
    expect(within(section).getByRole("heading", { name: "GameCF" })).toBeVisible();
    expect(
      within(section).getByRole("link", { name: "https://indie-guider.games/" }),
    ).toHaveAttribute("href", "https://indie-guider.games/");
    expect(within(section).getByText("獨立遊戲資訊站")).toBeVisible();
    expect(within(section).getByText("台灣遊戲產業職缺與外包資訊平台")).toBeVisible();
    expect(within(section).getByText("數位遊戲群眾募資資訊站")).toBeVisible();
    expect(within(section).getAllByRole("img", { name: "服務圖片待提供" })).toHaveLength(3);
    expect(section.querySelectorAll(".service-reveal")).toHaveLength(3);
    expect(section.querySelectorAll(".service-item[data-motion-accent='service-card']")).toHaveLength(3);
  });

  it("uses real links and images only when service content is ready", () => {
    const readyContent: LocaleContent = {
      ...zhContent,
      services: [
        {
          ...zhContent.services[0],
          name: { status: "ready", value: "Ready service" },
          url: { status: "ready", value: "https://service.keima.test/service" },
          image: { status: "ready", value: "/ready-service.jpg" },
        },
      ],
    };

    render(<Services content={readyContent} />);

    expect(
      screen.getByRole("link", { name: "https://service.keima.test/service" }),
    ).toHaveAttribute("href", "https://service.keima.test/service");
    expect(
      screen.getByRole("link", { name: "https://service.keima.test/service" }),
    ).not.toHaveAttribute("target");
    expect(screen.getByRole("img", { name: "Ready service" })).toHaveAttribute(
      "src",
      "/ready-service.jpg",
    );
  });

  it.each([
    "/\\evil.example/path",
    "/%5cevil.example/path",
    "//evil.example",
    " /path",
    "/path ",
    "/path\nnext",
    "/%0aevil.example/path",
    "javascript:alert(1)",
    "http://unsafe.keima.test/path",
  ])("does not make unsafe ready service URL %j clickable", (unsafeUrl) => {
    renderReadyServiceUrl(unsafeUrl);

    const urlDefinition = screen.getByText("網址").closest("div")?.querySelector("dd");
    expect(urlDefinition).toBeVisible();
    expect(urlDefinition?.textContent).toBe(unsafeUrl);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("normalizes a safe same-origin relative service path", () => {
    renderReadyServiceUrl("/section/../path?from=service#details");

    expect(
      screen.getByRole("link", { name: "/section/../path?from=service#details" }),
    ).toHaveAttribute("href", "/path?from=service#details");
  });

  it("accepts a valid root-relative service path", () => {
    renderReadyServiceUrl("/path");

    expect(screen.getByRole("link", { name: "/path" })).toHaveAttribute("href", "/path");
  });
});

describe("Contact", () => {
  it("shows a pending business email as text rather than a mail link", () => {
    render(<Contact content={zhContent} />);

    expect(screen.getByRole("region", { name: "商務聯繫" })).toHaveAttribute(
      "data-motion-accent",
      "contact-finale",
    );
    expect(screen.getByRole("link", { name: "service@pa023315.com" })).toHaveAttribute(
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

    expect(screen.getByRole("link", { name: "hello@keima.test" })).toHaveAttribute(
      "href",
      "mailto:hello@keima.test",
    );
  });
});

describe("Footer", () => {
  it("uses the official logo and shows localized navigation and pending information", () => {
    render(<Footer content={zhContent} />);

    expect(screen.getByRole("img", { name: "KEIMA" })).toHaveAttribute(
      "src",
      "/brand/keima-lockup.svg",
    );
    const footerNavigation = screen.getByRole("navigation", { name: "頁尾導覽" });
    const expectedLinks = [
      ["首頁", "#home"],
      ["介紹", "#about"],
      ["服務", "#services"],
      ["聯繫", "#contact"],
    ] as const;

    for (const [label, href] of expectedLinks) {
      expect(within(footerNavigation).getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    }

    const social = screen.getByText("社群資訊待提供");
    expect(social).toBeVisible();
    expect(social.closest("a")).toBeNull();
    expect(screen.getByText("版權資訊待提供")).toBeVisible();
    expect(screen.getByText("法律資訊待提供")).toBeVisible();
  });
});
