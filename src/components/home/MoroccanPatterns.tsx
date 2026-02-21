/**
 * Moroccan-inspired geometric patterns as subtle SVG decorations.
 * Uses traditional zellige / Islamic geometric motifs rendered minimally.
 */

/**
 * A horizontal band of interlocking 8-pointed stars — classic Moroccan zellige motif.
 * Renders as a thin decorative border/divider.
 */
export function ZelligeBorder({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 800 24" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern
            id="zellige-star"
            x="0"
            y="0"
            width="48"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            {/* 8-pointed star built from two overlapping squares */}
            <g transform="translate(24, 12)">
              <rect
                x="-6"
                y="-6"
                width="12"
                height="12"
                transform="rotate(0)"
                className="fill-current"
              />
              <rect
                x="-6"
                y="-6"
                width="12"
                height="12"
                transform="rotate(45)"
                className="fill-current"
              />
            </g>
          </pattern>
        </defs>
        <rect width="800" height="24" fill="url(#zellige-star)" />
      </svg>
    </div>
  );
}

/**
 * Corner ornament — a quarter-circle geometric rosette inspired by Moroccan riad archways.
 * Place in corners of sections for subtle cultural flair.
 */
export function MoroccanCorner({
  className,
  position = "top-left",
}: {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const rotation = {
    "top-left": "",
    "top-right": "scale(-1, 1)",
    "bottom-left": "scale(1, -1)",
    "bottom-right": "scale(-1, -1)",
  }[position];

  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="h-full w-full" style={{ transform: rotation }}>
        {/* Concentric quarter-arcs with Moroccan colors */}
        <path
          d="M0,0 Q0,120 120,120"
          fill="none"
          strokeWidth="1.5"
          className="stroke-red-500/20 dark:stroke-red-400/15"
        />
        <path
          d="M0,0 Q0,90 90,90"
          fill="none"
          strokeWidth="1.5"
          className="stroke-amber-500/20 dark:stroke-amber-400/15"
        />
        <path
          d="M0,0 Q0,60 60,60"
          fill="none"
          strokeWidth="1.5"
          className="stroke-green-500/20 dark:stroke-green-400/15"
        />
        <path
          d="M0,0 Q0,30 30,30"
          fill="none"
          strokeWidth="1"
          className="stroke-emerald-500/15 dark:stroke-emerald-400/10"
        />
        {/* Small diamond at the origin */}
        <polygon
          points="0,6 6,0 0,-6 -6,0"
          transform="translate(8, 8)"
          className="fill-red-500/15 dark:fill-red-400/10"
        />
      </svg>
    </div>
  );
}

/**
 * A subtle repeating geometric lattice — evokes traditional mashrabiya (wooden lattice screens).
 * Use as a full-section background overlay at very low opacity.
 */
export function MashrabiyaPattern({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg width="100%" height="100%" className="h-full w-full">
        <defs>
          <pattern id="mashrabiya" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            {/* Diamond lattice */}
            <path
              d="M20,0 L40,20 L20,40 L0,20 Z"
              fill="none"
              strokeWidth="0.5"
              className="stroke-current"
            />
            {/* Inner diamond */}
            <path
              d="M20,8 L32,20 L20,32 L8,20 Z"
              fill="none"
              strokeWidth="0.5"
              className="stroke-current"
            />
            {/* Center dot */}
            <circle cx="20" cy="20" r="1.5" className="fill-current" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mashrabiya)" />
      </svg>
    </div>
  );
}
