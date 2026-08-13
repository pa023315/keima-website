import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
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
let observerCallbacks: IntersectionObserverCallback[] = [];

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
  observerCallbacks = [];
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      addEventListener: vi.fn(),
      get matches() {
        return motionState.reduced;
      },
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      removeEventListener: vi.fn(),
    })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class IntersectionObserverStub {
      disconnect = vi.fn();
      observe = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);

      constructor(callback: IntersectionObserverCallback) {
        observerCallbacks.push(callback);
      }
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Reveal", () => {
  it("renders reduced-motion content immediately without a hidden or displaced initial state", async () => {
    motionState.reduced = true;

    render(
      <Reveal>
        <span>Visible content</span>
      </Reveal>,
    );

    const wrapper = screen.getByText("Visible content").closest("[data-reduced-motion]");
    await waitFor(() => expect(wrapper).toHaveAttribute("data-reduced-motion", "true"));
    expect(screen.getByText("Visible content")).toBeVisible();
    expect(motionState.calls.at(-1)).toMatchObject({ initial: false, whileInView: undefined });
    expect(motionState.calls.at(-1)?.style).toBeUndefined();
  });

  it("arms offscreen, then reveals once with controlled displacement, duration, and easing", () => {
    render(
      <Reveal delay={0.12}>
        <span>Animated content</span>
      </Reveal>,
    );

    expect(motionState.calls[0]).toEqual(
      expect.objectContaining({
        initial: false,
        animate: undefined,
        whileInView: undefined,
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
      }),
    );

    act(() =>
      observerCallbacks[0]([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver),
    );
    expect(motionState.calls.at(-1)).toEqual(
      expect.objectContaining({
        animate: { opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)" },
        whileInView: undefined,
      }),
    );

    act(() =>
      observerCallbacks[0]([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver),
    );
    expect(motionState.calls.at(-1)?.animate).toEqual({
      opacity: 1,
      y: 0,
      clipPath: "inset(0 0 0% 0)",
    });
  });

  it("honors the browser media query when Motion still has its hydration fallback", async () => {
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

    await waitFor(() =>
      expect(screen.getByText("Hydration-safe content").closest("[data-reduced-motion]")).toHaveAttribute(
        "data-reduced-motion",
        "true",
      ),
    );
    expect(motionState.calls.at(-1)).toMatchObject({ initial: false, whileInView: undefined });
  });

  it("does not auto-reveal an offscreen heading after 1.2 seconds", () => {
    motionState.inView = false;
    vi.useFakeTimers();
    render(
      <Reveal>
        <span>Offscreen heading</span>
      </Reveal>,
    );

    act(() =>
      observerCallbacks[0]([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver),
    );
    act(() => vi.advanceTimersByTime(1200));
    expect(motionState.calls.at(-1)?.animate).not.toEqual({
      opacity: 1,
      y: 0,
      clipPath: "inset(0 0 0% 0)",
    });
    vi.useRealTimers();
  });
});

describe("HeroMotion", () => {
  it("uses zero transform and exposes its reduced-motion state", async () => {
    motionState.reduced = true;

    render(
      <HeroMotion>
        <h1>Static hero</h1>
      </HeroMotion>,
    );

    const wrapper = screen.getByRole("heading", { name: "Static hero" }).parentElement;
    expect(wrapper).toHaveClass("hero-motion");
    await waitFor(() => expect(wrapper).toHaveAttribute("data-reduced-motion", "true"));
    expect(motionState.calls.at(-1)?.style).toEqual({ y: 0 });
  });
});

describe("SectionWipe", () => {
  it("fully reveals reduced-motion content without clipping it", async () => {
    motionState.reduced = true;

    render(
      <SectionWipe>
        <p>Readable contact</p>
      </SectionWipe>,
    );

    const content = screen.getByText("Readable contact");
    const animatedLayer = content.parentElement;
    const wrapper = animatedLayer?.parentElement;
    await waitFor(() => expect(wrapper).toHaveAttribute("data-reduced-motion", "true"));
    expect(content).toBeVisible();
    expect(motionState.calls.at(-1)?.style).toEqual({
      "--section-wipe-clip": "inset(0 0 0 0%)",
    });
    expect(motionState.transformCalls.at(-1)?.output).toEqual([
      "inset(0 0 0 100%)",
      "inset(0 0 0 0%)",
    ]);
  });
});
