import type { ReactNode } from "react";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * Section wrapper with consistent padding and max-width containment.
 * Uses design token spacing: section-padding-lg (120px) / section-padding-sm (64px).
 * Container max-width: 1280px per DESIGN.md.
 */
export function SectionWrapper({ id, children, className = "" }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`mx-auto w-full container-max px-6 py-20 md:px-8 lg:py-section-lg ${className}`}
    >
      {children}
    </section>
  );
}