import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Navigation } from "@/components/navigation";
import { SiteShell } from "@/components/site-shell";
import { siteContent, type LocaleContent } from "@/content/site-content";

let observerInstances: IntersectionObserverStub[] = [];

class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly scrollMargin = "";
  readonly thresholds = [];

  readonly disconnect = vi.fn();
  readonly observe = vi.fn();
  readonly takeRecords = vi.fn(() => []);
  readonly unobserve = vi.fn();

  constructor(readonly callback: IntersectionObserverCallback) {
    observerInstances.push(this);
  }
}

function renderNavigation(content: LocaleContent = siteContent["zh-TW"]) {
  return render(
    <>
      <Navigation content={content} />
      <section id="home" />
      <section id="about" />
      <section id="approach" />
      <section id="in-motion" />
      <section id="profile" />
      <section id="contact" />
    </>,
  );
}

function intersectionEntry(target: Element, intersectionRatio: number): IntersectionObserverEntry {
  return {
    boundingClientRect: target.getBoundingClientRect(),
    intersectionRatio,
    intersectionRect: target.getBoundingClientRect(),
    isIntersecting: intersectionRatio > 0,
    rootBounds: null,
    target,
    time: 0,
  };
}

function clickWithoutNavigation(link: HTMLElement) {
  link.addEventListener("click", (event) => event.preventDefault(), { once: true });
  fireEvent.click(link);
}

describe("Navigation", () => {
  beforeEach(() => {
    observerInstances = [];
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses official responsive marks and localized section names", () => {
    renderNavigation();

    const officialLogo = screen.getByRole("img", { name: "KEIMA" });

    expect(officialLogo).toHaveAttribute("src", "/brand/keima-lockup-color.svg");
    expect(officialLogo.closest("picture")?.querySelector("source")).toMatchObject({
      media: "(max-width: 767px)",
      srcset: "/brand/keima-icon-color.svg",
    });

    const primaryNavigation = screen.getByRole("navigation", { name: "主要導覽" });
    const expectedLinks = [
      ["首頁", "#home"],
      ["關於桂馬", "#about"],
      ["合作方式", "#approach"],
      ["進行中專案", "#in-motion"],
      ["顧問介紹", "#profile"],
      ["聯繫", "#contact"],
    ] as const;

    for (const [label, href] of expectedLinks) {
      expect(within(primaryNavigation).getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
    }
  });

  it("updates the active section, locale hash, and disconnects its observer", () => {
    const { unmount } = renderNavigation();
    const observer = observerInstances[0];

    expect(observer.observe).toHaveBeenCalledTimes(6);
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en/#home");

    act(() => {
      observer.callback(
        [
          intersectionEntry(document.getElementById("about")!, 0.2),
          intersectionEntry(document.getElementById("in-motion")!, 0.8),
        ],
        observer,
      );
    });

    expect(screen.getByRole("link", { name: "進行中專案" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/en/#in-motion",
    );

    unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });

  it("persists the alternate locale while preserving the native href", () => {
    const storage = vi.spyOn(Storage.prototype, "setItem");
    renderNavigation();

    const localeLink = screen.getByRole("link", { name: "EN" });
    clickWithoutNavigation(localeLink);

    expect(storage).toHaveBeenCalledWith("keima-locale", "en");
    expect(localeLink).toHaveAttribute("href", "/en/#home");
  });

  it("keeps locale navigation usable when storage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    renderNavigation();

    const localeLink = screen.getByRole("link", { name: "EN" });
    expect(() => clickWithoutNavigation(localeLink)).not.toThrow();
    expect(localeLink).toHaveAttribute("href", "/en/#home");
  });

  it("orders logo, locale, then navigation for compact keyboard flow", () => {
    renderNavigation();
    const header = screen.getByRole("banner");

    expect(header.children[0]).toHaveClass("brand-link");
    expect(header.children[1]).toHaveClass("locale-link");
    expect(header.children[2]).toHaveClass("primary-navigation");
  });
});

describe("SiteShell accessibility labels", () => {
  beforeEach(() => {
    observerInstances = [];
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("localizes navigation landmarks and the skip link", () => {
    render(<SiteShell content={siteContent["zh-TW"]} />);

    expect(screen.getByRole("link", { name: "跳至主要內容" })).toHaveAttribute("href", "#main");
    expect(screen.getByRole("link", { name: "KEIMA 首頁" })).toHaveAttribute("href", "#home");
    expect(screen.getByRole("navigation", { name: "主要導覽" })).toBeInTheDocument();
  });
});
