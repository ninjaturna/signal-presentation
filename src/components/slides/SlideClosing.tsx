import { SlideShell } from '../SlideShell'
import { EditableText } from '../EditableText'
import { colors } from '../../design-system'
import type { SlideData, InlineLink } from '../../types/deck'
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
  theme?: DeckTheme['tokens']
  links?: InlineLink[]
}

export function SlideClosing({
  headline, cta, ctaUrl, ctaTarget, contact,
  layout = 'default',
  editable = false,
  onUpdate,
  theme,
  links,
}: SlideClosingProps) {
  const up = (patch: Partial<SlideData>) => onUpdate?.(patch)

  const primary   = theme?.primary   ?? colors.blue
  const accentBar = theme?.accentBar ?? colors.gold
  const coverBg   = theme?.coverBg   ?? undefined
  const coverText = theme?.coverText ?? '#FFFFFF'

  const contactStyle = (extra?: React.CSSProperties): React.CSSProperties => ({
    fontSize: 14, color: colors.mutedDark, display: 'block', ...extra,
  })

  const ContactLine = ({ style }: { style?: React.CSSProperties }) => contact ? (
    editable ? (
      <EditableText
        value={contact} onSave={v => up({ contact: v })}
        editable
        style={contactStyle(style)}
      />
    ) : (
      <div style={contactStyle(style)}>{renderTextWithLinks(contact, links)}</div>
    )
  ) : null

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

  return (
    <SlideShell slideType="closing" mode="dark" style={coverBg ? { background: coverBg } : undefined}>

      {/* ── Default / Standard: left-aligned, gold top bar ── */}
      {(layout === 'default' || layout === 'standard') && (
        <>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 3, background: accentBar,
          }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <EditableText
              value={headline} onSave={v => up({ headline: v })}
              editable={!!editable} multiline
              style={{
                fontSize: 40, fontWeight: 600, lineHeight: 1.1,
                color: coverText, maxWidth: 560, marginBottom: 32, display: 'block',
              }}
            />
            <CTAButton />
            <ContactLine style={{ marginTop: 28 }} />
          </div>
        </>
      )}

      {/* ── Centered: everything center-aligned ── */}
      {layout === 'centered' && (
        <>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 3, background: primary,
          }} />
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '0 80px',
          }}>
            <EditableText
              value={headline} onSave={v => up({ headline: v })}
              editable={!!editable} multiline
              style={{
                fontSize: 38, fontWeight: 600, lineHeight: 1.1,
                color: coverText, maxWidth: 640, marginBottom: 36, display: 'block',
              }}
            />
            <CTAButton big />
            <ContactLine style={{ fontSize: 13, marginTop: 24 }} />
          </div>
        </>
      )}

      {/* ── Minimal: understated, bottom-anchored ── */}
      {layout === 'minimal' && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', paddingBottom: 48,
        }}>
          <div style={{
            width: 32, height: 2,
            background: accentBar,
            marginBottom: 28,
          }} />
          <EditableText
            value={headline} onSave={v => up({ headline: v })}
            editable={!!editable} multiline
            style={{
              fontSize: 32, fontWeight: 600, lineHeight: 1.2,
              color: coverText, maxWidth: '60%',
              marginBottom: cta ? 28 : 0, display: 'block',
            }}
          />
          {cta && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <CTAButton />
              <ContactLine style={{ fontSize: 13 }} />
            </div>
          )}
          {!cta && <ContactLine style={{ fontSize: 13 }} />}
        </div>
      )}

      {/* SIGNAL watermark */}
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
