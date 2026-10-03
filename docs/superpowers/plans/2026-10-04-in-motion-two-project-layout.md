# CURRENTLY IN MOTION Two-Project Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three oversized project features with two compact horizontal project rows whose branded cover areas stay at 16:9 and fit within one common desktop viewport.

**Architecture:** Keep project facts in `site-content.ts`, keep decorative geometry isolated in `ProjectArt`, and let `ProjectList` render the same data-driven row for both locales. Section, motion, and responsive styles will be scoped to existing project classes so no other homepage section changes.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest, Testing Library, Playwright.

---

## File Structure

- Modify `src/content/site-content.ts`: replace project IDs and bilingual project records.
- Modify `src/content/__tests__/site-content.test.ts`: specify the approved two-project data contract.
- Modify `src/components/project-list.tsx`: render compact rows with a 16:9 media wrapper.
- Modify `src/components/__tests__/content-sections.test.tsx`: verify two linked project rows and the cover hook.
- Modify `src/components/__tests__/project-art.test.tsx`: verify the new project ID union.
- Modify `src/app/styles/sections.css`: create the desktop two-row composition.
- Modify `src/app/styles/motion.css`: replace removed art variants and reduce hover travel.
- Modify `src/app/styles/responsive.css`: preserve 16:9 covers and stack copy on mobile.
- Modify `tests/e2e/site.spec.ts`: verify desktop viewport fit and mobile stacking.

### Task 1: Define the Approved Two-Project Content Contract

**Files:**
- Modify: `src/content/__tests__/site-content.test.ts`
- Modify: `src/content/site-content.ts`

- [ ] **Step 1: Write the failing content tests**

Replace the existing three-project assertions with:

```ts
expect(locale.inMotion.projects).toHaveLength(2);
expect(locale.inMotion.projects.map((project) => project.id)).toEqual([
  "jobsgame",
  "virtual-vector",
]);
expect(locale.inMotion.projects.map((project) => project.index)).toEqual(["01", "02"]);

expect(zh.inMotion.projects.map((project) => project.url)).toEqual([
  { status: "ready", value: "https://jobsgame.tw/" },
  { status: "ready", value: "https://virtual-vector.com/" },
]);
expect(zh.inMotion.projects[1]).toMatchObject({
  title: "VIRTUAL VECTOR",
  label: "虛擬向量計劃",
  description: "跨越次元，與你相遇。",
});
```

- [ ] **Step 2: Run the content test and verify RED**

Run: `npm test -- src/content/__tests__/site-content.test.ts`

Expected: FAIL because three legacy projects still exist and `virtual-vector` is absent.

- [ ] **Step 3: Implement the minimal bilingual content change**

Change the ID union and both locale records:

```ts
export type ProjectId = "jobsgame" | "virtual-vector";
```

```ts
projects: [
  {
    id: "jobsgame",
    index: "01",
    title: "JOBSGAME",
    label: "Game Industry Career Platform",
    description: "台灣遊戲產業職缺與職涯資訊平台。",
    url: ready("https://jobsgame.tw/"),
  },
  {
    id: "virtual-vector",
    index: "02",
    title: "VIRTUAL VECTOR",
    label: "虛擬向量計劃",
    description: "跨越次元，與你相遇。",
    url: ready("https://virtual-vector.com/"),
  },
],
```

For English, keep `VIRTUAL VECTOR`, use label `Virtual Vector Project`, and description `Across dimensions, we meet.`.

- [ ] **Step 4: Run the content test and verify GREEN**

Run: `npm test -- src/content/__tests__/site-content.test.ts`

Expected: all tests in the file pass.

- [ ] **Step 5: Commit the content contract**

```bash
git add src/content/site-content.ts src/content/__tests__/site-content.test.ts
git commit -m "Update in-motion projects"
```

### Task 2: Specify and Render Compact 16:9 Project Rows

**Files:**
- Modify: `src/components/__tests__/content-sections.test.tsx`
- Modify: `src/components/project-list.tsx`

- [ ] **Step 1: Write the failing component test**

Replace the legacy project-card expectations with:

```ts
expect(section.querySelectorAll(".project-card")).toHaveLength(2);
expect(section.querySelectorAll(".project-media-frame")).toHaveLength(2);
expect(section.querySelectorAll(".project-art")).toHaveLength(2);
expect(within(section).getByRole("link", { name: /JOBSGAME/ })).toHaveAttribute(
  "href",
  "https://jobsgame.tw/",
);
expect(within(section).getByRole("link", { name: /VIRTUAL VECTOR/ })).toHaveAttribute(
  "href",
  "https://virtual-vector.com/",
);
expect(within(section).queryByText("INDIE GUIDER")).not.toBeInTheDocument();
expect(within(section).queryByText("GAMECF")).not.toBeInTheDocument();
```

- [ ] **Step 2: Run the component test and verify RED**

Run: `npm test -- src/components/__tests__/content-sections.test.tsx`

Expected: FAIL because the media frame hook and Virtual Vector row do not exist.

- [ ] **Step 3: Implement the minimal row markup**

Wrap the existing project media content in a dedicated ratio frame and keep the text column separate:

```tsx
<div className="project-media" aria-hidden="true">
  <div className="project-media-frame">
    <ProjectArt project={project.id} />
    <span className="project-media-marker">{project.index}</span>
  </div>
</div>
<div className="project-card-copy">
  <div className="project-card-meta">
    <span className="project-card-index">{project.index}</span>
    <span className="project-arrow" aria-hidden="true">↗</span>
  </div>
  <div className="project-card-text">
    <h3 className="project-title">{project.title}</h3>
    <p className="project-label">{project.label}</p>
    <p className="project-description">{project.description}</p>
  </div>
</div>
```

Remove alternating `data-project-position`; two rows share one consistent image-left/copy-right structure.

- [ ] **Step 4: Run the component test and verify GREEN**

Run: `npm test -- src/components/__tests__/content-sections.test.tsx`

Expected: all ProjectList assertions pass.

- [ ] **Step 5: Commit the component structure**

```bash
git add src/components/project-list.tsx src/components/__tests__/content-sections.test.tsx
git commit -m "Render compact in-motion project rows"
```

### Task 3: Add the Virtual Vector Branded Placeholder

**Files:**
- Modify: `src/components/__tests__/project-art.test.tsx`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/app/styles/motion.css`

- [ ] **Step 1: Update the typed art variants and write a failing visual-style test**

```ts
it.each(["jobsgame", "virtual-vector"] as const)(
  "renders %s as decorative branded art",
  (project: ProjectId) => {
    const { container } = render(<ProjectArt project={project} />);
    const art = container.querySelector(`[data-project-art="${project}"]`);
    expect(art).toHaveAttribute("aria-hidden", "true");
    expect(art?.querySelectorAll("span")).toHaveLength(3);
  },
);
```

Add this Playwright assertion before adding the new CSS variant:

```ts
test("Virtual Vector uses a distinct branded placeholder", async ({ page }) => {
  await page.goto("/zh-TW/");
  const jobsgameBackground = await page.locator(".project-art--jobsgame").evaluate(
    (node) => getComputedStyle(node).backgroundImage,
  );
  const virtualVectorBackground = await page.locator(".project-art--virtual-vector").evaluate(
    (node) => getComputedStyle(node).backgroundImage,
  );
  expect(virtualVectorBackground).not.toBe("none");
  expect(virtualVectorBackground).not.toBe(jobsgameBackground);
});
```

- [ ] **Step 2: Run the art test and verify RED**

Run: `npm test -- src/components/__tests__/project-art.test.tsx && npm run build && npm run test:e2e -- --grep "Virtual Vector uses"`

Expected: the unit test passes the typed renderer contract, then the E2E test FAILS because the new art variant has no background treatment.

- [ ] **Step 3: Implement the Virtual Vector visual and restrained hover**

Remove the `indie-guider` and `gamecf` blocks. Add:

```css
.project-art--virtual-vector {
  background: linear-gradient(135deg, var(--paper-deep) 0 48%, var(--cyan) 48% 52%, var(--ink) 52%);
}
.project-art--virtual-vector .project-art-plane {
  top: 24%; left: 13%; width: 60%; height: 2px; background: var(--paper);
  transform: rotate(-17deg); box-shadow: 0 2.4rem 0 var(--paper), 0 4.8rem 0 var(--paper);
}
.project-art--virtual-vector .project-art-orbit {
  right: 12%; bottom: 10%; width: 30%; aspect-ratio: 1;
  border: 0.7rem solid var(--cyan); transform: rotate(45deg);
}
.project-art--virtual-vector .project-art-node {
  top: 16%; right: 17%; width: 1rem; aspect-ratio: 1; background: var(--paper);
}
.project-card-link:hover .project-media { transform: translateY(-0.25rem); }
```

- [ ] **Step 4: Run the art tests and verify GREEN**

Run: `npm test -- src/components/__tests__/project-art.test.tsx && npm run build && npm run test:e2e -- --grep "Virtual Vector uses"`

Expected: both typed variants and the distinct visual-style assertion pass.

- [ ] **Step 5: Commit the art variant**

```bash
git add src/components/__tests__/project-art.test.tsx tests/e2e/site.spec.ts src/app/styles/motion.css
git commit -m "Add Virtual Vector project art"
```

### Task 4: Fit Both Rows Into One Desktop Viewport

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/app/styles/sections.css`
- Modify: `src/app/styles/responsive.css`

- [ ] **Step 1: Write failing desktop and mobile layout tests**

Add:

```ts
test("in-motion fits two 16:9 project rows in one desktop viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/zh-TW/");
  const section = page.locator("#in-motion");
  await section.scrollIntoViewIfNeeded();
  const sectionBox = await section.boundingBox();
  expect(sectionBox).not.toBeNull();
  expect(sectionBox!.height).toBeLessThanOrEqual(900);
  await expect(section.locator(".project-card")).toHaveCount(2);
  for (const frame of await section.locator(".project-media-frame").all()) {
    const box = await frame.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width / box!.height - 16 / 9)).toBeLessThan(0.03);
  }
});

test("in-motion stacks 16:9 project covers on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh-TW/");
  const firstCard = page.locator("#in-motion .project-card").first();
  const media = await firstCard.locator(".project-media-frame").boundingBox();
  const copy = await firstCard.locator(".project-card-copy").boundingBox();
  expect(media).not.toBeNull();
  expect(copy).not.toBeNull();
  expect(copy!.y).toBeGreaterThan(media!.y + media!.height - 1);
  expect(Math.abs(media!.width / media!.height - 16 / 9)).toBeLessThan(0.03);
});
```

- [ ] **Step 2: Run the targeted E2E tests and verify RED**

Run: `npm run build && npm run test:e2e -- --grep "in-motion"`

Expected: FAIL because the current section exceeds one viewport and media uses the old dimensions.

- [ ] **Step 3: Implement the desktop section and row styles**

Use scoped values:

```css
.in-motion {
  min-height: 100svh;
  padding-block: clamp(3.75rem, 6vh, 5.5rem);
  background: var(--paper-light);
}
.in-motion .section-heading-block { grid-column: 2 / 6; }
.in-motion-title { font-size: clamp(3.25rem, 5.4vw, 5.8rem); }
.in-motion .section-intro { margin-top: 1.25rem; }
.project-list {
  display: grid; grid-column: 6 / -1; margin: 0; padding: 0;
  gap: clamp(1rem, 2vh, 1.5rem); list-style: none;
}
.project-card-link {
  display: grid; min-height: 0;
  grid-template-columns: minmax(18rem, 42%) minmax(0, 1fr);
  gap: clamp(1.5rem, 2.8vw, 3rem); align-items: stretch;
}
.project-media { display:flex; align-items:center; min-width:0; }
.project-media-frame { position:relative; width:100%; aspect-ratio:16 / 9; overflow:hidden; }
.project-card-copy { min-width:0; padding:1rem 0; border-top:2px solid var(--ink); }
.project-card-meta { display:flex; align-items:flex-start; justify-content:space-between; }
.project-title { margin-top:auto; font-size:clamp(2rem, 3vw, 3.75rem); }
.project-description { margin-top:1rem; }
```

- [ ] **Step 4: Implement responsive behavior**

At `max-width: 1100px`, keep a two-column row with a smaller gap. At `max-width: 767px`, set `.project-list` to grid column `2`, restore a top margin, make `.project-card-link` a single-column grid, and retain `.project-media-frame { aspect-ratio: 16 / 9; }`.

- [ ] **Step 5: Build and verify both E2E tests GREEN**

Run: `npm run build && npm run test:e2e -- --grep "in-motion"`

Expected: both in-motion tests pass.

- [ ] **Step 6: Commit the responsive layout**

```bash
git add tests/e2e/site.spec.ts src/app/styles/sections.css src/app/styles/responsive.css
git commit -m "Fit in-motion projects into one viewport"
```

### Task 5: Full Regression and Production Verification

**Files:**
- Verify only; fix only files already listed if failures reveal regressions.

- [ ] **Step 1: Run the complete automated verification suite**

Run: `npm test && npm run lint && npm run typecheck && npm run build && npm run test:e2e`

Expected: all commands exit 0 with no test failures or lint/type errors.

- [ ] **Step 2: Inspect the production build at required viewports**

Run: `npm start`

Check `/zh-TW/#in-motion` and `/en/#in-motion` at 1440×900, 1280×800, and 390×844. Confirm two projects only, 16:9 geometry, readable copy, keyboard focus, and no changes to adjacent sections.

- [ ] **Step 3: Review the final diff and repository status**

Run: `git diff HEAD~4 -- src/content src/components src/app/styles tests/e2e/site.spec.ts && git status --short`

Expected: only the planned files changed; pre-existing untracked business-card assets remain untouched.

- [ ] **Step 4: Push the completed commits for GitHub Pages deployment**

Run: `git push origin main`

Expected: push succeeds and the GitHub Pages workflow starts for the new `main` commit.
