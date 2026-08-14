import { Reveal } from "@/components/motion/reveal";
import type { LocaleContent } from "@/content/site-content";

type AboutProps = {
  content: LocaleContent;
};

export function About({ content }: AboutProps) {
  const { about } = content;

  return (
    <section
      id="about"
      className="content-section brand-section positioning"
      aria-label={about.title}
    >
      <div className="brand-section-grid">
        <p className="section-index positioning-index" aria-hidden="true">
          <span>01</span>
        </p>
        <div className="section-heading-block">
          <p className="section-kicker">{about.eyebrow}</p>
          <Reveal>
            <h2 id="about-title" className="positioning-display">
              {about.display}
            </h2>
          </Reveal>
        </div>
        <div className="positioning-copy">
          <p>{about.intro}</p>
          <p className="positioning-belief">{about.belief}</p>
        </div>
      </div>
    </section>
  );
}
