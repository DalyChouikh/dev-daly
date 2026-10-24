import type { Project } from "@/lib/types";
import {
  BulletList,
  ExternalLink,
  SectionHeading,
} from "@/components/ui/PortfolioPrimitives";

/** Native disclosures keep the archive scannable without hiding its detail. */
export function Projects({
  projects,
  githubUrl,
}: {
  projects: readonly Project[];
  githubUrl: string;
}) {
  return (
    <section className="projects section" id="projects">
      <SectionHeading
        title="Other projects"
        description="Personal projects, campus collaborations, and experiments. Open a project for the details."
      />
      <div className="project-archive">
        {projects.map((project) => (
          <details
            className="archive-item"
            key={project.id}
            data-project={project.id}
          >
            <summary>
              <span className="archive-title">
                {project.displayTitle ?? project.title}
              </span>
              <span className="archive-stack">
                {project.techStack.slice(0, 3).join(" · ")}
              </span>
              <span className="archive-year">{project.year}</span>
              <span className="archive-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="archive-content">
              <p className="archive-tagline">{project.tagline}</p>
              <BulletList items={project.bullets} />
              <p className="stack">{project.techStack.join(" · ")}</p>
              <div className="project-links">
                <ExternalLink href={project.githubUrl}>
                  View source code
                </ExternalLink>
                {project.liveUrl ? (
                  <ExternalLink href={project.liveUrl}>
                    Visit project
                  </ExternalLink>
                ) : null}
              </div>
            </div>
          </details>
        ))}
      </div>
      <p className="archive-footer">
        <ExternalLink href={githubUrl}>More on GitHub</ExternalLink>
      </p>
    </section>
  );
}
