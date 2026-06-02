import { getExperience } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TimelineNode } from "@/components/ui/TimelineNode";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { isValid, parseISO } from "date-fns";
import Link from "next/link";
import type { Experience } from "@/lib/types";

function parseDate(dateStr: string): Date {
  const cleaned = dateStr.replace("—", "-").trim();
  if (cleaned.toLowerCase().includes("present")) {
    return new Date();
  }
  const parts = cleaned.split(" - ");
  const startPart = parts[0]?.trim() ?? cleaned;
  const parsed = parseISO(startPart);
  return isValid(parsed) ? parsed : new Date();
}

export function Experience() {
  const experience = getExperience();
  const sorted = [...experience].sort(
    (a, b) => parseDate(b.dateRange).getTime() - parseDate(a.dateRange).getTime(),
  );

  return (
    <SectionWrapper id="experience">
      <AnimatedSection>
        <h2 className="font-display text-3xl font-bold text-on-surface md:text-4xl">
          Professional Experience
        </h2>
        <p className="mt-3 max-w-2xl text-on-surface-variant">
          A track record of delivering production systems across freelance and internship roles.
        </p>
      </AnimatedSection>

      <StaggerContainer className="relative mt-12" staggerDelay={0.15}>
        {/* Timeline vertical line */}
        <div className="absolute left-[7px] top-0 h-full w-[2px] bg-gradient-to-b from-primary/60 to-transparent md:left-[9px]" />

        {sorted.map((role: Experience, index: number) => (
          <StaggerItem key={role.id}>
            <div className="relative mb-10 flex gap-4 last:mb-0 md:gap-6">
              {/* Timeline node */}
              <div className="mt-1 shrink-0">
                <TimelineNode isActive={index === 0} />
              </div>

              {/* Card */}
              <div className="flex-1 rounded-default border border-white/10 bg-white/[0.03] p-5 backdrop-blur-[20px] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] md:p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-on-surface">
                      {role.title}
                    </h3>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
                      {role.companyUrl ? (
                        <Link
                          href={role.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          {role.company}
                        </Link>
                      ) : (
                        <span className="font-medium">{role.company}</span>
                      )}
                      <span className="hidden sm:inline">|</span>
                      <span>{role.location}</span>
                    </div>
                  </div>

                  <time className="mt-1 font-mono text-xs text-primary sm:mt-0">
                    {role.dateRange}
                  </time>
                </div>

                <ul className="mt-4 space-y-2">
                  {role.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-on-surface-variant">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}