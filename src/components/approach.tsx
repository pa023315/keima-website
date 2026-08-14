import { Reveal } from "@/components/motion/reveal";
import type { LocaleContent } from "@/content/site-content";

type ApproachProps = {
  content: LocaleContent;
};

export function Approach({ content }: ApproachProps) {
  const { approach } = content;

  return (
    <section
      id="approach"
      className="content-section brand-section approach"
      aria-labelledby="approach-title"
    >
      <div className="brand-section-grid">
        <p className="section-index approach-index" aria-hidden="true">
          <span>02</span>
        </p>
        <div className="section-heading-block">
          <p className="section-kicker">{approach.eyebrow}</p>
          <h2 id="approach-title" className="approach-title">
            {approach.title}
          </h2>
          <p className="section-intro">{approach.intro}</p>
        </div>
        <ol className="approach-list">
          {approach.items.map((item, index) => (
            <li key={item.id} className="approach-row" data-motion-accent="knight-row">
              <Reveal delay={index * 0.06}>
                <span className="row-index" aria-hidden="true">
                  {item.index}
                </span>
                <h3>{item.title}</h3>
                <p className="row-label">{item.label}</p>
                <p className="row-description">{item.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
