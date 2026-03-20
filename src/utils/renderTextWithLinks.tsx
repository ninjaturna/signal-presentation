import React from 'react'
import type { InlineLink } from '../types/deck'

/**
 * Replaces link.text phrases inside `text` with <a> elements.
 * Matches first occurrence of each phrase, resolves overlaps by position.
 */
export function renderTextWithLinks(
  text: string,
  links: InlineLink[] = []
): React.ReactNode {
  if (!links.length) return text

  type Match = { start: number; end: number; link: InlineLink }
  const matches: Match[] = []

  for (const link of links) {
    if (!link.text.trim()) continue
    const idx = text.indexOf(link.text)
    if (idx >= 0) {
      matches.push({ start: idx, end: idx + link.text.length, link })
    }
  }

  if (!matches.length) return text

  // Sort by position, drop overlaps
  matches.sort((a, b) => a.start - b.start)
  const clean: Match[] = []
  let lastEnd = 0
  for (const m of matches) {
    if (m.start >= lastEnd) { clean.push(m); lastEnd = m.end }
  }

  const nodes: React.ReactNode[] = []
  let pos = 0
  for (const m of clean) {
    if (m.start > pos) nodes.push(text.slice(pos, m.start))
    nodes.push(
      <a
        key={m.link.id}
        href={m.link.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'inherit',
          textDecoration: 'underline',
          textDecorationColor: 'rgba(30,90,242,0.55)',
          textUnderlineOffset: 3,
        }}
        onClick={e => e.stopPropagation()}
      >
        {m.link.text}
      </a>
    )
    pos = m.end
  }
  if (pos < text.length) nodes.push(text.slice(pos))

  return <>{nodes}</>
}
