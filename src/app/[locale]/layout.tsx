import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { cjk, latin } from "@/lib/fonts";
import { isLocale, locales } from "@/lib/locales";
import { createSiteMetadata } from "@/lib/site-metadata";

import "../globals.css";

type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<LocaleLayoutProps, "params">) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return createSiteMetadata(locale);
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${latin.variable} ${cjk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
