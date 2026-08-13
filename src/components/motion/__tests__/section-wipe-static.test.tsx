import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Reveal } from "@/components/motion/reveal";
import { SectionWipe } from "@/components/motion/section-wipe";

describe("Reveal static output", () => {
  it("keeps no-JS headings visible without inline hidden or displaced state", () => {
    const markup = renderToStaticMarkup(
      <Reveal>
        <h2>Static heading</h2>
      </Reveal>,
    );

    expect(markup).toContain("Static heading");
    expect(markup).not.toMatch(/style="[^"]*(?:opacity:\s*0|clip-path:|transform:)/);
  });
});

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
