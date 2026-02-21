/**
 * Munich Skyline SVG — silhouette of iconic Munich landmarks.
 * Rendered at the bottom of the hero section as a subtle decorative element.
 * Includes: Frauenkirche, Neues Rathaus, St. Peter's, Uptown Tower,
 * BMW Vier-Zylinder, and Olympiaturm.
 */
export function MunichSkyline({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 1440 200" className="h-full w-full" preserveAspectRatio="none">
        {/* Main Munich skyline base */}
        <path
          className="fill-zinc-400 dark:fill-zinc-500"
          d="M0,200 L0,175
            L40,175 L40,165 L55,165 L55,175
            L80,175 L80,140
            L90,140 L90,70 L95,70 L95,52 Q100,35 105,52 L105,70 L110,70 L110,140
            L120,140 L120,70 L125,70 L125,52 Q130,35 135,52 L135,70 L140,70 L140,140
            L150,140 L150,175
            L200,175 L200,160 L220,160 L220,175
            L260,175 L260,155 L280,155 L280,175
            L320,175 L320,145 L330,145 L330,130 L340,130 L340,145 L350,145 L350,175
            L400,175 L400,140
            L415,140 L415,95 L420,95 L420,75 L425,75 L425,55 L430,40 L435,55 L435,75 L440,75 L440,95 L445,95 L445,140
            L460,140 L460,175
            L510,175 L510,160 L530,160 L530,175
            L170,175 L170,150 L180,150 L180,135 L190,135 L190,120 L200,100 L210,120 L210,135 L220,135 L220,150 L230,150 L230,175
            L680,175 L680,160 L700,160 L700,175
            L740,175 L740,155 L760,155 L760,175
            L800,175 L800,145 L815,145 L815,160 L830,160 L830,145 L845,145 L845,175
            L890,175 L890,160 L910,160 L910,175
            L950,175 L950,160 L970,160 L970,175
            L1010,175 L1010,155 L1030,155 L1030,175
            L1070,175 L1070,160 L1090,160 L1090,175
            L1130,175 L1130,150 L1150,150 L1150,175
            L1200,175 L1200,160 L1220,160 L1220,175
            L1260,175 L1260,150 L1280,150 L1280,175
            L1320,175 L1320,165 L1340,165 L1340,175
            L1440,175 L1440,200 Z"
        />

        {/* Uptown München (O2 Tower) */}
        <g transform="translate(1060, 35)">
          <rect x="0" y="20" width="40" height="140" className="fill-zinc-400 dark:fill-zinc-500" />
        </g>

        {/* BMW Vier-Zylinder */}
        <g transform="translate(1220, 85)">
          <ellipse cx="0" cy="0" rx="14" ry="6" className="fill-zinc-400 dark:fill-zinc-500" />
          <rect x="-14" y="0" width="28" height="90" className="fill-zinc-400 dark:fill-zinc-500" />
          <ellipse cx="30" cy="5" rx="14" ry="6" className="fill-zinc-400 dark:fill-zinc-500" />
          <rect x="16" y="5" width="28" height="85" className="fill-zinc-400 dark:fill-zinc-500" />
          <ellipse cx="8" cy="-8" rx="14" ry="6" className="fill-zinc-400 dark:fill-zinc-500" />
          <rect x="-6" y="-8" width="28" height="98" className="fill-zinc-400 dark:fill-zinc-500" />
          <ellipse cx="38" cy="-3" rx="14" ry="6" className="fill-zinc-400 dark:fill-zinc-500" />
          <rect x="24" y="-3" width="28" height="93" className="fill-zinc-400 dark:fill-zinc-500" />
        </g>

        {/* Olympiaturm */}
        <rect
          x="1370"
          y="55"
          width="10"
          height="120"
          className="fill-zinc-400 dark:fill-zinc-500"
        />
        <ellipse cx="1375" cy="55" rx="25" ry="18" className="fill-zinc-400 dark:fill-zinc-500" />
        <ellipse cx="1375" cy="45" rx="20" ry="12" className="fill-zinc-400 dark:fill-zinc-500" />
        <ellipse cx="1375" cy="85" rx="15" ry="8" className="fill-zinc-400 dark:fill-zinc-500" />
        <rect x="1373" y="5" width="4" height="40" className="fill-zinc-400 dark:fill-zinc-500" />
        <polygon points="1375,0 1371,8 1379,8" className="fill-zinc-400 dark:fill-zinc-500" />

        {/* Frauenkirche dome crosses */}
        <rect x="99" y="28" width="2" height="12" className="fill-zinc-400 dark:fill-zinc-500" />
        <rect x="95" y="32" width="10" height="2" className="fill-zinc-400 dark:fill-zinc-500" />
        <rect x="129" y="28" width="2" height="12" className="fill-zinc-400 dark:fill-zinc-500" />
        <rect x="125" y="32" width="10" height="2" className="fill-zinc-400 dark:fill-zinc-500" />

        {/* Rathaus spire cross */}
        <rect x="429" y="25" width="2" height="18" className="fill-zinc-400 dark:fill-zinc-500" />
        <rect x="425" y="30" width="10" height="2" className="fill-zinc-400 dark:fill-zinc-500" />

        {/* St. Peter's spire cross */}
        <rect x="199" y="90" width="2" height="14" className="fill-zinc-400 dark:fill-zinc-500" />
        <rect x="195" y="95" width="10" height="2" className="fill-zinc-400 dark:fill-zinc-500" />
      </svg>
    </div>
  );
}
