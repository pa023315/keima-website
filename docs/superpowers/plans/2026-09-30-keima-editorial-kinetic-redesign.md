# KEIMA Editorial Kinetic Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing bilingual KEIMA one-page site into the approved Editorial Kinetic direction while preserving all approved content, real projects, accessibility, static export compatibility, and the custom domain.

**Architecture:** Keep the current content-driven React component structure and Next.js static export. Split the 1,679-line global stylesheet into focused design-system files, add small reusable motion/art primitives, and verify structure with Vitest plus layout, responsive, reduced-motion, and overflow behavior with Playwright.

**Tech Stack:** Next.js 16 static export, React 19, TypeScript 6, Motion 13, CSS, Vitest, Testing Library, Playwright.

---

## File map

**Create**

- `src/app/styles/tokens.css` — color, spacing, type, motion, and layout tokens.
- `src/app/styles/base.css` — reset, document defaults, focus, selection, and reduced-motion base rules.
- `src/app/styles/layout.css` — header, shared section grid, footer, and shared responsive structure.
- `src/app/styles/sections.css` — Hero, About, Approach, Projects, Profile, and Contact compositions.
- `src/app/styles/motion.css` — reveal, path, wipe, hover, and entrance choreography.
- `src/app/styles/responsive.css` — tablet and mobile recomposition rules.
- `src/components/project-art.tsx` — three deterministic, decorative project-art compositions.
- `src/components/motion/route-progress.tsx` — global scroll-progress path with reduced-motion support.
- `src/components/__tests__/project-art.test.tsx` — verifies real-project visual variants and decorative semantics.
- `src/components/motion/__tests__/route-progress.test.tsx` — verifies stable and reduced-motion render states.

**Modify**

- `src/app/globals.css` — replace legacy rules with ordered imports of the focused stylesheets.
- `src/components/site-shell.tsx` — mount the global route-progress element.
- `src/components/navigation.tsx` — add editorial header structure without changing links or locale behavior.
- `src/components/hero.tsx` — add the path-origin and section metadata wrappers.
- `src/components/about.tsx` — add editorial copy rails and semantic heading linkage.
- `src/components/approach.tsx` — add the stepped path structure.
- `src/components/project-list.tsx` — use distinct art and alternating project layouts.
- `src/components/profile.tsx` — add the left-side geometric portrait area and sequential index `04`.
- `src/components/contact.tsx` — sequential index `05` and resilient CTA line structure.
- `src/components/footer.tsx` — compact horizontal editorial footer.
- `src/components/motion/reveal.tsx` — support clip and rise variants without hiding server-rendered content.
- `src/content/site-content.ts` — narrow project IDs to the three approved real-project variants.
- `src/components/__tests__/content-sections.test.tsx` — lock approved content and structural requirements.
- `src/components/__tests__/navigation.test.tsx` — lock bilingual navigation and active-state behavior.
- `tests/e2e/site.spec.ts` — lock layout, type, overflow, focus, reduced-motion, and responsive behavior.

**Do not modify or stage**

- `docs/superpowers/specs/2026-09-22-keima-business-card-design.md`
- `public/brand/keima-business-card-*`

---

### Task 1: Lock content and section-order contracts

**Files:**
- Modify: `src/components/__tests__/content-sections.test.tsx`
- Modify: `src/components/profile.tsx`
- Modify: `src/components/contact.tsx`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Add failing unit assertions for sequential section indices and the profile composition**

Add these assertions to the existing Profile and Contact suites:

```tsx
expect(within(section).getByText("04")).toHaveClass("section-index-value");
expect(section.querySelector(".profile-portrait")).toHaveAttribute("aria-hidden", "true");
expect(within(section).getByRole("heading", { name: "IAN / 祤呈" })).toHaveClass(
  "profile-name",
);

expect(within(contactSection).getByText("05")).toHaveClass("section-index-value");
expect(within(contactSection).queryByText("CREATOR ERP")).not.toBeInTheDocument();
expect(within(contactSection).queryByText("CONSULTING")).not.toBeInTheDocument();
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- src/components/__tests__/content-sections.test.tsx
```

Expected: FAIL because `.section-index-value`, `.profile-portrait`, and `.profile-name` do not exist and the old indices are `05` / `06`.

- [ ] **Step 3: Apply the minimal semantic markup changes**

Change Profile to this structure while preserving all content mapping:

```tsx
<p className="section-index profile-index" aria-hidden="true">
  <span className="section-index-value">04</span>
</p>
<div className="profile-portrait" aria-hidden="true">
  <span className="profile-portrait-orbit" />
  <span className="profile-portrait-step" />
</div>
<div className="profile-heading">
  <p className="section-kicker">{profile.label}</p>
  <h2 id="profile-title">{profile.title}</h2>
</div>
<Reveal className="profile-card">
  <p className="profile-role">{profile.role}</p>
  <h3 className="profile-name">{profile.name}</h3>
  <ul className="profile-fields" aria-label="Profile fields">
    {profile.fields.map((field) => <li key={field}>{field}</li>)}
  </ul>
  <div className="profile-bio">
    {profile.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
  </div>
</Reveal>
```

Change Contact’s index to:

```tsx
<p className="section-index contact-index" aria-hidden="true">
  <span className="section-index-value">05</span>
</p>
```

- [ ] **Step 4: Add an end-to-end content guard**

Add:

```ts
test("section numbering remains continuous after the removed philosophy section", async ({ page }) => {
  await page.goto("/zh-TW/");
  await expect(page.locator("#profile .section-index-value")).toHaveText("04");
  await expect(page.locator("#contact .section-index-value")).toHaveText("05");
  await expect(page.getByText("CREATOR ERP", { exact: true })).toHaveCount(0);
  await expect(page.getByText("CONSULTING", { exact: true })).toHaveCount(0);
  await expect(page.locator("#philosophy")).toHaveCount(0);
});
```

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm test -- src/components/__tests__/content-sections.test.tsx
npm run build
npx playwright test tests/e2e/site.spec.ts --grep "section numbering"
```

Expected: all commands PASS.

Commit:

```bash
git add src/components/profile.tsx src/components/contact.tsx src/components/__tests__/content-sections.test.tsx tests/e2e/site.spec.ts
git commit -m "Align profile and contact section order"
```

---

### Task 2: Establish the editorial design system and split the stylesheet

**Files:**
- Create: `src/app/styles/tokens.css`
- Create: `src/app/styles/base.css`
- Create: `src/app/styles/layout.css`
- Create: `src/app/styles/sections.css`
- Create: `src/app/styles/motion.css`
- Create: `src/app/styles/responsive.css`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add the ordered stylesheet entry point**

Replace `src/app/globals.css` with:

```css
@import "./styles/tokens.css";
@import "./styles/base.css";
@import "./styles/layout.css";
@import "./styles/sections.css";
@import "./styles/motion.css";
@import "./styles/responsive.css";
```

- [ ] **Step 2: Create the shared tokens**

Create `tokens.css` with this exact foundation:

```css
:root {
  --ink: #12120e;
  --paper: #f1efe7;
  --paper-deep: #e5e2d8;
  --cyan: #2eb8c6;
  --muted: #76746b;
  --hairline: color-mix(in srgb, var(--ink) 20%, transparent);
  --page-gutter: clamp(1.25rem, 4vw, 4.75rem);
  --section-block: clamp(6.5rem, 12vw, 12rem);
  --grid-gap: clamp(1rem, 2vw, 2rem);
  --display-hero: clamp(4.8rem, 13vw, 13.5rem);
  --display-section: clamp(3.7rem, 8.4vw, 8.5rem);
  --display-card: clamp(2.4rem, 4vw, 4.6rem);
  --body-lg: clamp(1.125rem, 1.55vw, 1.45rem);
  --body: clamp(1rem, 1.1vw, 1.125rem);
  --label: 0.75rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --header-height: 5rem;
}
```

- [ ] **Step 3: Move and normalize shared styles**

Move reset/document/focus rules into `base.css`, shared grid/header/footer rules into `layout.css`, section rules into `sections.css`, animation rules into `motion.css`, and media queries into `responsive.css`. Delete duplicated legacy declarations during the move. Preserve these base behaviors:

```css
html { scroll-behavior: smooth; background: var(--paper); }
body { margin: 0; overflow-x: clip; background: var(--paper); color: var(--ink); }
:focus-visible { outline: 3px solid var(--cyan); outline-offset: 4px; }
::selection { background: var(--cyan); color: var(--ink); }
section[id] { scroll-margin-top: calc(var(--header-height) + 1rem); }
```

- [ ] **Step 4: Add reduced-motion guarantees**

Add to `base.css`:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Verify no behavior regression and commit**

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Expected: all commands PASS and the static export completes.

Commit:

```bash
git add src/app/globals.css src/app/styles
git commit -m "Establish Editorial Kinetic design system"
```

---

### Task 3: Recompose the navigation and Hero

**Files:**
- Modify: `src/components/navigation.tsx`
- Modify: `src/components/hero.tsx`
- Modify: `src/components/__tests__/navigation.test.tsx`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/app/styles/layout.css`
- Modify: `src/app/styles/sections.css`
- Modify: `src/app/styles/responsive.css`

- [ ] **Step 1: Add failing header and Hero layout assertions**

Add these unit assertions so the content and navigation behavior remain locked:

```tsx
expect(screen.getByRole("link", { name: "KEIMA 首頁" })).toHaveAttribute("href", "#home");
expect(screen.getByRole("navigation", { name: "主要導覽" })).toBeVisible();
expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en/#home");
expect(screen.getByRole("link", { name: "關於桂馬" })).toHaveAttribute("href", "#about");

const hero = screen.getByRole("region", { name: "跨越既有路徑，連結新的可能。" });
expect(within(hero).getByRole("img", { name: "KEIMA 桂馬數位" })).toBeVisible();
expect(within(hero).getByRole("heading", { name: "跨越既有路徑，連結新的可能。" })).toBeVisible();
expect(within(hero).getByText("Beyond the expected path.")).toBeVisible();
```

Add this Playwright test:

```ts
test("desktop hero creates a deliberate logo-to-cut composition", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/zh-TW/");
  const hero = page.locator("#home");
  const logo = hero.locator(".hero-logo");
  const cut = hero.locator(".hero-cut");
  const [heroBox, logoBox, cutBox] = await Promise.all([
    hero.boundingBox(),
    logo.boundingBox(),
    cut.boundingBox(),
  ]);
  expect(heroBox).not.toBeNull();
  expect(logoBox).not.toBeNull();
  expect(cutBox).not.toBeNull();
  expect(logoBox!.width).toBeGreaterThan(heroBox!.width * 0.35);
  expect(logoBox!.x + logoBox!.width).toBeLessThan(cutBox!.x + cutBox!.width * 0.6);
  expect(Math.abs(cutBox!.y - heroBox!.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(cutBox!.y + cutBox!.height - (heroBox!.y + heroBox!.height))).toBeLessThanOrEqual(1);
});
```

- [ ] **Step 2: Verify the new layout test fails**

Run:

```bash
npm run build
npx playwright test tests/e2e/site.spec.ts --grep "logo-to-cut"
```

Expected: FAIL on at least one composition ratio before the CSS rewrite.

- [ ] **Step 3: Add editorial wrappers without changing content**

In Navigation, wrap the primary nav with a rail label:

```tsx
<div className="header-rail" aria-hidden="true"><span>KEIMA / 2026</span></div>
```

In Hero, preserve the image and heading and add these decorative elements:

```tsx
<div className="hero-path" aria-hidden="true">
  <span className="hero-path-node" />
</div>
<p className="hero-section-label" aria-hidden="true">00 / KEIMA</p>
```

- [ ] **Step 4: Implement the Hero composition**

Use a full-width, minimum-viewport-height Hero; position the logo and statement within the safe left grid; align `.hero-cut` to both Hero edges; cap the subtitle measure at `22ch`; and use the icon-only Header logo below 768px. Ensure `.hero-supporting` remains a secondary line, not a competing headline.

- [ ] **Step 5: Run focused and full checks, then commit**

Run:

```bash
npm test -- src/components/__tests__/navigation.test.tsx src/components/__tests__/content-sections.test.tsx
npm run build
npx playwright test tests/e2e/site.spec.ts --grep "hero|navigation|language switching"
```

Expected: PASS in Chromium, WebKit, and mobile WebKit.

Commit:

```bash
git add src/components/navigation.tsx src/components/hero.tsx src/components/__tests__/navigation.test.tsx tests/e2e/site.spec.ts src/app/styles/layout.css src/app/styles/sections.css src/app/styles/responsive.css
git commit -m "Recompose the editorial header and hero"
```

---

### Task 4: Differentiate About and Approach through editorial rhythm

**Files:**
- Modify: `src/components/about.tsx`
- Modify: `src/components/approach.tsx`
- Modify: `src/components/motion/reveal.tsx`
- Modify: `src/components/motion/__tests__/reveal.test.tsx`
- Modify: `src/components/__tests__/content-sections.test.tsx`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/app/styles/sections.css`
- Modify: `src/app/styles/responsive.css`

- [ ] **Step 1: Add failing semantic and layout tests**

Assert About uses `.positioning-statement` plus `.positioning-copy`, and Approach uses a single ordered `.approach-path` with three `.approach-node` elements. Add a desktop Playwright assertion that About has a two-column editorial split while Approach rows span the reading grid.

```ts
await expect(page.locator("#about .positioning-statement")).toBeVisible();
await expect(page.locator("#approach .approach-node")).toHaveCount(3);
const aboutDisplay = await page.locator("#about .positioning-display").boundingBox();
const aboutCopy = await page.locator("#about .positioning-copy").boundingBox();
expect(aboutDisplay!.x).toBeLessThan(aboutCopy!.x);
```

- [ ] **Step 2: Verify the tests fail**

Run:

```bash
npm test -- src/components/__tests__/content-sections.test.tsx
```

Expected: FAIL because `.positioning-statement`, `.approach-path`, and `.approach-node` do not exist.

- [ ] **Step 3: Extend Reveal with the two approved variants**

Add the `variant` property before using it in the sections:

```tsx
type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "clip" | "rise";
};
```

Set `data-reveal-variant={variant}` on the wrapper. Keep `initial={false}` and leave content visible until IntersectionObserver arms the animation. Use clip-path for `clip`; use opacity and a maximum 32px Y offset for `rise`; remove the existing 10px blur. Add this unit assertion:

```tsx
render(<Reveal variant="clip">Editorial heading</Reveal>);
expect(screen.getByText("Editorial heading").closest(".reveal")).toHaveAttribute(
  "data-reveal-variant",
  "clip",
);
```

- [ ] **Step 4: Implement About’s editorial split**

Wrap the existing display and copy as:

```tsx
<div className="positioning-statement">
  <Reveal variant="clip">
    <h2 id="about-title" className="positioning-display">{about.display}</h2>
  </Reveal>
</div>
<div className="positioning-copy">
  <p>{about.intro}</p>
  <p className="positioning-belief">{about.belief}</p>
</div>
```

- [ ] **Step 5: Implement Approach’s stepped path**

Add a single decorative path before the list and mark every row as a path node:

```tsx
<div className="approach-path" aria-hidden="true"><span /></div>
<ol className="approach-list">
  {approach.items.map((item, index) => (
    <li key={item.id} className="approach-row approach-node" data-step={item.index}>
      <Reveal variant="rise" delay={index * 0.06}>
        <span className="row-index" aria-hidden="true">{item.index}</span>
        <h3>{item.title}</h3>
        <p className="row-label">{item.label}</p>
        <p className="row-description">{item.description}</p>
      </Reveal>
    </li>
  ))}
</ol>
```

The desktop layout must read as a sequence rather than a card grid. On mobile, retain the step order and move the path to the left edge of the text.

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm test -- src/components/__tests__/content-sections.test.tsx src/components/motion/__tests__/reveal.test.tsx
npm run build
npx playwright test tests/e2e/site.spec.ts --grep "positioning|approach"
```

Expected: PASS.

Commit:

```bash
git add src/components/about.tsx src/components/approach.tsx src/components/motion/reveal.tsx src/components/motion/__tests__/reveal.test.tsx src/components/__tests__/content-sections.test.tsx tests/e2e/site.spec.ts src/app/styles/sections.css src/app/styles/responsive.css
git commit -m "Create distinct positioning and approach rhythms"
```

---

### Task 5: Turn the real projects into distinct editorial features

**Files:**
- Create: `src/components/project-art.tsx`
- Create: `src/components/__tests__/project-art.test.tsx`
- Modify: `src/content/site-content.ts`
- Modify: `src/components/project-list.tsx`
- Modify: `src/components/__tests__/content-sections.test.tsx`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/app/styles/sections.css`
- Modify: `src/app/styles/motion.css`
- Modify: `src/app/styles/responsive.css`

- [ ] **Step 1: Write failing tests for three deterministic art variants**

```tsx
import { render } from "@testing-library/react";
import { ProjectArt } from "@/components/project-art";

it.each(["jobsgame", "indie-guider", "gamecf"] as const)(
  "renders %s as decorative branded art",
  (project) => {
    const { container } = render(<ProjectArt project={project} />);
    const art = container.querySelector(`[data-project-art="${project}"]`);
    expect(art).toHaveAttribute("aria-hidden", "true");
    expect(art?.querySelectorAll("span").length).toBeGreaterThanOrEqual(2);
  },
);
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
npm test -- src/components/__tests__/project-art.test.tsx
```

Expected: FAIL because `ProjectArt` does not exist.

- [ ] **Step 3: Lock the real-project ID type and implement `ProjectArt`**

In `site-content.ts`, add:

```ts
export type ProjectId = "jobsgame" | "indie-guider" | "gamecf";
```

Change `ProjectContent.id` from `string` to `ProjectId`, then implement:

```tsx
import type { ProjectId } from "@/content/site-content";

type ProjectArtProps = { project: ProjectId };

export function ProjectArt({ project }: ProjectArtProps) {
  return (
    <div className={`project-art project-art--${project}`} data-project-art={project} aria-hidden="true">
      <span className="project-art-plane" />
      <span className="project-art-orbit" />
      <span className="project-art-node" />
    </div>
  );
}
```

- [ ] **Step 4: Integrate the art and alternating layout**

Replace the existing two generic media shapes with `<ProjectArt project={project.id} />`. Add `data-project-position={index % 2 === 0 ? "leading" : "trailing"}` to each card. Use `index` only to alternate composition; keep URLs, titles, labels, descriptions, and all three project IDs unchanged.

- [ ] **Step 5: Add layout assertions**

Desktop: each project occupies a large editorial row, alternating media and copy; project art differs by CSS geometry. Tablet: one or two columns only when copy remains readable. Mobile: single column with media ratio between 1.45 and 1.8. Assert exactly three cards and the current HTTPS URLs.

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm test -- src/components/__tests__/project-art.test.tsx src/components/__tests__/content-sections.test.tsx
npm run build
npx playwright test tests/e2e/site.spec.ts --grep "project"
```

Expected: PASS.

Commit:

```bash
git add src/content/site-content.ts src/components/project-art.tsx src/components/project-list.tsx src/components/__tests__/project-art.test.tsx src/components/__tests__/content-sections.test.tsx tests/e2e/site.spec.ts src/app/styles/sections.css src/app/styles/motion.css src/app/styles/responsive.css
git commit -m "Elevate real projects into editorial features"
```

---

### Task 6: Finish Profile, Contact, and Footer compositions

**Files:**
- Modify: `src/components/profile.tsx`
- Modify: `src/components/contact.tsx`
- Modify: `src/components/footer.tsx`
- Modify: `src/components/__tests__/content-sections.test.tsx`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/app/styles/layout.css`
- Modify: `src/app/styles/sections.css`
- Modify: `src/app/styles/motion.css`
- Modify: `src/app/styles/responsive.css`

- [ ] **Step 1: Add failing composition assertions**

Add Playwright checks that at 1440px the portrait is left of the Profile copy, role and name occupy separate lines, the CTA letter spacing is greater than `-1.5px`, the Footer height is below 280px, and the Footer logo width is at least 170px.

```ts
const portrait = await page.locator(".profile-portrait").boundingBox();
const profileCard = await page.locator(".profile-card").boundingBox();
expect(portrait!.x).toBeLessThan(profileCard!.x);
expect(Math.abs(portrait!.y - profileCard!.y)).toBeLessThan(140);

const footerMetrics = await page.locator(".site-footer").evaluate((footer) => ({
  height: footer.getBoundingClientRect().height,
  logoWidth: footer.querySelector("img")!.getBoundingClientRect().width,
}));
expect(footerMetrics.height).toBeLessThan(280);
expect(footerMetrics.logoWidth).toBeGreaterThanOrEqual(170);
```

- [ ] **Step 2: Verify the layout checks fail before styling**

Run:

```bash
npm run build
npx playwright test tests/e2e/site.spec.ts --grep "Profile|Footer|CTA"
```

Expected: FAIL on at least the Profile portrait and new Footer limits.

- [ ] **Step 3: Complete Profile**

Style `.profile` as a desktop two-column composition with the geometric portrait on the left and role/name/fields/bio on the right. Keep `.profile-role` and `.profile-name` block-level and cap biography measure at `62ch`. On mobile, show the geometric portrait first with a landscape-safe height and then the text.

- [ ] **Step 4: Make Contact typography resilient**

Wrap CTA text and Email separately:

```tsx
<a href={`mailto:${email}`} aria-label={`${contact.cta} ${email}`}>
  <span className="contact-cta-label">{contact.cta}</span>
  <span className="contact-email-address">{email}</span>
</a>
```

Give the CTA a controlled max width, `text-wrap: balance`, non-negative word spacing, and a minimum of `0.01em` letter spacing at mobile widths.

- [ ] **Step 5: Compact the Footer**

Use a three-area desktop grid—brand, navigation, copyright—with the copyright row spanning full width only when needed. Keep all localized navigation labels from `content.nav`; do not add social or legal columns. On mobile, reduce to brand, two-column navigation, and copyright.

- [ ] **Step 6: Verify and commit**

Run:

```bash
npm test -- src/components/__tests__/content-sections.test.tsx
npm run build
npx playwright test tests/e2e/site.spec.ts --grep "profile|contact|footer|business email"
```

Expected: PASS.

Commit:

```bash
git add src/components/profile.tsx src/components/contact.tsx src/components/footer.tsx src/components/__tests__/content-sections.test.tsx tests/e2e/site.spec.ts src/app/styles/layout.css src/app/styles/sections.css src/app/styles/motion.css src/app/styles/responsive.css
git commit -m "Refine profile contact and footer composition"
```

---

### Task 7: Add the restrained motion system

**Files:**
- Create: `src/components/motion/route-progress.tsx`
- Create: `src/components/motion/__tests__/route-progress.test.tsx`
- Modify: `src/components/site-shell.tsx`
- Modify: `src/app/styles/motion.css`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write a failing test for the route-progress fallback**

```tsx
render(<RouteProgress />);
expect(screen.getByTestId("route-progress")).toHaveAttribute("aria-hidden", "true");
expect(screen.getByTestId("route-progress")).toHaveAttribute(
  "data-reduced-motion",
  expect.any(String),
);
```

- [ ] **Step 2: Run focused tests and verify they fail**

Run:

```bash
npm test -- src/components/motion/__tests__/route-progress.test.tsx
```

Expected: FAIL because `RouteProgress` does not exist.

- [ ] **Step 3: Implement RouteProgress**

```tsx
"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useKeimaReducedMotion } from "@/components/motion/use-keima-reduced-motion";

export function RouteProgress() {
  const reducedMotion = useKeimaReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.35 });

  return (
    <div
      className="route-progress"
      data-testid="route-progress"
      data-reduced-motion={String(reducedMotion)}
      aria-hidden="true"
    >
      <motion.span style={{ scaleY: reducedMotion ? 1 : scaleY }} />
    </div>
  );
}
```

Mount `<RouteProgress />` once after the skip link in `SiteShell`.

- [ ] **Step 4: Add reduced-motion and no-console e2e checks**

Verify that all content remains visible under `reducedMotion: "reduce"`, the route is static, and no console errors occur during a full-page scroll.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm test -- src/components/motion
npm run build
npx playwright test tests/e2e/site.spec.ts --grep "reduced motion|console|route"
```

Expected: PASS.

Commit:

```bash
git add src/components/motion/route-progress.tsx src/components/motion/__tests__/route-progress.test.tsx src/components/site-shell.tsx src/app/styles/motion.css tests/e2e/site.spec.ts
git commit -m "Add restrained route and reveal motion"
```

---

### Task 8: Cross-size award-quality audit and final correction loop

**Files:**
- Modify: `src/app/styles/base.css`
- Modify: `src/app/styles/layout.css`
- Modify: `src/app/styles/sections.css`
- Modify: `src/app/styles/motion.css`
- Modify: `src/app/styles/responsive.css`
- Modify: `src/components/navigation.tsx`
- Modify: `src/components/hero.tsx`
- Modify: `src/components/about.tsx`
- Modify: `src/components/approach.tsx`
- Modify: `src/components/project-list.tsx`
- Modify: `src/components/profile.tsx`
- Modify: `src/components/contact.tsx`
- Modify: `src/components/footer.tsx`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Run the complete automated quality gate**

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Expected: all commands PASS with zero console errors and no failed browser project.

- [ ] **Step 2: Capture the visual matrix**

Serve the export and inspect both locales at 1920×1080, 1440×900, 1024×900, 768×1024, 430×932, 390×844, and 375×812. Capture full-page and key-section screenshots for Hero, About/Approach transition, all three projects, Profile, Contact, and Footer.

- [ ] **Step 3: Apply the five-part review rubric**

For every screenshot, record and fix any issue under:

1. Concept — every distinctive shape or motion supports crossing paths.
2. Craft — no accidental wrapping, weak alignment, inconsistent radius, or arbitrary spacing.
3. Story — About, Approach, Projects, Profile, and Contact each have a distinct role and composition.
4. Experience — links, focus, navigation, locale switching, reduced-motion, and mobile reading order work.
5. Execution — no overflow, asset 404, build warning that affects output, hydration error, or console error.

Repeat Steps 1–3 until no high-priority issue remains. Add a regression assertion to `tests/e2e/site.spec.ts` for every layout defect that can be measured reliably.

- [ ] **Step 4: Check content invariants directly**

Run:

```bash
rg -n "CREATOR ERP|CONSULTING|DIGITAL|Not every good move is a straight line|社群資訊待提供|法律資訊待提供" src
```

Expected: no forbidden user-facing content. Internal test descriptions are allowed only when they assert absence.

- [ ] **Step 5: Commit final corrections**

```bash
git add src tests/e2e/site.spec.ts
git commit -m "Polish Editorial Kinetic experience across viewports"
```

- [ ] **Step 6: Present the local build before deployment**

Open the verified production export at `/zh-TW/` and `/en/`. Report test results, remaining non-blocking limitations, and the exact commits. Do not push or alter GitHub Pages until the user approves the local result.
