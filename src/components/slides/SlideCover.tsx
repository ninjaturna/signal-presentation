import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'

interface SlideCoverProps {
  eyebrow?: string
  title: string
  subtitle?: string
  meta?: string
}

export function SlideCover({ eyebrow, title, subtitle, meta }: SlideCoverProps) {
  return (
    <SlideShell slideType="cover" mode="dark">
      {/* Blue accent bar top-left */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 4, height: '100%',
        background: colors.blue,
      }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingLeft: 12 }}>
        {eyebrow && (
          <div style={{
            fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: colors.blue, marginBottom: 20,
          }}>
            {eyebrow}
          </div>
        )}
        <h1 style={{
          fontSize: 44, fontWeight: 600, lineHeight: 1.08,
          color: '#FFFFFF', marginBottom: subtitle ? 20 : 32,
          maxWidth: '70%',
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontSize: 18, fontWeight: 400, lineHeight: 1.5,
            color: colors.mutedDark, marginBottom: 32, maxWidth: '55%',
          }}>
            {subtitle}
          </p>
        )}
        {meta && (
          <div style={{
            fontSize: 13, fontWeight: 400,
            color: colors.mutedDark, letterSpacing: '0.02em',
          }}>
            {meta}
          </div>
        )}
      </div>

      {/* SIGNAL wordmark bottom right */}
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
