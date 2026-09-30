import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RouteProgress } from "@/components/motion/route-progress";

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock("motion/react", async () => {
  const React = await import("react");

  return {
    motion: {
      span: ({ style }: React.HTMLAttributes<HTMLSpanElement>) =>
        React.createElement("span", { "data-motion-style": JSON.stringify(style) }),
    },
    useScroll: () => ({ scrollYProgress: "scroll-progress" }),
    useSpring: () => "spring-progress",
  };
});

describe("RouteProgress", () => {
  beforeEach(() => {
    motionState.reduced = false;
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({
        addEventListener: vi.fn(),
        matches: motionState.reduced,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        removeEventListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders a decorative progress route with its motion preference exposed", async () => {
    render(<RouteProgress />);

    const route = screen.getByTestId("route-progress");
    expect(route).toHaveAttribute("aria-hidden", "true");
    await waitFor(() => expect(route).toHaveAttribute("data-reduced-motion", "false"));
    expect(route.querySelector("span")).toHaveAttribute(
      "data-motion-style",
      JSON.stringify({ scaleY: "spring-progress" }),
    );
  });
});
