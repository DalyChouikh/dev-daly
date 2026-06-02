/**
 * Skill/tech tag badge following DESIGN.md primary color guidelines.
 * Uses #22C55E (primary-container) background with dark text.
 */
export function TagBadge({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-sm bg-primary-container/20 px-2.5 py-0.5 font-mono text-xs font-medium text-primary transition-colors duration-300 hover:bg-primary-container/40">
      {label}
    </span>
  );
}