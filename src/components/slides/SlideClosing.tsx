import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'
import type { DeckTheme } from '../../design-system/themes'

interface SlideClosingProps {
  headline: string
  cta?: string
  ctaUrl?: string
  ctaTarget?: '_blank' | '_self'
  contact?: string
  theme?: DeckTheme['tokens']
}

export function SlideClosing({ headline, cta, ctaUrl, ctaTarget, contact, theme }: SlideClosingProps) {
  const coverBg   = theme?.coverBg   ?? undefined
  const coverText = theme?.coverText ?? '#FFFFFF'
  const primary   = theme?.primary   ?? colors.blue
  const accentBar = theme?.accentBar ?? colors.gold

  return (
    <SlideShell slideType="closing" mode="dark" style={coverBg ? { background: coverBg } : undefined}>
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: accentBar,
      }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{
          fontSize: 40, fontWeight: 600, lineHeight: 1.1,
          color: coverText, maxWidth: 560, marginBottom: 32,
        }}>
          {headline}
        </h2>
        {cta && (
          ctaUrl ? (
            <a
              href={ctaUrl}
              target={ctaTarget ?? '_blank'}
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                background: primary, borderRadius: 8,
                padding: '14px 28px', width: 'fit-content', marginBottom: 32,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background 0.15s, transform 0.1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = colors.blueDim
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = primary
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>{cta}</span>
              <span style={{ color: '#FFFFFF', opacity: 0.7 }}>→</span>
            </a>
          ) : (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              background: primary, borderRadius: 8,
              padding: '14px 28px', width: 'fit-content', marginBottom: 32,
              opacity: 0.6,
              cursor: 'default',
            }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>{cta}</span>
              <span style={{ color: '#FFFFFF', opacity: 0.7 }}>→</span>
            </div>
          )
        )}
        {contact && (
          <p style={{ fontSize: 14, color: colors.mutedDark }}>{contact}</p>
        )}
      </div>

      <div style={{
        position: 'absolute', bottom: 32, right: 48,
        fontSize: 13, fontWeight: 600, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: colors.borderDark,
      }}>
        SIGNAL
      </div>
    </SlideShell>
  )
}
