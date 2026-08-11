import { notFound } from "next/navigation";

import { SiteShell } from "@/components/site-shell";
import { siteContent } from "@/content/site-content";
import { isLocale } from "@/lib/locales";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <SiteShell content={siteContent[locale]} />;
}
