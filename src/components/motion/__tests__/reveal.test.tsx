import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HeroMotion } from "@/components/motion/hero-motion";
import { Reveal } from "@/components/motion/reveal";
import { SectionWipe } from "@/components/motion/section-wipe";

type MotionDivCall = {
  animate?: unknown;
  initial?: unknown;
  whileInView?: unknown;
  viewport?: unknown;
  transition?: unknown;
  style?: unknown;
};

const motionState = vi.hoisted(() => ({
  calls: [] as MotionDivCall[],
  reduced: false,
  transformCalls: [] as Array<{ input: number[]; output: unknown[] }>,
  inView: true,
  inViewCalls: [] as unknown[],
}));

vi.mock("motion/react", async () => {
  const React = await import("react");

  return {
    motion: {
      div: React.forwardRef<
        HTMLDivElement,
        React.HTMLAttributes<HTMLDivElement> & MotionDivCall
      >(function MotionDiv(
        { children, animate, initial, whileInView, viewport, transition, style, ...domProps },
        ref,
      ) {
        motionState.calls.push({ animate, initial, whileInView, viewport, transition, style });
        return React.createElement("div", { ...domProps, ref }, children);
      }),
    },
    useReducedMotion: () => motionState.reduced,
    useInView: (_ref: unknown, options: unknown) => {
      motionState.inViewCalls.push(options);
      return motionState.inView;
    },
    useScroll: () => ({ scrollYProgress: "scroll-progress" }),
    useTransform: (_value: unknown, input: number[], output: unknown[]) => {
      motionState.transformCalls.push({ input, output });
      return { motionValue: output };
    },
  };
});

beforeEach(() => {
  motionState.calls.length = 0;
  motionState.transformCalls.length = 0;
  motionState.reduced = false;
  motionState.inView = true;
  motionState.inViewCalls.length = 0;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Reveal", () => {
  it("renders reduced-motion content immediately without a hidden or displaced initial state", () => {
    motionState.reduced = true;

    render(
      <Reveal>
        <span>Visible content</span>
      </Reveal>,
    );

    const wrapper = screen.getByText("Visible content").parentElement;
    expect(wrapper).toHaveAttribute("data-reduced-motion", "true");
    expect(screen.getByText("Visible content")).toBeVisible();
    expect(motionState.calls[0]).toMatchObject({ initial: false, whileInView: undefined });
    expect(motionState.calls[0]?.style).toBeUndefined();
  });

  it("reveals once with controlled displacement, clipping, duration, and easing", () => {
    render(
      <Reveal delay={0.12}>
        <span>Animated content</span>
      </Reveal>,
    );

    expect(motionState.calls[0]).toEqual(
      expect.objectContaining({
        initial: { opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)" },
        animate: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
        whileInView: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
      }),
    );
    expect(motionState.inViewCalls[0]).toEqual({ once: true, amount: 0.25 });
  });

  it("honors the browser media query when Motion still has its hydration fallback", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        addEventListener: vi.fn(),
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        removeEventListener: vi.fn(),
      }),
    );

    render(
      <Reveal>
        <span>Hydration-safe content</span>
      </Reveal>,
    );

    expect(screen.getByText("Hydration-safe content").parentElement).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(motionState.calls[0]).toMatchObject({ initial: false, whileInView: undefined });
  });
});

describe("HeroMotion", () => {
  it("uses zero transform and exposes its reduced-motion state", () => {
    motionState.reduced = true;

    render(
      <HeroMotion>
        <h1>Static hero</h1>
      </HeroMotion>,
    );

    const wrapper = screen.getByRole("heading", { name: "Static hero" }).parentElement;
    expect(wrapper).toHaveClass("hero-motion");
    expect(wrapper).toHaveAttribute("data-reduced-motion", "true");
    expect(motionState.calls[0]?.style).toEqual({ y: 0 });
  });
});

describe("SectionWipe", () => {
  it("fully reveals reduced-motion content without clipping it", () => {
    motionState.reduced = true;

    render(
      <SectionWipe>
        <p>Readable contact</p>
      </SectionWipe>,
    );

    const content = screen.getByText("Readable contact");
    const animatedLayer = content.parentElement;
    const wrapper = animatedLayer?.parentElement;
    expect(wrapper).toHaveAttribute("data-reduced-motion", "true");
    expect(content).toBeVisible();
    expect(motionState.calls[0]?.style).toEqual({
      "--section-wipe-clip": "inset(0 0 0 0)",
    });
  });
});
