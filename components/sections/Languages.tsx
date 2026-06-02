import { getLanguages } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import type { Language } from "@/lib/types";

const proficiencyOrder: Record<string, number> = {
  "Native": 1,
  "Professional proficiency": 0.75,
  "Elementary proficiency": 0.25,
};

export function Languages() {
  const languages = getLanguages();

  return (
    <SectionWrapper id="languages">
      <AnimatedSection>
        <h2 className="font-display text-3xl font-bold text-on-surface md:text-4xl">
          Languages
        </h2>
        <p className="mt-3 max-w-2xl text-on-surface-variant">
          Communication skills across multiple languages.
        </p>
      </AnimatedSection>

      <StaggerContainer
        className="mt-12 grid gap-6 md:grid-cols-3"
        staggerDelay={0.1}
      >
        {languages.map((lang: Language) => {
          const width = proficiencyOrder[lang.proficiency] ?? 0.5;

          return (
            <StaggerItem key={lang.name}>
              <div className="rounded-default border border-white/10 bg-white/[0.03] p-6 backdrop-blur-[20px] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-on-surface">
                    {lang.name}
                  </h3>
                  <span className="font-mono text-xs text-primary">
                    {lang.proficiency}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 w-full rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-container to-primary transition-all duration-1000"
                    style={{ width: `${width * 100}%` }}
                  />
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </SectionWrapper>
  );
}