/**
 * Zellige rosette — the hero's tiled ground.
 *
 * Real zellige is radial, not a wallpaper grid: a shamsa (sun) rosette laid
 * from concentric rings of hand-cut pieces, each ring a single shape repeated
 * around the centre. This builds one the same way, ring by ring, from the
 * core star outward through petals, rhombi, kites and a rim of khatam stars.
 *
 * The white pieces of a real panel are the plaster itself, so the gaps
 * between rings are left open and the page background reads as those pieces.
 * Every ring is drawn once into <defs> and placed with rotated <use>, so the
 * whole thing costs a few kilobytes of markup and no network request.
 */

const VIEW = 112;

function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
}

const n2 = (v: number) => v.toFixed(1);

/**
 * Half-width a piece may take at radius `r` when `count` of them sit around
 * the ring, leaving `grout` of the pitch as plaster. This is what keeps the
 * spacing even from the core out to the rim.
 */
function halfWidth(r: number, count: number, grout = 0.14) {
  return (Math.PI / count) * r * (1 - grout);
}

/** A pointed almond, the classic petal piece. */
function petal(r1: number, r2: number, count: number) {
  const rm = (r1 + r2) / 2;
  const w = halfWidth(rm, count) * 1.9; // control point, curve peaks near w/2
  return `M${n2(r1)},0Q${n2(rm)},${n2(w)} ${n2(r2)},0Q${n2(rm)},${n2(-w)} ${n2(r1)},0Z`;
}

/** A rhombus spanning two radii. */
function rhombus(r1: number, r2: number, count: number) {
  const rm = (r1 + r2) / 2;
  const w = halfWidth(rm, count);
  return `M${n2(r1)},0L${n2(rm)},${n2(w)}L${n2(r2)},0L${n2(rm)},${n2(-w)}Z`;
}

/** A kite: blunt at the ring's inner edge, pointed outward. */
function kite(r1: number, r2: number, count: number) {
  const rm = r1 + (r2 - r1) * 0.42;
  const w = halfWidth(rm, count);
  const w1 = w * 0.55;
  return [
    `M${n2(r1)},${n2(-w1)}`,
    `L${n2(rm)},${n2(-w)}`,
    `L${n2(r2)},0`,
    `L${n2(rm)},${n2(w)}`,
    `L${n2(r1)},${n2(w1)}`,
    "Z",
  ].join("");
}

/** A small diamond centred on the ring, for the pieces that fill the voids. */
function chip(rc: number, a: number, b: number) {
  return `M${n2(rc - a)},0L${n2(rc)},${n2(-b)}L${n2(rc + a)},0L${n2(rc)},${n2(b)}Z`;
}

/** An eight-pointed khatam star centred on the ring. */
function khatam(rc: number, outer: number) {
  const inner = outer * 0.56;
  const p: string[] = [];
  for (let k = 0; k < 16; k++) {
    const [x, y] = polar(k % 2 === 0 ? outer : inner, k * 22.5);
    p.push(`${n2(rc + x)},${n2(y)}`);
  }
  return `M${p.join("L")}Z`;
}

type Ring = {
  id: string;
  d: string;
  count: number;
  /** Rotation of the whole ring, to interleave it with its neighbours. */
  offset?: number;
  fill: string;
  /** Every nth piece glazes slowly, so light seems to move across the panel. */
  glaze?: number;
};

/* Laid from the centre out. Radii are tuned so consecutive rings almost
   touch: the thin gaps left over are the panel's white pieces. */
const RINGS: Ring[] = [
  { id: "c", d: khatam(0, 17), count: 1, fill: "fill-tile-terra" },
  { id: "p", d: petal(19, 36, 16), count: 16, fill: "fill-tile-green", glaze: 4 },
  { id: "pf", d: chip(27, 2.4, 3.6), count: 16, offset: 11.25, fill: "fill-zinc-800" },
  { id: "r", d: rhombus(38, 58, 16), count: 16, fill: "fill-bloom", glaze: 5 },
  { id: "rf", d: chip(48, 3.4, 5.4), count: 16, offset: 11.25, fill: "fill-zinc-800" },
  { id: "d", d: chip(63, 2.8, 4.4), count: 32, fill: "fill-tile-blue" },
  { id: "k", d: kite(67, 87, 16), count: 16, fill: "fill-tile-saffron", glaze: 3 },
  { id: "kf", d: chip(77, 3.8, 6), count: 16, offset: 11.25, fill: "fill-zinc-800" },
  { id: "s", d: khatam(96, 12), count: 8, fill: "fill-tile-blue", glaze: 3 },
  { id: "sf", d: chip(96, 5.5, 8), count: 8, offset: 22.5, fill: "fill-tile-terra" },
  { id: "rim", d: chip(108, 2.2, 3.6), count: 32, fill: "fill-zinc-500" },
];

/**
 * One rosette. Sits half off the edge of the hero, like a panel continuing
 * past the wall, and turns slowly enough that you notice it only if you look.
 */
export function ZelligeRosette({
  uid,
  spin = "420s",
  reverse = false,
  className = "",
  svgClassName = "",
}: {
  /** Prefix for this instance's shape ids. */
  uid: string;
  /** Seconds for one full turn. Long is the point. */
  spin?: string;
  reverse?: boolean;
  className?: string;
  svgClassName?: string;
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div
        className="zellige-turn"
        style={
          {
            "--zt": spin,
            "--zturn": reverse ? "-360deg" : "360deg",
          } as React.CSSProperties
        }
      >
        <svg
          viewBox={`${-VIEW} ${-VIEW} ${VIEW * 2} ${VIEW * 2}`}
          className={`block opacity-30 dark:opacity-50 ${svgClassName}`}
        >
          <defs>
            {RINGS.map((ring) => (
              <path key={ring.id} id={`${uid}-${ring.id}`} d={ring.d} />
            ))}
          </defs>
          {RINGS.map((ring, index) => (
            <g
              key={ring.id}
              className="zellige-ring"
              style={{ "--zd": `${(index * 0.09).toFixed(2)}s` } as React.CSSProperties}
            >
              {Array.from({ length: ring.count }, (_, k) => {
                const glazes = ring.glaze !== undefined && k % ring.glaze === 0;
                return (
                  <use
                    key={k}
                    href={`#${uid}-${ring.id}`}
                    transform={`rotate(${((k * 360) / ring.count + (ring.offset ?? 0)).toFixed(2)})`}
                    className={`${ring.fill} ${glazes ? "zellige-breathe" : ""}`}
                    style={
                      glazes
                        ? ({
                            "--zb": `${9 + (k % 4) * 1.7}s`,
                            "--zbd": `-${(k % 7) * 1.3}s`,
                          } as React.CSSProperties)
                        : undefined
                    }
                  />
                );
              })}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
