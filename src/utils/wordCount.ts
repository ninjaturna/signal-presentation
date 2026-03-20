// SIGNAL Content Density Rules
// Used by useOverflowDetect hook to flag slides with too much text.

import type { SlideData } from '../types/deck'

export type OverflowReason =
  | 'headline-too-long'
  | 'body-too-long'
  | 'slide-too-wordy'
  | 'stat-label-too-long'
  | 'statement-too-long'

export interface ContentDensityResult {
  isDense: boolean
  reasons: OverflowReason[]
  wordCount: number
  threshold: number
}

function countWords(text?: string): number {
  if (!text?.trim()) return 0
  return text.trim().split(/\s+/).length
}

// Per slide type thresholds (SIGNAL brand voice standards)
const SLIDE_THRESHOLDS: Record<string, {
  headline?: number
  body?: number
  total: number
  perStat?: number
  perPane?: number
}> = {
  'cover':          { headline: 12, body: 25, total: 50 },
  'narrative':      { headline: 15, body: 50, total: 80 },
  'stat-grid':      { headline: 12, total: 60, perStat: 12 },
  'two-pane':       { headline: 12, total: 100, perPane: 40 },
  'section-break':  { headline: 10, body: 20, total: 35 },
  'full-bleed':     { headline: 8, total: 8 },
  'closing':        { headline: 10, body: 30, total: 55 },
  'diagram':        { headline: 12, total: 40 },
  'poll':           { headline: 20, total: 50 },
}

export function checkContentDensity(slide: SlideData): ContentDensityResult {
  const thresholds = SLIDE_THRESHOLDS[slide.type]
  if (!thresholds) return { isDense: false, reasons: [], wordCount: 0, threshold: 999 }

  const reasons: OverflowReason[] = []
  let totalWords = 0

  // Eyebrow (never flagged individually — always short)
  totalWords += countWords(slide.eyebrow)

  // Headline / title / statement depending on slide type
  const headlineWords = countWords(slide.headline ?? (slide as any).title ?? (slide as any).statement)
  totalWords += headlineWords
  if (thresholds.headline && headlineWords > thresholds.headline) {
    reasons.push(slide.type === 'full-bleed' ? 'statement-too-long' : 'headline-too-long')
  }

  // Body / subtitle
  const bodyWords = countWords(slide.body ?? (slide as any).subtitle)
  totalWords += bodyWords
  if (thresholds.body && bodyWords > thresholds.body) {
    reasons.push('body-too-long')
  }

  // Pull quote (counts toward total, not individually flagged)
  totalWords += countWords(slide.pullQuote)

  // Stat grid — each stat label + context
  if (slide.type === 'stat-grid' && (slide as any).stats) {
    for (const stat of (slide as any).stats) {
      const statWords = countWords(stat.label) + countWords(stat.context)
      totalWords += statWords + countWords(stat.value)
      if (thresholds.perStat && statWords > thresholds.perStat) {
        reasons.push('stat-label-too-long')
      }
    }
  }

  // Two-pane — each pane
  if (slide.type === 'two-pane') {
    const leftWords  = countWords((slide as any).left?.heading)  + countWords((slide as any).left?.body)
    const rightWords = countWords((slide as any).right?.heading) + countWords((slide as any).right?.body)
    totalWords += leftWords + rightWords
    if (thresholds.perPane) {
      if (leftWords  > thresholds.perPane) reasons.push('body-too-long')
      if (rightWords > thresholds.perPane) reasons.push('body-too-long')
    }
  }

  // CTA / contact (closing)
  totalWords += countWords((slide as any).cta) + countWords((slide as any).contact)

  // Total slide density
  if (totalWords > thresholds.total) {
    if (!reasons.includes('headline-too-long') && !reasons.includes('body-too-long')) {
      reasons.push('slide-too-wordy')
    }
  }

  const uniqueReasons = [...new Set(reasons)] as OverflowReason[]

  return {
    isDense: uniqueReasons.length > 0,
    reasons: uniqueReasons,
    wordCount: totalWords,
    threshold: thresholds.total,
  }
}

// Human-readable reason messages for the badge tooltip
export const DENSITY_MESSAGES: Record<OverflowReason, string> = {
  'headline-too-long':   'Headline is too long for a slide',
  'body-too-long':       'Body copy exceeds slide reading limit',
  'slide-too-wordy':     'Too much text for one slide',
  'stat-label-too-long': 'Stat labels are too long',
  'statement-too-long':  'Statement exceeds full-bleed limit (8 words)',
}
