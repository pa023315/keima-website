import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Navigation } from "@/components/navigation";
import { siteContent } from "@/content/site-content";

class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly scrollMargin = "";
  readonly thresholds = [];

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

describe("Navigation", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
  });

  it("uses the official KEIMA marks and links every primary section", () => {
    render(<Navigation content={siteContent["zh-TW"]} />);

    const officialLogo = screen.getByRole("img", { name: "KEIMA" });

    expect(officialLogo).toHaveAttribute(
      "src",
      "/brand/keima-lockup-color.svg",
    );
    expect(officialLogo.closest("picture")?.querySelector("source")).toHaveAttribute(
      "media",
      "(max-width: 767px)",
    );

    const expectedLinks = [
      ["home", "#home"],
      ["about", "#about"],
      ["services", "#services"],
      ["contact", "#contact"],
    ] as const;
    const primaryNavigation = screen.getByRole("navigation", { name: "Primary" });

    for (const [id, href] of expectedLinks) {
      expect(within(primaryNavigation).getByRole("link", { name: new RegExp(id, "i") })).toHaveAttribute(
        "href",
        href,
      );
    }

    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en/");
  });
});
