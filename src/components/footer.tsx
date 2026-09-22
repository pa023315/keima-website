import Image from "next/image";

import type { LocaleContent, NavSectionId } from "@/content/site-content";

type FooterProps = {
  content: LocaleContent;
};

const footerSections = ["home", "about", "approach", "in-motion", "profile", "contact"] as const satisfies readonly NavSectionId[];

export function Footer({ content }: FooterProps) {
  const navigationLabel = content.locale === "zh-TW" ? "頁尾導覽" : "Footer navigation";

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Image
          src="/brand/keima-lockup.svg"
          alt="KEIMA"
          width="180"
          height="36"
          unoptimized
        />
      </div>

      <nav className="footer-navigation" aria-label={navigationLabel}>
        <ul>
          {footerSections.map((section) => (
            <li key={section}>
              <a href={`#${section}`}>{content.nav[section]}</a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="footer-copyright">{content.footer.copyright}</p>
    </footer>
  );
}
