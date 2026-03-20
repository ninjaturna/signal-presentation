import { SlideShell } from '../SlideShell'
import { EditableText } from '../EditableText'
import { colors } from '../../design-system'
import type { SlideMode } from '../../design-system'
import type { SlideData } from '../../types/deck'
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
  layout?: string
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
  revealStep?: number
}

export function SlideStatGrid({ eyebrow, headline, stats, mode = 'light', theme, layout, editable = false, onUpdate, revealStep }: SlideStatGridProps) {
  const textPrimary = mode === 'dark' ? '#FFFFFF' : colors.ink
  const textMuted   = mode === 'dark' ? colors.mutedDark : colors.mutedLight
  const statColor   = theme?.statColor ?? colors.blue
  const statBg      = mode === 'dark' ? colors.inkSoft : colors.surfaceAlt
  const statBorder  = mode === 'dark' ? colors.borderDark : colors.border

  const isBold = layout === 'bold'

  return (
    <SlideShell slideType="content" mode={mode}>
      {(eyebrow !== undefined || headline !== undefined) && (
        <div style={{ marginBottom: 32 }}>
          {eyebrow !== undefined && (
            <EditableText
              value={eyebrow}
              onSave={v => onUpdate?.({ eyebrow: v })}
              editable={!!editable}
              style={{
                fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: statColor, marginBottom: 8,
                display: 'block',
              }}
            />
          )}
          {headline !== undefined && (
            <EditableText
              value={headline}
              onSave={v => onUpdate?.({ headline: v })}
              editable={!!editable}
              multiline
              style={{
                fontSize: 24, fontWeight: 600, color: textPrimary, display: 'block',
              }}
            />
          )}
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(stats.length, isBold ? 3 : 4)}, 1fr)`,
        gap: isBold ? 28 : 20,
        flex: 1,
        alignContent: 'center',
      }}>
        {stats.map((stat, i) => {
          const isVisible = revealStep === undefined || i < revealStep
          return (
          <div key={i} style={{
            background: isBold ? 'transparent' : statBg,
            border: isBold ? 'none' : `1px solid ${statBorder}`,
            borderTop: isBold ? `3px solid ${statColor}` : undefined,
            borderRadius: isBold ? 0 : 12,
            padding: isBold ? '24px 0' : '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            transitionDelay: isVisible ? `${i * 0.06}s` : '0s',
          }}>
            <div style={{
              fontSize: isBold ? 'clamp(36px, 5vw, 72px)' : 'clamp(24px, 3.8vw, 48px)',
              fontWeight: 700,
              lineHeight: 1,
              color: statColor,
              marginBottom: isBold ? 16 : 12,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {stat.value}
            </div>
            <div>
              <div style={{
                fontSize: isBold ? 13 : 15,
                fontWeight: 600,
                color: textPrimary,
                marginBottom: 4,
              }}>
                {stat.label}
              </div>
              {stat.context && !isBold && (
                <div style={{ fontSize: 12, color: textMuted }}>{stat.context}</div>
              )}
            </div>
          </div>
          )
        })}
      </div>
    </SlideShell>
  )
}
