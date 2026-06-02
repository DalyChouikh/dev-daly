import Link from "next/link";
import { Award } from "lucide-react";
import { getCertifications } from "@/lib/data";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import type { Certification } from "@/lib/types";

export function Certifications() {
  const certifications = getCertifications();

  return (
    <SectionWrapper id="certifications">
      <AnimatedSection>
        <h2 className="font-display text-3xl font-bold text-on-surface md:text-4xl">
          Certifications
        </h2>
        <p className="mt-3 max-w-2xl text-on-surface-variant">
          Industry-recognized credentials and training.
        </p>
      </AnimatedSection>

      <StaggerContainer
        className="mt-12 flex flex-wrap gap-4"
        staggerDelay={0.1}
      >
        {certifications.map((cert: Certification) => (
          <StaggerItem key={cert.name}>
            <Link
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur-[20px] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
            >
              <Award size={16} className="text-primary" />
              <span className="text-sm font-medium text-on-surface">
                {cert.name}
              </span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}