import { SlideShell } from '../SlideShell'
import { EditableText } from '../EditableText'
import { HighlightText } from '../HighlightText'
import { colors } from '../../design-system'
import type { SlideMode } from '../../design-system'
import type { SlideData, InlineLink, TextHighlight } from '../../types/deck'
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
  highlights?: TextHighlight[]
  revealStep?: number
}

export function SlideNarrative({
  eyebrow, headline, body, mode = 'light', pullQuote,
  editable = false, onUpdate, theme, layout,
  links, highlights, revealStep,
}: SlideNarrativeProps) {
  const up = (patch: Partial<SlideData>) => onUpdate?.(patch)

  const isDark       = mode === 'dark'
  const textPrimary  = isDark ? '#FFFFFF' : colors.ink
  const textMuted    = isDark ? (theme?.bodyText ?? colors.mutedDark) : colors.mutedLight
  const accentColor  = theme?.accentColor ?? theme?.accentBar ?? (isDark ? colors.gold : colors.blue)
  const headlineScale = theme?.headlineScale ?? 'normal'

  const showBody      = revealStep === undefined || revealStep >= 1
  const showPullQuote = revealStep === undefined || revealStep >= 2

  // Per-slide layout overrides theme default
  const effectiveLayout = layout ?? theme?.narrativeLayout ?? 'default'

  const headlineFontSize = headlineScale === 'massive'
    ? 'clamp(28px, 4.2vw, 56px)'
    : headlineScale === 'large'
    ? 'clamp(22px, 3.4vw, 44px)'
    : 'clamp(18px, 2.6vw, 32px)'

  // ── EDITORIAL — accent rule, oversized headline, body beside ──
  if (effectiveLayout === 'editorial') {
    return (
      <SlideShell slideType="content" mode={mode}>

        {/* Top accent rule */}
        <div style={{
          width: 48, height: 3,
          background: accentColor,
          marginBottom: 28, flexShrink: 0,
        }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {eyebrow && (
            <div style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: accentColor, marginBottom: 16,
            }}>
              {eyebrow}
            </div>
          )}

          {editable ? (
            <EditableText
              value={headline}
              onSave={v => up({ headline: v })}
              editable
              multiline
              highlights={highlights}
              style={{
                fontSize: headlineFontSize,
                fontWeight: 700,
                lineHeight: 1.1,
                color: textPrimary,
                letterSpacing: '-0.025em',
                maxWidth: body ? '65%' : '80%',
                display: 'block',
                marginBottom: body ? 32 : 0,
              }}
            />
          ) : (
            <div style={{
              fontSize: headlineFontSize,
              fontWeight: 700,
              lineHeight: 1.1,
              color: textPrimary,
              letterSpacing: '-0.025em',
              maxWidth: body ? '65%' : '80%',
              marginBottom: body ? 32 : 0,
            }}>
              <HighlightText text={headline} highlights={highlights ?? []} />
            </div>
          )}

          {body && (
            <div style={{
              display: 'flex', gap: 40, alignItems: 'flex-start',
              opacity: showBody ? 1 : 0,
              transition: 'opacity 0.35s ease',
            }}>
              <div style={{
                width: 2, flexShrink: 0,
                background: accentColor, alignSelf: 'stretch', minHeight: 60,
                opacity: 0.4,
              }} />
              {editable ? (
                <EditableText
                  value={body}
                  onSave={v => up({ body: v })}
                  editable
                  multiline
                  style={{
                    fontSize: 'clamp(13px, 1.4vw, 17px)',
                    lineHeight: 1.75,
                    color: textMuted,
                    display: 'block',
                    flex: 1,
                  }}
                />
              ) : (
                <p style={{
                  fontSize: 'clamp(13px, 1.4vw, 17px)',
                  lineHeight: 1.75,
                  color: textMuted,
                  flex: 1, margin: 0,
                }}>
                  {renderTextWithLinks(body, links)}
                </p>
              )}
            </div>
          )}
        </div>
      </SlideShell>
    )
  }

  // ── MINIMAL — massive bottom-anchored headline ─────────────────
  if (effectiveLayout === 'minimal') {
    return (
      <SlideShell slideType="content" mode={mode}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: 16,
        }}>
          {eyebrow && (
            <div style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: accentColor, marginBottom: 20,
            }}>
              {eyebrow}
            </div>
          )}
          {editable ? (
            <EditableText
              value={headline}
              onSave={v => up({ headline: v })}
              editable
              multiline
              highlights={highlights}
              style={{
                fontSize: 'clamp(32px, 5vw, 68px)',
                fontWeight: 700,
                lineHeight: 1.0,
                color: textPrimary,
                letterSpacing: '-0.03em',
                display: 'block',
                maxWidth: '90%',
              }}
            />
          ) : (
            <div style={{
              fontSize: 'clamp(32px, 5vw, 68px)',
              fontWeight: 700,
              lineHeight: 1.0,
              color: textPrimary,
              letterSpacing: '-0.03em',
              maxWidth: '90%',
            }}>
              <HighlightText text={headline} highlights={highlights ?? []} />
            </div>
          )}
          {body && (
            <div style={{
              marginTop: 32, paddingTop: 24,
              borderTop: `1px solid ${accentColor}20`,
              fontSize: 'clamp(12px, 1.3vw, 15px)',
              lineHeight: 1.7, color: textMuted,
              opacity: showBody ? 1 : 0,
              transition: 'opacity 0.35s ease',
              maxWidth: '65%',
            }}>
              {editable
                ? <EditableText value={body} onSave={v => up({ body: v })} editable multiline style={{ display: 'block' }} />
                : renderTextWithLinks(body, links)
              }
            </div>
          )}
        </div>
      </SlideShell>
    )
  }

  // ── DEFAULT / CENTERED ────────────────────────────────────────
  const isCentered = effectiveLayout === 'centered'
  const maxWidth   = isCentered ? '80%' : pullQuote ? '55%' : '70%'

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
        {editable ? (
          <EditableText
            value={headline}
            onSave={v => up({ headline: v })}
            editable
            multiline
            highlights={highlights}
            style={{
              fontSize: headlineFontSize,
              fontWeight: 600, lineHeight: 1.2,
              color: textPrimary, marginBottom: body ? 20 : 0,
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            fontSize: headlineFontSize,
            fontWeight: 600, lineHeight: 1.2,
            color: textPrimary, marginBottom: body ? 20 : 0,
          }}>
            <HighlightText text={headline} highlights={highlights ?? []} />
          </div>
        )}
        {body && (
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
              color: textMuted,
              opacity: showBody ? 1 : 0,
              transform: showBody ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}>
              {renderTextWithLinks(body, links)}
            </div>
          )
        )}
      </div>
      {pullQuote && !isCentered && (
        <div style={{
          position: 'absolute', right: 48, top: '50%',
          transform: 'translateY(-50%)',
          width: '36%',
          borderLeft: `3px solid ${accentColor}`,
          paddingLeft: 24,
          opacity: showPullQuote ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}>
          {editable ? (
            <EditableText
              value={pullQuote}
              onSave={v => up({ pullQuote: v })}
              editable
              multiline
              highlights={highlights}
              style={{
                fontSize: 'clamp(14px, 1.6vw, 20px)', fontWeight: 500,
                lineHeight: 1.4, color: textPrimary, fontStyle: 'italic',
                display: 'block',
              }}
            />
          ) : (
            <div style={{
              fontSize: 'clamp(14px, 1.6vw, 20px)', fontWeight: 500,
              lineHeight: 1.4, color: textPrimary, fontStyle: 'italic',
            }}>
              <HighlightText text={pullQuote} highlights={highlights ?? []} />
            </div>
          )}
        </div>
      )}
    </SlideShell>
  )
}
