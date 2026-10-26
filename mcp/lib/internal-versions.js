/**
 * App versions whose WHOLE build was baked as internal (VITE_INTERNAL_BUILD=true),
 * so every real user on them carries user property internal=true.
 * 1.9.5 was built for the App Store from branch analytics-095 with
 * internal_build=auto. internal='exclude' keeps these versions' users.
 * Extend this list if it ever happens again.
 */
export const INTERNAL_MISLABELED_VERSIONS = ['1.9.5'];

export const INTERNAL_MISLABELED_NOTE =
  '1.9.5 помечена internal целиком (сборка из ветки) — её пользователи включены; ' +
  'наши тестовые устройства на 1.9.5 тоже попадут сюда';

/** Note for tool output when the exclude-mode carve-out is active. */
export function internalMislabeledNote(mode) {
  if ((mode || 'exclude') !== 'exclude' || INTERNAL_MISLABELED_VERSIONS.length === 0) return null;
  return INTERNAL_MISLABELED_NOTE;
}
