import { SlideShell } from '../SlideShell'
import { EditableText } from '../EditableText'
import { HighlightText } from '../HighlightText'
import { LogoSlot } from '../LogoSlot'
import { colors } from '../../design-system'
import type { SlideData, InlineLink, TextHighlight, DeckMeta } from '../../types/deck'
import type { DeckTheme } from '../../design-system/themes'
import { renderTextWithLinks } from '../../utils/renderTextWithLinks'

interface SlideClosingProps {
  headline: string
  cta?: string
  ctaUrl?: string
  ctaTarget?: '_blank' | '_self'
  contact?: string
  layout?: string
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
  theme?: DeckTheme
  deckMeta?: DeckMeta
  links?: InlineLink[]
  highlights?: TextHighlight[]
}

export function SlideClosing({
  headline, cta, ctaUrl, ctaTarget, contact,
  layout = 'default',
  editable = false, onUpdate, theme, deckMeta, links, highlights,
}: SlideClosingProps) {
  const up = (patch: Partial<SlideData>) => onUpdate?.(patch)

  const primary     = theme?.tokens.accent      ?? colors.blue
  const accentBar   = theme?.tokens.barTop      ?? theme?.tokens.barLeft ?? colors.gold
  const accentColor = theme?.tokens.accent      ?? colors.blue
  const coverBg     = theme?.tokens.groundAccent ?? undefined
  const coverText   = theme?.tokens.textReversed ?? '#FFFFFF'
  const bodyText    = theme?.tokens.textMuted    ?? '#77706F'

  // Per-slide layout overrides theme default
  const effectiveLayout = layout ?? 'default'

  const headlineFontSize = 'clamp(24px, 3.2vw, 40px)'

  const CTAButton = ({ big }: { big?: boolean }) => cta ? (
    <a
      href={ctaUrl ?? '#'}
      target={ctaUrl ? (ctaTarget ?? '_blank') : undefined}
      rel="noopener noreferrer"
      onClick={e => { if (!ctaUrl) e.preventDefault(); e.stopPropagation() }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        background: primary, borderRadius: 8,
        padding: big ? '16px 32px' : '14px 28px',
        width: 'fit-content', textDecoration: 'none',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      <span style={{ fontSize: big ? 17 : 15, fontWeight: 600, color: '#FFFFFF' }}>{cta}</span>
      <span style={{ color: '#FFFFFF', opacity: 0.7 }}>→</span>
    </a>
  ) : null

  const ContactLine = ({ style }: { style?: React.CSSProperties }) => contact ? (
    editable ? (
      <EditableText
        value={contact} onSave={v => up({ contact: v })}
        editable
        style={{ fontSize: 14, color: bodyText, display: 'block', ...style }}
      />
    ) : (
      <div style={{ fontSize: 14, color: bodyText, ...style }}>
        {renderTextWithLinks(contact, links)}
      </div>
    )
  ) : null

  // ── CINEMATIC — diagonal accent, oversized type ───────────────
  if (effectiveLayout === 'cinematic') {
    return (
      <SlideShell slideType="closing" mode="dark" theme={theme}
        style={coverBg ? { background: coverBg } : undefined}>

        {/* Top accent rule */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 4, background: accentColor,
        }} />

        {/* Diagonal background accent */}
        <div style={{
          position: 'absolute',
          bottom: 0, right: 0,
          width: '55%', height: '60%',
          background: accentColor,
          clipPath: 'polygon(30% 100%, 100% 0, 100% 100%)',
          opacity: 0.06,
        }} />

        {/* Decorative large glyph */}
        <div style={{
          position: 'absolute',
          right: 64, top: '50%',
          transform: 'translateY(-60%)',
          fontSize: 'clamp(120px, 18vw, 240px)',
          fontWeight: 800,
          color: accentColor,
          opacity: 0.04,
          lineHeight: 1,
          letterSpacing: '-0.05em',
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          ✦
        </div>

        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative', zIndex: 1,
        }}>
          {editable ? (
            <EditableText
              value={headline} onSave={v => up({ headline: v })}
              editable multiline
              highlights={highlights}
              style={{
                fontSize: headlineFontSize,
                fontWeight: 700, lineHeight: 1.05,
                color: coverText, maxWidth: '55%',
                marginBottom: 40, display: 'block',
                letterSpacing: '-0.02em',
              }}
            />
          ) : (
            <div style={{
              fontSize: headlineFontSize,
              fontWeight: 700, lineHeight: 1.05,
              color: coverText, maxWidth: '55%',
              marginBottom: 40, letterSpacing: '-0.02em',
            }}>
              <HighlightText text={headline} highlights={highlights ?? []} />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <CTAButton big />
            <ContactLine style={{ fontSize: 13 }} />
          </div>
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

  // ── CENTERED ──────────────────────────────────────────────────
  if (effectiveLayout === 'centered') {
    return (
      <SlideShell slideType="closing" mode="dark" theme={theme}
        style={coverBg ? { background: coverBg } : undefined}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 3, background: primary,
        }} />
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 80px',
        }}>
          {editable ? (
            <EditableText
              value={headline} onSave={v => up({ headline: v })}
              editable multiline
              highlights={highlights}
              style={{
                fontSize: headlineFontSize,
                fontWeight: 600, lineHeight: 1.1,
                color: coverText, maxWidth: 640, marginBottom: 36, display: 'block',
              }}
            />
          ) : (
            <div style={{
              fontSize: headlineFontSize,
              fontWeight: 600, lineHeight: 1.1,
              color: coverText, maxWidth: 640, marginBottom: 36,
            }}>
              <HighlightText text={headline} highlights={highlights ?? []} />
            </div>
          )}
          <CTAButton big />
          <ContactLine style={{ fontSize: 13, marginTop: 24 }} />
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

  // ── MINIMAL ───────────────────────────────────────────────────
  if (effectiveLayout === 'minimal') {
    return (
      <SlideShell slideType="closing" mode="dark" theme={theme}
        style={coverBg ? { background: coverBg } : undefined}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', paddingBottom: 48,
        }}>
          <div style={{
            width: 32, height: 2,
            background: accentBar, marginBottom: 28,
          }} />
          {editable ? (
            <EditableText
              value={headline} onSave={v => up({ headline: v })}
              editable multiline
              highlights={highlights}
              style={{
                fontSize: 'clamp(24px, 3.5vw, 44px)',
                fontWeight: 600, lineHeight: 1.2,
                color: coverText, maxWidth: '60%',
                marginBottom: cta ? 28 : 0, display: 'block',
              }}
            />
          ) : (
            <div style={{
              fontSize: 'clamp(24px, 3.5vw, 44px)',
              fontWeight: 600, lineHeight: 1.2,
              color: coverText, maxWidth: '60%',
              marginBottom: cta ? 28 : 0,
            }}>
              <HighlightText text={headline} highlights={highlights ?? []} />
            </div>
          )}
          {cta && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <CTAButton />
              <ContactLine style={{ fontSize: 13 }} />
            </div>
          )}
          {!cta && <ContactLine style={{ fontSize: 13 }} />}
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

  // ── DEFAULT / STANDARD ────────────────────────────────────────
  return (
    <SlideShell slideType="closing" mode="dark" theme={theme}
      style={coverBg ? { background: coverBg } : undefined}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: accentBar,
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {editable ? (
          <EditableText
            value={headline} onSave={v => up({ headline: v })}
            editable multiline
            highlights={highlights}
            style={{
              fontSize: headlineFontSize,
              fontWeight: 600, lineHeight: 1.1,
              color: coverText, maxWidth: 560, marginBottom: 32, display: 'block',
            }}
          />
        ) : (
          <div style={{
            fontSize: headlineFontSize,
            fontWeight: 600, lineHeight: 1.1,
            color: coverText, maxWidth: 560, marginBottom: 32,
          }}>
            <HighlightText text={headline} highlights={highlights ?? []} />
          </div>
        )}
        <CTAButton />
        <ContactLine style={{ marginTop: 28 }} />
      </div>

      {deckMeta?.clientName && (
        <LogoSlot
          clientName={deckMeta.clientName}
          logoUrl={deckMeta.logoUrl}
          mode="dark" theme={theme} size="sm"
          editable={editable}
          style={{ position: 'absolute', bottom: 32, left: 48 }}
        />
      )}

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
