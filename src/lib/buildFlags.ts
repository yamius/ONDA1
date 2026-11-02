/** Baked at build time. 'true' only in TestFlight/test builds (VITE_INTERNAL_BUILD);
 *  App Store builds from main never set it. Debug/test panels gate on THIS, never on
 *  the runtime 7-tap internal-traffic marker (101). */
export const IS_INTERNAL_BUILD: boolean = import.meta.env.VITE_INTERNAL_BUILD === 'true';
