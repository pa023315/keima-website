import type { LocaleContent } from "@/content/site-content";

type SiteShellProps = {
  content: LocaleContent;
};

export function SiteShell({ content }: SiteShellProps) {
  return <main data-locale={content.locale}>{content.hero.eyebrow}</main>;
}
