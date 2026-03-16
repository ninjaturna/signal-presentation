import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'

interface SlideClosingProps {
  headline: string
  cta?: string
  contact?: string
}

export function SlideClosing({ headline, cta, contact }: SlideClosingProps) {
  return (
    <SlideShell slideType="closing" mode="dark">
      {/* Gold top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: colors.gold,
      }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{
          fontSize: 40, fontWeight: 600, lineHeight: 1.1,
          color: '#FFFFFF', maxWidth: 560, marginBottom: 32,
        }}>
          {headline}
        </h2>
        {cta && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            background: colors.blue, borderRadius: 8,
            padding: '14px 28px', width: 'fit-content', marginBottom: 32,
          }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>{cta}</span>
            <span style={{ color: '#FFFFFF', opacity: 0.7 }}>→</span>
          </div>
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
