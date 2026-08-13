import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
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

describe("About", () => {
  it("shows the current pending profile and portrait labels", () => {
    render(<About content={zhContent} />);

    expect(screen.getByText("人物資料待提供")).toBeVisible();
    expect(screen.getByRole("img", { name: "人物照片待提供" })).toBeVisible();
  });
});

describe("Services", () => {
  it("renders exactly three complete pending service entries without fake links", () => {
    render(<Services content={zhContent} />);

    const section = screen.getByRole("region", { name: "運作中服務" });
    const services = within(section).getAllByRole("listitem");

    expect(services).toHaveLength(3);
    expect(within(section).getAllByText("服務名稱待提供")).toHaveLength(3);
    expect(within(section).getAllByText("目前狀態待提供")).toHaveLength(3);
    expect(within(section).getAllByText("服務簡介待提供")).toHaveLength(3);
    expect(within(section).getAllByText("目標客群待提供")).toHaveLength(3);
    expect(within(section).getAllByText("服務網址待提供")).toHaveLength(3);
    expect(within(section).getAllByRole("img", { name: "服務圖片待提供" })).toHaveLength(3);
    expect(within(section).queryByRole("link")).not.toBeInTheDocument();
  });

  it("uses real links and images only when service content is ready", () => {
    const readyContent: LocaleContent = {
      ...zhContent,
      services: [
        {
          ...zhContent.services[0],
          name: { status: "ready", value: "Ready service" },
          url: { status: "ready", value: "https://example.com/service" },
          image: { status: "ready", value: "/ready-service.jpg" },
        },
      ],
    };

    render(<Services content={readyContent} />);

    expect(screen.getByRole("link", { name: "https://example.com/service" })).toHaveAttribute(
      "href",
      "https://example.com/service",
    );
    expect(screen.getByRole("link", { name: "https://example.com/service" })).not.toHaveAttribute(
      "target",
    );
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
    "http://example.com/path",
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

    expect(screen.getByText("商務 Email 待提供")).toBeVisible();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(document.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
  });

  it("links a business email only when it is ready", () => {
    const readyContent: LocaleContent = {
      ...zhContent,
      contact: { ...zhContent.contact, email: { status: "ready", value: "hello@example.com" } },
    };

    render(<Contact content={readyContent} />);

    expect(screen.getByRole("link", { name: "hello@example.com" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
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
