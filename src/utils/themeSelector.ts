import { DECK_THEMES, DEFAULT_THEME_ID } from '../design-system/themes'
import type { DeckTheme } from '../design-system/themes'

export interface ThemeSelectorInput {
  clientName?:   string
  industry?:     string
  deckType?:     string
  tone?:         string
  rawText?:      string
}

interface ScoredTheme {
  theme:        DeckTheme
  score:        number
  matchedOn:    string[]
}

export function selectTheme(input: ThemeSelectorInput): {
  themeId:     string
  confidence:  'high' | 'medium' | 'low'
  reason:      string
  scores:      ScoredTheme[]
} {
  const searchText = [
    input.clientName ?? '',
    input.industry ?? '',
    input.deckType ?? '',
    input.tone ?? '',
    (input.rawText ?? '').slice(0, 2000),
  ].join(' ').toLowerCase()

  const scored: ScoredTheme[] = DECK_THEMES.map(theme => {
    let score = theme.selector.priority
    const matchedOn: string[] = []

    const checkSignals = (signals: string[], weight: number, category: string) => {
      for (const signal of signals) {
        if (searchText.includes(signal.toLowerCase())) {
          score += weight
          matchedOn.push(`${category}:${signal}`)
        }
      }
    }

    checkSignals(theme.selector.clientSignals,   5, 'client')
    checkSignals(theme.selector.industrySignals, 3, 'industry')
    checkSignals(theme.selector.deckTypeSignals, 3, 'deckType')
    checkSignals(theme.selector.toneSignals,     2, 'tone')

    for (const avoid of theme.selector.avoid) {
      if (searchText.includes(avoid.toLowerCase())) {
        score -= 4
        matchedOn.push(`avoid:${avoid} (-4)`)
      }
    }

    return { theme, score, matchedOn }
  })

  scored.sort((a, b) => b.score - a.score)

  const winner = scored[0]
  const runnerUp = scored[1]

  const scoreDiff = winner.score - runnerUp.score
  const confidence = scoreDiff >= 6 ? 'high' : scoreDiff >= 3 ? 'medium' : 'low'

  const topMatches = winner.matchedOn
    .filter(m => !m.startsWith('avoid'))
    .slice(0, 3)
    .map(m => m.split(':')[1])

  const reason = topMatches.length > 0
    ? `Selected ${winner.theme.name} based on ${topMatches.join(', ')} signals.`
    : `${winner.theme.name} applied as the default theme.`

  return {
    themeId:    winner.score > 0 ? winner.theme.id : DEFAULT_THEME_ID,
    confidence,
    reason,
    scores:     scored,
  }
}

export function extractThemeSignals(rawContentDoc: string): ThemeSelectorInput {
  const lines = rawContentDoc.split('\n').slice(0, 30)

  let clientName: string | undefined
  let industry: string | undefined
  let deckType: string | undefined
  let tone: string | undefined

  for (const line of lines) {
    const clientMatch = line.match(/(?:client|prepared for|for|audience)[:\s]+(.+)/i)
    if (clientMatch) clientName = clientMatch[1].trim()

    const industryMatch = line.match(/(?:industry|sector|vertical)[:\s]+(.+)/i)
    if (industryMatch) industry = industryMatch[1].trim()

    const typeMatch = line.match(/(?:deck type|type|format|purpose)[:\s]+(.+)/i)
    if (typeMatch) deckType = typeMatch[1].trim()

    const toneMatch = line.match(/(?:tone|voice|style)[:\s]+(.+)/i)
    if (toneMatch) tone = toneMatch[1].trim()
  }

  return { clientName, industry, deckType, tone, rawText: rawContentDoc.slice(0, 2000) }
}

export function selectThemeFromDoc(rawContentDoc: string): ReturnType<typeof selectTheme> {
  const signals = extractThemeSignals(rawContentDoc)
  return selectTheme(signals)
}
