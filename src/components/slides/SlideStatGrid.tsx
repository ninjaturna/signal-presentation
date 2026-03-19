import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'
import type { SlideMode } from '../../design-system'
import type { DeckTheme } from '../../design-system/themes'

interface Stat {
  value: string
  label: string
  context?: string
}

interface SlideStatGridProps {
  eyebrow?: string
  headline?: string
  stats: Stat[]
  mode?: SlideMode
  theme?: DeckTheme['tokens']
}

export function SlideStatGrid({ eyebrow, headline, stats, mode = 'light', theme }: SlideStatGridProps) {
  const textPrimary = mode === 'dark' ? '#FFFFFF' : colors.ink
  const textMuted   = mode === 'dark' ? colors.mutedDark : colors.mutedLight
  const statColor   = theme?.statColor ?? colors.blue
  const statBg      = mode === 'dark' ? colors.inkSoft : colors.surfaceAlt
  const statBorder  = mode === 'dark' ? colors.borderDark : colors.border

  return (
    <SlideShell slideType="content" mode={mode}>
      {(eyebrow || headline) && (
        <div style={{ marginBottom: 32 }}>
          {eyebrow && (
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: statColor, marginBottom: 8,
            }}>
              {eyebrow}
            </div>
          )}
          {headline && (
            <h2 style={{ fontSize: 24, fontWeight: 600, color: textPrimary }}>{headline}</h2>
          )}
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
        gap: 20,
        flex: 1,
        alignContent: 'center',
      }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: statBg,
            border: `1px solid ${statBorder}`,
            borderRadius: 12,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div style={{
              fontSize: 48, fontWeight: 600, lineHeight: 1,
              color: statColor, marginBottom: 12,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {stat.value}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: textPrimary, marginBottom: 4 }}>
                {stat.label}
              </div>
              {stat.context && (
                <div style={{ fontSize: 12, color: textMuted }}>{stat.context}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}
