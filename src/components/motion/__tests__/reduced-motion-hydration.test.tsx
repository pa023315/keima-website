import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Reveal } from "@/components/motion/reveal";

const motionState = vi.hoisted(() => ({ reduced: false }));

type MotionStubProps = React.HTMLAttributes<HTMLDivElement> & {
  animate?: unknown;
  initial?: unknown;
  transition?: unknown;
  viewport?: unknown;
  whileInView?: unknown;
};

vi.mock("motion/react", async () => {
  const React = await import("react");

  return {
    motion: {
      div: React.forwardRef<HTMLDivElement, MotionStubProps>(
        function MotionDiv(
          {
            children,
            initial: _initial,
            animate: _animate,
            whileInView: _whileInView,
            viewport: _viewport,
            transition: _transition,
            ...props
          },
          ref,
        ) {
          void [_initial, _animate, _whileInView, _viewport, _transition];
          return React.createElement("div", { ...props, ref }, children);
        },
      ),
    },
    useInView: () => false,
    useReducedMotion: () => motionState.reduced,
  };
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe("reduced-motion hydration", () => {
  it("hydrates the deterministic SSR marker then updates it from the browser preference", async () => {
    let reduced = false;
    const mediaQuery = {
      addEventListener: vi.fn(),
      get matches() {
        return reduced;
      },
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal("matchMedia", vi.fn(() => mediaQuery));
    const hydrationErrors: unknown[][] = [];
    vi.spyOn(console, "error").mockImplementation((...args) => hydrationErrors.push(args));

    const element = (
      <Reveal>
        <span>Hydrated content</span>
      </Reveal>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(element);
    document.body.append(container);

    expect(container.firstElementChild).toHaveAttribute("data-reduced-motion", "false");
    reduced = true;

    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, element);
      await Promise.resolve();
    });

    expect(container.firstElementChild).toHaveAttribute("data-reduced-motion", "true");
    expect(
      hydrationErrors.filter(([message]) =>
        String(message).match(/hydration|hydrated|server rendered HTML|didn't match/i),
      ),
    ).toEqual([]);
    expect(mediaQuery.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));

    await act(async () => root?.unmount());
  });
});
