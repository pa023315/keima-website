"use client";

import Link from "next/link";

import type { LocaleContent } from "@/content/site-content";
import { sectionIds, useActiveSection } from "@/hooks/use-active-section";

type NavigationProps = {
  content: LocaleContent;
};

const alternateLocales = {
  "zh-TW": { href: "/en/", label: "EN", locale: "en" },
  en: { href: "/zh-TW/", label: "中文", locale: "zh-TW" },
} as const;

const accessibilityLabels = {
  "zh-TW": { brand: "KEIMA 首頁", navigation: "主要導覽" },
  en: { brand: "KEIMA home", navigation: "Primary navigation" },
} as const;

export function Navigation({ content }: NavigationProps) {
  const activeSection = useActiveSection();
  const alternate = alternateLocales[content.locale];
  const labels = accessibilityLabels[content.locale];
  const localeHref = `${alternate.href}#${activeSection}`;

  function rememberLocale() {
    try {
      localStorage.setItem("keima-locale", alternate.locale);
    } catch {
      // The native link remains functional when storage is unavailable.
    }
  }

  return (
    <header className="site-header">
      <a className="brand-link" href="#home" aria-label={labels.brand}>
        <picture>
          <source media="(max-width: 767px)" srcSet="/brand/keima-icon-color.svg" />
          <img src="/brand/keima-lockup-color.svg" alt="KEIMA" width="148" height="30" />
        </picture>
      </a>

      <Link href={localeHref} legacyBehavior>
        <a
          className="locale-link"
          href={localeHref}
          hrefLang={alternate.locale}
          onClick={rememberLocale}
        >
          {alternate.label}
        </a>
      </Link>

      <nav className="primary-navigation" aria-label={labels.navigation}>
        <ul>
          {sectionIds.map((id) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={activeSection === id ? "location" : undefined}>
                {content.nav[id]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
