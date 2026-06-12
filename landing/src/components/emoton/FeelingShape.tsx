import type { ZoneId } from '../../lib/emotonCore';

/**
 * One parametric "feeling shape" primitive — a soft ONDA-teal blob whose
 * AUTONOMIC QUALITY (not the emotion's "meaning") is set by a few parameters:
 *   speed      — movement, still ↔ jittery  (keyframe + duration)
 *   density    — compression, scattered ↔ tight  (base scale + blur)
 *   brightness — opacity
 *   softness   — edge blur / breathing
 *
 * Abstract on purpose — NOT "this is what shame looks like". There is no
 * emotion→icon and no emotion→colour mapping: everything stays in the orb's
 * teal/navy palette and differs only by motion / density / brightness / edge,
 * with at most a slight temperature shift by activation level (cooler & dimmer
 * toward the dorsal/freeze end). Gentle, never grotesque — a witness, not a
 * diagnosis.
 *
 * One primitive, six presets. Reusable: pass `params` to override the per-cluster
 * preset and `size` for geometry — later the person sets their own params/
 * geometry in be-with, replacing the preset. The movement keyframes (emoton-fs-*)
 * live in EmotonPage's <style> block.
 */
export interface FeelingParams {
  /** movement keyframe name (speed / quality of motion) */
  anim: string;
  /** seconds — slower reads calmer/heavier, faster reads agitated */
  duration: number;
  /** base scale (density/compression): <1 tight, >1 open */
  scale: number;
  /** brightness 0..1 (overridden by the keyframe for shimmer/fade) */
  opacity: number;
  /** edge softness / scatter, px */
  blur: number;
  /** optional temperature/activation filter (saturate/brightness/hue-rotate) —
   *  cooler & dimmer toward the dorsal end. No emotion-assigned hues. */
  filter?: string;
}

/** Neutral-geometry presets — one per cluster. QUALITY only; size + distance are
 *  set by the caller (the same neutral default for all six on the own screen). */
// Base scale is 1.0 for ALL six — the footprint (size) + distance are the neutral
// geometry, identical everywhere; density/compression reads through the EDGE
// (sharp = dense/tight ↔ blurry = scattered) and motion, not by resizing the blob.
export const FEELING_PRESETS: Record<ZoneId, FeelingParams> = {
  // regulation — open, slowly breathing, even, soft glow
  regulated: { anim: 'emoton-fs-breathe', duration: 6, scale: 1, opacity: 0.8, blur: 2 },
  // expansion — open, lively, brighter, light shimmer, reaching out
  expansive: { anim: 'emoton-fs-shimmer', duration: 3.2, scale: 1, opacity: 0.9, blur: 1.5, filter: 'brightness(1.18)' },
  // sympathetic / fight — dense, under pressure, sharp edge, fast
  fight: { anim: 'emoton-fs-press', duration: 1.5, scale: 1, opacity: 0.92, blur: 0 },
  // sympathetic / flight — trembling, fast, unstable, fine tremor, scattered (diffuse edge)
  flight: { anim: 'emoton-fs-tremor', duration: 0.5, scale: 1, opacity: 0.78, blur: 4 },
  // grief — heavy, slow, settles down, muted
  grief: { anim: 'emoton-fs-settle', duration: 6.5, scale: 1, opacity: 0.6, blur: 2.5, filter: 'saturate(0.7)' },
  // dorsal / freeze — almost motionless, dim, tight edge, cool, fading
  freeze: { anim: 'emoton-fs-fade', duration: 8, scale: 1, opacity: 0.45, blur: 1, filter: 'saturate(0.5) brightness(0.92) hue-rotate(-12deg)' },
};

export function FeelingShape({
  zone,
  params,
  size = 80,
}: {
  zone: ZoneId;
  params?: Partial<FeelingParams>;
  size?: number;
}) {
  const p = { ...FEELING_PRESETS[zone], ...params };
  return (
    // Outer carries the STATIC density/compression scale only, so the movement
    // keyframe on the inner element owns `transform` without a clash.
    <div style={{ transform: `scale(${p.scale})` }} aria-hidden>
      <div
        className="rounded-full border border-cyan-300/30 bg-gradient-to-b from-cyan-400/20 to-transparent"
        style={{
          width: size,
          height: size,
          opacity: p.opacity,
          filter: `blur(${p.blur}px)${p.filter ? ` ${p.filter}` : ''}`,
          animation: `${p.anim} ${p.duration}s ease-in-out infinite`,
        }}
      />
    </div>
  );
}
