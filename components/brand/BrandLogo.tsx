type BrandLogoProps = {
  variant?: "wordmark" | "symbol";
  className?: string;
  label?: string;
};

/** The approved Daly paths, rendered without a font or client-side runtime. */
export function BrandLogo({
  variant = "wordmark",
  className,
  label = "Daly",
}: BrandLogoProps) {
  const isWordmark = variant === "wordmark";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={isWordmark ? "0 0 680 288" : "0 0 256 256"}
      width={isWordmark ? 680 : 256}
      height={isWordmark ? 288 : 256}
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={className}
    >
      {label ? <title>{label}</title> : null}
      {isWordmark ? (
        <g>
          <path fillRule="evenodd" d="M144 24H184V212H144V196C132 209 113 216 93 216C51 216 24 187 24 148C24 109 52 79 94 79C115 79 132 87 144 100ZM104 116C80 116 64 129 64 148C64 167 80 180 104 180C128 180 144 167 144 148C144 129 128 116 104 116Z" />
          <path fillRule="evenodd" d="M332 84H372V212H332V196C320 209 301 216 281 216C239 216 212 187 212 148C212 109 240 79 282 79C303 79 320 87 332 100ZM292 116C268 116 252 129 252 148C252 167 268 180 292 180C316 180 332 167 332 148C332 129 316 116 292 116Z" />
          <path d="M410 24H450V212H410Z" />
          <path d="M478 84H524L565 155.01L606 84H652L548.08 264H502.08L542 194.85Z" />
          <circle cx="640" cy="196" r="16" />
        </g>
      ) : (
        <g>
          <path fillRule="evenodd" d="M144 24H184V212H144V196C132 209 113 216 93 216C51 216 24 187 24 148C24 109 52 79 94 79C115 79 132 87 144 100ZM104 116C80 116 64 129 64 148C64 167 80 180 104 180C128 180 144 167 144 148C144 129 128 116 104 116Z" />
          <circle cx="216" cy="196" r="16" />
        </g>
      )}
    </svg>
  );
}

export default BrandLogo;
