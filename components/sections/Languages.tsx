import { getLanguages } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CircularRing } from "@/components/ui/CircularRing";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import type { Language } from "@/lib/types";

const proficiencyMap: Record<string, { percentage: number; label: string }> = {
  Native: { percentage: 100, label: "100%" },
  "Professional proficiency": { percentage: 75, label: "75%" },
  "Elementary proficiency": { percentage: 25, label: "25%" },
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
          const level = proficiencyMap[lang.proficiency] ?? { percentage: 50, label: "50%" };

          return (
            <StaggerItem key={lang.name}>
              <div className="flex items-center gap-5 rounded-default border border-white/10 bg-white/[0.03] p-5 backdrop-blur-[20px] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <CircularRing percentage={level.percentage} label={level.label} />

                <div>
                  <h3 className="font-display text-lg font-bold text-on-surface">
                    {lang.name}
                  </h3>
                  <p className="mt-1 text-sm text-primary">
                    {lang.proficiency}
                  </p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </SectionWrapper>
  );
}