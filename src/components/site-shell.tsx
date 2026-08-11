import type { LocaleContent } from "@/content/site-content";
import { Hero } from "@/components/hero";
import { Navigation } from "@/components/navigation";

type SiteShellProps = {
  content: LocaleContent;
};

export function SiteShell({ content }: SiteShellProps) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation content={content} />
      <main id="main" data-locale={content.locale}>
        <Hero content={content} />
      </main>
    </>
  );
}
