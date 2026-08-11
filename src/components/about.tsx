import Image from "next/image";

import { MediaPlaceholder } from "@/components/media-placeholder";
import type { LocaleContent } from "@/content/site-content";

type AboutProps = {
  content: LocaleContent;
};

export function About({ content }: AboutProps) {
  const { about } = content;
  const person = about.person.status === "ready" ? about.person.value : about.person.label;

  return (
    <section id="about" className="content-section section-grid about" aria-labelledby="about-title">
      <p className="section-index about-index" aria-hidden="true">
        <span>02</span>
      </p>

      <div className="about-heading">
        <p className="section-kicker">KEIMA</p>
        <h2 id="about-title" className="section-title">
          {about.label}
        </h2>
      </div>

      <div className="about-portrait">
        {about.portrait.status === "ready" ? (
          <Image
            className="editorial-image"
            src={about.portrait.value}
            alt={about.label}
            width="960"
            height="1200"
            unoptimized
          />
        ) : (
          <MediaPlaceholder label={about.portrait.label} />
        )}
      </div>

      <div className="about-person" data-content-status={about.person.status}>
        <span className="field-rule" aria-hidden="true" />
        <p>{person}</p>
      </div>
    </section>
  );
}
