/**
 * PubMed citation anchors for E-E-A-T (citations in parts, levels).
 *
 * ONLY verified, label-matched PubMed IDs live here. A June 2026 integrity
 * audit found several previously-listed PMIDs (17329479, 15913566, 6657789,
 * 17512470, 10744432) did NOT match their labels — they pointed to unrelated
 * papers (alcohol-craving, P2Y13-receptor chemistry, plant pharmacology,
 * musculoskeletal nursing, neonatal drug withdrawal). Those were removed from
 * the level/part pages and are not reintroduced here. If you add a citation,
 * open the PubMed entry and confirm the title matches the label first.
 */
export const RESEARCH = {
  diaphragmHrv: 'https://pubmed.ncbi.nlm.nih.gov/19463818/', // Thayer & Lane — HRV & neurovisceral integration
  breathingHrv: 'https://pubmed.ncbi.nlm.nih.gov/19246382/', // Lehrer/Gevirtz — resonance breathing & HRV
  vagalTone: 'https://pubmed.ncbi.nlm.nih.gov/17049418/', // Porges — polyvagal theory / vagal tone
  porgesPolyvagal: 'https://pubmed.ncbi.nlm.nih.gov/17049418/', // Porges — polyvagal theory
  interoception: 'https://pubmed.ncbi.nlm.nih.gov/12030437/', // Craig — interoception & the insular cortex
  hrv: 'https://pubmed.ncbi.nlm.nih.gov/19463818/', // Thayer & Lane — HRV
} as const
