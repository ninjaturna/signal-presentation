import React from 'react'
import type { TextHighlight } from '../types/deck'

const HIGHLIGHT_COLORS: Record<string, { bg: string; text: string }> = {
  blue: { bg: '#1E5AF2', text: '#FFFFFF' },
  gold: { bg: '#FFCC2D', text: '#111113' },
  red:  { bg: '#FF1C52', text: '#FFFFFF' },
  ink:  { bg: '#111113', text: '#FFFFFF' },
}

interface HighlightTextProps {
  text: string
  highlights: TextHighlight[]
  baseStyle?: React.CSSProperties
}

export function HighlightText({ text, highlights, baseStyle }: HighlightTextProps) {
  if (!highlights || highlights.length === 0) return <>{text}</>

  let remaining = text
  const segments: Array<{ text: string; highlight?: TextHighlight }> = []

  while (remaining.length > 0) {
    let earliest: { idx: number; highlight: TextHighlight } | null = null

    for (const h of highlights) {
      if (!h.text.trim()) continue
      const idx = remaining.indexOf(h.text)
      if (idx !== -1 && (earliest === null || idx < earliest.idx)) {
        earliest = { idx, highlight: h }
      }
    }

    if (!earliest) {
      segments.push({ text: remaining })
      break
    }

    if (earliest.idx > 0) {
      segments.push({ text: remaining.slice(0, earliest.idx) })
    }
    segments.push({ text: earliest.highlight.text, highlight: earliest.highlight })
    remaining = remaining.slice(earliest.idx + earliest.highlight.text.length)
  }

  return (
    <>
      {segments.map((seg, i) => {
        if (!seg.highlight) {
          return <React.Fragment key={i}>{seg.text}</React.Fragment>
        }
        const { bg, text: textColor } = HIGHLIGHT_COLORS[seg.highlight.color ?? 'blue']
        return (
          <mark
            key={i}
            style={{
              background: bg,
              color: textColor,
              borderRadius: 3,
              padding: '0 4px 1px',
              boxDecorationBreak: 'clone',
              WebkitBoxDecorationBreak: 'clone',
              fontSize: 'inherit',
              fontWeight: 'inherit',
              lineHeight: 'inherit',
              fontFamily: 'inherit',
              ...baseStyle,
            }}
          >
            {seg.text}
          </mark>
        )
      })}
    </>
  )
}
