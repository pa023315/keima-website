import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import type { LocaleContent } from "@/content/site-content";

type PhilosophyProps = {
  content: LocaleContent;
};

export function Philosophy({ content }: PhilosophyProps) {
  const { philosophy } = content;

  return (
    <section
      id="philosophy"
      className="content-section brand-section philosophy"
      aria-label={philosophy.label}
    >
      <div className="brand-section-grid">
        <p className="section-index philosophy-index" aria-hidden="true">
          <span>04</span>
        </p>
        <Reveal className="philosophy-copy">
          <p className="section-kicker">{philosophy.label}</p>
          <h2 id="philosophy-title" className="philosophy-display">
            {philosophy.display}
          </h2>
          <p>{philosophy.body}</p>
        </Reveal>
        <div className="philosophy-symbol" aria-hidden="true">
          <Image
            src="/brand/keima-icon-color.svg"
            alt=""
            width="132"
            height="132"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
