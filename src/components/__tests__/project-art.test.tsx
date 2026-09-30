import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectArt } from "@/components/project-art";
import type { ProjectId } from "@/content/site-content";

describe("ProjectArt", () => {
  it.each(["jobsgame", "indie-guider", "gamecf"] as const)(
    "renders %s as decorative branded art",
    (project: ProjectId) => {
      const { container } = render(<ProjectArt project={project} />);
      const art = container.querySelector(`[data-project-art="${project}"]`);

      expect(art).toHaveAttribute("aria-hidden", "true");
      expect(art?.querySelectorAll("span").length).toBe(3);
    },
  );
});
