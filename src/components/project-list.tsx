import { Reveal } from "@/components/motion/reveal";
import type { LocaleContent, ProjectContent } from "@/content/site-content";

type ProjectListProps = {
  content: LocaleContent;
};

function safeProjectHref(project: ProjectContent) {
  if (project.url.status !== "ready") return null;

  try {
    const url = new URL(project.url.value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function ProjectCard({ project, index }: { project: ProjectContent; index: number }) {
  const href = safeProjectHref(project);
  const cardContent = (
    <>
      <div className="project-media" aria-hidden="true">
        <span className="project-media-shape project-media-shape--primary" />
        <span className="project-media-shape project-media-shape--secondary" />
        <span className="project-media-marker">
          {project.index} / {project.title}
        </span>
      </div>
      <div className="project-card-copy">
        <div className="project-card-text">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-label">{project.label}</p>
          <p className="project-description">{project.description}</p>
        </div>
        <span className="project-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </>
  );

  return (
    <li
      className={`project-card project-card--${project.id}`}
      data-link-state={href ? "ready" : "pending"}
    >
      <Reveal delay={index * 0.08}>
        {href ? (
          <a
            className="project-card-link"
            href={href}
            aria-label={`${project.title} — ${project.label}`}
          >
            {cardContent}
          </a>
        ) : (
          <div className="project-card-link">{cardContent}</div>
        )}
      </Reveal>
    </li>
  );
}

export function ProjectList({ content }: ProjectListProps) {
  const { inMotion } = content;

  return (
    <section
      id="in-motion"
      className="content-section brand-section in-motion"
      aria-labelledby="in-motion-title"
    >
      <div className="brand-section-grid">
        <p className="section-index in-motion-index" aria-hidden="true">
          <span>03</span>
        </p>
        <div className="section-heading-block">
          <p className="section-kicker">{inMotion.eyebrow}</p>
          <h2 id="in-motion-title" className="in-motion-title">
            {inMotion.title}
          </h2>
          <p className="section-intro">{inMotion.intro}</p>
        </div>
        <ol className="project-list">
          {inMotion.projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
