/**
 * Atlas Munich brand geometry.
 *
 * The Bavarian Raute and Moroccan zellige share one shape — the diamond.
 * Everything here is built from it: the mark (a khatam star made of two
 * overlapping squares), the tile band (a Raute lattice that blooms into
 * stars), and the horizon (Atlas ridge behind the Alps and Frauenkirche).
 */

export function ZelligeStar({ className }: { className?: string }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} aria-hidden="true">
      <g fill="currentColor">
        <rect x="-8" y="-8" width="16" height="16" rx="1" />
        <rect x="-8" y="-8" width="16" height="16" rx="1" transform="rotate(45)" />
      </g>
    </svg>
  );
}

/**
 * A diamond that blooms into an eight-pointed star when its `group`
 * parent is hovered — the brand's micro-interaction.
 */
export function BloomStar({ className }: { className?: string }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} aria-hidden="true">
      <rect
        x="-8"
        y="-8"
        width="16"
        height="16"
        rx="1"
        transform="rotate(45)"
        fill="currentColor"
      />
      <rect
        x="-8"
        y="-8"
        width="16"
        height="16"
        rx="1"
        fill="currentColor"
        className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </svg>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="-24 -24 48 48" className={className} aria-hidden="true">
      <g className="fill-zellige">
        <rect x="-14" y="-14" width="28" height="28" rx="3" />
        <rect x="-14" y="-14" width="28" height="28" rx="3" transform="rotate(45)" />
      </g>
      <rect
        x="-6"
        y="-6"
        width="12"
        height="12"
        rx="1"
        transform="rotate(45)"
        className="fill-saffron"
      />
    </svg>
  );
}

/**
 * A single row of Bavarian lozenges that periodically bloom into
 * eight-pointed zellige stars. `id` must be unique per instance.
 */
export function RauteBand({
  id,
  className,
  latticeClass = "stroke-zellige/30",
  tones = ["fill-terracotta", "fill-saffron", "fill-zellige", "fill-saffron", "fill-terracotta"],
}: {
  id: string;
  className?: string;
  latticeClass?: string;
  tones?: string[];
}) {
  const positions = [130, 442, 754, 1066, 1378];
  return (
    <svg
      viewBox="0 0 1456 64"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} width="52" height="64" patternUnits="userSpaceOnUse">
          <path
            d="M26 5 L47 32 L26 59 L5 32 Z"
            fill="none"
            strokeWidth="1.5"
            className={latticeClass}
          />
        </pattern>
      </defs>
      <rect width="1456" height="64" fill={`url(#${id})`} />
      {positions.map((x, i) => (
        <g key={x} transform={`translate(${x} 32)`} className={tones[i % tones.length]}>
          <rect x="-11" y="-11" width="22" height="22" rx="1" />
          <rect x="-11" y="-11" width="22" height="22" rx="1" transform="rotate(45)" />
        </g>
      ))}
    </svg>
  );
}

/**
 * The horizon the brand lives on: the Atlas ridge in the far distance,
 * the Alps in front of it, and Munich's silhouette — Frauenkirche's twin
 * onion domes beside Peterskirche's spire.
 */
export function AtlasHorizon({
  className,
  ridgeFar = "fill-terracotta/15 dark:fill-terracotta/10",
  ridgeNear = "fill-zellige/15 dark:fill-zellige/12",
  city = "fill-foreground/50",
}: {
  className?: string;
  ridgeFar?: string;
  ridgeNear?: string;
  city?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      {/* Atlas ridge — far */}
      <path
        d="M0 158 L110 104 L205 140 L318 92 L420 138 L535 100 L640 142 L760 106 L865 144 L985 96 L1090 138 L1205 102 L1310 140 L1440 100 L1440 200 L0 200 Z"
        className={ridgeFar}
      />
      {/* Alps — near */}
      <path
        d="M0 178 L85 138 L175 166 L280 122 L375 164 L490 132 L580 168 L700 140 L810 170 L920 130 L1030 166 L1145 136 L1250 168 L1355 142 L1440 164 L1440 200 L0 200 Z"
        className={ridgeNear}
      />
      {/* Munich silhouette */}
      <g className={city}>
        {/* Peterskirche spire */}
        <path d="M645 200 V128 l7 -16 l7 16 v72 Z" />
        {/* Frauenkirche towers with onion domes */}
        <g>
          <rect x="668" y="98" width="26" height="102" />
          <path d="M668 98 C662 88, 666 78, 681 72 C696 78, 700 88, 694 98 Z" />
          <rect x="679.5" y="62" width="3" height="10" rx="1.5" />
          <circle cx="681" cy="60" r="2.5" />
        </g>
        <g>
          <rect x="706" y="98" width="26" height="102" />
          <path d="M706 98 C700 88, 704 78, 719 72 C734 78, 738 88, 732 98 Z" />
          <rect x="717.5" y="62" width="3" height="10" rx="1.5" />
          <circle cx="719" cy="60" r="2.5" />
        </g>
        {/* pitched roofs at the towers' feet */}
        <path d="M604 200 V158 l16 -11 l16 11 v42 Z" />
        <path d="M754 200 V162 l14 -10 l14 10 v38 Z" />
      </g>
    </svg>
  );
}
