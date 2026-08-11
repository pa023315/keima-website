"use client";

import type { LocaleContent } from "@/content/site-content";
import { sectionIds, useActiveSection } from "@/hooks/use-active-section";

type NavigationProps = {
  content: LocaleContent;
};

const alternateLocales = {
  "zh-TW": { href: "/en/", label: "EN", locale: "en" },
  en: { href: "/zh-TW/", label: "中文", locale: "zh-TW" },
} as const;

export function Navigation({ content }: NavigationProps) {
  const activeSection = useActiveSection();
  const alternate = alternateLocales[content.locale];

  function rememberLocale() {
    try {
      localStorage.setItem("keima-locale", alternate.locale);
    } catch {
      // The native link remains functional when storage is unavailable.
    }
  }

  return (
    <header className="site-header">
      <a className="brand-link" href="#home" aria-label="KEIMA home">
        <picture>
          <source media="(max-width: 639px)" srcSet="/brand/keima-icon-color.svg" />
          <img src="/brand/keima-lockup-color.svg" alt="KEIMA" width="148" height="30" />
        </picture>
      </a>

      <nav className="primary-navigation" aria-label="Primary">
        <ul>
          {sectionIds.map((id) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={activeSection === id ? "location" : undefined}>
                <span>{content.nav[id]}</span>
                <span className="sr-only"> {id}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <a className="locale-link" href={alternate.href} hrefLang={alternate.locale} onClick={rememberLocale}>
        {alternate.label}
      </a>
    </header>
  );
}
