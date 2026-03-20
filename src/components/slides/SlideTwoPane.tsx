import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'
import type { SlideMode } from '../../design-system'
import type { DeckTheme } from '../../design-system/themes'

interface Pane {
  eyebrow?: string
  heading: string
  body?: string
  bullets?: string[]
  accent?: boolean
}

interface SlideTwoPaneProps {
  left: Pane
  right: Pane
  split?: '50/50' | '60/40' | '40/60'
  mode?: SlideMode
  revealStep?: number
  theme?: DeckTheme['tokens']
}

export function SlideTwoPane({ left, right, split = '50/50', mode = 'light', revealStep, theme }: SlideTwoPaneProps) {
  const textPrimary  = mode === 'dark' ? '#FFFFFF' : colors.ink
  const textMuted    = mode === 'dark' ? colors.mutedDark : colors.mutedLight
  const dividerColor = mode === 'dark' ? colors.borderDark : colors.border
  const accentColor  = theme?.primary ?? colors.blue

  const leftFr   = split === '60/40' ? '60' : split === '40/60' ? '40' : '50'
  const rightFr  = split === '60/40' ? '40' : split === '40/60' ? '60' : '50'
  const showRight = revealStep === undefined || revealStep >= 1

  const renderPane = (pane: Pane) => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {pane.eyebrow && (
        <div style={{
          fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: pane.accent ? colors.gold : accentColor,
          marginBottom: 12,
        }}>
          {pane.eyebrow}
        </div>
      )}
      <h3 style={{
        fontSize: 'clamp(16px, 1.9vw, 24px)', fontWeight: 600, lineHeight: 1.25,
        color: textPrimary, marginBottom: pane.body || pane.bullets ? 16 : 0,
      }}>
        {pane.heading}
      </h3>
      {pane.body && (
        <p style={{ fontSize: 'clamp(11px, 1.2vw, 15px)', lineHeight: 1.6, color: textMuted }}>{pane.body}</p>
      )}
      {pane.bullets && (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: pane.body ? 16 : 0 }}>
          {pane.bullets.map((b, i) => (
            <li key={i} style={{
              fontSize: 'clamp(11px, 1.2vw, 15px)', lineHeight: 1.5, color: textMuted,
              paddingLeft: 16, marginBottom: 8, position: 'relative',
            }}>
              <span style={{
                position: 'absolute', left: 0, top: 8,
                width: 5, height: 5, borderRadius: '50%',
                background: accentColor, display: 'block',
              }} />
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <SlideShell slideType="content" mode={mode}>
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: `${leftFr}fr ${rightFr}fr`,
        gap: 0,
        alignItems: 'stretch',
      }}>
        <div style={{ paddingRight: 40, borderRight: `1px solid ${dividerColor}` }}>
          {renderPane(left)}
        </div>
        <div style={{
          paddingLeft: 40,
          opacity: showRight ? 1 : 0,
          transform: showRight ? 'translateX(0)' : 'translateX(20px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}>
          {renderPane(right)}
        </div>
      </div>
    </SlideShell>
  )
}
