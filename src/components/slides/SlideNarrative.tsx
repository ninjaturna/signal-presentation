import { SlideShell } from '../SlideShell'
import { EditableText } from '../EditableText'
import { colors } from '../../design-system'
import type { SlideMode } from '../../design-system'
import type { SlideData } from '../../types/deck'
import type { DeckTheme } from '../../design-system/themes'

interface SlideNarrativeProps {
  eyebrow?: string
  headline: string
  body?: string
  mode?: SlideMode
  pullQuote?: string
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
  theme?: DeckTheme['tokens']
}

export function SlideNarrative({ eyebrow, headline, body, mode = 'light', pullQuote, editable = false, onUpdate, theme }: SlideNarrativeProps) {
  const up = (patch: Partial<SlideData>) => onUpdate?.(patch)
  const textPrimary = mode === 'dark' ? '#FFFFFF' : colors.ink
  const textMuted   = mode === 'dark' ? colors.mutedDark : colors.mutedLight
  const accentColor = theme?.accentBar ?? (mode === 'dark' ? colors.gold : colors.blue)

  return (
    <SlideShell slideType="content" mode={mode}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: pullQuote ? '55%' : '70%' }}>
        {eyebrow && (
          <EditableText
            value={eyebrow}
            onSave={v => up({ eyebrow: v })}
            editable={!!editable}
            style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: accentColor, marginBottom: 16,
              display: 'block',
            }}
          />
        )}
        <EditableText
          value={headline}
          onSave={v => up({ headline: v })}
          editable={!!editable}
          multiline
          style={{
            fontSize: 32, fontWeight: 600, lineHeight: 1.2,
            color: textPrimary, marginBottom: body ? 20 : 0,
            display: 'block',
          }}
        />
        {body && (
          <EditableText
            value={body}
            onSave={v => up({ body: v })}
            editable={!!editable}
            multiline
            style={{
              fontSize: 16, lineHeight: 1.65,
              color: textMuted, display: 'block',
            }}
          />
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
          <EditableText
            value={pullQuote}
            onSave={v => up({ pullQuote: v })}
            editable={!!editable}
            multiline
            style={{
              fontSize: 20, fontWeight: 500, lineHeight: 1.4,
              color: textPrimary, fontStyle: 'italic', display: 'block',
            }}
          />
        </div>
      )}
    </SlideShell>
  )
}
