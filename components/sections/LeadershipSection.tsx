import { getLeadership } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import type { Leadership } from "@/lib/types";

export function LeadershipSection() {
  const leadership = getLeadership();

  return (
    <SectionWrapper id="leadership">
      <AnimatedSection>
        <h2 className="font-display text-3xl font-bold text-on-surface md:text-4xl">
          Leadership & Community
        </h2>
        <p className="mt-3 max-w-2xl text-on-surface-variant">
          Active contributor to developer communities and campus organizations.
        </p>
      </AnimatedSection>

      <StaggerContainer className="mt-12" staggerDelay={0.15}>
        {leadership.map((entry: Leadership) => (
          <StaggerItem key={entry.id}>
            <div className="mb-6 glass-card glass-card-hover p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-on-surface">
                    {entry.role}
                  </h3>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
                    {entry.organizationUrl ? (
                      <Link
                        href={entry.organizationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {entry.organization}
                      </Link>
                    ) : (
                      <span className="font-medium">{entry.organization}</span>
                    )}
                    <span className="hidden sm:inline">|</span>
                    <span>{entry.location}</span>
                  </div>
                </div>

                <time className="mt-1 font-mono text-xs text-primary sm:mt-0">
                  {entry.dateRange}
                </time>
              </div>

              <ul className="mt-4 space-y-2">
                {entry.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed text-on-surface-variant"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}