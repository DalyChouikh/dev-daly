/**
 * Timeline node with pulsing green dot per DESIGN.md timeline spec.
 * The line has a gradient from transparent to primary green.
 */
export function TimelineNode({
  isActive = false,
  className = "",
}: {
  isActive?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div
        className={[
          "h-3.5 w-3.5 rounded-full border-2 border-primary bg-surface",
          isActive && "animate-[pulse-glow_2s_ease-in-out_infinite]",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  );
}