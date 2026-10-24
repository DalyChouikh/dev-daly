import type { Education as EducationEntry } from "@/lib/types";
import { SectionHeading } from "@/components/ui/PortfolioPrimitives";

/** Degrees and coursework stay complete and readable in the public page. */
export function Education({ entries }: { entries: readonly EducationEntry[] }) {
  return (
    <section className="education section" id="education">
      <SectionHeading
        title="Education"
        description="Software engineering, from foundations to distributed systems."
      />
      <div className="education-list">
        {entries.map((entry) => (
          <article
            className="degree"
            key={entry.id}
            data-education={entry.id}
            data-reveal="degree"
          >
            <p className="date">{entry.dateRange}</p>
            <div>
              <h3>{entry.degree}</h3>
              <p className="institution">{entry.institution}</p>
              <p className="location">{entry.location}</p>
              <p className="coursework">{entry.coursework.join(" · ")}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
