export interface ParsedSlide {
  id: string
  number: string          // '1', '2', ... or 'A', 'B' for appendix
  title: string           // slide title from ### SLIDE N | TITLE
  heading: string
  subheading?: string
  body: string            // raw body text (may contain bullets or paragraphs)
  bodyBullets: string[]   // extracted bullet lines
  isBodyParagraph: boolean
  footer?: string
  notes?: string          // internal reviewer notes — never shown in slides
  hasLeftRight: boolean   // true if BODY contains LEFT:/RIGHT: pattern
  left?: { label: string; bullets: string[] }
  right?: { label: string; bullets: string[] }
  isAppendix: boolean
}

export interface ParsedStats {
  value: string
  label: string
  context: string
}

export interface ParsedContentDoc {
  documentTitle: string
  agencyLine: string
  clientName: string
  preparedFor?: string
  status?: string
  engagementType?: string
  summary?: string
  slides: ParsedSlide[]
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractBetween(text: string, startLabel: string, endLabels: string[]): string {
  // Always include the NOTES blockquote as a stop — so FOOTER capture stops before notes
  const stops = [
    ...endLabels.map(l => `\\*\\*${l}\\*\\*`),
    `>\\s*\\*\\*NOTES`,
  ]
  const pattern = new RegExp(
    `\\*\\*${startLabel}\\*\\*\\s*\\n([\\s\\S]*?)(?=${stops.join('|')}|$)`,
    'i',
  )
  const m = text.match(pattern)
  return m ? m[1].trim() : ''
}

function extractNotes(text: string): string {
  const m = text.match(/>\s*\*\*NOTES[^*]*\*\*\s*([\s\S]*?)(?=\n---|\n###|$)/i)
  if (!m) return ''
  return m[1]
    .split('\n')
    .map(l => l.replace(/^>\s?/, '').trim())
    .filter(Boolean)
    .join('\n')
}

function extractBullets(body: string): string[] {
  return body
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('- '))
    .map(l => l.slice(2).trim())
}

function extractLeftRight(body: string): {
  left?: { label: string; bullets: string[] }
  right?: { label: string; bullets: string[] }
  found: boolean
} {
  const leftMatch  = body.match(/LEFT:\s*\[?([^\]\n]*)\]?\s*\n([\s\S]*?)(?=RIGHT:|$)/i)
  const rightMatch = body.match(/RIGHT:\s*\[?([^\]\n]*)\]?\s*\n([\s\S]*?)(?=$)/i)
  if (!leftMatch || !rightMatch) return { found: false }
  return {
    found: true,
    left:  { label: leftMatch[1].trim(),  bullets: extractBullets(leftMatch[2]) },
    right: { label: rightMatch[1].trim(), bullets: extractBullets(rightMatch[2]) },
  }
}

function stripItalics(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '$1').trim()
}

function extractMetaValue(table: string, key: string): string {
  const re = new RegExp(`\\*\\*${key}\\*\\*\\s*\\|\\s*([^\\n|]+)`, 'i')
  const m = table.match(re)
  return m ? m[1].trim() : ''
}

// ── Main parser ──────────────────────────────────────────────────────────────

export function parseContentDoc(rawMarkdown: string): ParsedContentDoc {
  // Normalise Windows line endings
  const markdown = rawMarkdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  const lines = markdown.split('\n')

  // Document title + agency line
  const h1 = lines.find(l => l.startsWith('# '))?.slice(2).trim() ?? ''

  // Client name from h1 (format: "Client × Agency" or plain title)
  const clientFromH1 = h1.includes('×') ? h1.split('×')[0].trim() : h1

  // Summary section
  const summaryMatch = markdown.match(/## Pitch Summary\s*\n+([\s\S]*?)(?=\n---|\n##)/i)
  const summary = summaryMatch ? summaryMatch[1].trim() : ''

  // Document info table
  const infoMatch = markdown.match(/## Document Information\s*\n+([\s\S]*?)(?=\n---|\n##)/i)
  const infoTable = infoMatch ? infoMatch[1] : ''
  const preparedFor    = extractMetaValue(infoTable, 'Prepared for')
  const status         = extractMetaValue(infoTable, 'Status')
  const engagementType = extractMetaValue(infoTable, 'Engagement type')

  // Split into slide sections: ### SLIDE N | TITLE or ### APPENDIX A | TITLE
  const slideRegex = /### (SLIDE\s+(\w+)|APPENDIX\s+([A-Z]))\s*\|\s*([^\n]+)/gi
  const slideMatches = [...markdown.matchAll(slideRegex)]

  const slides: ParsedSlide[] = slideMatches.map((match, i) => {
    const fullMatch  = match[0]
    const appendixId = match[3] ?? ''
    const slideNum   = match[2] ?? ''
    const slideTitle = match[4].trim()
    const isAppendix = !!appendixId
    const number     = isAppendix ? appendixId : slideNum

    // Extract block from this ### to next ### or end
    const startIdx = markdown.indexOf(fullMatch)
    const endIdx   = i < slideMatches.length - 1
      ? markdown.indexOf(slideMatches[i + 1][0])
      : markdown.length
    const block = markdown.slice(startIdx, endIdx)

    const heading    = extractBetween(block, 'HEADING',    ['SUBHEADING', 'BODY', 'FOOTER'])
    const subheading = extractBetween(block, 'SUBHEADING', ['BODY', 'FOOTER'])
    const bodyRaw    = extractBetween(block, 'BODY',       ['FOOTER'])
    const footerRaw  = extractBetween(block, 'FOOTER',     [])
    const notes      = extractNotes(block)

    const footer = footerRaw ? stripItalics(footerRaw.split('\n')[0]) : undefined

    const bullets           = extractBullets(bodyRaw)
    const { found, left, right } = extractLeftRight(bodyRaw)
    const isBodyParagraph   = bullets.length === 0 && !found

    return {
      id: `slide-${number}`,
      number,
      title: slideTitle,
      heading: heading || slideTitle,
      subheading: subheading || undefined,
      body: bodyRaw,
      bodyBullets: bullets,
      isBodyParagraph,
      footer,
      notes,
      hasLeftRight: found,
      left,
      right,
      isAppendix,
    }
  })

  return {
    documentTitle: h1,
    agencyLine: '',
    clientName: clientFromH1,
    preparedFor,
    status,
    engagementType,
    summary,
    slides,
  }
}

// ── Stat extractor ───────────────────────────────────────────────────────────

export function extractStats(bullets: string[]): ParsedStats[] {
  return bullets
    .map(b => {
      const colonSplit = b.match(/^([^:]+):\s*(.+)/)
      if (colonSplit) {
        const [, label, rest] = colonSplit
        const dashParts = rest.split('—').map(s => s.trim())
        return { value: dashParts[0] ?? '', label: label.trim(), context: dashParts.slice(1).join(' — ') }
      }
      const statLike = b.match(/^(\$?[\d.]+[BMK%x+]?\+?)\s+(.+?)(?:\s*[—–-]\s*(.+))?$/)
      if (statLike) {
        return { value: statLike[1], label: statLike[2] ?? '', context: statLike[3] ?? '' }
      }
      return null
    })
    .filter((s): s is ParsedStats => s !== null && s.value.length > 0)
}
