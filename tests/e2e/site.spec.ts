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
    for (const id of ["home", "about", "services", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test("pending email is presented as text instead of an invalid mail link", async ({ page }) => {
  await page.goto("/zh-TW/");

  await expect(page.locator("#contact a[href^='mailto:']")).toHaveCount(0);
});

test("mobile uses the standalone color symbol", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh-TW/");

  await expect(page.locator("header source")).toHaveAttribute(
    "srcset",
    "/brand/keima-icon-color.svg",
  );
});

test("language switching persists the selected locale and current section", async ({ page }) => {
  await page.goto("/zh-TW/#home");

  await page.getByRole("link", { name: "EN" }).click();

  await expect(page).toHaveURL(/\/en\/#home$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(await page.evaluate(() => localStorage.getItem("keima-locale"))).toBe("en");
});

test("section navigation exposes the active location", async ({ page }) => {
  await page.goto("/zh-TW/");

  await page.locator("#services").scrollIntoViewIfNeeded();

  await expect(page.locator("header nav a[href='#services']")).toHaveAttribute(
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
