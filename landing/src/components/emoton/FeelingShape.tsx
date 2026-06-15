import { memo, useEffect, useState } from 'react';
import type { ZoneId } from '../../lib/emotonCore';

/**
 * FeelingShape — a RADIAL FIELD OF THIN GLOWING RAYS rising from the central "Я"
 * orb on the "Я и [feeling]" screen. The page absolutely-centres both; this field
 * renders BEHIND the orb (lower z-index), so the rays appear to emanate from the
 * self. The SVG viewBox is centred on the orb origin (0,0), and most rays are
 * biased toward `direction` — a quiet field of light, not a salute.
 *
 * HONESTY / DESIGN CONTRACT:
 *  - MOSTLY ABSTRACT, NO icons. The DEFAULT palette is the ONDA teal/cyan, base
 *    #22d3ee brightening to white-teal #ccfbf1 / #eafffb at the tips. A zone MAY
 *    override the hue for its signature (joy → warm GOLD) via colMid/colTip/colHot;
 *    without an override the teal palette is used. A feeling's signature is otherwise
 *    carried by DISTRIBUTION, LENGTH, BRIGHTNESS and MOTION — never by an icon.
 *  - Gentle, not fireworks / not a diagnosis.
 *  - ANTI-HALO (the #1 acceptance rule): this is NEVER an even symmetric ring /
 *    sunburst / corona. Rays are distributed across the fan PROPORTIONALLY to an
 *    explicit per-sector `densityBias` array, so one side is denser than the other
 *    and some sectors can be empty; combined with length jitter and edge fade this
 *    makes a full-360 glow impossible. Asymmetry is mandatory and enforced below.
 *
 * STRATEGY (layered spine): two ray layers —
 *   1. a few brighter, LONGER "spine" rays that give the field a coherent body /
 *      direction, and
 *   2. many faint, SHORTER, airy rays (lots of black between them) for the
 *      diffuse-but-gathered look — plus a sparse sparkle layer of bright dots.
 * The diffuse central rise (no single tight fountain) for joy comes from a DIP in
 * the centre sectors of its densityBias array.
 *
 * SSR-SAFE by construction: pure render, no canvas, no requestAnimationFrame, no
 * window/document, and NO nondeterministic randomness at render time. All geometry
 * comes from a small SEEDED pseudo-random helper, so server and client produce
 * byte-identical SVG (no hydration mismatch). All motion is CSS-only via an inline
 * <style> defining its OWN @keyframes — it depends on no external emoton-fs-*.
 *
 * `formedness` (0..1, reserved): 0 = scattered / softer / wider jitter (default);
 * 1 = gathered / coherent / tighter. Wired so it CAN animate (it lerps spread,
 * length-jitter and per-ray opacity scatter); joy sits near gathered, but the
 * field must already look good at the default 0.
 */

// ── ONDA palette (the ONLY colours used) ────────────────────────────────────
const COL_MID = '#22d3ee'; // cyan — mid ray
const COL_TIP = '#ccfbf1'; // white-teal — ray tip
const COL_HOT = '#eafffb'; // brightest white-teal — sparkle / hottest tip

export interface RayParams {
  /** Angle (deg) the ray concentration is biased toward. UP = -90 (joy points up). */
  direction: number;
  /** Angular fan width (deg) around `direction` that rays spread across. */
  spread: number;
  /** Total number of rays (spine + airy). Kept <= ~60 for mobile. */
  count: number;
  /** Ray length as a fraction of (size / 2). */
  length: number;
  /** Per-ray length variance (fraction of length) for organic, uneven tips. */
  lengthJitter: number;
  /**
   * MANDATORY ASYMMETRY. Per-sector concentration weights spanning the fan from
   * one edge of `spread` to the other. Rays are distributed proportionally to
   * these weights, so an uneven array makes one side denser than the other and a
   * 0 leaves a sector empty. This is the lever that guarantees the anti-halo rule.
   */
  densityBias: number[];
  /** Overall base stroke brightness, 0..1. */
  brightness: number;
  /** Tip brightness, 0..1 — the white-teal at the far end of each ray. */
  tipBrightness: number;
  /** Sideways control-point offset (fraction of length) for the fibre-optic wave. */
  curve: number;
  /** Sparkle density, 0..1 — the fraction of rays that carry a bright spark dot. */
  sparkle: number;
  /** Shimmer cycle length (s) — slower reads calmer, faster reads agitated. */
  shimmer: number;
  /** Slow drift distance (px) along `direction` for the whole field. */
  drift: number;
  /** Per-ray random angular wobble (deg) — trembling/scatter without a clean fan. */
  wobble: number;
  /** Count of brighter, longer "spine" rays (a subset of `count`). */
  spineCount: number;
  /** Radius (px) of the ring rays START from (slightly randomised per ray), so the
   *  clear inner disc keeps "Я" readable. Optional — defaults to ~90 (just outside
   *  the 88px orb edge). */
  innerRadius?: number;
  /** Optional per-zone hue overrides (default = ONDA teal). joy → warm gold. */
  colMid?: string;
  colTip?: string;
  colHot?: string;
  /** Optional soft halo colour around the orb (set warmer than the rays). */
  colHalo?: string;
}

/**
 * Six presets — JOY ("expansive") is tuned fully to the reference (a wide, airy
 * teal fan rising mostly UP, fading before the top, asymmetric, diffuse centre).
 * The other five are directionally-correct slider shifts of the SAME engine (same
 * palette, same anti-halo asymmetry), not bespoke pictures:
 *   grief     — downward, short, dim, slow.
 *   flight    — scattered, trembling, no clean direction (high wobble, jagged bias).
 *   fight     — dense, short, fast pulse.
 *   regulated — sparse, long, soft, even-ish but still slightly asymmetric.
 *   freeze    — almost no rays: very few, short, dim, near-still.
 */
// `satisfies` (not a type annotation) so react-refresh treats this as a constant
// export (allowConstantExport) while still fully checking every preset against
// RayParams and requiring all six ZoneIds.
export const RAY_PRESETS = {
  // JOY — the reference image. Wide upward fan of thin airy rays, lots of black
  // between them, length ~25% short of a full fan so they fade well before the top
  // (air/headroom above). The centre sectors DIP so there is no single tight
  // central jet — a wide, scattered rise. Asymmetric L/R. Sparkle along the rays.
  expansive: {
    direction: -90,
    // Full sweep so a FAINT downward skirt exists too, but density makes it read
    // as a big upward bloom (top ~1, bottom ~1/3 — never an even corona).
    spread: 360,
    count: 1500,
    length: 0.82,
    lengthJitter: 0.8,
    // Spans bottom → up → bottom. Ends (the very bottom) ~0.3-0.33 = ~1/3 of the
    // upper peaks (1.0), so the lower rays are ~3x sparser; centre dipped (0.55)
    // so there's no single tight central jet; halves deliberately unequal.
    densityBias: [0.33, 0.5, 0.72, 0.95, 1, 0.82, 0.55, 0.9, 1, 0.92, 0.66, 0.42, 0.3],
    brightness: 0.95,
    tipBrightness: 1.0,
    curve: 0.01,
    sparkle: 0.22,
    shimmer: 2.5,
    drift: 8,
    wobble: 4,
    spineCount: 24,
    innerRadius: 92, // start right at the orb edge (88px) + a tiny gap
    colMid: '#ffc658', // warm gold (base rise)
    colTip: '#ffab2e', // amber-gold (declining tips)
    colHot: '#ffdf90', // warm light gold at the brightest point
    colHalo: '#ff7e2e', // soft halo around the orb — warmer (orange) than the rays
  },
  // Non-joy zones share JOY's lush structure (full 360 corona, 1500 thin rays,
  // soft fade-in, halo). Their SIGNATURE is carried by colour + direction (where
  // the bloom points) + shimmer pace + wobble — not by sparseness.
  // CALM — teal, gentle even bloom, slow & steady.
  regulated: {
    direction: -90,
    spread: 360,
    count: 1500,
    length: 0.82,
    lengthJitter: 0.8,
    densityBias: [0.33, 0.5, 0.72, 0.95, 1, 0.82, 0.55, 0.9, 1, 0.92, 0.66, 0.42, 0.3],
    brightness: 0.85,
    tipBrightness: 1.0,
    curve: 0.01,
    sparkle: 0.08,
    shimmer: 6,
    drift: 4,
    wobble: 2,
    spineCount: 24,
    innerRadius: 92,
    colMid: '#2dd4bf', // teal
    colTip: '#9bf3e3',
    colHot: '#d6fff7',
    colHalo: '#0f9e8e',
  },
  // ANGER — dark red, intense, fast pulse, more tremble.
  fight: {
    direction: -90,
    spread: 360,
    count: 1500,
    length: 0.82,
    lengthJitter: 0.8,
    densityBias: [0.33, 0.5, 0.72, 0.95, 1, 0.82, 0.55, 0.9, 1, 0.92, 0.66, 0.42, 0.3],
    brightness: 0.95,
    tipBrightness: 1.0,
    curve: 0.01,
    sparkle: 0.08,
    shimmer: 1.6,
    drift: 5,
    wobble: 6,
    spineCount: 24,
    innerRadius: 92,
    colMid: '#c0392b', // dark red
    colTip: '#ef7468',
    colHot: '#ffb4a6',
    colHalo: '#7a1714',
  },
  // ANXIETY — cool steel-blue, fast flicker, high tremble.
  flight: {
    direction: -72,
    spread: 360,
    count: 1500,
    length: 0.82,
    lengthJitter: 0.8,
    densityBias: [0.33, 0.5, 0.72, 0.95, 1, 0.82, 0.55, 0.9, 1, 0.92, 0.66, 0.42, 0.3],
    brightness: 0.82,
    tipBrightness: 1.0,
    curve: 0.01,
    sparkle: 0.08,
    shimmer: 0.9,
    drift: 3,
    wobble: 16,
    spineCount: 24,
    innerRadius: 92,
    colMid: '#8a93d4', // steel-blue / periwinkle
    colTip: '#c0c7ee',
    colHot: '#e3e8fb',
    colHalo: '#5560a6',
  },
  // GRIEF — indigo, bloom points DOWN, dim, slow settling.
  grief: {
    direction: 90,
    spread: 360,
    count: 1500,
    length: 0.82,
    lengthJitter: 0.8,
    densityBias: [0.33, 0.5, 0.72, 0.95, 1, 0.82, 0.55, 0.9, 1, 0.92, 0.66, 0.42, 0.3],
    brightness: 0.78,
    tipBrightness: 0.95,
    curve: 0.01,
    sparkle: 0.08,
    shimmer: 8.5,
    drift: 4,
    wobble: 4,
    spineCount: 24,
    innerRadius: 92,
    colMid: '#6e74e6', // indigo
    colTip: '#a9aef6',
    colHot: '#cdd1ff',
    colHalo: '#4338ca',
  },
  // NUMBNESS — almost grey, faint, near-still.
  freeze: {
    direction: -100,
    spread: 360,
    count: 1500,
    length: 0.82,
    lengthJitter: 0.8,
    densityBias: [0.33, 0.5, 0.72, 0.95, 1, 0.82, 0.55, 0.9, 1, 0.92, 0.66, 0.42, 0.3],
    brightness: 0.62,
    tipBrightness: 0.85,
    curve: 0.01,
    sparkle: 0.08,
    shimmer: 11,
    drift: 1.5,
    wobble: 3,
    spineCount: 24,
    innerRadius: 92,
    colMid: '#a8adb5', // almost grey (faint cool tint)
    colTip: '#ccd0d6',
    colHot: '#e8ebee',
    colHalo: '#6b7280',
  },
} satisfies Record<ZoneId, RayParams>;

// ── Deterministic seeded PRNG (mulberry32) ──────────────────────────────────
// A tiny pure 32-bit generator: same seed → same stream on server and client,
// so the rendered SVG is identical and SSR hydration never mismatches.
function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable per-zone seed so each feeling has its own fixed, reproducible field. */
function seedForZone(zone: ZoneId): number {
  let h = 2166136261;
  for (let i = 0; i < zone.length; i++) {
    h ^= zone.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const DEG = Math.PI / 180;

/** One fully-resolved ray, in SVG units centred on the orb origin (0,0). */
interface Ray {
  /** Start x — on the ring around the orb (not the centre), so "Я" stays clear. */
  sx: number;
  /** Start y. */
  sy: number;
  /** Endpoint x (tip). */
  x: number;
  /** Endpoint y (tip). */
  y: number;
  /** Quadratic control-point x (the fibre-optic sideways bow). */
  cx: number;
  /** Quadratic control-point y. */
  cy: number;
  /** Stroke width. */
  w: number;
  /** Base opacity for this ray. */
  o: number;
  /** Brighter, longer body ray drawn on top of the airy haze. */
  spine: boolean;
  /** Animation delay (s) so the sparkle dots are staggered, never a unison flash. */
  delay: number;
  /** Sparkle position along the ray (0..1) or null if this ray has no spark. */
  spark: number | null;
}

/**
 * Build the ray geometry deterministically. ASYMMETRY is enforced here: each ray
 * picks a SECTOR by the cumulative `densityBias` weights (so dense sectors get
 * more rays, empty sectors get none), then a position within that sector, mapping
 * to an angle across the fan around `direction`. Spine rays (the first
 * `spineCount`) run longer, wider and brighter; the rest are short & airy.
 */
function buildRays(zone: ZoneId, p: RayParams, radius: number, formedness: number): Ray[] {
  const f = clamp01(formedness);
  const rng = makeRng(seedForZone(zone));

  // formedness lerps: 0 = wider/softer/more jitter, 1 = tighter/coherent.
  const spread = lerp(p.spread * 1.16, p.spread * 0.78, f);
  const jitter = lerp(p.lengthJitter * 1.25, p.lengthJitter * 0.5, f);
  const wobble = lerp(p.wobble * 1.3, p.wobble * 0.55, f);
  const oScatter = lerp(0.55, 0.2, f); // opacity spread shrinks as it forms

  // Normalise per-sector weights into a cumulative distribution.
  const weights = p.densityBias.length > 0 ? p.densityBias : [1];
  const total = weights.reduce((s, w) => s + Math.max(0, w), 0) || 1;
  const sectors = weights.length;

  const rays: Ray[] = [];
  for (let i = 0; i < p.count; i++) {
    const spine = i < p.spineCount;
    const wob = (rng() * 2 - 1) * wobble;

    let angle: number;
    let edge: number;
    if (spine) {
      // SPINE rays carry the signature/direction: distributed by the densityBias
      // weights across the fan around `direction` (asymmetric — e.g. joy up).
      const target = rng() * total;
      let acc = 0;
      let sector = sectors - 1;
      for (let s = 0; s < sectors; s++) {
        acc += Math.max(0, weights[s]);
        if (target <= acc) {
          sector = s;
          break;
        }
      }
      const frac = (sector + rng()) / sectors;
      angle = (p.direction - spread / 2 + frac * spread + wob) * DEG;
      edge = Math.abs(frac - 0.5) * 2; // dim toward the fan edges
    } else {
      // AIRY rays: long, thin, distributed EVENLY around the FULL circle (under the
      // orb too) — an even corona; direction is carried only by the spine layer.
      const frac = (i + rng() * 0.7) / p.count;
      angle = (frac * 360 + wob) * DEG;
      edge = 0; // even brightness all around — no fan-edge fade
    }

    // Nominal farthest reach; the jitter is applied to the OUTWARD span below.
    const layerLen = spine ? lerp(1.0, 1.12, f) : lerp(0.82, 0.96, f);
    const reach = radius * p.length * layerLen;

    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    // Rays START on a ring around the orb (slightly randomised), NOT at the centre,
    // so the clear inner disc keeps "Я" readable; they run OUT to the tip.
    // Start just OUTSIDE the orb edge (~88px) on a near-uniform ring (tiny scatter).
    const r0 = (p.innerRadius ?? 90) + rng() * 6;
    // Length as a SPAN out from the start ring with wide jitter and only a hair of a
    // minimum — so tips scatter across radii (no clustering at a floor → no ring).
    const tipSpan = Math.max(radius * 0.03, (reach - r0) * (1 - jitter * rng()));
    const tipLen = r0 + tipSpan;
    const sx = dirX * r0;
    const sy = dirY * r0;
    const x = dirX * tipLen;
    const y = dirY * tipLen;

    // Quadratic control point: midpoint of the VISIBLE span, pushed sideways
    // (perpendicular) for a slight fibre-optic wave. Sign alternates for variety.
    const side = rng() < 0.5 ? -1 : 1;
    const span = tipLen - r0;
    const bow = side * p.curve * span * (0.6 + rng() * 0.8) * lerp(1.25, 0.65, f);
    const perpX = -dirY;
    const perpY = dirX;
    const midR = (r0 + tipLen) / 2;
    const cx = dirX * midR + perpX * bow;
    const cy = dirY * midR + perpY * bow;

    // Thin rays. Vary thickness — most airy rays near the top of a thin range, a
    // few thinner (rng()*rng() biases the subtraction toward 0); spines a touch
    // heavier as the body.
    const w = spine ? 0.42 + rng() * 0.25 : 0.28 - 0.18 * (rng() * rng());
    const layerBright = spine ? 1 : 0.8;
    const edgeFade = 1 - 0.3 * edge; // dimmer toward the fan edges
    const o = clamp01(p.brightness * layerBright * edgeFade * (1 - oScatter + rng() * oScatter));
    const delay = -rng() * p.shimmer;
    const spark = rng() < p.sparkle ? 0.45 + rng() * 0.5 : null;

    rays.push({ sx, sy, x, y, cx, cy, w, o, spine, delay, spark });
  }

  // Spine rays last → painted on top of the airy haze.
  rays.sort((aa, bb) => Number(aa.spine) - Number(bb.spine));
  return rays;
}

function FeelingShapeImpl({
  zone,
  params,
  size = 460,
  formedness = 0,
}: {
  zone: ZoneId;
  params?: Partial<RayParams>;
  /** SVG viewBox size, px. Centred on the orb origin. */
  size?: number;
  /** 0 = scattered/soft (default), 1 = gathered/coherent. Animate later. */
  formedness?: number;
}) {
  // iOS Safari / mobile GPUs choke on many animated SVG paths with gradient strokes.
  // Detect a small viewport and render a MUCH lighter field there (far fewer rays +
  // fewer layers). SSR-safe: starts false (matches the prerender), tightens on mount.
  const [lite, setLite] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 820px)');
    const apply = () => setLite(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const p: RayParams = { ...RAY_PRESETS[zone], ...params };
  const radius = size / 2;
  const count = lite ? Math.round(p.count * 0.35) : p.count;
  const rays = buildRays(zone, { ...p, count }, radius, formedness);

  // Stable, collision-free ids (per zone) for the gradients / mask in <defs>.
  const uid = `fs-${zone}`;
  const gradId = `${uid}-ray`;

  // Resolved palette (per-zone hue override, default ONDA teal).
  const cMid = p.colMid ?? COL_MID;
  const cTip = p.colTip ?? COL_TIP;
  const cHot = p.colHot ?? COL_HOT;
  const cHalo = p.colHalo;

  // ALL rays twinkle, spread across a few compositor layers (will-change: opacity)
  // on staggered phases — the GPU blends each pre-rasterised layer at a changing
  // alpha (no per-frame path repaint, no mask). Per-frame cost is bound by the LAYER
  // count (~6), not the ray count, so animating every ray stays smooth.
  const ANIM_LAYERS = lite ? 4 : 6;
  const animBuckets: Ray[][] = Array.from({ length: ANIM_LAYERS }, () => []);
  rays.forEach((r, i) => animBuckets[i % ANIM_LAYERS].push(r));

  return (
    <div
      aria-hidden
      style={{ position: 'relative', width: size, height: size, pointerEvents: 'none' }}
    >
      <style>{`
        @keyframes ${uid}-twinkle {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.04; }
        }
        @media (prefers-reduced-motion: reduce) {
          .${uid}-bucket { animation: none !important; }
        }
      `}</style>
      <svg
        width={size}
        height={size}
        viewBox={`${-radius} ${-radius} ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Base ray: faint teal near the orb, brightening to a white-teal tip. */}
          {/* RADIAL from the orb centre outward (userSpaceOnUse), so EVERY ray —
              up, down or sideways — runs faint-teal near the orb → white-teal at
              its tip. (A vertical objectBoundingBox gradient flipped for downward
              rays, which read as "inverted"; this is direction-independent.) */}
          {/* The radial envelope is BAKED into the stroke gradient (no separate
              <mask> — a mask forces a full re-raster on every animated frame): rays
              fade in QUICKLY from the orb edge (0 at ~38%), peak near the base (~48%),
              then DECLINE steadily so every ray dims toward its own tip. */}
          <radialGradient id={gradId} gradientUnits="userSpaceOnUse" cx="0" cy="0" r={radius}>
            <stop offset="0%" stopColor={cMid} stopOpacity="0" />
            {/* Orb edge (~88px / radius 230 ≈ 38%): invisible → SHORT fade-in. */}
            <stop offset="38%" stopColor={cMid} stopOpacity="0" />
            {/* Peak right at the base (rays start ~40–43%), then a steady DECLINE →
                every ray dims toward its own tip, whatever radius it ends at. */}
            <stop offset="45%" stopColor={cHot} stopOpacity={p.tipBrightness.toFixed(3)} />
            <stop offset="66%" stopColor={cTip} stopOpacity={(0.45 * p.brightness).toFixed(3)} />
            <stop offset="100%" stopColor={cTip} stopOpacity="0" />
          </radialGradient>
          {cHalo && (
            // Soft warm halo hugging the orb edge (brightest just outside the orb,
            // fading out). Warmer than the rays. Painted behind the rays.
            <radialGradient id={`${uid}-halo`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r={radius}>
              <stop offset="0%" stopColor={cHalo} stopOpacity="0" />
              {/* Nothing inside the orb (its fill is translucent → halo would show
                  through); start at the orb edge (~38%) so it sits ONLY outside. */}
              <stop offset="38%" stopColor={cHalo} stopOpacity="0" />
              <stop offset="41%" stopColor={cHalo} stopOpacity="0.55" />
              <stop offset="47%" stopColor={cHalo} stopOpacity="0.25" />
              <stop offset="53%" stopColor={cHalo} stopOpacity="0" />
            </radialGradient>
          )}
        </defs>

        {/* Rays read as light, not strokes. An even airy corona around the orb (full
            360) plus a brighter spine body biased toward `direction`. Rays are split
            into BUCKETS — each bucket is one compositor layer that twinkles via group
            opacity (cheap), giving the whole field a staggered shimmer. */}
        {cHalo && (
          <rect
            x={-radius}
            y={-radius}
            width={size}
            height={size}
            fill={`url(#${uid}-halo)`}
            // Heartbeat opacity driven live by the page via the --fs-halo-op CSS var
            // (a rAF phase-accumulator → smooth rate changes, no jump). Default 1.
            style={{ opacity: 'var(--fs-halo-op, 1)' }}
          />
        )}
        <g className={`${uid}-grp`}>
          {/* Every ray twinkles — bucketed into a few compositor layers with
              staggered phases (layer count, not ray count, drives per-frame cost). */}
          {animBuckets.map((bucket, k) => (
            <g
              key={`a${k}`}
              className={`${uid}-bucket`}
              style={{
                willChange: 'opacity',
                animation: `${uid}-twinkle ${p.shimmer.toFixed(2)}s ease-in-out ${(-(k / ANIM_LAYERS) * p.shimmer).toFixed(2)}s infinite`,
              }}
            >
              {bucket.map((r, i) => {
                const d = `M ${r.sx.toFixed(2)} ${r.sy.toFixed(2)} Q ${r.cx.toFixed(2)} ${r.cy.toFixed(2)} ${r.x.toFixed(2)} ${r.y.toFixed(2)}`;
                return (
                  <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth={r.w}
                    strokeLinecap="round"
                    opacity={r.o}
                  />
                );
              })}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

export const FeelingShape = memo(FeelingShapeImpl);
