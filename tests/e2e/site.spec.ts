import { expect, test } from "@playwright/test";

const locales = ["zh-TW", "en"] as const;

for (const locale of locales) {
  test(`${locale} renders the complete one-page shell`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(`/${locale}/`);

    await expect(page.locator("header img")).toBeVisible();
    for (const id of ["home", "about", "approach", "in-motion", "philosophy", "profile", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "HOW WE MOVE" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "CURRENTLY IN MOTION" })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("business email is presented as a ready mail link", async ({ page }) => {
  await page.goto("/zh-TW/");

  await expect(page.locator("#contact a[href='mailto:service@pa023315.com']")).toContainText(
    "service@pa023315.com",
  );
});

test("mobile uses the standalone color symbol", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh-TW/");

  await expect(page.locator("header source")).toHaveAttribute(
    "srcset",
    "/brand/keima-icon-color.svg",
  );
});

test("desktop hero cut aligns with the hero top and bottom edges", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/zh-TW/");

  const heroBox = await page.locator("#home").boundingBox();
  const cutBox = await page.locator(".hero-cut").boundingBox();

  expect(heroBox).not.toBeNull();
  expect(cutBox).not.toBeNull();
  expect(Math.abs(cutBox!.y - heroBox!.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(cutBox!.y + cutBox!.height - (heroBox!.y + heroBox!.height))).toBeLessThanOrEqual(
    1,
  );
});

test("language switching persists the selected locale and current section", async ({ page }) => {
  await page.goto("/zh-TW/#home");

  await page.getByRole("link", { name: "EN", exact: true }).click();

  await expect(page).toHaveURL(/\/en\/#home$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(await page.evaluate(() => localStorage.getItem("keima-locale"))).toBe("en");
});

test("section navigation exposes the active location", async ({ page }) => {
  await page.goto("/zh-TW/");

  await page.locator("#in-motion").scrollIntoViewIfNeeded();

  await expect(page.locator("header nav a[href='#in-motion']")).toHaveAttribute(
    "aria-current",
    "location",
  );
});

for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 375]) {
  test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 430 ? 844 : 900 });

    for (const locale of locales) {
      await page.goto(`/${locale}/`);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    }
  });
}

test("reduced motion keeps content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh-TW/");

  await expect(page.locator("#contact")).toBeVisible();
  await expect(page.locator("[data-reduced-motion='true']").first()).toBeVisible();
});

test("mobile project rows stay compact enough for a paced long-scroll section", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh-TW/");

  const rowHeights = await page.locator(".project-row").evaluateAll((rows) =>
    rows.map((row) => Math.round(row.getBoundingClientRect().height)),
  );
  const sectionHeight = await page
    .locator("#in-motion")
    .evaluate((section) => Math.round(section.getBoundingClientRect().height));

  expect(rowHeights).toHaveLength(3);
  expect(Math.max(...rowHeights)).toBeLessThanOrEqual(260);
  expect(sectionHeight).toBeLessThanOrEqual(1500);
});

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

test("desktop approach and project rows share a readable grid system", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/zh-TW/");

  const styles = await page.evaluate(() => {
    const read = (selector: string) =>
      getComputedStyle(document.querySelector<HTMLElement>(selector)!);
    const x = (selector: string) =>
      document.querySelector<HTMLElement>(selector)!.getBoundingClientRect().x;
    const approach = read(".approach-row .reveal-content");
    const description = read(".row-description");

    return {
      approachPositions: [x(".approach-row h3"), x(".approach-row .row-label"), x(".row-description")],
      projectPositions: [x(".project-title"), x(".project-label"), x(".project-description")],
      approachPadding: Number.parseFloat(approach.paddingTop),
      descriptionSize: Number.parseFloat(description.fontSize),
      descriptionLineHeight: Number.parseFloat(description.lineHeight),
    };
  });

  styles.approachPositions.forEach((position, index) => {
    expect(Math.abs(position - styles.projectPositions[index])).toBeLessThanOrEqual(1);
  });
  expect(styles.approachPadding).toBeLessThanOrEqual(30);
  expect(styles.descriptionSize).toBeGreaterThanOrEqual(16);
  expect(styles.descriptionLineHeight / styles.descriptionSize).toBeGreaterThanOrEqual(1.65);
});

test("tablet keeps positioning and profile as balanced two-column compositions", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 1000 });
  await page.goto("/zh-TW/");

  const boxes = await page.evaluate(() => {
    const box = (selector: string) =>
      document.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
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

test("mobile navigation and body typography remain legible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh-TW/");

  const metrics = await page.evaluate(() => {
    const style = (selector: string) =>
      getComputedStyle(document.querySelector<HTMLElement>(selector)!);

    return {
      navSize: Number.parseFloat(style(".primary-navigation a").fontSize),
      navHeight: document
        .querySelector<HTMLElement>(".primary-navigation a")!
        .getBoundingClientRect().height,
      bodySize: Number.parseFloat(style(".profile-bio p").fontSize),
      positioningSize: Number.parseFloat(style(".positioning-display").fontSize),
    };
  });

  expect(metrics.navSize).toBeGreaterThanOrEqual(10);
  expect(metrics.navHeight).toBeGreaterThanOrEqual(44);
  expect(metrics.bodySize).toBeGreaterThanOrEqual(16);
  expect(metrics.positioningSize).toBeLessThanOrEqual(56);
});
