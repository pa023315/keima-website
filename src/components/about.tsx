import Image from "next/image";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { Reveal } from "@/components/motion/reveal";
import type { LocaleContent } from "@/content/site-content";

type AboutProps = {
  content: LocaleContent;
};

export function About({ content }: AboutProps) {
  const { about } = content;
  const [lead, ...supportingIntro] = about.brand.intro;

  return (
    <section id="about" className="content-section section-grid about" aria-labelledby="about-title">
      <p className="section-index about-index" aria-hidden="true">
        <span>02</span>
      </p>

      <div className="about-brand-panel">
        <Reveal>
          <h2 id="about-title" className="about-lead">
            {lead}
          </h2>
        </Reveal>
        <div className="about-copy">
          {supportingIntro.map((paragraph) => (
            <p key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="about-portrait about-portrait--compact">
        {about.portrait.status === "ready" ? (
          <Image
            className="editorial-image"
            src={about.portrait.value}
            alt={about.person.name}
            width="960"
            height="1200"
            unoptimized
          />
        ) : (
          <MediaPlaceholder label={about.portrait.label} />
        )}
      </div>

      <div className="about-person-panel">
        <span className="field-rule" aria-hidden="true" />
        <p className="section-kicker">{about.person.label}</p>
        <h3>{about.person.name}</h3>
        <p>{about.person.bio}</p>
      </div>
    </section>
  );
}
