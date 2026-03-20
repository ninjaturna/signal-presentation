import { SlideShell } from '../SlideShell'
import { EditableText } from '../EditableText'
import { colors } from '../../design-system'
import type { SlideData } from '../../types/deck'
import type { DeckTheme } from '../../design-system/themes'

interface SlideCoverProps {
  eyebrow?: string
  title: string
  subtitle?: string
  meta?: string
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
  theme?: DeckTheme['tokens']
  layout?: string
}

export function SlideCover({ eyebrow, title, subtitle, meta, editable = false, onUpdate, theme, layout }: SlideCoverProps) {
  const up = (patch: Partial<SlideData>) => onUpdate?.(patch)
  const accentBar = theme?.accentBar ?? colors.blue
  const coverBg   = theme?.coverBg   ?? undefined
  const coverText = theme?.coverText ?? '#FFFFFF'

  const isCentered = layout === 'centered'
  const isBold     = layout === 'bold'

  return (
    <SlideShell slideType="cover" mode="dark" style={coverBg ? { background: coverBg } : undefined}>
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 4, height: '100%', background: accentBar,
      }} />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: isCentered ? 'center' : 'flex-end',
        alignItems: isCentered ? 'center' : 'flex-start',
        paddingLeft: isCentered ? 0 : 12,
        textAlign: isCentered ? 'center' : 'left',
      }}>
        {eyebrow && (
          <EditableText
            value={eyebrow}
            onSave={v => up({ eyebrow: v })}
            editable={!!editable}
            style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: accentBar, marginBottom: 20,
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
            fontSize: isBold ? 56 : 44,
            fontWeight: 600, lineHeight: 1.08,
            color: coverText, marginBottom: subtitle ? 20 : 32,
            maxWidth: isBold ? '90%' : isCentered ? '80%' : '70%',
            display: 'block',
          }}
        />
        {subtitle && !isBold && (
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
        {meta && !isBold && (
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
