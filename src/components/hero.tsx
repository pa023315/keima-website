import { HeroMotion } from "@/components/motion/hero-motion";
import type { LocaleContent } from "@/content/site-content";

type HeroProps = {
  content: LocaleContent;
};

export function Hero({ content }: HeroProps) {
  const statement =
    content.hero.statement.status === "ready"
      ? content.hero.statement.value
      : content.hero.statement.label;

  return (
    <section
      id="home"
      className="hero"
      aria-labelledby="hero-title"
      data-motion-intensity="enhanced"
    >
      <div className="hero-cut" aria-hidden="true" />
      <p className="hero-eyebrow hero-reveal hero-reveal--eyebrow">{content.hero.eyebrow}</p>
      <HeroMotion>
        <h1 id="hero-title" className="hero-title hero-reveal hero-reveal--title">
          {statement}
        </h1>
      </HeroMotion>
      <a className="hero-scroll hero-reveal hero-reveal--scroll" href="#about">
        <span aria-hidden="true">01—</span>
        {content.hero.scroll}
      </a>
    </section>
  );
}
