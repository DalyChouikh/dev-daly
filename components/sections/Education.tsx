import { getEducation } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import type { Education } from "@/lib/types";

export function Education() {
  const education = getEducation();

  return (
    <SectionWrapper id="education">
      <AnimatedSection>
        <h2 className="font-display text-3xl font-bold text-on-surface md:text-4xl">
          Education
        </h2>
        <p className="mt-3 max-w-2xl text-on-surface-variant">
          Academic foundation in software engineering and computer science.
        </p>
      </AnimatedSection>

      <StaggerContainer
        className="mt-12 grid gap-6 md:grid-cols-2"
        staggerDelay={0.15}
      >
        {education.map((entry: Education) => (
          <StaggerItem key={entry.id}>
            <div className="rounded-default border border-white/10 bg-white/[0.03] p-6 backdrop-blur-[20px] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="font-display text-lg font-bold text-on-surface">
                  {entry.institution}
                </h3>
                <time className="font-mono text-xs text-primary">
                  {entry.dateRange}
                </time>
              </div>

              <p className="mt-1 text-sm text-on-surface-variant">
                {entry.location}
              </p>

              <div className="mt-2 font-semibold text-secondary">
                {entry.degree}
              </div>

              {entry.coursework.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Coursework
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entry.coursework.map((course) => (
                      <span
                        key={course}
                        className="rounded-sm bg-secondary/10 px-2 py-0.5 font-mono text-xs text-secondary"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}