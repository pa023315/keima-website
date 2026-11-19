import type { LocaleContent } from "@/content/site-content";
import { About } from "@/components/about";
import { Approach } from "@/components/approach";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { RouteProgress } from "@/components/motion/route-progress";
import { Navigation } from "@/components/navigation";
import { Profile } from "@/components/profile";
import { ProjectList } from "@/components/project-list";

type SiteShellProps = {
  content: LocaleContent;
};

export function SiteShell({ content }: SiteShellProps) {
  const skipLabel = content.locale === "zh-TW" ? "跳至主要內容" : "Skip to main content";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://keima.tw/#organization",
        name: "KEIMA",
        alternateName: "桂馬數位",
        legalName: "桂馬數位股份有限公司",
        url: "https://keima.tw/zh-TW/",
        logo: "https://keima.tw/brand/keima-icon-color.svg",
        email: "service@pa023315.com",
        description: content.about.intro,
        knowsAbout:
          content.locale === "zh-TW"
            ? ["數位策略規劃", "專案企劃與推進", "遊戲產業", "數位娛樂", "創作者經濟", "商務合作"]
            : [
                "Digital strategy consulting",
                "Project planning and direction",
                "Games",
                "Digital entertainment",
                "Creator economy",
                "Business partnerships",
              ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: content.locale === "zh-TW" ? "商務洽詢" : "Business inquiries",
          email: "service@pa023315.com",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://keima.tw/#website",
        url: "https://keima.tw/zh-TW/",
        name: "KEIMA | 桂馬數位",
        inLanguage: ["zh-TW", "en"],
        publisher: { "@id": "https://keima.tw/#organization" },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <a className="skip-link" href="#main">
        {skipLabel}
      </a>
      <RouteProgress />
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
