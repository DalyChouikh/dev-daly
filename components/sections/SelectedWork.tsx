import Image from "next/image";
import type { Project, ProjectImage } from "@/lib/types";
import { normalizeContentText } from "@/lib/portfolio";
import {
  BulletList,
  ExternalLink,
  SectionHeading,
} from "@/components/ui/PortfolioPrimitives";

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-links">
      {project.liveUrl ? (
        <ExternalLink href={project.liveUrl}>
          Explore {project.displayTitle ?? project.title}
        </ExternalLink>
      ) : null}
      <ExternalLink href={project.githubUrl}>Source code</ExternalLink>
    </div>
  );
}

function Gallery({ images }: { images: readonly ProjectImage[] }) {
  return (
    <div className="product-stills">
      {images.map((image) => (
        <figure key={image.src}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 700px) 100vw, 45vw"
          />
          <figcaption>{image.alt}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  const title = project.displayTitle ?? project.title;
  const media = project.media;
  const summary =
    project.engineeringIntro ?? project.bullets[0] ?? project.tagline;
  if (media?.type === "image") {
    return (
      <article className="featured within-feature" data-project={project.id}>
        <div className="within-image" data-reveal="image">
          <Image
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            sizes="(max-width: 700px) 185vw, 90vw"
          />
        </div>
        <div className="within-caption">
          <div>
            <p className="project-category">
              {project.category ?? "Software"} · {project.year}
            </p>
            <h3>{title}</h3>
            <p className="project-description">{project.tagline}</p>
          </div>
          <div>
            <p>{normalizeContentText(summary)}</p>
            <p className="stack">{project.techStack.join(" · ")}</p>
            <ProjectLinks project={project} />
            <details className="within-details">
              <summary>
                Engineering details <span aria-hidden="true">+</span>
              </summary>
              <BulletList items={project.bullets} />
            </details>
          </div>
        </div>
      </article>
    );
  }
  return (
    <article className="featured tap-feature" data-project={project.id}>
      <div className="project-intro">
        <div>
          <p className="project-category">
            {project.category ?? "Software"} · {project.year}
          </p>
          <h3>{title}</h3>
        </div>
        <div>
          <p className="project-description">{project.tagline}</p>
          <p className="stack">{project.techStack.join(" · ")}</p>
          <ProjectLinks project={project} />
        </div>
      </div>
      {media?.type === "video" ? (
        <figure className="launch-film" data-reveal="image">
          <video
            controls
            playsInline
            preload="metadata"
            poster={media.poster}
            width={media.width}
            height={media.height}
            aria-label={media.alt}
          >
            <source src={media.src} type="video/mp4" />
            Your browser cannot play this video.{" "}
            <a href={media.src}>Download the {title} film.</a>
          </video>
          <figcaption>
            <span>{title} — product launch film</span>
            <span>Play to explore the product.</span>
          </figcaption>
        </figure>
      ) : null}
      <div className="engineering">
        <p className="engineering-lead">{normalizeContentText(summary)}</p>
        <div>
          <BulletList items={project.bullets.slice(1, 4)} />
          <details className="engineering-details">
            <summary>
              More about the build <span aria-hidden="true">+</span>
            </summary>
            <BulletList
              items={[
                ...project.bullets.slice(4),
                ...(project.bullets[0] ? [project.bullets[0]] : []),
              ]}
            />
            {project.gallery?.length ? (
              <Gallery images={project.gallery} />
            ) : null}
          </details>
        </div>
      </div>
    </article>
  );
}

/** Curated work is selected by published configuration rather than duplicated UI data. */
export function SelectedWork({ projects }: { projects: readonly Project[] }) {
  return (
    <section className="work section" id="work">
      <SectionHeading
        title="Selected work"
        description="Products I’ve built, and the engineering decisions behind them."
      />
      {projects.map((project) => (
        <FeaturedProject key={project.id} project={project} />
      ))}
    </section>
  );
}
