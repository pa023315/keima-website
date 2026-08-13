import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useKeimaReducedMotion } from "@/components/motion/use-keima-reduced-motion";

function ReducedMotionHarness() {
  const reducedMotion = useKeimaReducedMotion();
  return <div data-reduced-motion={String(reducedMotion)}>Hydrated content</div>;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

describe("reduced-motion hydration", () => {
  it("hydrates the SSR false marker then updates to the real reduced preference without mismatch", async () => {
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

    const container = document.createElement("div");
    container.innerHTML = renderToString(<ReducedMotionHarness />);
    document.body.append(container);

    expect(container.firstElementChild).toHaveAttribute("data-reduced-motion", "false");
    reduced = true;

    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, <ReducedMotionHarness />);
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
