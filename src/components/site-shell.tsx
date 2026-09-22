import type { LocaleContent } from "@/content/site-content";
import { About } from "@/components/about";
import { Approach } from "@/components/approach";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navigation } from "@/components/navigation";
import { Profile } from "@/components/profile";
import { ProjectList } from "@/components/project-list";

type SiteShellProps = {
  content: LocaleContent;
};

export function SiteShell({ content }: SiteShellProps) {
  const skipLabel = content.locale === "zh-TW" ? "跳至主要內容" : "Skip to main content";

  return (
    <>
      <a className="skip-link" href="#main">
        {skipLabel}
      </a>
      <Navigation content={content} />
      <main id="main" data-locale={content.locale}>
        <Hero content={content} />
        <About content={content} />
        <Approach content={content} />
        <ProjectList content={content} />
        <Profile content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </>
  );
}
