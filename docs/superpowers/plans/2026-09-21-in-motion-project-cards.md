# In Motion Project Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the row-based `CURRENTLY IN MOTION` presentation with three equal-weight, large-image KEIMA project cards using distinct CSS geometric placeholders.

**Architecture:** Keep `inMotion.projects` as the single content source and retain the existing HTTPS URL guard. Refactor the presentational `ProjectRow` into `ProjectCard`, then separate project-card styling from the HOW WE MOVE row system so both sections have distinct visual structures. Use project-id modifier classes for decorative geometry and existing `Reveal` behavior for staggered entry.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Motion Reveal wrapper, Vitest + Testing Library, Playwright.

---

## File Map

- Modify `src/components/project-list.tsx`: replace row markup with accessible linked project-card markup and decorative geometry.
- Modify `src/components/__tests__/content-sections.test.tsx`: lock the card structure, real project content, media placeholders, and safe links.
- Modify `src/app/globals.css`: create the three-column card grid, project-specific geometric artwork, hover/focus motion, and tablet/mobile layouts; preserve HOW WE MOVE row styles.
- Modify `tests/e2e/site.spec.ts`: replace assumptions about shared row grids with desktop/tablet/mobile project-card layout assertions.

### Task 1: Refactor project rows into semantic cards

**Files:**
- Modify: `src/components/__tests__/content-sections.test.tsx:109-132`
- Modify: `src/components/project-list.tsx:19-78`

- [ ] **Step 1: Write the failing component test**

Replace the existing `ProjectList` test with:

```tsx
describe("ProjectList", () => {
  it("renders the three real projects as large linked cards", () => {
    render(<ProjectList content={zhContent} />);

    const section = screen.getByRole("region", { name: "CURRENTLY IN MOTION" });
    const cards = section.querySelectorAll(".project-card");
    const media = section.querySelectorAll(".project-media");

    expect(cards).toHaveLength(3);
    expect(media).toHaveLength(3);
    expect(section.querySelector(".project-row")).not.toBeInTheDocument();

    expect(within(section).getByRole("link", { name: /JOBSGAME/ })).toHaveAttribute(
      "href",
      "https://jobsgame.tw/",
    );
    expect(within(section).getByRole("link", { name: /INDIE GUIDER/ })).toHaveAttribute(
      "href",
      "https://indie-guider.games/",
    );
    expect(within(section).getByRole("link", { name: /GAMECF/ })).toHaveAttribute(
      "href",
      "https://gamecf.tw/",
    );

    expect(section.querySelector(".project-card--jobsgame .project-media")).toBeInTheDocument();
    expect(section.querySelector(".project-card--indie-guider .project-media")).toBeInTheDocument();
    expect(section.querySelector(".project-card--gamecf .project-media")).toBeInTheDocument();
    expect(within(section).queryByText("CREATOR ERP")).not.toBeInTheDocument();
    expect(within(section).queryByText("CONSULTING")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the targeted test and verify RED**

Run:

```bash
npm test -- src/components/__tests__/content-sections.test.tsx
```

Expected: FAIL because `.project-card` and `.project-media` do not exist and `.project-row` still renders.

- [ ] **Step 3: Implement the project-card markup**

In `src/components/project-list.tsx`, replace `ProjectRow` with this component and update the map call to render `ProjectCard`:

```tsx
function ProjectCard({ project, index }: { project: ProjectContent; index: number }) {
  const href = safeProjectHref(project);
  const cardContent = (
    <>
      <div className="project-media" aria-hidden="true">
        <span className="project-media-shape project-media-shape--primary" />
        <span className="project-media-shape project-media-shape--secondary" />
        <span className="project-media-marker">
          {project.index} / {project.title}
        </span>
      </div>
      <div className="project-card-copy">
        <div className="project-card-text">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-label">{project.label}</p>
          <p className="project-description">{project.description}</p>
        </div>
        <span className="project-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </>
  );

  return (
    <li
      className={`project-card project-card--${project.id}`}
      data-link-state={href ? "ready" : "pending"}
    >
      <Reveal delay={index * 0.08}>
        {href ? (
          <a className="project-card-link" href={href} aria-label={`${project.title} — ${project.label}`}>
            {cardContent}
          </a>
        ) : (
          <div className="project-card-link">{cardContent}</div>
        )}
      </Reveal>
    </li>
  );
}
```

Update the list mapping:

```tsx
<ol className="project-list">
  {inMotion.projects.map((project, index) => (
    <ProjectCard key={project.id} project={project} index={index} />
  ))}
</ol>
```

- [ ] **Step 4: Run the targeted test and verify GREEN**

Run:

```bash
npm test -- src/components/__tests__/content-sections.test.tsx
```

Expected: all tests in the file PASS.

- [ ] **Step 5: Commit the semantic card refactor**

```bash
git add src/components/project-list.tsx src/components/__tests__/content-sections.test.tsx
git commit -m "refactor: present in-motion projects as cards"
```

### Task 2: Build the KEIMA geometric card system

**Files:**
- Modify: `src/app/globals.css:1158-1234`
- Modify: `src/app/globals.css:1394-1440`
- Modify: `src/app/globals.css:1442-1536`

- [ ] **Step 1: Separate HOW WE MOVE row rules from project-card rules**

Keep `.approach-list`, `.approach-row`, and `.approach-row .reveal-content` as the row system. Remove project selectors from those shared rules, then add this project grid immediately after the approach styles:

```css
.project-list {
  grid-column: 2 / 12;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 1.6vw, 1.75rem);
  padding: 0;
  margin: clamp(2rem, 4vw, 4rem) 0 0;
  list-style: none;
}

.project-card,
.project-card .reveal,
.project-card .reveal-content {
  min-width: 0;
  height: 100%;
}

.project-card-link {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  color: var(--keima-ink);
  text-decoration: none;
}

.project-card-link:focus-visible {
  outline: 3px solid var(--keima-cyan);
  outline-offset: 5px;
}

.project-media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: var(--keima-ink);
  border: 1px solid var(--keima-ink);
  isolation: isolate;
}

.project-media-shape {
  position: absolute;
  display: block;
  transition: transform 420ms var(--ease-keima);
}

.project-media-marker {
  position: absolute;
  z-index: 3;
  inset: auto auto 1rem 1rem;
  color: var(--surface-light);
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.12em;
}

.project-card--jobsgame .project-media-shape--primary {
  width: 76%;
  aspect-ratio: 1;
  top: -12%;
  left: -28%;
  border: 4px solid var(--keima-cyan);
  transform: rotate(35deg);
}

.project-card--jobsgame .project-media-shape--secondary {
  width: 52%;
  height: 150%;
  top: -25%;
  right: -23%;
  background: var(--keima-paper);
  border-left: 4px solid var(--keima-cyan);
  transform: rotate(26deg);
}

.project-card--indie-guider .project-media-shape--primary {
  width: 120%;
  height: 42%;
  top: 24%;
  left: -15%;
  background: var(--keima-cyan);
  transform: rotate(-18deg);
}

.project-card--indie-guider .project-media-shape--secondary {
  width: 46%;
  aspect-ratio: 1;
  top: 12%;
  right: 10%;
  border: clamp(0.8rem, 1.5vw, 1.35rem) solid var(--keima-paper);
  border-radius: 50%;
}

.project-card--gamecf .project-media-shape--primary {
  inset: 12% 14%;
  border: 4px solid var(--keima-cyan);
  transform: skewX(-20deg);
}

.project-card--gamecf .project-media-shape--secondary {
  width: 38%;
  height: 160%;
  top: -28%;
  right: -5%;
  background: var(--keima-paper);
  box-shadow: -5px 0 0 var(--keima-cyan);
  transform: rotate(38deg);
}

.project-card-copy {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: start;
  padding: 1.35rem 0 1.5rem;
  border-bottom: 1px solid var(--keima-ink);
}

.project-card-text {
  display: grid;
  gap: 0.65rem;
}

.project-title {
  margin: 0;
  color: var(--keima-ink);
  font-size: clamp(1.7rem, 2.25vw, 2.6rem);
  font-weight: 620;
  letter-spacing: -0.045em;
  line-height: 0.96;
}

.project-label,
.project-description {
  margin: 0;
}

.project-label {
  color: var(--keima-ink);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.45;
}

.project-description {
  color: #57544d;
  font-size: 0.95rem;
  line-height: 1.65;
}

.project-arrow {
  color: var(--keima-cyan);
  font-size: clamp(1.5rem, 2vw, 2rem);
  line-height: 1;
  transition: transform 220ms var(--ease-keima);
}

.project-card-link:hover .project-arrow,
.project-card-link:focus-visible .project-arrow {
  transform: translate(0.35rem, -0.35rem);
}

.project-card-link:hover .project-media-shape--primary,
.project-card-link:focus-visible .project-media-shape--primary {
  transform: translate3d(0.45rem, -0.35rem, 0) rotate(35deg);
}

.project-card--indie-guider .project-card-link:hover .project-media-shape--primary,
.project-card--indie-guider .project-card-link:focus-visible .project-media-shape--primary {
  transform: translate3d(0.45rem, -0.35rem, 0) rotate(-18deg);
}

.project-card--gamecf .project-card-link:hover .project-media-shape--primary,
.project-card--gamecf .project-card-link:focus-visible .project-media-shape--primary {
  transform: translate3d(0.45rem, -0.35rem, 0) skewX(-20deg);
}

.project-card-link:hover .project-media-shape--secondary,
.project-card-link:focus-visible .project-media-shape--secondary {
  translate: -0.4rem 0.3rem;
}

.project-card[data-link-state="pending"] {
  color: var(--text-muted);
}
```

- [ ] **Step 2: Add explicit tablet and mobile layout rules**

Inside `@media (max-width: 1023px)`, keep `.project-list` at `grid-column: 1 / -1` and add:

```css
.project-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
```

Remove `.project-row-content` and project-description/arrow row-placement rules from that breakpoint. Inside `@media (max-width: 767px)`, add:

```css
.project-list {
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

.project-media {
  aspect-ratio: 16 / 10;
}

.project-card-copy {
  padding-block: 1.1rem 1.25rem;
}

.project-title {
  font-size: clamp(1.8rem, 9vw, 2.5rem);
}

.project-description {
  font-size: 1rem;
}
```

Remove the obsolete mobile `.project-row-content`, `.project-title`, `.project-label`, `.project-description`, and `.project-arrow` grid-column overrides. The existing global reduced-motion media query already forces transition duration to `0.01ms`, so no duplicate reduced-motion rule is needed.

- [ ] **Step 3: Run component tests and the CSS syntax path**

Run:

```bash
npm test -- src/components/__tests__/content-sections.test.tsx
npm run build
```

Expected: component tests PASS and the production build exits 0.

- [ ] **Step 4: Commit the visual card system**

```bash
git add src/app/globals.css
git commit -m "style: add geometric in-motion project cards"
```

### Task 3: Replace row-layout browser assertions with card-layout assertions

**Files:**
- Modify: `tests/e2e/site.spec.ts:101-168`

- [ ] **Step 1: Replace the obsolete mobile row-height test**

Use this test instead:

```ts
test("mobile project cards use a compact single-column image layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh-TW/");

  const cards = page.locator(".project-card");
  const firstCard = cards.first();
  const firstMedia = firstCard.locator(".project-media");

  await expect(cards).toHaveCount(3);
  await expect(firstMedia).toBeVisible();

  const layout = await page.evaluate(() => {
    const list = document.querySelector<HTMLElement>(".project-list")!;
    const media = document.querySelector<HTMLElement>(".project-media")!;
    const mediaBox = media.getBoundingClientRect();
    return {
      columns: getComputedStyle(list).gridTemplateColumns.split(" ").length,
      mediaRatio: mediaBox.width / mediaBox.height,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  expect(layout.columns).toBe(1);
  expect(layout.mediaRatio).toBeGreaterThan(1.5);
  expect(layout.overflow).toBeLessThanOrEqual(1);
});
```

- [ ] **Step 2: Replace the shared row-grid test with desktop and tablet card-grid tests**

Replace `desktop approach and project rows share a readable grid system` with:

```ts
test("desktop separates project cards from the approach row system", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/zh-TW/");

  const layout = await page.evaluate(() => {
    const projectList = document.querySelector<HTMLElement>(".project-list")!;
    const cards = [...document.querySelectorAll<HTMLElement>(".project-card")];
    const media = document.querySelector<HTMLElement>(".project-media")!.getBoundingClientRect();
    return {
      columns: getComputedStyle(projectList).gridTemplateColumns.split(" ").length,
      cardTopPositions: cards.map((card) => Math.round(card.getBoundingClientRect().top)),
      mediaRatio: media.width / media.height,
      approachIsRows: getComputedStyle(
        document.querySelector<HTMLElement>(".approach-row .reveal-content")!,
      ).display,
    };
  });

  expect(layout.columns).toBe(3);
  expect(new Set(layout.cardTopPositions).size).toBe(1);
  expect(layout.mediaRatio).toBeGreaterThan(1.3);
  expect(layout.mediaRatio).toBeLessThan(1.36);
  expect(layout.approachIsRows).toBe("grid");
});

test("tablet keeps project cards in a two-column grid", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 1000 });
  await page.goto("/zh-TW/");

  const columns = await page
    .locator(".project-list")
    .evaluate((list) => getComputedStyle(list).gridTemplateColumns.split(" ").length);

  expect(columns).toBe(2);
});
```

- [ ] **Step 3: Run the targeted Playwright tests and verify GREEN**

Run:

```bash
npx playwright test tests/e2e/site.spec.ts
```

Expected: all site E2E cases PASS in desktop Chromium, desktop WebKit, and mobile WebKit.

- [ ] **Step 4: Commit responsive browser coverage**

```bash
git add tests/e2e/site.spec.ts
git commit -m "test: cover responsive project card layouts"
```

### Task 4: Full verification and local preview review

**Files:**
- Verify only; no source changes expected.

- [ ] **Step 1: Run the full automated verification suite**

Run each command and require exit code 0:

```bash
npm test
npm run typecheck
npm run lint
npm run build
npx playwright test
```

Expected:

- Vitest reports all test files and tests passing.
- TypeScript emits no errors.
- ESLint emits no errors.
- Next.js production build succeeds and exports `/zh-TW` and `/en`.
- Playwright reports all browser tests passing.

- [ ] **Step 2: Inspect both locales in the local preview**

Open `http://localhost:4173/zh-TW/#in-motion` and `http://localhost:4173/en/#in-motion` after the production build. Confirm:

- Three cards are present and equal in visual weight.
- JOBSGAME, INDIE GUIDER, and GAMECF each have a distinct geometric image.
- The entire card is clickable and opens the existing HTTPS project URL.
- HOW WE MOVE remains a three-row editorial list.
- Desktop, tablet, and mobile have no horizontal overflow.
- Reduced-motion mode keeps all content visible.

- [ ] **Step 3: Confirm a clean worktree**

Run:

```bash
git status --short
```

Expected: no output.
