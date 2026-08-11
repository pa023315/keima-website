export const locales = ["zh-TW", "en"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "zh-TW" ? "en" : "zh-TW";
}
