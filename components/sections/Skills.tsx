import { getSkills } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { TagBadge } from "@/components/ui/TagBadge";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { Code } from "lucide-react";
import type { ReactNode } from "react";

const iconMap: Record<string, ReactNode> = {
  code: <Code size={18} />,
  layout: <Code size={18} />,
  server: <Code size={18} />,
  brain: <Code size={18} />,
  database: <Code size={18} />,
  cloud: <Code size={18} />,
  wrench: <Code size={18} />,
};

export function Skills() {
  const skills = getSkills();

  return (
    <SectionWrapper id="skills">
      <AnimatedSection>
        <h2 className="font-display text-3xl font-bold text-on-surface md:text-4xl">
          Technical Skills
        </h2>
        <p className="mt-3 max-w-2xl text-on-surface-variant">
          A comprehensive toolkit spanning languages, frameworks, cloud, and AI/ML.
        </p>
      </AnimatedSection>

      <StaggerContainer
        className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        staggerDelay={0.1}
      >
        {skills.map((category) => (
          <StaggerItem key={category.category}>
            <div className="glass-card glass-card-hover p-6">
              <div className="flex items-center gap-2 text-primary">
                {iconMap[category.icon] ?? <Code size={18} />}
                <h3 className="font-display text-lg font-semibold text-on-surface">
                  {category.category}
                </h3>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <TagBadge key={item} label={item} />
                ))}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}