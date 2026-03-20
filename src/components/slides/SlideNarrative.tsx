import { SlideShell } from '../SlideShell'
import { EditableText } from '../EditableText'
import { colors } from '../../design-system'
import type { SlideMode } from '../../design-system'
import type { SlideData, InlineLink } from '../../types/deck'
import type { DeckTheme } from '../../design-system/themes'
import { renderTextWithLinks } from '../../utils/renderTextWithLinks'

interface SlideNarrativeProps {
  eyebrow?: string
  headline: string
  body?: string
  mode?: SlideMode
  pullQuote?: string
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
  theme?: DeckTheme['tokens']
  layout?: string
  links?: InlineLink[]
  revealStep?: number
}

export function SlideNarrative({ eyebrow, headline, body, mode = 'light', pullQuote, editable = false, onUpdate, theme, layout, links, revealStep }: SlideNarrativeProps) {
  const up = (patch: Partial<SlideData>) => onUpdate?.(patch)
  const textPrimary = mode === 'dark' ? '#FFFFFF' : colors.ink
  const textMuted   = mode === 'dark' ? colors.mutedDark : colors.mutedLight
  const accentColor = theme?.accentBar ?? (mode === 'dark' ? colors.gold : colors.blue)

  const isCentered = layout === 'centered'
  const isMinimal  = layout === 'minimal'

  const showBody      = revealStep === undefined || revealStep >= 1
  const showPullQuote = revealStep === undefined || revealStep >= 2

  const maxWidth = isCentered ? '80%' : pullQuote ? '55%' : '70%'

  return (
    <SlideShell slideType="content" mode={mode}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        maxWidth,
        margin: isCentered ? '0 auto' : undefined,
        alignItems: isCentered ? 'center' : 'flex-start',
        textAlign: isCentered ? 'center' : 'left',
      }}>
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
            fontSize: isMinimal ? 'clamp(28px, 3.5vw, 44px)' : 'clamp(18px, 2.6vw, 32px)',
            fontWeight: 600, lineHeight: 1.2,
            color: textPrimary, marginBottom: body && !isMinimal ? 20 : 0,
            display: 'block',
          }}
        />
        {body && !isMinimal && (
          editable ? (
            <EditableText
              value={body}
              onSave={v => up({ body: v })}
              editable
              multiline
              style={{
                fontSize: 'clamp(12px, 1.3vw, 16px)', lineHeight: 1.65,
                color: textMuted, display: 'block',
              }}
            />
          ) : (
            <div style={{
              fontSize: 'clamp(12px, 1.3vw, 16px)', lineHeight: 1.65,
              color: textMuted, display: 'block',
              opacity: showBody ? 1 : 0,
              transform: showBody ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}>
              {renderTextWithLinks(body, links)}
            </div>
          )
        )}
      </div>
      {pullQuote && !isCentered && !isMinimal && (
        <div style={{
          position: 'absolute', right: 48, top: '50%',
          transform: 'translateY(-50%)',
          width: '36%',
          borderLeft: `3px solid ${accentColor}`,
          paddingLeft: 24,
          opacity: showPullQuote ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}>
          <EditableText
            value={pullQuote}
            onSave={v => up({ pullQuote: v })}
            editable={!!editable}
            multiline
            style={{
              fontSize: 'clamp(14px, 1.6vw, 20px)', fontWeight: 500, lineHeight: 1.4,
              color: textPrimary, fontStyle: 'italic', display: 'block',
            }}
          />
        </div>
      )}
    </SlideShell>
  )
}
