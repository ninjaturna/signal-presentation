import { SlideShell } from '../SlideShell'
import { EditableText } from '../EditableText'
import { colors } from '../../design-system'
import type { SlideData } from '../../types/deck'

interface SlideCoverProps {
  eyebrow?: string
  title: string
  subtitle?: string
  meta?: string
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
}

export function SlideCover({ eyebrow, title, subtitle, meta, editable = false, onUpdate }: SlideCoverProps) {
  const up = (patch: Partial<SlideData>) => onUpdate?.(patch)

  return (
    <SlideShell slideType="cover" mode="dark">
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 4, height: '100%', background: colors.blue,
      }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingLeft: 12 }}>
        {eyebrow && (
          <EditableText
            value={eyebrow}
            onSave={v => up({ eyebrow: v })}
            editable={!!editable}
            style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: colors.blue, marginBottom: 20,
              display: 'block',
            }}
          />
        )}
        <EditableText
          value={title}
          onSave={v => up({ title: v })}
          editable={!!editable}
          multiline
          style={{
            fontSize: 44, fontWeight: 600, lineHeight: 1.08,
            color: '#FFFFFF', marginBottom: subtitle ? 20 : 32,
            maxWidth: '70%', display: 'block',
          }}
        />
        {subtitle && (
          <EditableText
            value={subtitle}
            onSave={v => up({ subtitle: v })}
            editable={!!editable}
            multiline
            style={{
              fontSize: 18, fontWeight: 400, lineHeight: 1.5,
              color: colors.mutedDark, marginBottom: 32, maxWidth: '55%',
              display: 'block',
            }}
          />
        )}
        {meta && (
          <EditableText
            value={meta}
            onSave={v => up({ meta: v })}
            editable={!!editable}
            style={{
              fontSize: 13, fontWeight: 400,
              color: colors.mutedDark, letterSpacing: '0.02em',
              display: 'block',
            }}
          />
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
