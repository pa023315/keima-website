import type { ProjectId } from "@/content/site-content";

type ProjectArtProps = {
  project: ProjectId;
};

export function ProjectArt({ project }: ProjectArtProps) {
  return (
    <div
      className={`project-art project-art--${project}`}
      data-project-art={project}
      aria-hidden="true"
    >
      <span className="project-art-plane" />
      <span className="project-art-orbit" />
      <span className="project-art-node" />
    </div>
  );
}
