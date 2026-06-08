/**
 * English ordinal suffix for a number: 1→"1st", 2→"2nd", 3→"3rd", 4→"4th",
 * with the 11/12/13 exception (11th, 12th, 13th — not 11st/12nd/13rd).
 * Rounds to the nearest integer so a float never prints "71.4th".
 *
 * ordinalSuffix(71) === 'st'   ordinal(71) === '71st'
 */
export function ordinalSuffix(n: number): 'st' | 'nd' | 'rd' | 'th' {
  const v = Math.abs(Math.round(n)) % 100
  if (v >= 11 && v <= 13) return 'th'
  switch (v % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

/** Number with its ordinal suffix attached, e.g. ordinal(71) → "71st". */
export function ordinal(n: number): string {
  return `${Math.round(n)}${ordinalSuffix(n)}`
}
