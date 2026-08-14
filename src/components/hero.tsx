import Image from "next/image";

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
      <HeroMotion>
        <div className="hero-mark hero-reveal hero-reveal--logo">
          <Image
            className="hero-logo"
            src="/brand/keima-lockup-color.svg"
            alt="KEIMA 桂馬數位"
            width="580"
            height="116"
            priority
            unoptimized
          />
          <h1 id="hero-title" className="hero-subtitle hero-reveal hero-reveal--subtitle">
            {statement}
          </h1>
        </div>
      </HeroMotion>
    </section>
  );
}
