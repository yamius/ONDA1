/// <reference lib="webworker" />
/**
 * Apple Health export reader (task 082 B2). Runs inside a dedicated Web Worker.
 *
 * File.stream() → (fflate streaming Unzip, if it is a ZIP) → TextDecoder(stream) → saxes → Aggregator.
 * Only the current chunk and the daily aggregates are ever in memory.
 *
 * PRIVACY CONTRACT — do not break:
 *  - no fetch / XHR / importScripts / WebSocket / sendBeacon here. Everything is bundled.
 *  - nothing is stored (no IndexedDB, no caches).
 *  - errors leave this worker as { code, offset } only — never a message from the parser (those
 *    quote file content) and never the file name.
 */
import { Unzip, UnzipInflate, type UnzipFile } from 'fflate'
import { SaxesParser } from 'saxes'
import { Aggregator } from '../lib/apple-health/aggregate'

export type WorkerIn = { type: 'start'; file: File }
export type WorkerOut =
  | { type: 'progress'; read: number; total: number }
  | { type: 'done'; result: ReturnType<Aggregator['result']>; ms: number }
  | { type: 'error'; code: ErrorCode; offset: number }

export type ErrorCode = 'E_READ' | 'E_ZIP' | 'E_NO_XML' | 'E_XML' | 'E_NOT_HEALTH' | 'E_TYPE'

const post = (m: WorkerOut) => (self as unknown as DedicatedWorkerGlobalScope).postMessage(m)

class Fail extends Error {
  code: ErrorCode
  constructor(code: ErrorCode) {
    super(code)
    this.code = code
  }
}

self.onmessage = async (ev: MessageEvent<WorkerIn>) => {
  if (ev.data?.type !== 'start') return
  const file = ev.data.file
  const t0 = performance.now()
  let read = 0
  try {
    const agg = new Aggregator()
    let sawRoot = false
    let xmlErrors = 0
    const sax = new SaxesParser({ xmlns: false, position: false })
    sax.on('opentag', (tag) => {
      if (tag.name === 'Record') agg.record(tag.attributes as Record<string, string>)
      else if (tag.name === 'HealthData') sawRoot = true
    })
    // Tolerant: a stray malformed attribute should not lose a multi-year file. Give up only when the
    // input is clearly not XML.
    sax.on('error', () => {
      if (++xmlErrors > 1000) throw new Fail('E_XML')
    })
    const decoder = new TextDecoder('utf-8')
    const feedXml = (bytes: Uint8Array, final: boolean) => {
      const s = decoder.decode(bytes, { stream: !final })
      if (s) sax.write(s)
    }

    const reader = file.stream().getReader()
    let mode: 'unknown' | 'zip' | 'xml' = 'unknown'
    let unzip: Unzip | null = null
    let xmlFound = false
    let xmlDone = false
    let lastPost = 0

    const startZip = () => {
      unzip = new Unzip()
      unzip.register(UnzipInflate)
      unzip.onfile = (f: UnzipFile) => {
        // apple_health_export/export.xml (also accept a bare export.xml at the root). Never export_cda.xml.
        if (xmlFound || !/(^|\/)export\.xml$/.test(f.name)) return
        xmlFound = true
        f.ondata = (err, data, final) => {
          if (err) throw new Fail('E_ZIP')
          feedXml(data, final)
          if (final) xmlDone = true
        }
        f.start()
      }
    }

    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      read += value.byteLength
      if (mode === 'unknown') {
        const isZip = value[0] === 0x50 && value[1] === 0x4b && value[2] === 0x03 && value[3] === 0x04
        if (isZip) {
          mode = 'zip'
          startZip()
        } else if (value[0] === 0x3c || (value[0] === 0xef && value[1] === 0xbb)) mode = 'xml'
        else throw new Fail('E_TYPE')
      }
      if (mode === 'zip') {
        try {
          unzip!.push(value, false)
        } catch (e) {
          throw e instanceof Fail ? e : new Fail('E_ZIP')
        }
        // export.xml done: no need to read workout routes / ECGs that follow it in the archive.
        if (xmlDone) {
          await reader.cancel()
          read = file.size
          break
        }
      } else feedXml(value, false)
      const now = performance.now()
      if (now - lastPost > 100) {
        lastPost = now
        post({ type: 'progress', read, total: file.size })
      }
    }
    if (mode === 'zip') {
      if (!xmlDone) {
        try {
          unzip!.push(new Uint8Array(0), true)
        } catch {
          /* trailing archive bytes — export.xml is what matters */
        }
      }
      if (!xmlFound) throw new Fail('E_NO_XML')
    } else feedXml(new Uint8Array(0), true)
    sax.close()
    if (!sawRoot) throw new Fail('E_NOT_HEALTH')
    post({ type: 'progress', read: file.size, total: file.size })
    post({ type: 'done', result: agg.result(), ms: Math.round(performance.now() - t0) })
  } catch (e) {
    post({ type: 'error', code: e instanceof Fail ? e.code : 'E_READ', offset: read })
  }
}
