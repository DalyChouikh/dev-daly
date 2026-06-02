import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GitHub } from "@/components/ui/icons/GitHub";
import { getProjects } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TagBadge } from "@/components/ui/TagBadge";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import type { Project } from "@/lib/types";

export function Projects() {
  const projects = getProjects();

  return (
    <SectionWrapper id="projects">
      <AnimatedSection>
        <h2 className="font-display text-3xl font-bold text-on-surface md:text-4xl">
          Featured Projects
        </h2>
        <p className="mt-3 max-w-2xl text-on-surface-variant">
          A selection of projects spanning real-time systems, web platforms, and mobile applications.
        </p>
      </AnimatedSection>

      <StaggerContainer
        className="mt-12 grid gap-6 md:grid-cols-2"
        staggerDelay={0.15}
      >
        {projects.map((project: Project) => (
          <StaggerItem key={project.id} className="h-full">
            <div className="group relative flex h-full flex-col rounded-default border border-white/10 bg-white/[0.03] p-6 backdrop-blur-[20px] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]">
              {/* Year badge */}
              <div className="absolute right-4 top-4 font-mono text-xs text-primary">
                {project.year}
              </div>

              <div className="flex items-start justify-between gap-4 pr-10">
                <div>
                  <h3 className="font-display text-xl font-bold text-on-surface transition-colors duration-200 group-hover:text-primary">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-secondary">{project.tagline}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <TagBadge key={tech} label={tech} />
                ))}
              </div>

              <ul className="mt-4 flex-1 space-y-2">
                {project.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed text-on-surface-variant"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-3">
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-on-surface-variant transition-colors duration-200 hover:border-primary/40 hover:text-primary"
                >
                  <GitHub className="h-[14px] w-[14px]" />
                  Source
                </Link>

                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-on-surface-variant transition-colors duration-200 hover:border-primary/40 hover:text-primary"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </Link>
                )}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}