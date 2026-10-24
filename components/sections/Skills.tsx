import type { SkillCategory } from "@/lib/types";
import { SectionHeading } from "@/components/ui/PortfolioPrimitives";

/** Technical skills grouped by practice without invented proficiency scores. */
export function Skills({
  categories,
}: {
  categories: readonly SkillCategory[];
}) {
  return (
    <section className="skills section" id="skills">
      <SectionHeading
        title="Skills & tools"
        description="The languages, systems, and tools I work with."
      />
      <div className="skill-list">
        {categories.map((group) => (
          <article
            className="skill-group"
            key={group.category}
            data-reveal="skill"
          >
            <h3>
              {group.category === "Languages"
                ? "Programming languages"
                : group.category}
            </h3>
            <p>{group.items.join(" · ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
