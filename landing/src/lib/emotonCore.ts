/**
 * emotonCore — pure, UI-free, dependency-free core for the Emoton check-in.
 *
 * Holds the wheel taxonomy, the authored want→branch routing, the
 * state→practice-direction map, and the window-of-tolerance gauge. Liftable into
 * the app unchanged (no React, no DOM, no i18n — ids only; EN labels live in the
 * page). No persistence, no free text.
 *
 * HONESTY: the 6 zones use the "window of tolerance" + autonomic-spine as a felt
 * METAPHOR, not a claimed physiological mechanism. Practices are EXISTING in-app
 * practices (reused by id), never invented here. The Freeze zone reuses the
 * closest up-leaning existing practice ('inner_spark', Inspiration) as a gentle
 * re-mobilization — flagged in the honesty note, since the library has no bespoke
 * energizing protocol.
 */

// ── Zones (autonomic spine, felt-state metaphor) ────────────────────────────
export type ZoneId = 'fight' | 'flight' | 'freeze' | 'grief' | 'regulated' | 'expansive';

/** Where the zone sits relative to the window of tolerance. */
export type WindowPosition = 'over' | 'within' | 'under' | 'low_present';

/** The direction a regulation practice should move the user for this zone. */
export type PracticeDirection = 'down' | 'gentle_up' | 'deepen' | 'channel';

export interface Zone {
  id: ZoneId;
  window: WindowPosition;
  /** Shade ids (progressive disclosure: tap zone → refine to one shade). EN labels in the page. */
  shades: string[];
  /** Existing in-app practice reused for this zone's regulation want, or null (be-with only). */
  practiceId: string | null;
  practiceDirection: PracticeDirection | null;
}

export const ZONES: Record<ZoneId, Zone> = {
  fight: {
    id: 'fight',
    window: 'over',
    shades: ['irritation', 'indignation', 'rage', 'hurt', 'guilt'],
    practiceId: 'body_cocoon', // DOWN-regulation (self-soothing, long exhale)
    practiceDirection: 'down',
  },
  flight: {
    id: 'flight',
    window: 'over',
    shades: ['worry', 'tension', 'wariness', 'turmoil', 'panic'],
    practiceId: 'earth_pulse', // DOWN-regulation (grounding heart anchor)
    practiceDirection: 'down',
  },
  freeze: {
    id: 'freeze',
    window: 'under',
    shades: ['detachment', 'numbness', 'apathy', 'indifference', 'shame'],
    // GENTLE UP (asymmetry — not calming). Reuses the closest up-leaning existing
    // practice (Inspiration/inner_spark); no bespoke energizing protocol exists.
    practiceId: 'inner_spark',
    practiceDirection: 'gentle_up',
  },
  grief: {
    id: 'grief',
    window: 'low_present',
    shades: ['sorrow', 'melancholy', 'loneliness', 'despondency', 'lostness'],
    // Default is the be-with visualization, not a breathing practice.
    practiceId: null,
    practiceDirection: null,
  },
  regulated: {
    id: 'regulated',
    window: 'within',
    shades: ['serenity', 'clarity', 'fullness', 'grounded', 'lightness'],
    practiceId: 'earth_breath', // deepen / maintain
    practiceDirection: 'deepen',
  },
  expansive: {
    id: 'expansive',
    window: 'within', // pleasant high arousal — within tolerance, not a problem
    shades: ['thrill', 'anticipation', 'warmth', 'aliveness', 'interest'],
    practiceId: 'light_inhale', // channel into action (gentle up-leaning)
    practiceDirection: 'channel',
  },
};

export const ZONE_ORDER: ZoneId[] = ['regulated', 'expansive', 'fight', 'flight', 'grief', 'freeze'];

// ── Branches (where a named want routes) ────────────────────────────────────
export type BranchId = 'practice' | 'be_with' | 'release' | 'support';

/** A want a user can name after owning their emotion. Authored per the brief. */
export type WantId =
  | 'calm_down'
  | 'ground'
  | 'gently_come_back'
  | 'deepen'
  | 'channel_action'
  | 'be_with'
  | 'describe'
  | 'set_boundary'
  | 'live_it'
  | 'nothing'
  | 'other';

export interface WantOption {
  id: WantId;
  branch: BranchId;
  /**
   * For be_with: 'describe' opens the Gendlin quality-word picker; default is the
   * witnessing visualization. For practice: the zone's practiceId is used.
   */
  beWithMode?: 'witness' | 'describe';
}

/**
 * AUTHORED want-options per zone (brief §"CONFIRMED want-options per state").
 * Implement as given — do not add or reorder beyond this. "be with it" is also
 * universally available (see universalWants). "other" resolves to release.
 */
export const WANTS_BY_ZONE: Record<ZoneId, WantOption[]> = {
  fight: [
    { id: 'calm_down', branch: 'practice' },
    { id: 'be_with', branch: 'be_with', beWithMode: 'witness' },
    { id: 'set_boundary', branch: 'release' }, // real-world action → name it, go do it
  ],
  flight: [
    { id: 'calm_down', branch: 'practice' },
    { id: 'ground', branch: 'practice' },
    { id: 'be_with', branch: 'be_with', beWithMode: 'witness' },
  ],
  freeze: [
    { id: 'gently_come_back', branch: 'practice' }, // gentle UP (after the first-move)
    { id: 'be_with', branch: 'be_with', beWithMode: 'witness' },
  ],
  grief: [
    { id: 'be_with', branch: 'be_with', beWithMode: 'witness' },
    { id: 'describe', branch: 'be_with', beWithMode: 'describe' },
  ],
  regulated: [
    { id: 'deepen', branch: 'practice' },
    { id: 'nothing', branch: 'release' }, // "nothing, I'm good" — clean no-guilt exit
  ],
  expansive: [
    { id: 'live_it', branch: 'release' }, // go live it — the breath can wait
    { id: 'channel_action', branch: 'practice' },
  ],
};

/** Always appended after the authored options: an off-menu want → release. */
export const UNIVERSAL_WANTS: WantOption[] = [{ id: 'other', branch: 'release' }];

// ── Gendlin quality words (describe-the-feeling; SELECT, never free text) ────
export const QUALITY_WORDS: string[] = [
  'heavy', 'tight', 'hollow', 'sharp', 'warm', 'cold', 'fluttery', 'dull', 'electric', 'numb',
];

// ── Window-of-tolerance gauge (Я / feeling proportion → graded moves) ───────
/** Shades whose explicit selection routes straight to the support off-ramp. */
export const HOPELESSNESS_SHADES: string[] = ['hopelessness', 'meaninglessness'];

/** Я-fraction at/under which we treat the user as flooded (backend trigger ONLY — never shown). */
export const SELF_FLOODED_FRACTION = 0.1;

export function isHopelessnessShade(shadeId: string | null | undefined): boolean {
  return shadeId != null && HOPELESSNESS_SHADES.includes(shadeId);
}

/**
 * Support off-ramp trigger (brief §SAFETY): flooding (Я ≤ ~10%) OR an explicit
 * hopelessness/meaninglessness shade. The % is a backend trigger only — NEVER
 * display it; the page conveys it via region sizes.
 */
export function shouldOfferSupport(input: { selfFraction?: number; shadeId?: string | null }): boolean {
  if (isHopelessnessShade(input.shadeId)) return true;
  if (typeof input.selfFraction === 'number' && input.selfFraction <= SELF_FLOODED_FRACTION) return true;
  return false;
}

/**
 * Graded be-with moves as Я shrinks (brief: be-with → grow-self/titrate →
 * support; not a cliff). Returns which controls the be-with screen should offer.
 * `ease` (titration) is surfaced ONLY as Я approaches the danger zone — never a
 * "shrink the feeling" slider in a normal state (that would be suppression).
 */
export type BeWithMove = 'witness' | 'grow_self' | 'describe' | 'ease';
export function beWithMoves(selfFraction: number): BeWithMove[] {
  if (selfFraction <= SELF_FLOODED_FRACTION) return ['witness', 'grow_self', 'ease'];
  if (selfFraction <= 0.25) return ['witness', 'grow_self', 'describe', 'ease']; // approaching danger → titration appears
  return ['witness', 'grow_self', 'describe']; // normal: NO ease/shrink slider
}

// ── Pure routing helpers ────────────────────────────────────────────────────
export function getZone(zoneId: ZoneId): Zone {
  return ZONES[zoneId];
}

/** Zone of a given shade, or null if unknown. */
export function zoneForShade(shadeId: string): ZoneId | null {
  for (const id of ZONE_ORDER) {
    if (ZONES[id].shades.includes(shadeId)) return id;
  }
  return null;
}

/** Authored want-options for a zone + the universal off-menu option. */
export function wantsForZone(zoneId: ZoneId): WantOption[] {
  return [...WANTS_BY_ZONE[zoneId], ...UNIVERSAL_WANTS];
}

export interface RoutedBranch {
  branch: BranchId;
  /** When branch === 'practice': the existing practice id to run. */
  practiceId?: string;
  practiceDirection?: PracticeDirection;
  /** When branch === 'be_with'. */
  beWithMode?: 'witness' | 'describe';
}

/**
 * Resolve a named want (in a zone) to a concrete branch. A 'practice' want pulls
 * the zone's reused practice + direction. Never invents a practice; if a zone has
 * no practiceId (grief), a 'practice' want falls back to the be-with branch
 * rather than fabricating one.
 */
export function resolveBranch(zoneId: ZoneId, want: WantOption): RoutedBranch {
  if (want.branch === 'practice') {
    const z = ZONES[zoneId];
    if (!z.practiceId || !z.practiceDirection) {
      return { branch: 'be_with', beWithMode: 'witness' };
    }
    return { branch: 'practice', practiceId: z.practiceId, practiceDirection: z.practiceDirection };
  }
  if (want.branch === 'be_with') {
    return { branch: 'be_with', beWithMode: want.beWithMode ?? 'witness' };
  }
  return { branch: want.branch };
}

/** Freeze needs a tiny first-move (impossible-to-fail mark) before the gentle-up practice. */
export function requiresFirstMove(zoneId: ZoneId): boolean {
  return zoneId === 'freeze';
}

/** Does this branch connect the camera/pulse sensor? ONLY the practice branch does. */
export function branchUsesSensor(branch: BranchId): boolean {
  return branch === 'practice';
}
