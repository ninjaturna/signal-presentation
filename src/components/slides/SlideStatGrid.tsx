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

export function SlideStatGrid({
  eyebrow, headline, stats, mode = 'light',
  theme, layout, editable = false, onUpdate, revealStep,
}: SlideStatGridProps) {
  const isDark      = mode === 'dark'
  const textPrimary = isDark ? '#FFFFFF' : colors.ink
  const textMuted   = isDark ? (theme?.bodyText ?? colors.mutedDark) : colors.mutedLight
  const statColor   = theme?.statColor   ?? colors.blue
  const accentColor = theme?.accentColor ?? colors.blue
  const cardBg      = theme?.cardBg      ?? (isDark ? colors.inkSoft : colors.surfaceAlt)
  const cardBorder  = theme?.cardBorder  ?? (isDark ? colors.borderDark : colors.border)

  // Per-slide layout overrides theme default
  const effectiveLayout = layout ?? theme?.statLayout ?? 'default'
  const isBold      = effectiveLayout === 'bold'
  const isOversized = effectiveLayout === 'oversized'

  // ── OVERSIZED — magazine-style, numbers dominate ──────────────
  if (isOversized) {
    return (
      <SlideShell slideType="content" mode={mode}>
        {/* Eyebrow + headline row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32, flexShrink: 0,
        }}>
          <div>
            {eyebrow && (
              <div style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: accentColor, marginBottom: 4,
              }}>
                {eyebrow}
              </div>
            )}
            {headline && (
              <div style={{
                fontSize: 'clamp(14px, 1.6vw, 19px)',
                fontWeight: 600, color: textPrimary,
              }}>
                {headline}
              </div>
            )}
          </div>
          {/* Decorative gradient rule */}
          <div style={{
            flex: 1, height: 1, margin: '0 24px',
            background: `linear-gradient(to right, ${accentColor}40, transparent)`,
          }} />
        </div>

        {/* Stats — full-height columns, number-dominant */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
          gap: 2,
          alignContent: 'stretch',
        }}>
          {stats.map((stat, i) => {
            const isVisible = revealStep === undefined || i < revealStep
            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '24px 20px',
                borderLeft: i > 0 ? `1px solid ${accentColor}15` : 'none',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
              }}>
                {/* Massive number */}
                <div style={{
                  fontSize: 'clamp(52px, 7vw, 96px)',
                  fontWeight: 800,
                  lineHeight: 0.9,
                  color: statColor,
                  letterSpacing: '-0.04em',
                  marginBottom: 16,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {stat.value}
                </div>

                {/* Thin rule */}
                <div style={{
                  width: 32, height: 2,
                  background: accentColor,
                  marginBottom: 12, opacity: 0.6,
                }} />

                <div style={{
                  fontSize: 'clamp(11px, 1.2vw, 14px)',
                  fontWeight: 600,
                  color: textPrimary,
                  lineHeight: 1.3,
                  marginBottom: 6,
                }}>
                  {stat.label}
                </div>
                {stat.context && (
                  <div style={{
                    fontSize: 'clamp(10px, 1vw, 12px)',
                    color: textMuted,
                    lineHeight: 1.4,
                  }}>
                    {stat.context}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SlideShell>
    )
  }

  // ── BOLD — large numbers, top-rule, card-free ─────────────────
  if (isBold) {
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
                  textTransform: 'uppercase', color: accentColor, marginBottom: 8,
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
                style={{ fontSize: 24, fontWeight: 600, color: textPrimary, display: 'block' }}
              />
            )}
          </div>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`,
          gap: 28, flex: 1, alignContent: 'center',
        }}>
          {stats.map((stat, i) => {
            const isVisible = revealStep === undefined || i < revealStep
            return (
              <div key={i} style={{
                borderTop: `3px solid ${statColor}`,
                paddingTop: 24,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.35s ease ${i * 0.06}s, transform 0.35s ease ${i * 0.06}s`,
              }}>
                <div style={{
                  fontSize: 'clamp(36px, 5vw, 72px)',
                  fontWeight: 700, lineHeight: 1,
                  color: statColor, marginBottom: 16,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: textPrimary, marginBottom: 4,
                }}>
                  {stat.label}
                </div>
                {stat.context && (
                  <div style={{ fontSize: 12, color: textMuted }}>
                    {stat.context}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </SlideShell>
    )
  }

  // ── DEFAULT — card grid ────────────────────────────────────────
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
                textTransform: 'uppercase', color: accentColor, marginBottom: 8,
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
              style={{ fontSize: 24, fontWeight: 600, color: textPrimary, display: 'block' }}
            />
          )}
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
        gap: 20, flex: 1, alignContent: 'center',
      }}>
        {stats.map((stat, i) => {
          const isVisible = revealStep === undefined || i < revealStep
          return (
            <div key={i} style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              borderRadius: 12,
              padding: '28px 24px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: `opacity 0.35s ease ${i * 0.06}s, transform 0.35s ease ${i * 0.06}s`,
            }}>
              <div style={{
                fontSize: 'clamp(24px, 3.8vw, 48px)',
                fontWeight: 700, lineHeight: 1,
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
                  <div style={{ fontSize: 12, color: textMuted }}>
                    {stat.context}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </SlideShell>
  )
}
