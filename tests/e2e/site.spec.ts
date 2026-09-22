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
    for (const id of ["home", "about", "approach", "in-motion", "profile", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    await expect(page.locator("#philosophy")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "HOW WE MOVE" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "CURRENTLY IN MOTION" })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("business email is presented as a ready mail link", async ({ page }) => {
  await page.goto("/zh-TW/");

  const emailLink = page.locator("#contact a[href='mailto:service@pa023315.com']");
  await expect(emailLink).toContainText("service@pa023315.com");
  const letterSpacing = await emailLink.evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).letterSpacing),
  );
  expect(letterSpacing).toBeGreaterThan(-2);
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

test("desktop uses the restrained consultancy type hierarchy", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/zh-TW/");

  const sizes = await page.evaluate(() => {
    const px = (selector: string) =>
      Number.parseFloat(getComputedStyle(document.querySelector<HTMLElement>(selector)!).fontSize);

    return {
      positioning: px(".positioning-display"),
      profileName: px(".profile-card h3"),
      contact: px(".contact-title"),
      body: px(".positioning-copy p"),
    };
  });

  expect(sizes.positioning).toBeLessThanOrEqual(96);
  expect(sizes.profileName).toBeLessThanOrEqual(72);
  expect(sizes.contact).toBeLessThanOrEqual(104);
  expect(sizes.body).toBeGreaterThanOrEqual(17);
});

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
