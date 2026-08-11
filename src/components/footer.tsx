import Image from "next/image";

import type { ContentState, LocaleContent } from "@/content/site-content";

type FooterProps = {
  content: LocaleContent;
};

function contentValue(state: ContentState<string>) {
  return state.status === "ready" ? state.value : state.label;
}

export function Footer({ content }: FooterProps) {
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
      <div className="footer-meta">
        <p data-content-status={content.footer.copyright.status}>
          {contentValue(content.footer.copyright)}
        </p>
        <p data-content-status={content.footer.legal.status}>{contentValue(content.footer.legal)}</p>
      </div>
    </footer>
  );
}
