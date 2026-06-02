/**
 * Circular ring progress indicator using SVG.
 * Fills a ring arc based on the percentage prop.
 * Glow effect on the filled arc for visual impact.
 */
export function CircularRing({
  percentage,
  label,
}: {
  percentage: number;
  label: string;
}) {
  const radius = 36;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90"
      >
        {/* Background ring */}
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Filled arc */}
        <circle
          stroke="#22c55e"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={percentage === 100 ? "animate-[pulse-glow_3s_ease-in-out_infinite]" : ""}
          style={{
            filter: "drop-shadow(0 0 6px rgba(34,197,94,0.5))",
            transition: "stroke-dashoffset 1s ease-out",
          }}
        />
      </svg>
      <span className="absolute text-xs font-semibold text-on-surface">
        {label}
      </span>
    </div>
  );
}