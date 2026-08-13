import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SectionWipe } from "@/components/motion/section-wipe";

describe("SectionWipe static output", () => {
  it("keeps no-JS contact content readable without inline clipping", () => {
    const markup = renderToStaticMarkup(
      <SectionWipe>
        <p>Static contact</p>
      </SectionWipe>,
    );

    expect(markup).toContain("Static contact");
    expect(markup).toContain('data-motion-ready="false"');
    expect(markup).not.toMatch(/style="[^"]*clip-path:/);
  });
});
