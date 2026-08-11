"use client";

import { useEffect } from "react";
import Link from "next/link";

import { isLocale } from "@/lib/locales";

const localeStorageKey = "keima-locale";

export function LanguageEntry() {
  useEffect(() => {
    const storedLocale = window.localStorage.getItem(localeStorageKey);
    const locale = storedLocale && isLocale(storedLocale) ? storedLocale : "zh-TW";

    window.location.replace(`/${locale}/`);
  }, []);

  return (
    <main>
      <h1>KEIMA</h1>
      <nav aria-label="Language selection">
        <Link href="/zh-TW/">繁體中文</Link>
        <Link href="/en/">English</Link>
      </nav>
    </main>
  );
}
