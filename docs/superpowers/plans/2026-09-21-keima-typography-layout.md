# KEIMA Typography and Layout Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing KEIMA one-page site into the approved restrained consultancy direction by correcting its bilingual type scale, hierarchy, spacing, grid alignment, and responsive composition.

**Architecture:** Keep the current React component and content architecture intact. Implement the visual system primarily in `src/app/globals.css`, using Playwright geometry and computed-style assertions as executable design constraints. Validate Traditional Chinese and English at desktop, tablet, and mobile sizes without altering copy, section order, assets, or interaction behavior.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Playwright, Vitest

---

## File map

- Modify: `tests/e2e/site.spec.ts` — add measurable typography, tablet layout, and mobile legibility constraints.
- Modify: `src/app/globals.css` — define the restrained type scale, spacing rhythm, section grids, and responsive overrides.
- No component or content files should change unless a selector cannot express the approved layout without changing semantic markup.

### Task 1: Encode the restrained desktop type hierarchy

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing desktop typography test**

Append this test to `tests/e2e/site.spec.ts`:

```ts
test("desktop uses the restrained consultancy type hierarchy", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/zh-TW/");

  const sizes = await page.evaluate(() => {
    const px = (selector: string) =>
      Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>(selector)!).fontSize);
    return {
      positioning: px(".positioning-display"),
      philosophy: px(".philosophy-display"),
      profileName: px(".profile-card h3"),
      contact: px(".contact-title"),
      body: px(".positioning-copy p"),
    };
  });

  expect(sizes.positioning).toBeLessThanOrEqual(96);
  expect(sizes.philosophy).toBeLessThanOrEqual(100);
  expect(sizes.profileName).toBeLessThanOrEqual(72);
  expect(sizes.contact).toBeLessThanOrEqual(104);
  expect(sizes.body).toBeGreaterThanOrEqual(17);
});
```

- [ ] **Step 2: Run the test and confirm the intended failure**

Run: `npx playwright test tests/e2e/site.spec.ts -g "restrained consultancy type hierarchy"`

Expected: FAIL because at least the current positioning, philosophy, profile-name, or contact display size exceeds the approved cap.

- [ ] **Step 3: Add type tokens and replace the oversized display rules**

Add these variables to `:root` in `src/app/globals.css`:

```css
--type-display-xl: clamp(3.75rem, 6.4vw, 7rem);
--type-display-lg: clamp(3.25rem, 5.6vw, 6rem);
--type-display-md: clamp(2.6rem, 4.6vw, 4.5rem);
--type-heading: clamp(1.9rem, 2.7vw, 3.25rem);
--type-body-lg: clamp(1.0625rem, 1.2vw, 1.25rem);
--type-body: clamp(1rem, 1.05vw, 1.125rem);
--measure-copy: 34rem;
```

Update the relevant selectors:

```css
.positioning-display {
  max-width: 12ch;
  font-size: var(--type-display-lg);
  font-weight: 620;
  letter-spacing: -0.055em;
  line-height: 0.92;
}

.positioning-copy p {
  max-width: var(--measure-copy);
  color: var(--keima-ink);
  font-size: var(--type-body-lg);
  font-weight: 450;
  line-height: 1.78;
}

.philosophy-display {
  max-width: 12ch;
  font-size: var(--type-display-lg);
  font-weight: 620;
  letter-spacing: -0.055em;
  line-height: 0.92;
}

.profile-heading h2 {
  max-width: 12ch;
  font-size: var(--type-heading);
  font-weight: 620;
  letter-spacing: -0.04em;
  line-height: 1;
}

.profile-card h3 {
  font-size: var(--type-display-md);
  font-weight: 620;
  letter-spacing: -0.045em;
  line-height: 0.95;
}

.contact-title {
  max-width: 12ch;
  font-size: var(--type-display-xl);
  font-weight: 620;
  letter-spacing: -0.055em;
  line-height: 0.9;
}
```

- [ ] **Step 4: Run the desktop typography test**

Run: `npx playwright test tests/e2e/site.spec.ts -g "restrained consultancy type hierarchy"`

Expected: PASS.

- [ ] **Step 5: Commit the desktop hierarchy**

```bash
git add tests/e2e/site.spec.ts src/app/globals.css
git commit -m "style: restrain desktop typography hierarchy"
```

### Task 2: Align informational rows and improve reading contrast

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing row-system test**

Append:

```ts
test("desktop approach and project rows share a readable grid system", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/zh-TW/");

  const styles = await page.evaluate(() => {
    const read = (selector: string) => getComputedStyle(document.querySelector<HTMLElement>(selector)!);
    const approach = read(".approach-row .reveal-content");
    const project = read(".project-row-content");
    const description = read(".row-description");
    return {
      approachColumns: approach.gridTemplateColumns,
      projectColumns: project.gridTemplateColumns,
      approachPadding: Number.parseFloat(approach.paddingTop),
      descriptionSize: Number.parseFloat(description.fontSize),
      descriptionLineHeight: Number.parseFloat(description.lineHeight),
    };
  });

  expect(styles.approachColumns).toBe(styles.projectColumns);
  expect(styles.approachPadding).toBeLessThanOrEqual(30);
  expect(styles.descriptionSize).toBeGreaterThanOrEqual(16);
  expect(styles.descriptionLineHeight / styles.descriptionSize).toBeGreaterThanOrEqual(1.65);
});
```

- [ ] **Step 2: Run the test and confirm the intended failure**

Run: `npx playwright test tests/e2e/site.spec.ts -g "readable grid system"`

Expected: FAIL because the current row padding exceeds 30 px at 1440 px.

- [ ] **Step 3: Apply the shared restrained row system**

Replace the row typography and spacing with:

```css
.approach-row .reveal-content,
.project-row-content {
  grid-template-columns: minmax(2.75rem, 0.4fr) minmax(10rem, 1.7fr) minmax(9rem, 1.15fr) minmax(18rem, 2.5fr) auto;
  gap: clamp(0.75rem, 1.4vw, 1.75rem);
  align-items: baseline;
  padding: clamp(1.25rem, 1.9vw, 1.8rem) 0;
}

.approach-row h3,
.project-title {
  font-size: clamp(1.65rem, 2.6vw, 3rem);
  font-weight: 620;
  letter-spacing: -0.045em;
  line-height: 1;
}

.row-label,
.project-label {
  font-size: var(--type-body);
  font-weight: 700;
  letter-spacing: 0.015em;
}

.row-description,
.project-description {
  color: #57544d;
  font-size: var(--type-body);
  line-height: 1.7;
}
```

Also set section intros and profile biography to the shared reading scale:

```css
.section-intro,
.profile-bio p {
  font-size: var(--type-body);
  line-height: 1.78;
}
```

- [ ] **Step 4: Run the row-system test**

Run: `npx playwright test tests/e2e/site.spec.ts -g "readable grid system"`

Expected: PASS.

- [ ] **Step 5: Commit the shared row system**

```bash
git add tests/e2e/site.spec.ts src/app/globals.css
git commit -m "style: align service and project rows"
```

### Task 3: Preserve two-column relationships on tablet

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing tablet geometry test**

Append:

```ts
test("tablet keeps positioning and profile as balanced two-column compositions", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 1000 });
  await page.goto("/zh-TW/");

  const boxes = await page.evaluate(() => {
    const box = (selector: string) => document.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
    const aboutHeading = box(".positioning .section-heading-block");
    const aboutCopy = box(".positioning-copy");
    const profileHeading = box(".profile-heading");
    const profileCard = box(".profile-card");
    return {
      about: [aboutHeading.x, aboutCopy.x, Math.abs(aboutHeading.y - aboutCopy.y)],
      profile: [profileHeading.x, profileCard.x, Math.abs(profileHeading.y - profileCard.y)],
    };
  });

  expect(boxes.about[0]).toBeLessThan(boxes.about[1]);
  expect(boxes.profile[0]).toBeLessThan(boxes.profile[1]);
  expect(boxes.about[2]).toBeLessThanOrEqual(140);
  expect(boxes.profile[2]).toBeLessThanOrEqual(140);
});
```

- [ ] **Step 2: Run the test and confirm the intended failure**

Run: `npx playwright test tests/e2e/site.spec.ts -g "balanced two-column compositions"`

Expected: FAIL because the current `max-width: 1023px` rules force both pairs to span all six columns.

- [ ] **Step 3: Split tablet and mobile layout rules**

Within `@media (max-width: 1023px)`, keep the six-column grid but add:

```css
.positioning .section-heading-block,
.profile-heading {
  grid-column: 1 / 4;
}

.positioning-copy,
.profile-card {
  grid-column: 4 / -1;
  align-self: end;
}

.positioning-index,
.profile-index {
  grid-column: 1 / -1;
}
```

Within `@media (max-width: 767px)`, explicitly restore the single reading flow:

```css
.positioning .section-heading-block,
.positioning-copy,
.profile-heading,
.profile-card {
  grid-column: 1 / -1;
}

.positioning-copy,
.profile-card {
  margin-top: 0.5rem;
}
```

- [ ] **Step 4: Run tablet and overflow tests**

Run: `npx playwright test tests/e2e/site.spec.ts -g "balanced two-column compositions|horizontal overflow"`

Expected: PASS at all existing viewport widths.

- [ ] **Step 5: Commit tablet composition**

```bash
git add tests/e2e/site.spec.ts src/app/globals.css
git commit -m "style: balance tablet editorial grids"
```

### Task 4: Improve mobile navigation and typographic rhythm

**Files:**
- Modify: `tests/e2e/site.spec.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing mobile legibility test**

Append:

```ts
test("mobile navigation and body typography remain legible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh-TW/");

  const metrics = await page.evaluate(() => {
    const style = (selector: string) => getComputedStyle(document.querySelector<HTMLElement>(selector)!);
    return {
      navSize: Number.parseFloat(style(".primary-navigation a").fontSize),
      navHeight: document.querySelector<HTMLElement>(".primary-navigation a")!.getBoundingClientRect().height,
      bodySize: Number.parseFloat(style(".profile-bio p").fontSize),
      positioningSize: Number.parseFloat(style(".positioning-display").fontSize),
    };
  });

  expect(metrics.navSize).toBeGreaterThanOrEqual(10);
  expect(metrics.navHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.bodySize).toBeGreaterThanOrEqual(16);
  expect(metrics.positioningSize).toBeLessThanOrEqual(56);
});
```

- [ ] **Step 2: Run the test and confirm the intended failure**

Run: `npx playwright test tests/e2e/site.spec.ts -g "mobile navigation and body typography"`

Expected: FAIL because the current mobile navigation is `0.54rem` (8.64 px), and the current positioning display may exceed the 56 px cap.

- [ ] **Step 3: Apply the mobile scale and spacing overrides**

Inside `@media (max-width: 767px)` set:

```css
.primary-navigation a {
  min-height: 44px;
  font-size: 0.625rem;
  letter-spacing: 0.015em;
}

.positioning-display,
.philosophy-display {
  font-size: clamp(2.75rem, 13vw, 3.5rem);
  line-height: 0.95;
}

.approach-title,
.in-motion-title,
.profile-heading h2 {
  font-size: clamp(1.85rem, 8vw, 2.5rem);
  line-height: 1;
}

.profile-card h3 {
  font-size: clamp(2.5rem, 12vw, 3.5rem);
}

.contact-title {
  font-size: clamp(3rem, 14vw, 4rem);
  line-height: 0.92;
}

.section-intro,
.positioning-copy p,
.row-description,
.project-description,
.profile-bio p {
  font-size: 1rem;
}
```

- [ ] **Step 4: Run mobile and no-overflow tests**

Run: `npx playwright test tests/e2e/site.spec.ts -g "mobile navigation and body typography|mobile project rows|horizontal overflow"`

Expected: PASS.

- [ ] **Step 5: Commit mobile typography**

```bash
git add tests/e2e/site.spec.ts src/app/globals.css
git commit -m "style: improve mobile typography rhythm"
```

### Task 5: Verify the complete bilingual production build

**Files:**
- Verify: `src/app/globals.css`
- Verify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Run unit, type, lint, and build checks**

Run:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: all commands exit with code 0.

- [ ] **Step 2: Run the complete browser suite**

Run: `npx playwright test`

Expected: all tests pass for both locales and every configured project.

- [ ] **Step 3: Visually inspect representative breakpoints**

Inspect `/zh-TW/` and `/en/` at 1440×900, 900×1000, and 390×844. Confirm:

- display headings no longer dominate body copy;
- Chinese paragraphs have consistent density and contrast;
- About and Profile remain balanced at tablet width;
- row columns align on desktop and stack cleanly on mobile;
- contact email appears without clipping;
- no reveal animation overlaps or hides content.

- [ ] **Step 4: Confirm a clean worktree and record the final commit**

Run:

```bash
git status --short
git log -5 --oneline
```

Expected: no uncommitted files; the four typography commits appear at the top of `main`.
