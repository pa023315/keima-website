# KEIMA Corporate Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual, static-exported KEIMA corporate brand site with the approved Directional Editorial visual system, responsive layouts, accessible motion, and explicit content-pending states.

**Architecture:** Use Next.js App Router with statically generated `/zh-TW/` and `/en/` routes backed by one typed content model and one shared section component tree. Keep visual styling in focused CSS files, use Motion only through small reusable primitives, and verify behavior with Vitest, Testing Library, Playwright, lint, type-checking, and a production static export.

**Tech Stack:** Next.js, React, TypeScript, Modern CSS, Motion for React, Vitest, Testing Library, Playwright, ESLint

---

## File map

- `package.json` — scripts and dependencies.
- `next.config.ts` — static-export and image behavior.
- `tsconfig.json` — strict TypeScript configuration.
- `eslint.config.mjs` — Next.js lint configuration.
- `vitest.config.ts` — component and unit test configuration.
- `playwright.config.ts` — production-preview browser checks.
- `src/test/setup.ts` — DOM matcher setup.
- `src/app/(entry)/layout.tsx` — static root-entry document shell.
- `src/app/(entry)/page.tsx` — static root language entrance.
- `src/app/[locale]/page.tsx` — statically generated locale page.
- `src/app/[locale]/layout.tsx` — locale validation and locale-specific metadata.
- `src/app/globals.css` — reset, brand tokens, typography, grid, accessibility, and responsive rules.
- `src/app/sitemap.ts` — static bilingual sitemap.
- `src/app/robots.ts` — robots metadata.
- `src/content/site-content.ts` — typed bilingual content and intentional `pending` values.
- `src/lib/locales.ts` — locale types, validation, alternate-route helpers, and labels.
- `src/lib/site-metadata.ts` — locale-specific metadata factory.
- `src/lib/fonts.ts` — shared self-hosted Next.js font configuration.
- `src/hooks/use-active-section.ts` — IntersectionObserver-based current-section state.
- `src/components/language-entry.tsx` — saved-language redirect with visible no-JavaScript links.
- `src/components/site-shell.tsx` — shared one-page section composition.
- `src/components/navigation.tsx` — section navigation, active state, logo switching, and language switching.
- `src/components/hero.tsx` — opening brand composition.
- `src/components/about.tsx` — editorial profile and portrait pending state.
- `src/components/services.tsx` — sticky service index and mobile reading flow.
- `src/components/contact.tsx` — pending or live email ending state.
- `src/components/footer.tsx` — brand, navigation, and pending legal/social information.
- `src/components/motion/reveal.tsx` — viewport reveal with reduced-motion fallback.
- `src/components/motion/hero-motion.tsx` — bounded hero scroll progress.
- `src/components/motion/section-wipe.tsx` — Paper/Ink transition wrapper.
- `src/components/media-placeholder.tsx` — accessible branded missing-media state.
- `src/components/__tests__/*.test.tsx` — component behavior tests.
- `src/content/__tests__/site-content.test.ts` — content integrity tests.
- `src/lib/__tests__/*.test.ts` — locale and metadata tests.
- `tests/e2e/site.spec.ts` — bilingual, navigation, viewport, link, and console checks.
- `public/brand/*.svg` — exact copies of official KEIMA SVG assets.
- `public/favicon.svg` — exact official standalone symbol used as favicon.

## Task 1: Scaffold the static Next.js project and test harness

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/test/setup.ts`
- Create: `.gitignore`

- [ ] **Step 1: Initialize the package and install runtime dependencies**

Run these commands separately:

```bash
npm init -y
npm install next@latest react@latest react-dom@latest motion@latest
npm install -D typescript@latest @types/node@latest @types/react@latest @types/react-dom@latest eslint@latest eslint-config-next@latest vitest@latest @vitejs/plugin-react@latest jsdom@latest @testing-library/react@latest @testing-library/jest-dom@latest @testing-library/user-event@latest @playwright/test@latest
```

Expected: `package.json` and `package-lock.json` exist and npm reports no install failure.

- [ ] **Step 2: Define project scripts**

Set `package.json` scripts to:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "serve out -l 4173",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 3: Create the static-export configuration**

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 4: Configure lint and tests**

Create `eslint.config.mjs`:

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "coverage/**", ".superpowers/**", "tmp/**"]),
]);
```

Create `vitest.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: "http://127.0.0.1:4173", trace: "retain-on-failure" },
  webServer: {
    command: "npx serve out -l 4173",
    url: "http://127.0.0.1:4173/zh-TW/",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "desktop-webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
  ],
});
```

Add `serve` as a dev dependency because the Playwright configuration uses it:

```bash
npm install -D serve@latest
```

- [ ] **Step 5: Ignore generated and temporary files**

Create `.gitignore`:

```gitignore
node_modules/
.next/
out/
coverage/
playwright-report/
test-results/
.superpowers/
tmp/
.DS_Store
```

- [ ] **Step 6: Verify the harness and commit**

Run:

```bash
npm run typecheck
npm run lint
```

Expected: both commands exit successfully with no source files requiring fixes.

Commit:

```bash
git add package.json package-lock.json next.config.ts tsconfig.json next-env.d.ts eslint.config.mjs vitest.config.ts playwright.config.ts src/test/setup.ts .gitignore
git commit -m "chore: scaffold static KEIMA site"
```

## Task 2: Add exact brand assets and the typed bilingual content model

**Files:**
- Create: `public/brand/keima-lockup-color.svg`
- Create: `public/brand/keima-icon-color.svg`
- Create: `public/brand/keima-wordmark.svg`
- Create: `public/brand/keima-lockup.svg`
- Create: `public/brand/keima-icon.svg`
- Create: `public/favicon.svg`
- Create: `src/content/site-content.ts`
- Create: `src/content/__tests__/site-content.test.ts`

- [ ] **Step 1: Copy official SVG files without modifying their contents**

Run:

```bash
mkdir -p public/brand
cp "/Users/ian/Desktop/桌面/桂馬數位/0. 公司品牌/Keima_logo_最終交付包/01_SVG向量檔/彩色版/keima-final-lockup-color.svg" public/brand/keima-lockup-color.svg
cp "/Users/ian/Desktop/桌面/桂馬數位/0. 公司品牌/Keima_logo_最終交付包/01_SVG向量檔/彩色版/keima-final-icon-color.svg" public/brand/keima-icon-color.svg
cp "/Users/ian/Desktop/桌面/桂馬數位/0. 公司品牌/Keima_logo_最終交付包/01_SVG向量檔/單色版/keima-final-wordmark.svg" public/brand/keima-wordmark.svg
cp "/Users/ian/Desktop/桌面/桂馬數位/0. 公司品牌/Keima_logo_最終交付包/01_SVG向量檔/單色版/keima-final-lockup.svg" public/brand/keima-lockup.svg
cp "/Users/ian/Desktop/桌面/桂馬數位/0. 公司品牌/Keima_logo_最終交付包/01_SVG向量檔/單色版/keima-final-icon.svg" public/brand/keima-icon.svg
cp public/brand/keima-icon.svg public/favicon.svg
```

Expected: six output files exist and `shasum` for each brand file matches its source counterpart.

- [ ] **Step 2: Write the failing content-integrity test**

Create `src/content/__tests__/site-content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { siteContent } from "@/content/site-content";

describe("siteContent", () => {
  it("provides both approved locales", () => {
    expect(Object.keys(siteContent).sort()).toEqual(["en", "zh-TW"]);
  });

  it("provides the three approved service slots in each locale", () => {
    for (const locale of Object.values(siteContent)) {
      expect(locale.services).toHaveLength(3);
      expect(locale.services.map((service) => service.id)).toEqual([
        "service-01", "service-02", "service-03",
      ]);
      expect(locale.services.map((service) => service.index)).toEqual(["01", "02", "03"]);
    }
  });

  it("marks every unprovided business fact as pending", () => {
    for (const locale of Object.values(siteContent)) {
      expect(locale.hero.statement.status).toBe("pending");
      expect(locale.about.person.status).toBe("pending");
      expect(locale.about.portrait.status).toBe("pending");
      expect(locale.contact.email.status).toBe("pending");
      expect(locale.footer.copyright.status).toBe("pending");
      expect(locale.footer.legal.status).toBe("pending");
      for (const service of locale.services) {
        expect(service.status.status).toBe("pending");
        expect(service.name.status).toBe("pending");
        expect(service.summary.status).toBe("pending");
        expect(service.audience.status).toBe("pending");
        expect(service.url.status).toBe("pending");
        expect(service.image.status).toBe("pending");
      }
    }
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run:

```bash
npm test -- src/content/__tests__/site-content.test.ts
```

Expected: FAIL because `@/content/site-content` does not exist.

- [ ] **Step 4: Implement the typed content model**

Create `src/content/site-content.ts`:

```ts
export type ContentState<T> =
  | { status: "ready"; value: T }
  | { status: "pending"; label: string };

export type ContentLocale = "zh-TW" | "en";

export type ServiceContent = {
  id: string;
  index: string;
  status: ContentState<string>;
  name: ContentState<string>;
  summary: ContentState<string>;
  audience: ContentState<string>;
  url: ContentState<string>;
  image: ContentState<string>;
};

export type LocaleContent<L extends ContentLocale = ContentLocale> = {
  locale: L;
  nav: { home: string; about: string; services: string; contact: string };
  hero: { eyebrow: string; statement: ContentState<string>; scroll: string };
  about: { label: string; person: ContentState<string>; portrait: ContentState<string> };
  servicesLabel: string;
  services: ServiceContent[];
  contact: { label: string; email: ContentState<string> };
  footer: { copyright: ContentState<string>; legal: ContentState<string> };
};

const pending = (label: string): ContentState<string> => ({ status: "pending", label });

export const siteContent: { [L in ContentLocale]: LocaleContent<L> } = {
  "zh-TW": {
    locale: "zh-TW",
    nav: { home: "首頁", about: "介紹", services: "服務", contact: "聯繫" },
    hero: { eyebrow: "KEIMA／桂馬數位", statement: pending("品牌定位文案待提供"), scroll: "向下探索" },
    about: { label: "人物介紹", person: pending("人物資料待提供"), portrait: pending("人物照片待提供") },
    servicesLabel: "運作中服務",
    services: ["01", "02", "03"].map((index) => ({
      id: `service-${index}`,
      index,
      status: pending("目前狀態待提供"),
      name: pending("服務名稱待提供"),
      summary: pending("服務簡介待提供"),
      audience: pending("目標客群待提供"),
      url: pending("服務網址待提供"),
      image: pending("服務圖片待提供"),
    })),
    contact: { label: "商務聯繫", email: pending("商務 Email 待提供") },
    footer: { copyright: pending("版權資訊待提供"), legal: pending("法律資訊待提供") },
  },
  en: {
    locale: "en",
    nav: { home: "Home", about: "About", services: "Services", contact: "Contact" },
    hero: { eyebrow: "KEIMA", statement: pending("Brand statement pending"), scroll: "Scroll to explore" },
    about: { label: "Profile", person: pending("Profile content pending"), portrait: pending("Portrait pending") },
    servicesLabel: "Active Services",
    services: ["01", "02", "03"].map((index) => ({
      id: `service-${index}`,
      index,
      status: pending("Current status pending"),
      name: pending("Service name pending"),
      summary: pending("Service summary pending"),
      audience: pending("Audience pending"),
      url: pending("Service URL pending"),
      image: pending("Service image pending"),
    })),
    contact: { label: "Business Inquiry", email: pending("Business email pending") },
    footer: { copyright: pending("Copyright information pending"), legal: pending("Legal information pending") },
  },
};
```

- [ ] **Step 5: Run the content test and commit**

Run:

```bash
npm test -- src/content/__tests__/site-content.test.ts
```

Expected: 3 tests PASS.

Commit:

```bash
git add public src/content
git commit -m "feat: add KEIMA assets and bilingual content model"
```

## Task 3: Add locale routing and locale-specific metadata

**Files:**
- Create: `src/lib/locales.ts`
- Create: `src/lib/site-metadata.ts`
- Create: `src/lib/__tests__/locales.test.ts`
- Create: `src/lib/__tests__/site-metadata.test.ts`
- Create: `src/app/(entry)/layout.tsx`
- Create: `src/app/(entry)/page.tsx`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Create: `src/lib/fonts.ts`
- Create: `src/components/language-entry.tsx`
- Create: `src/components/site-shell.tsx`

- [ ] **Step 1: Write failing locale and metadata tests**

Create `src/lib/__tests__/locales.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { alternateLocale, isLocale } from "@/lib/locales";

describe("locale helpers", () => {
  it("accepts only approved locales", () => {
    expect(isLocale("zh-TW")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("returns the alternate locale", () => {
    expect(alternateLocale("zh-TW")).toBe("en");
    expect(alternateLocale("en")).toBe("zh-TW");
  });
});
```

Create `src/lib/__tests__/site-metadata.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createSiteMetadata } from "@/lib/site-metadata";

describe("createSiteMetadata", () => {
  it("creates canonical and language alternates", () => {
    const metadata = createSiteMetadata("en");
    expect(metadata.alternates?.canonical).toBe("/en/");
    expect(metadata.alternates?.languages).toEqual({ "zh-TW": "/zh-TW/", en: "/en/" });
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
npm test -- src/lib/__tests__
```

Expected: FAIL because both helper modules are missing.

- [ ] **Step 3: Implement locale and metadata helpers**

Create `src/lib/locales.ts`:

```ts
export const locales = ["zh-TW", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "zh-TW" ? "en" : "zh-TW";
}
```

Create `src/lib/site-metadata.ts`:

```ts
import type { Metadata } from "next";
import type { Locale } from "@/lib/locales";

export function createSiteMetadata(locale: Locale): Metadata {
  const isZh = locale === "zh-TW";
  return {
    metadataBase: new URL("https://keima.example"),
    title: isZh ? "KEIMA／桂馬數位｜品牌資訊待補" : "KEIMA | Brand information pending",
    description: isZh ? "KEIMA 桂馬數位企業形象網站，正式品牌文案待提供。" : "KEIMA corporate brand site. Final brand copy is pending.",
    alternates: {
      canonical: `/${locale}/`,
      languages: { "zh-TW": "/zh-TW/", en: "/en/" },
    },
    icons: { icon: "/favicon.svg" },
  };
}
```

- [ ] **Step 4: Run the helper tests**

Run:

```bash
npm test -- src/lib/__tests__
```

Expected: 3 tests PASS.

- [ ] **Step 5: Create the static route shells**

Create `src/lib/fonts.ts`:

```ts
import { Instrument_Sans, Noto_Sans_TC } from "next/font/google";

export const latin = Instrument_Sans({ subsets: ["latin"], variable: "--font-latin", display: "swap" });
export const cjk = Noto_Sans_TC({ variable: "--font-cjk", display: "swap", preload: false });
```

Create `src/components/language-entry.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { isLocale } from "@/lib/locales";

export function LanguageEntry() {
  useEffect(() => {
    const saved = window.localStorage.getItem("keima-locale");
    const locale = saved && isLocale(saved) ? saved : "zh-TW";
    window.location.replace(`/${locale}/`);
  }, []);

  return <main className="language-entry" aria-labelledby="language-title"><h1 id="language-title">KEIMA</h1><p><a href="/zh-TW/">繁體中文</a></p><p><a href="/en/">English</a></p></main>;
}
```

Create `src/app/(entry)/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { cjk, latin } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = { metadataBase: new URL("https://keima.example"), robots: { index: false, follow: false } };

export default function EntryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW" className={`${latin.variable} ${cjk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/(entry)/page.tsx`:

```tsx
import { LanguageEntry } from "@/components/language-entry";

export default function EntryPage() { return <LanguageEntry />; }
```

Create `src/app/[locale]/layout.tsx`:

```tsx
import { notFound } from "next/navigation";
import { createSiteMetadata } from "@/lib/site-metadata";
import { cjk, latin } from "@/lib/fonts";
import { isLocale, locales } from "@/lib/locales";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return isLocale(locale) ? createSiteMetadata(locale) : {};
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <html lang={locale} className={`${latin.variable} ${cjk.variable}`}><body>{children}</body></html>;
}
```

Create `src/app/[locale]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { siteContent } from "@/content/site-content";
import { isLocale } from "@/lib/locales";

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SiteShell content={siteContent[locale]} />;
}
```

Create `src/components/site-shell.tsx`:

```tsx
import type { LocaleContent } from "@/content/site-content";

export function SiteShell({ content }: { content: LocaleContent }) {
  return <main data-locale={content.locale}>{content.hero.eyebrow}</main>;
}
```

- [ ] **Step 6: Add a minimal global stylesheet so type-checking can run**

Create `src/app/globals.css`:

```css
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; }
```

- [ ] **Step 7: Verify routes compile and commit**

Run:

```bash
npm run typecheck
npm test
```

Expected: type-checking succeeds and 5 tests PASS.

Commit:

```bash
git add src/app src/components/site-shell.tsx src/components/language-entry.tsx src/lib
git commit -m "feat: add bilingual static routes"
```

## Task 4: Build the KEIMA design tokens, navigation, and Hero

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/navigation.tsx`
- Create: `src/components/hero.tsx`
- Create: `src/hooks/use-active-section.ts`
- Create: `src/components/__tests__/navigation.test.tsx`
- Modify: `src/components/site-shell.tsx`

- [ ] **Step 1: Write the failing navigation test**

Create `src/components/__tests__/navigation.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Navigation } from "@/components/navigation";
import { siteContent } from "@/content/site-content";

vi.stubGlobal("IntersectionObserver", class {
  observe() {}
  disconnect() {}
  unobserve() {}
});

describe("Navigation", () => {
  it("uses the official lockup and links to every section", () => {
    render(<Navigation content={siteContent["zh-TW"]} />);
    expect(screen.getByRole("img", { name: "KEIMA" })).toHaveAttribute("src", "/brand/keima-lockup-color.svg");
    for (const target of ["#home", "#about", "#services", "#contact"]) {
      expect(screen.getByRole("link", { name: new RegExp(target.slice(1), "i") }).getAttribute("href")).toBe(target);
    }
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en/");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/components/__tests__/navigation.test.tsx
```

Expected: FAIL because `Navigation` does not exist.

- [ ] **Step 3: Implement Navigation and Hero**

Create `src/components/navigation.tsx`:

```tsx
"use client";

import type { LocaleContent } from "@/content/site-content";
import { useActiveSection } from "@/hooks/use-active-section";

export function Navigation({ content }: { content: LocaleContent }) {
  const alternate = content.locale === "zh-TW" ? { href: "/en/", label: "EN" } : { href: "/zh-TW/", label: "中文" };
  const active = useActiveSection();
  return (
    <header className="site-header">
      <a className="brand-link" href="#home" aria-label="KEIMA home">
        <picture>
          <source media="(max-width: 639px)" srcSet="/brand/keima-icon-color.svg" />
          <img src="/brand/keima-lockup-color.svg" alt="KEIMA" />
        </picture>
      </a>
      <nav aria-label="Primary">
        {Object.entries(content.nav).map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}>{label}<span className="sr-only"> {id}</span></a>)}
      </nav>
      <a className="locale-link" href={alternate.href} onClick={() => window.localStorage.setItem("keima-locale", content.locale === "zh-TW" ? "en" : "zh-TW")}>{alternate.label}</a>
    </header>
  );
}
```

Create `src/hooks/use-active-section.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

const sectionIds = ["home", "about", "services", "contact"] as const;

export function useActiveSection() {
  const ids = sectionIds;
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: "-30% 0px -55%", threshold: [0, .2, .5, .8] });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}
```

Create `src/components/hero.tsx`:

```tsx
import type { LocaleContent } from "@/content/site-content";

export function Hero({ content }: { content: LocaleContent }) {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <p className="eyebrow">{content.hero.eyebrow}</p>
      <h1 id="hero-title" className="display">{content.hero.statement.status === "pending" ? content.hero.statement.label : content.hero.statement.value}</h1>
      <p className="scroll-cue">{content.hero.scroll}</p>
      <div className="hero-cut" aria-hidden="true" />
    </section>
  );
}
```

Update `src/components/site-shell.tsx`:

```tsx
import type { LocaleContent } from "@/content/site-content";
import { Hero } from "@/components/hero";
import { Navigation } from "@/components/navigation";

export function SiteShell({ content }: { content: LocaleContent }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation content={content} />
      <main id="main" data-locale={content.locale}><Hero content={content} /></main>
    </>
  );
}
```

- [ ] **Step 4: Replace the minimal stylesheet with the brand foundation**

Define these exact tokens and structural rules at the top of `src/app/globals.css`, then add focused selectors for `.site-header`, `.brand-link`, `nav`, `.locale-link`, `.hero`, `.display`, `.hero-cut`, `.skip-link`, and `.sr-only`:

```css
:root {
  --keima-ink: #12120e;
  --keima-paper: #f1efe7;
  --keima-cyan: #2eb8c6;
  --surface-light: #fffdf7;
  --text-secondary: #6f6a61;
  --text-muted: #918b80;
  --border-primary: #d0cabe;
  --border-subtle: #e5e0d6;
  --accent-hover: #279faa;
  --focus-ring: #2eb8c6;
  --page-margin: clamp(1.25rem, 4vw, 4.5rem);
  --ease-keima: cubic-bezier(.22, 1, .36, 1);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--keima-paper); }
body { margin: 0; color: var(--keima-ink); background: var(--keima-paper); font-family: var(--font-cjk), sans-serif; }
a { color: inherit; }
:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 4px; }
.display { font-family: var(--font-latin), var(--font-cjk), sans-serif; font-size: clamp(5rem, 11vw, 12rem); line-height: .82; letter-spacing: -.07em; }
.hero { min-height: 100svh; padding: 9rem var(--page-margin) 4rem; position: relative; overflow: clip; }
.hero-cut { position: absolute; right: -8vw; bottom: -18vh; width: min(36vw, 38rem); height: 70vh; background: var(--keima-ink); clip-path: polygon(38% 0, 100% 0, 100% 100%, 0 100%); }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 639px) {
  .display { font-size: clamp(3.25rem, 17vw, 5.5rem); line-height: .9; }
  .hero-cut { width: 55vw; height: 46vh; }
}
```

Add these navigation selectors:

```css
.site-header { position: fixed; inset: 0 0 auto; z-index: 50; display: grid; grid-template-columns: 2fr 8fr 2fr; align-items: center; min-height: 5.75rem; padding: 1rem var(--page-margin); background: color-mix(in srgb, var(--keima-paper) 88%, transparent); backdrop-filter: blur(12px); }
.brand-link { display: inline-flex; width: 148px; min-height: 44px; align-items: center; }
.brand-link img { display: block; width: 100%; height: auto; }
.site-header nav { display: flex; justify-content: center; gap: clamp(1rem, 2.4vw, 2.75rem); }
.site-header nav a, .locale-link { min-height: 44px; display: inline-flex; align-items: center; text-decoration: none; font-family: var(--font-latin), var(--font-cjk), sans-serif; font-size: .75rem; letter-spacing: .08em; text-transform: uppercase; }
.site-header nav a::after { content: ""; height: 1px; background: var(--keima-cyan); position: absolute; inset: auto 0 0; transform: scaleX(0); transform-origin: right; transition: transform .35s var(--ease-keima); }
.site-header nav a { position: relative; }
.site-header nav a:hover::after, .site-header nav a[aria-current="location"]::after { transform: scaleX(1); transform-origin: left; }
.locale-link { justify-self: end; }
.skip-link { position: fixed; z-index: 100; left: var(--page-margin); top: 0; transform: translateY(-120%); background: var(--keima-ink); color: var(--keima-paper); padding: .75rem 1rem; }
.skip-link:focus { transform: translateY(.5rem); }
@media (max-width: 767px) {
  .site-header { grid-template-columns: 1fr auto; min-height: 4.75rem; }
  .brand-link { width: 44px; }
  .brand-link img { width: 32px; height: 32px; }
  .site-header nav { position: fixed; inset: auto var(--page-margin) 1rem; justify-content: space-between; padding: .25rem .75rem; background: var(--keima-paper); border: 1px solid var(--border-primary); }
}
```

- [ ] **Step 5: Run tests, lint, and commit**

Run:

```bash
npm test -- src/components/__tests__/navigation.test.tsx
npm run typecheck
npm run lint
```

Expected: the navigation test passes and both static checks exit successfully.

Commit:

```bash
git add src/app/globals.css src/components/navigation.tsx src/components/hero.tsx src/components/site-shell.tsx src/components/__tests__/navigation.test.tsx src/hooks/use-active-section.ts
git commit -m "feat: build KEIMA navigation and hero"
```

## Task 5: Build About, Services, Contact, and Footer states

**Files:**
- Create: `src/components/media-placeholder.tsx`
- Create: `src/components/about.tsx`
- Create: `src/components/services.tsx`
- Create: `src/components/contact.tsx`
- Create: `src/components/footer.tsx`
- Create: `src/components/__tests__/content-sections.test.tsx`
- Modify: `src/components/site-shell.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing content-section tests**

Create `src/components/__tests__/content-sections.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Services } from "@/components/services";
import { siteContent } from "@/content/site-content";

const content = siteContent["zh-TW"];

describe("content pending states", () => {
  it("renders the profile and portrait as pending", () => {
    render(<About content={content} />);
    expect(screen.getByText("人物資料待提供")).toBeVisible();
    expect(screen.getByText("人物照片待提供")).toBeVisible();
  });

  it("renders three indexed service pending entries", () => {
    render(<Services content={content} />);
    expect(screen.getAllByText("服務名稱待提供")).toHaveLength(3);
  });

  it("does not create a mail link before the email is ready", () => {
    render(<Contact content={content} />);
    expect(screen.queryByRole("link", { name: /email/i })).not.toBeInTheDocument();
    expect(screen.getByText("商務 Email 待提供")).toBeVisible();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
npm test -- src/components/__tests__/content-sections.test.tsx
```

Expected: FAIL because the section components do not exist.

- [ ] **Step 3: Implement the pending-state sections**

Create `src/components/media-placeholder.tsx`:

```tsx
export function MediaPlaceholder({ label }: { label: string }) {
  return <div className="media-placeholder" role="img" aria-label={label}><span>{label}</span></div>;
}
```

Create `src/components/about.tsx`:

```tsx
import type { LocaleContent } from "@/content/site-content";
import { MediaPlaceholder } from "@/components/media-placeholder";

export function About({ content }: { content: LocaleContent }) {
  const person = content.about.person.status === "pending" ? content.about.person.label : content.about.person.value;
  const portrait = content.about.portrait.status === "pending" ? content.about.portrait.label : content.about.portrait.value;
  return <section id="about" className="about section-grid"><p className="section-index">02</p><h2>{content.about.label}</h2><MediaPlaceholder label={portrait} /><p className="pending-copy">{person}</p></section>;
}
```

Create `src/components/services.tsx`:

```tsx
import type { LocaleContent } from "@/content/site-content";

export function Services({ content }: { content: LocaleContent }) {
  return (
    <section id="services" className="services section-grid" aria-labelledby="services-title">
      <div className="services-sticky"><p className="section-index">03</p><h2 id="services-title">{content.servicesLabel}</h2></div>
      <ol className="service-list">
        {content.services.map((service) => <li key={service.id}><span>{service.index}</span><h3>{service.name.status === "pending" ? service.name.label : service.name.value}</h3><p>{service.summary.status === "pending" ? service.summary.label : service.summary.value}</p></li>)}
      </ol>
    </section>
  );
}
```

Create `src/components/contact.tsx`:

```tsx
import type { LocaleContent } from "@/content/site-content";

export function Contact({ content }: { content: LocaleContent }) {
  const email = content.contact.email;
  return <section id="contact" className="contact" aria-labelledby="contact-title"><p>{content.contact.label}</p><h2 id="contact-title">{email.status === "ready" ? <a href={`mailto:${email.value}`}>{email.value}</a> : email.label}</h2></section>;
}
```

Create `src/components/footer.tsx`:

```tsx
import type { LocaleContent } from "@/content/site-content";

export function Footer({ content }: { content: LocaleContent }) {
  return <footer><img src="/brand/keima-lockup.svg" alt="KEIMA" /><p>{content.footer.copyright.status === "pending" ? content.footer.copyright.label : content.footer.copyright.value}</p><p>{content.footer.legal.status === "pending" ? content.footer.legal.label : content.footer.legal.value}</p></footer>;
}
```

- [ ] **Step 4: Compose all sections in SiteShell**

Replace the `<main>` content in `src/components/site-shell.tsx` with:

```tsx
<main id="main" data-locale={content.locale}>
  <Hero content={content} />
  <About content={content} />
  <Services content={content} />
  <Contact content={content} />
</main>
<Footer content={content} />
```

Add the matching imports for `About`, `Services`, `Contact`, and `Footer`.

- [ ] **Step 5: Add section-specific responsive CSS**

Add:

```css
.section-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: clamp(1rem, 2vw, 2rem); padding: clamp(7rem, 12vw, 12rem) var(--page-margin); }
.section-index { grid-column: 1 / 2; color: var(--keima-cyan); font-family: var(--font-latin), sans-serif; }
.about-heading { grid-column: 3 / 7; }
.about h2 { font-size: clamp(2.5rem, 6vw, 7rem); margin: 0; }
.about .media-placeholder { grid-column: 3 / 8; aspect-ratio: 4 / 5; }
.about .pending-copy { grid-column: 9 / 13; align-self: end; }
.media-placeholder { position: relative; display: grid; place-items: end start; padding: 1.25rem; background: var(--surface-light); border: 1px solid var(--border-primary); overflow: hidden; }
.media-placeholder::after { content: ""; position: absolute; width: 1px; height: 140%; left: 52%; top: -20%; background: var(--keima-cyan); transform: rotate(24deg); }
.services-sticky { grid-column: 1 / 5; position: sticky; top: 8rem; align-self: start; }
.service-list { grid-column: 6 / 13; list-style: none; margin: 0; padding: 0; }
.service-list li { min-height: 55vh; padding: 2rem 0 6rem; border-top: 1px solid var(--border-primary); }
.contact { min-height: 92svh; display: flex; flex-direction: column; justify-content: space-between; padding: clamp(7rem, 12vw, 12rem) var(--page-margin); color: var(--keima-paper); background: var(--keima-ink); }
.contact h2 { max-width: 11ch; margin: 0; font-size: clamp(3rem, 9vw, 10rem); line-height: .9; letter-spacing: -.06em; overflow-wrap: anywhere; }
.contact a { text-decoration-color: var(--keima-cyan); text-underline-offset: .16em; }
footer { display: grid; grid-template-columns: 2fr 5fr 5fr; gap: 2rem; padding: 3rem var(--page-margin); color: var(--keima-paper); background: var(--keima-ink); border-top: 1px solid #383832; }
footer img { width: 148px; filter: invert(1); }
@media (max-width: 1023px) { .section-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); } .section-index { grid-column: 1; } .about-heading, .about .media-placeholder { grid-column: 2 / 5; } .about .pending-copy { grid-column: 5 / 7; } .services-sticky { grid-column: 1 / 3; } .service-list { grid-column: 3 / 7; } }
@media (max-width: 767px) { .section-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } .section-index, .about-heading, .about .media-placeholder, .about .pending-copy, .services-sticky, .service-list { grid-column: 1 / -1; } .services-sticky { position: static; } .service-list li { min-height: auto; padding: 2rem 0 4rem; } footer { grid-template-columns: 1fr; } }
```

- [ ] **Step 6: Run tests and commit**

Run:

```bash
npm test -- src/components/__tests__/content-sections.test.tsx
npm run typecheck
npm run lint
```

Expected: 3 section tests PASS and static checks succeed.

Commit:

```bash
git add src/components src/app/globals.css
git commit -m "feat: add KEIMA content sections"
```

## Task 6: Add controlled motion and reduced-motion behavior

**Files:**
- Create: `src/components/motion/reveal.tsx`
- Create: `src/components/motion/hero-motion.tsx`
- Create: `src/components/motion/section-wipe.tsx`
- Create: `src/components/motion/__tests__/reveal.test.tsx`
- Modify: `src/components/hero.tsx`
- Modify: `src/components/about.tsx`
- Modify: `src/components/services.tsx`
- Modify: `src/components/contact.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing reduced-motion test**

Create `src/components/motion/__tests__/reveal.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Reveal } from "@/components/motion/reveal";

vi.mock("motion/react", () => ({
  motion: { div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div> },
  useReducedMotion: () => true,
}));

describe("Reveal", () => {
  it("marks reduced-motion output without translated hidden state", () => {
    render(<Reveal><span>Visible content</span></Reveal>);
    expect(screen.getByText("Visible content").parentElement).toHaveAttribute("data-reduced-motion", "true");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/components/motion/__tests__/reveal.test.tsx
```

Expected: FAIL because `Reveal` does not exist.

- [ ] **Step 3: Implement the reusable Reveal primitive**

Create `src/components/motion/reveal.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} data-reduced-motion={String(Boolean(reduced))} initial={reduced ? false : { opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)" }} whileInView={reduced ? undefined : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }} viewport={{ once: true, amount: .25 }} transition={{ duration: .8, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
```

- [ ] **Step 4: Implement bounded Hero and section transitions**

Create `src/components/motion/hero-motion.tsx`:

```tsx
"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function HeroMotion({ children }: { children: React.ReactNode }) {
  const target = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end start"] });
  const animatedY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  return <motion.div ref={target} style={{ y: reduced ? 0 : animatedY }}>{children}</motion.div>;
}
```

Create `src/components/motion/section-wipe.tsx`:

```tsx
"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function SectionWipe({ children }: { children: React.ReactNode }) {
  const target = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "start 35%"] });
  const clipPath = useTransform(scrollYProgress, [0, 1], ["inset(0 0 0 100%)", "inset(0 0 0 0%)"]);
  return <div ref={target} className="section-wipe"><motion.div className="section-wipe-content" style={{ clipPath: reduced ? "inset(0 0 0 0%)" : clipPath }}>{children}</motion.div></div>;
}
```

In `hero.tsx`, import `HeroMotion` and replace the H1 line with:

```tsx
<HeroMotion><h1 id="hero-title" className="display">{content.hero.statement.status === "pending" ? content.hero.statement.label : content.hero.statement.value}</h1></HeroMotion>
```

In `about.tsx` and `services.tsx`, import `Reveal` and wrap only each section H2:

```tsx
<Reveal className="about-heading"><h2>{content.about.label}</h2></Reveal>
```

```tsx
<Reveal><h2 id="services-title">{content.servicesLabel}</h2></Reveal>
```

In `contact.tsx`, import `SectionWipe` and return:

```tsx
return <SectionWipe><section id="contact" className="contact" aria-labelledby="contact-title"><p>{content.contact.label}</p><h2 id="contact-title">{email.status === "ready" ? <a href={`mailto:${email.value}`}>{email.value}</a> : email.label}</h2></section></SectionWipe>;
```

Do not animate the official Logo files.

Add:

```css
.section-wipe { position: relative; background: var(--keima-paper); }
.section-wipe-content { position: relative; background: var(--keima-ink); }
```

- [ ] **Step 5: Add the CSS reduced-motion safety net**

Add:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
  .hero-cut { transform: none !important; }
}
```

- [ ] **Step 6: Run tests and commit**

Run:

```bash
npm test -- src/components/motion/__tests__/reveal.test.tsx
npm run typecheck
npm run lint
```

Expected: Reveal test PASS; type-checking and lint succeed.

Commit:

```bash
git add src/components src/app/globals.css
git commit -m "feat: add controlled KEIMA motion system"
```

## Task 7: Add sitemap, robots, social metadata, and browser QA

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/lib/site-metadata.ts`
- Create: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write failing browser acceptance tests**

Create `tests/e2e/site.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

for (const locale of ["zh-TW", "en"] as const) {
  test(`${locale} renders the complete one-page shell`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(`/${locale}/`);
    await expect(page.locator("header img")).toBeVisible();
    for (const id of ["home", "about", "services", "contact"]) await expect(page.locator(`#${id}`)).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("pending email is not an invalid link", async ({ page }) => {
  await page.goto("/zh-TW/");
  await expect(page.locator("#contact a[href^='mailto:']")).toHaveCount(0);
});

test("mobile uses the standalone symbol", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh-TW/");
  await expect(page.locator("header source[media='(max-width: 639px)']")).toHaveAttribute("srcset", "/brand/keima-icon-color.svg");
});

test("language switching persists the selected locale", async ({ page }) => {
  await page.goto("/zh-TW/");
  await page.getByRole("link", { name: "EN" }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  expect(await page.evaluate(() => localStorage.getItem("keima-locale"))).toBe("en");
});

test("section navigation exposes the active location", async ({ page }) => {
  await page.goto("/zh-TW/");
  await page.locator("#services").scrollIntoViewIfNeeded();
  await expect(page.locator("header nav a[href='#services']")).toHaveAttribute("aria-current", "location");
});
```

- [ ] **Step 2: Run a production build, then the browser tests to expose remaining gaps**

Run:

```bash
npm run build
npx playwright install chromium webkit
npm run test:e2e
```

Expected before metadata work: section tests pass; any browser failure names the exact missing static or layout behavior to correct.

- [ ] **Step 3: Implement sitemap and robots**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["zh-TW", "en"].map((locale) => ({ url: `https://keima.example/${locale}/`, changeFrequency: "monthly", priority: 1 }));
}
```

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://keima.example/sitemap.xml" };
}
```

Replace `createSiteMetadata()` with:

```ts
export function createSiteMetadata(locale: Locale): Metadata {
  const isZh = locale === "zh-TW";
  const title = isZh ? "KEIMA／桂馬數位｜品牌資訊待補" : "KEIMA | Brand information pending";
  const description = isZh ? "KEIMA 桂馬數位企業形象網站，正式品牌文案待提供。" : "KEIMA corporate brand site. Final brand copy is pending.";
  return {
    metadataBase: new URL("https://keima.example"),
    title,
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: `/${locale}/`, languages: { "zh-TW": "/zh-TW/", en: "/en/" } },
    icons: { icon: "/favicon.svg" },
    openGraph: { type: "website", locale: isZh ? "zh_TW" : "en_US", title, description, url: `/${locale}/`, siteName: "KEIMA" },
  };
}
```

This prevents unfinished brand copy from being indexed if someone uploads the local output accidentally. Remove this no-index state only after formal copy, a real production domain, and an approved social-preview image are provided.

- [ ] **Step 4: Verify all browser acceptance tests pass at required breakpoints**

Append this exact viewport test to `tests/e2e/site.spec.ts`:

```ts
for (const width of [1920, 1440, 1280, 1024, 768, 430, 390, 375]) {
  test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width <= 430 ? 844 : 900 });
    for (const locale of ["zh-TW", "en"] as const) {
      await page.goto(`/${locale}/`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
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
```

Run:

```bash
npm run build
npm run test:e2e
```

Expected: all bilingual, email, logo, console, and overflow checks PASS in desktop and mobile projects.

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts src/lib/site-metadata.ts tests/e2e/site.spec.ts
git commit -m "test: add metadata and responsive browser QA"
```

## Task 8: Final verification and handoff

**Files:**
- Modify only files identified by verification failures.

- [ ] **Step 1: Run the complete automated suite**

Run each command separately:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Expected: every command exits successfully; `out/zh-TW/index.html` and `out/en/index.html` exist.

- [ ] **Step 2: Inspect the static output and source for forbidden content**

Run:

```bash
rg -n "Lorem ipsum|example.com|mailto:.*pending|#000000|linear-gradient|radial-gradient" src public out
```

Expected: no Lorem Ipsum, clickable pending Email, raw black replacement, or visual gradient appears. `keima.example` may appear only in intentionally non-indexable local metadata and must be reported as a production-domain input still required before deployment.

- [ ] **Step 3: Perform focused visual QA**

Open the production output and inspect both languages at 1440px and 390px. Confirm official Logo proportions, clear space, large-title clipping, Service sticky behavior, Mobile stacking, Contact transition, visible keyboard focus, and reduced-motion behavior. Fix only observed defects, then rerun the complete automated suite.

- [ ] **Step 4: Record the remaining content inputs in the handoff**

Report these intentional content requirements without inventing values:

```text
Formal bilingual brand statement
Founder/profile name, title, biography, experience, expertise, and portrait
Active service names, descriptions, audiences, URLs, logos, images, and statuses
Business Email
Social links
Company, copyright, and legal information
Production domain and final social-preview content
```

- [ ] **Step 5: Commit verification fixes if any source files changed**

```bash
git add src tests public package.json package-lock.json
git commit -m "fix: complete KEIMA site verification"
```

If verification required no source changes, do not create an empty commit.
