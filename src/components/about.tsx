import Image from "next/image";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { Reveal } from "@/components/motion/reveal";
import type { LocaleContent } from "@/content/site-content";

type AboutProps = {
  content: LocaleContent;
};

export function About({ content }: AboutProps) {
  const { about } = content;

  return (
    <section id="about" className="content-section section-grid about" aria-labelledby="about-title">
      <p className="section-index about-index" aria-hidden="true">
        <span>02</span>
      </p>

      <div className="about-brand">
        <p className="section-kicker">{about.brand.label}</p>
        <Reveal>
          <h2 id="about-title" className="section-title about-brand-title">
            {about.brand.headline}
          </h2>
        </Reveal>
        <p className="about-tagline">{about.brand.tagline}</p>
        <div className="about-copy">
          {about.brand.intro.map((paragraph, index) => (
            <p key={paragraph} className={index === 0 || index === about.brand.intro.length - 1 ? "lead" : undefined}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="about-portrait">
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

      <div className="about-person">
        <span className="field-rule" aria-hidden="true" />
        <p className="section-kicker">{about.person.label}</p>
        <h3>{about.person.name}</h3>
        <p>{about.person.bio}</p>
      </div>
    </section>
  );
}
