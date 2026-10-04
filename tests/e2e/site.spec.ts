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
  const letterSpacing = await emailLink.locator(".contact-cta-label").evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).letterSpacing),
  );
  expect(letterSpacing).toBeGreaterThan(-2);
});

test("section numbering remains continuous after the removed philosophy section", async ({ page }) => {
  await page.goto("/zh-TW/");
  await expect(page.locator("#profile .section-index-value")).toHaveText("04");
  await expect(page.locator("#contact .section-index-value")).toHaveText("05");
  await expect(page.getByText("CREATOR ERP", { exact: true })).toHaveCount(0);
  await expect(page.getByText("CONSULTING", { exact: true })).toHaveCount(0);
  await expect(page.locator("#philosophy")).toHaveCount(0);
});

test("footer ends with the approved full-width copyright row", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/zh-TW/");

  const footer = page.locator(".site-footer");
  const brand = footer.locator(".footer-brand");
  const navigation = footer.locator(".footer-navigation");
  const copyright = footer.locator(".footer-copyright");

  await footer.scrollIntoViewIfNeeded();
  await expect(copyright).toHaveText(
    "Copyright © 2026 桂馬數位股份有限公司 All Rights Reserved.",
  );
  await expect(footer.getByText("社群資訊待提供")).toHaveCount(0);
  await expect(footer.getByText("版權資訊待提供")).toHaveCount(0);
  await expect(footer.getByText("法律資訊待提供")).toHaveCount(0);

  const brandBox = await brand.boundingBox();
  const navigationBox = await navigation.boundingBox();
  const copyrightBox = await copyright.boundingBox();

  expect(brandBox).not.toBeNull();
  expect(navigationBox).not.toBeNull();
  expect(copyrightBox).not.toBeNull();
  expect(copyrightBox!.y).toBeGreaterThan(brandBox!.y + brandBox!.height);
  expect(copyrightBox!.y).toBeGreaterThan(navigationBox!.y + navigationBox!.height);
  expect(copyrightBox!.width).toBeGreaterThan(1000);
});

test("profile contact and footer keep the approved editorial proportions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/zh-TW/");

  const portrait = await page.locator(".profile-portrait").boundingBox();
  const profileCard = await page.locator(".profile-card").boundingBox();
  const role = await page.locator(".profile-role").boundingBox();
  const name = await page.locator(".profile-name").boundingBox();
  const ctaSpacing = await page.locator(".contact-cta-label").evaluate((node) =>
    Number.parseFloat(getComputedStyle(node).letterSpacing),
  );
  const footerMetrics = await page.locator(".site-footer").evaluate((footer) => ({
    height: footer.getBoundingClientRect().height,
    logoWidth: footer.querySelector("img")!.getBoundingClientRect().width,
  }));

  expect(portrait).not.toBeNull();
  expect(profileCard).not.toBeNull();
  expect(role).not.toBeNull();
  expect(name).not.toBeNull();
  expect(portrait!.x).toBeLessThan(profileCard!.x);
  expect(Math.abs(portrait!.y - profileCard!.y)).toBeLessThan(140);
  expect(name!.y).toBeGreaterThan(role!.y + role!.height);
  expect(ctaSpacing).toBeGreaterThan(-1.5);
  expect(footerMetrics.height).toBeLessThan(280);
  expect(footerMetrics.logoWidth).toBeGreaterThanOrEqual(170);
});

test("mobile uses the standalone color symbol", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh-TW/");

  await expect(page.locator("header source")).toHaveAttribute(
    "srcset",
    "/brand/keima-icon-color.svg",
  );
});

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
  await expect(page.locator(".reveal[data-reduced-motion='true']").first()).toBeVisible();
  await expect(page.getByTestId("route-progress")).toBeHidden();
});

test("mobile project cards use a compact single-column image layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh-TW/");

  const cards = page.locator(".project-card");
  const firstCard = cards.first();
  const firstMedia = firstCard.locator(".project-media-frame");

  await expect(cards).toHaveCount(2);
  await expect(firstMedia).toBeVisible();

  const layout = await page.evaluate(() => {
    const list = document.querySelector<HTMLElement>(".project-list")!;
    const media = document.querySelector<HTMLElement>(".project-media-frame")!;
    const mediaBox = media.getBoundingClientRect();
    return {
      columns: getComputedStyle(list).gridTemplateColumns.split(" ").length,
      mediaRatio: mediaBox.width / mediaBox.height,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });

  expect(layout.columns).toBe(1);
  expect(Math.abs(layout.mediaRatio - 16 / 9)).toBeLessThan(0.03);
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

test("desktop uses compact horizontal project rows distinct from the approach system", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/zh-TW/");

  const layout = await page.evaluate(() => {
    const projectList = document.querySelector<HTMLElement>(".project-list")!;
    const cards = [...document.querySelectorAll<HTMLElement>(".project-card")];
    const media = document
      .querySelector<HTMLElement>(".project-media-frame")!
      .getBoundingClientRect();
    const firstRow = document.querySelector<HTMLElement>(".project-card-link")!;
    return {
      columns: getComputedStyle(projectList).gridTemplateColumns.split(" ").length,
      rowColumns: getComputedStyle(firstRow).gridTemplateColumns.split(" ").length,
      cardTopPositions: cards.map((card) => Math.round(card.getBoundingClientRect().top)),
      mediaRatio: media.width / media.height,
      approachIsRows: getComputedStyle(
        document.querySelector<HTMLElement>(".approach-row .reveal-content")!,
      ).display,
    };
  });

  expect(layout.columns).toBe(1);
  expect(layout.rowColumns).toBe(2);
  expect(new Set(layout.cardTopPositions).size).toBe(2);
  expect(Math.abs(layout.mediaRatio - 16 / 9)).toBeLessThan(0.03);
  expect(layout.approachIsRows).toBe("grid");
});

test("tablet keeps project features in a readable single-column sequence", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 1000 });
  await page.goto("/zh-TW/");

  const columns = await page
    .locator(".project-list")
    .evaluate((list) => getComputedStyle(list).gridTemplateColumns.split(" ").length);

  expect(columns).toBe(1);
});

test("tablet keeps positioning and profile as balanced two-column compositions", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 1000 });
  await page.goto("/zh-TW/");

  const boxes = await page.evaluate(() => {
    const box = (selector: string) =>
      document.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
    const aboutHeading = box(".positioning .section-heading-block");
    const aboutCopy = box(".positioning-copy");
    const profilePortrait = box(".profile-portrait");
    const profileCard = box(".profile-card");

    return {
      about: [aboutHeading.x, aboutCopy.x, Math.abs(aboutHeading.y - aboutCopy.y)],
      profile: [profilePortrait.x, profileCard.x, Math.abs(profilePortrait.y - profileCard.y)],
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
