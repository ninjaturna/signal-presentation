import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'
import type { SlideMode } from '../../design-system'

interface SlideNarrativeProps {
  eyebrow?: string
  headline: string
  body?: string
  mode?: SlideMode
  pullQuote?: string
}

export function SlideNarrative({ eyebrow, headline, body, mode = 'light', pullQuote }: SlideNarrativeProps) {
  const textPrimary = mode === 'dark' ? '#FFFFFF' : colors.ink
  const textMuted   = mode === 'dark' ? colors.mutedDark : colors.mutedLight
  const accentColor = mode === 'dark' ? colors.gold : colors.blue

  return (
    <SlideShell slideType="content" mode={mode}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: pullQuote ? '55%' : '70%' }}>
        {eyebrow && (
          <div style={{
            fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: accentColor, marginBottom: 16,
          }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{
          fontSize: 32, fontWeight: 600, lineHeight: 1.2,
          color: textPrimary, marginBottom: body ? 20 : 0,
        }}>
          {headline}
        </h2>
        {body && (
          <p style={{ fontSize: 16, lineHeight: 1.65, color: textMuted }}>
            {body}
          </p>
        )}
      </div>
      {pullQuote && (
        <div style={{
          position: 'absolute', right: 48, top: '50%',
          transform: 'translateY(-50%)',
          width: '36%',
          borderLeft: `3px solid ${accentColor}`,
          paddingLeft: 24,
        }}>
          <p style={{
            fontSize: 20, fontWeight: 500, lineHeight: 1.4,
            color: textPrimary, fontStyle: 'italic',
          }}>
            {pullQuote}
          </p>
        </div>
      )}
    </SlideShell>
  )
}
