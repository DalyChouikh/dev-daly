import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

/**
 * Glassmorphism card component following DESIGN.md elevation system.
 * Level 1: base glass effect. Level 2 (hover): green border glow.
 */
export function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
  return (
    <div
      className={[
        "rounded-default border border-white/10 bg-white/[0.03] backdrop-blur-[20px]",
        hover && "transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}