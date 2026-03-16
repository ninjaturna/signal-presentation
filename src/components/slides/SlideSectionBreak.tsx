import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'

interface SlideSectionBreakProps {
  number?: string
  title: string
  subtitle?: string
}

export function SlideSectionBreak({ number, title, subtitle }: SlideSectionBreakProps) {
  return (
    <SlideShell slideType="section-break" mode="dark">
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
          }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ fontSize: 16, color: colors.mutedDark, maxWidth: 440 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {/* Gold accent bar bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 48,
        width: 48, height: 3, background: colors.gold,
      }} />
    </SlideShell>
  )
}
