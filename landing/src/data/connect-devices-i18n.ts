/**
 * Translations of the /connect/<device> pages (task 071 step 2c). One JSON per language in
 * ./connect-devices-i18n/<lang>.json, same shape as the EN source (ui labels + per-device text).
 * Maker quotes are NOT translated (they stay verbatim English, from connect-device-details.ts);
 * {{fact:}} tokens are resolved with the same per-item publish gate as EN.
 * A localized device page is prerendered only from its release-queue date
 * (scripts/article-release-queue.ts, collection 'connectDevices').
 */
import ru from './connect-devices-i18n/ru.json'
import uk from './connect-devices-i18n/uk.json'
import es from './connect-devices-i18n/es.json'
import pt from './connect-devices-i18n/pt.json'
import fr from './connect-devices-i18n/fr.json'
import de from './connect-devices-i18n/de.json'
import it from './connect-devices-i18n/it.json'
import nl from './connect-devices-i18n/nl.json'
import pl from './connect-devices-i18n/pl.json'
import ja from './connect-devices-i18n/ja.json'
import zh from './connect-devices-i18n/zh.json'
import type { ConnectStatus } from './connect-devices'

export interface ConnectDeviceText {
  metaTitle: string
  metaDescription: string
  h1: string
  lead: string
  shows: string[]
  connect: string
  appleHealth: string
  faq: { q: string; a: string }[]
  det?: { hrvSummary: string; composite: string; independent: string[]; independentNone?: string; affiliated: string[] }
}

export interface ConnectDevicesLocale {
  ui: {
    allDevices: string; shows: string; hrvType: string; sources: string; calls: string; inputs: string; inputsNone: string
    accuracy: string; weights: string; single: string; affiliated: string; accessed: string; quoteNote: string
    howToRead: string; howToRead1: string; howToRead2: string; canConnect: string; throughAppleHealth: string
    questions: string; readMore: string; emergencyTitle: string; emergencyText: string; redFlags: string
    trademark: string; otherDevices: string; status: Record<ConnectStatus, string>
  }
  devices: Record<string, ConnectDeviceText>
}

export const CONNECT_DEVICES_I18N: Record<string, ConnectDevicesLocale> = { ru, uk, es, pt, fr, de, it, nl, pl, ja, zh } as Record<string, ConnectDevicesLocale>

export const CONNECT_DEVICE_I18N_LANGS: readonly string[] = Object.keys(CONNECT_DEVICES_I18N)

/** "{name}" etc. → value (every occurrence). */
export function fillConnect(t: string, vars: Record<string, string>): string {
  return t.replace(/\{(name|composite|flags)\}/g, (m, k: string) => vars[k] ?? m)
}
