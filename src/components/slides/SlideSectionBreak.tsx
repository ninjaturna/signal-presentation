import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'
import type { DeckTheme } from '../../design-system/themes'

interface SlideSectionBreakProps {
  number?: string
  title: string
  subtitle?: string
  theme?: DeckTheme['tokens']
  revealStep?: number
}

export function SlideSectionBreak({ number, title, subtitle, theme, revealStep }: SlideSectionBreakProps) {
  const sectionBg    = theme?.sectionBg ?? undefined
  const accentBar    = theme?.accentBar ?? colors.gold
  const showTitle    = revealStep === undefined || revealStep >= 1
  const showSubtitle = revealStep === undefined || revealStep >= 2

  return (
    <SlideShell slideType="section-break" mode="dark" style={sectionBg ? { background: sectionBg } : undefined}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <div>
          {number && (
            <div style={{
              fontSize: 80, fontWeight: 600, lineHeight: 1,
              color: colors.inkSoft, marginBottom: 8, fontVariantNumeric: 'tabular-nums',
            }}>
              {number}
            </div>
          )}
          <h2 style={{
            fontSize: 36, fontWeight: 600, lineHeight: 1.15,
            color: '#FFFFFF', maxWidth: 560, marginBottom: subtitle ? 16 : 0,
            opacity: showTitle ? 1 : 0,
            transform: showTitle ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{
              fontSize: 16, color: colors.mutedDark, maxWidth: 440,
              opacity: showSubtitle ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {/* Accent bar bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 48,
        width: 48, height: 3, background: accentBar,
      }} />
    </SlideShell>
  )
}
