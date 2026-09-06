/**
 * ONDA Evidence Center — the structured evidence base behind the app's
 * present-tense claims. Single source for /research's "what we build on"
 * section, its References list, and the ScholarlyArticle JSON-LD.
 *
 * Discipline (do not break):
 *   - Every reference here is VERIFIED: authors, year, journal, study type,
 *     DOI and (where confirmed) PMID all resolve to the real paper. No
 *     fabricated identifiers. If a PMID is not confirmed, omit it and rely
 *     on the DOI.
 *   - Every claim carries BOTH what ONDA does with it AND what it does NOT
 *     prove. The honest boundary is the point — it is what makes the page
 *     citable rather than promotional.
 *   - A mechanism only appears here if it is actually in the shipping app.
 *     Aspirations live in the research-frontier section, not here.
 *
 * History: this dataset also corrected two defects in the prior hand-coded
 * reference list — a wrong PMID on Lehrer & Gevirtz (pointed at an unrelated
 * paper) and a citation-text/PMID mismatch on the Thayer reference.
 */

export type StudyType =
  | 'Narrative review'
  | 'Review / theoretical'
  | 'Review'
  | 'Randomized controlled trial'
  | 'Meta-analysis'
  | 'Observational study'

export interface EvidenceReference {
  /** Stable citation id used as the on-page marker, e.g. "R1". */
  id: string
  authors: string
  year: number
  title: string
  journal: string
  studyType: StudyType
  /** PubMed ID — only when independently verified. */
  pmid?: string
  /** Digital Object Identifier — the canonical machine-verifiable link. */
  doi: string
  /** Canonical URL (DOI resolver or PubMed). */
  url: string
}

export interface EvidenceClaim {
  id: string
  /** The plain claim, present tense, exactly as strong as the evidence allows. */
  statement: string
  /** How the shipping ONDA app applies this mechanism. */
  whatOndaDoes: string
  /** The honest boundary — what these references do NOT establish. */
  whatIsNotProven: string
  /** Reference ids backing the claim. */
  refIds: string[]
}

/** Verified references (see discipline note above). */
export const EVIDENCE_REFERENCES: EvidenceReference[] = [
  {
    id: 'R1',
    authors: 'Lehrer PM, Gevirtz R',
    year: 2014,
    title: 'Heart rate variability biofeedback: how and why does it work?',
    journal: 'Frontiers in Psychology',
    studyType: 'Narrative review',
    pmid: '25101026',
    doi: '10.3389/fpsyg.2014.00756',
    url: 'https://pubmed.ncbi.nlm.nih.gov/25101026/',
  },
  {
    id: 'R2',
    authors: 'Thayer JF, Hansen AL, Saus-Rose E, Johnsen BH',
    year: 2009,
    title:
      'Heart rate variability, prefrontal neural function, and cognitive performance: the neurovisceral integration perspective on self-regulation, adaptation, and health',
    journal: 'Annals of Behavioral Medicine',
    studyType: 'Review / theoretical',
    pmid: '19463818',
    doi: '10.1007/s12160-009-9101-z',
    url: 'https://pubmed.ncbi.nlm.nih.gov/19463818/',
  },
  {
    id: 'R3',
    authors: 'Porges SW',
    year: 2007,
    title: 'The polyvagal perspective',
    journal: 'Biological Psychology',
    studyType: 'Review / theoretical',
    pmid: '17049418',
    doi: '10.1016/j.biopsycho.2006.06.009',
    url: 'https://pubmed.ncbi.nlm.nih.gov/17049418/',
  },
  {
    id: 'R4',
    authors: 'Craig AD',
    year: 2002,
    title: 'How do you feel? Interoception: the sense of the physiological condition of the body',
    journal: 'Nature Reviews Neuroscience',
    studyType: 'Review',
    doi: '10.1038/nrn894',
    url: 'https://doi.org/10.1038/nrn894',
  },
]

/** Claims the shipping app rests on, each with its honest boundary. */
export const EVIDENCE_CLAIMS: EvidenceClaim[] = [
  {
    id: 'C1',
    statement: 'Slow, paced breathing raises HRV in the moment.',
    whatOndaDoes:
      'Every ONDA session is paced breathing near your resonance frequency (about six breaths a minute) with live heart-rhythm feedback, so you can see HRV respond as you breathe.',
    whatIsNotProven:
      'That a single session raises HRV acutely is well established. That regular practice produces a large, permanent rise in everyone’s resting baseline is not — the size and durability of the effect vary between people, which is why ONDA leads with your own trend rather than a promise.',
    refIds: ['R1'],
  },
  {
    id: 'C2',
    statement: 'HRV biofeedback trains autonomic balance, not just measures it.',
    whatOndaDoes:
      'ONDA closes the loop: you breathe, you watch your own heart rhythm respond in real time, and the practice adapts. That is HRV biofeedback — an active technique for engaging vagal (parasympathetic) activity, not a passive readout.',
    whatIsNotProven:
      'The mechanism (baroreflex and vagal engagement) is supported; the magnitude of long-term change in autonomic balance for a given individual, and how it translates to specific health outcomes, remains an active research question.',
    refIds: ['R1', 'R3'],
  },
  {
    id: 'C3',
    statement: 'Interoception — the felt sense of the body — is a real, trainable capacity.',
    whatOndaDoes:
      'ONDA’s live-feedback practice is interoceptive training: attending to the felt sense of breath and heartbeat while a visible signal confirms what you feel.',
    whatIsNotProven:
      'Craig establishes interoception as a distinct neural sense with a clear cortical basis. That a phone-based practice measurably improves interoceptive accuracy, and that this transfers to everyday emotional regulation, is plausible and supported by broader work but is not proven by this foundational reference alone.',
    refIds: ['R4'],
  },
  {
    id: 'C4',
    statement: 'Resting HRV is a meaningful multi-day trend, not a daily verdict.',
    whatOndaDoes:
      'ONDA reads your resting-HRV trend from your device (via Apple Health) and leads with the direction over weeks, rather than gamifying any single morning reading.',
    whatIsNotProven:
      'HRV is a useful marker of self-regulation and health at the group level; it is not a diagnostic test, and an individual day’s number is noisy. A higher HRV is not automatically “better” in every context.',
    refIds: ['R2'],
  },
]

export function getReference(id: string): EvidenceReference | undefined {
  return EVIDENCE_REFERENCES.find((r) => r.id === id)
}
