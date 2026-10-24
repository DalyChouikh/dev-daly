import type { Experience as ExperienceEntry } from "@/lib/types";
import { sortExperience } from "@/lib/portfolio";
import {
  BulletList,
  ExternalLink,
  SectionHeading,
} from "@/components/ui/PortfolioPrimitives";

/** Full career history with clear employer, role, and chronology. */
export function Experience({
  entries,
}: {
  entries: readonly ExperienceEntry[];
}) {
  return (
    <section className="experience section" id="experience">
      <SectionHeading
        title="Experience"
        description="From independent delivery to product teams."
      />
      <div className="career-list">
        {sortExperience(entries).map((entry) => (
          <article
            className="career"
            key={entry.id}
            data-experience={entry.id}
            data-reveal="career"
          >
            <div className="career-company">
              <p className="date">{entry.dateRange}</p>
              <h3>
                {entry.companyUrl ? (
                  <ExternalLink href={entry.companyUrl}>
                    {entry.company}
                  </ExternalLink>
                ) : (
                  entry.company
                )}
              </h3>
              <p className="location">{entry.location}</p>
            </div>
            <div className="career-body">
              <h4>{entry.title}</h4>
              <BulletList items={entry.bullets} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
