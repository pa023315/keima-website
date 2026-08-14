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

function ProjectRow({ project, index }: { project: ProjectContent; index: number }) {
  const href = safeProjectHref(project);
  const rowContent = (
    <>
      <span className="row-index" aria-hidden="true">
        {project.index}
      </span>
      <span className="project-title">{project.title}</span>
      <span className="project-label">{project.label}</span>
      <span className="project-description">{project.description}</span>
      <span className="project-arrow" aria-hidden="true">
        →
      </span>
    </>
  );

  return (
    <li className="project-row" data-link-state={href ? "ready" : "pending"}>
      <Reveal delay={index * 0.06}>
        {href ? (
          <a href={href} aria-label={`${project.title} — ${project.label}`}>
            {rowContent}
          </a>
        ) : (
          <div>{rowContent}</div>
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
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
