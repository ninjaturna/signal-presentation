import { SlideShell } from '../SlideShell'
import { EditableText } from '../EditableText'
import { LogoSlot } from '../LogoSlot'
import { palette } from '../../design-system'
import type { SlideData, DeckMeta } from '../../types/deck'
import type { DeckTheme } from '../../design-system/themes'

interface SlideCoverProps {
  eyebrow?: string
  title: string
  subtitle?: string
  meta?: string
  mode?: string
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
  theme?: DeckTheme
  deckMeta?: DeckMeta
  layout?: string
}

export function SlideCover({
  eyebrow, title, subtitle, meta, mode,
  editable = false, onUpdate, theme, deckMeta, layout,
}: SlideCoverProps) {
  const up = (patch: Partial<SlideData>) => onUpdate?.(patch)

  // Use new token structure with fallbacks to old values
  const accentBar     = theme?.tokens.barLeft     ?? palette.blue
  const accentColor   = theme?.tokens.accent      ?? palette.blue
  const coverBg       = theme?.tokens.groundAccent ?? undefined
  const coverText     = theme?.tokens.textReversed ?? '#FFFFFF'
  const bodyText      = theme?.tokens.textMuted    ?? '#70708A'

  const accentBarWidth = theme?.style.accentBarSize === 'sm' ? '3px'
    : theme?.style.accentBarSize === 'lg' ? '5px' : '4px'

  const headlineFontSize = 'clamp(24px, 3.5vw, 44px)'

  const effectiveLayout = layout ?? 'default'

  // ── EDITORIAL ─────────────────────────────────────────────────────────────
  if (effectiveLayout === 'editorial') {
    return (
      <SlideShell slideType="cover" mode="dark" fullBleed theme={theme}
        style={coverBg ? { background: coverBg } : undefined}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 1280 720" preserveAspectRatio="none">
          <line x1="64" y1="0" x2="64" y2="720" stroke={accentColor} strokeWidth="1" opacity="0.15" />
          <line x1="640" y1="0" x2="640" y2="720" stroke={accentColor} strokeWidth="1" opacity="0.08" />
          <line x1="0" y1="560" x2="1280" y2="560" stroke={accentColor} strokeWidth="1" opacity="0.12" />
        </svg>
        {eyebrow && (
          <div style={{
            position: 'absolute', left: 22, top: '50%',
            transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'center center',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: accentColor, whiteSpace: 'nowrap',
          }}>{eyebrow}</div>
        )}
        <div style={{ position: 'absolute', left: 80, right: 64, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {deckMeta?.clientName && (
            <LogoSlot clientName={deckMeta.clientName} logoUrl={deckMeta.logoUrl} mode="dark" theme={theme} size="md" editable={editable} style={{ marginBottom: '24px' }} />
          )}
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accentColor, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 1, background: accentColor }} />
            {eyebrow || 'SIGNAL DECK'}
            <div style={{ width: 32, height: 1, background: accentColor }} />
          </div>
          <EditableText value={title} onSave={v => up({ title: v })} editable={!!editable} multiline
            style={{ fontSize: headlineFontSize, fontWeight: 700, lineHeight: 1.0, color: coverText, letterSpacing: '-0.03em', marginBottom: subtitle ? 28 : 0, display: 'block', maxWidth: '75%' }} />
          {subtitle && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 3, height: 40, background: accentColor, flexShrink: 0 }} />
              <EditableText value={subtitle} onSave={v => up({ subtitle: v })} editable={!!editable} multiline
                style={{ fontSize: 'clamp(13px, 1.5vw, 18px)', lineHeight: 1.5, color: bodyText, maxWidth: 500, display: 'block' }} />
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: accentColor, display: 'flex', alignItems: 'center', padding: '0 80px', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000', opacity: 0.8 }}>SIGNAL</span>
          {meta && <span style={{ fontSize: 11, fontWeight: 500, color: '#000', opacity: 0.7 }}>{meta}</span>}
        </div>
      </SlideShell>
    )
  }

  // ── CINEMATIC ─────────────────────────────────────────────────────────────
  if (effectiveLayout === 'cinematic') {
    return (
      <SlideShell slideType="cover" mode="dark" fullBleed theme={theme}
        style={coverBg ? { background: coverBg } : undefined}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', background: accentColor, clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)', opacity: 0.12 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: accentColor }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', position: 'relative', zIndex: 1 }}>
          {deckMeta?.clientName && (
            <LogoSlot clientName={deckMeta.clientName} logoUrl={deckMeta.logoUrl} mode="dark" theme={theme} size="md" editable={editable} style={{ marginBottom: '28px' }} />
          )}
          {eyebrow && (
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accentColor, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 2, background: accentColor }} />{eyebrow}
            </div>
          )}
          <EditableText value={title} onSave={v => up({ title: v })} editable={!!editable} multiline
            style={{ fontSize: headlineFontSize, fontWeight: 700, lineHeight: 1.05, color: coverText, letterSpacing: '-0.025em', maxWidth: '60%', marginBottom: subtitle ? 32 : 0, display: 'block' }} />
          {subtitle && (
            <EditableText value={subtitle} onSave={v => up({ subtitle: v })} editable={!!editable} multiline
              style={{ fontSize: 'clamp(13px, 1.4vw, 17px)', lineHeight: 1.6, color: bodyText, maxWidth: 460, display: 'block' }} />
          )}
          {meta && <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${accentColor}30`, fontSize: 11, color: bodyText, letterSpacing: '0.05em' }}>{meta}</div>}
        </div>
      </SlideShell>
    )
  }

  // ── BOLD ───────────────────────────────────────────────────────────────────
  if (effectiveLayout === 'bold') {
    return (
      <SlideShell slideType="cover" mode="dark" fullBleed theme={theme}
        style={coverBg ? { background: coverBg } : undefined}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: accentBarWidth, height: '100%', background: accentBar }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 72px' }}>
          {deckMeta?.clientName && (
            <LogoSlot clientName={deckMeta.clientName} logoUrl={deckMeta.logoUrl} mode="dark" theme={theme} size="md" editable={editable} style={{ marginBottom: '28px' }} />
          )}
          {eyebrow && (
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: accentColor, marginBottom: 20 }}>{eyebrow}</div>
          )}
          <EditableText value={title} onSave={v => up({ title: v })} editable={!!editable} multiline
            style={{ fontSize: 'clamp(40px, 6.5vw, 88px)', fontWeight: 800, lineHeight: 0.95, color: coverText, letterSpacing: '-0.04em', display: 'block', maxWidth: '85%' }} />
          {subtitle && (
            <div style={{ marginTop: 36, paddingTop: 28, borderTop: `1px solid ${accentColor}25` }}>
              <EditableText value={subtitle} onSave={v => up({ subtitle: v })} editable={!!editable} multiline
                style={{ fontSize: 'clamp(14px, 1.5vw, 19px)', lineHeight: 1.5, color: bodyText, display: 'block', maxWidth: 500 }} />
            </div>
          )}
        </div>
        {meta && <div style={{ position: 'absolute', bottom: 32, left: 72, fontSize: 11, fontWeight: 400, color: bodyText, letterSpacing: '0.04em' }}>{meta}</div>}
        <div style={{ position: 'absolute', bottom: 32, right: 48, fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.borderDark }}>SIGNAL</div>
      </SlideShell>
    )
  }

  // ── DEFAULT / CENTERED ────────────────────────────────────────────────────
  const isCentered = effectiveLayout === 'centered'

  return (
    <SlideShell slideType="cover" mode="dark" theme={theme}
      style={coverBg ? { background: coverBg } : undefined}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: accentBarWidth, height: '100%', background: accentBar }} />

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: isCentered ? 'center' : 'flex-end',
        alignItems: isCentered ? 'center' : 'flex-start',
        paddingLeft: isCentered ? 0 : 12,
        textAlign: isCentered ? 'center' : 'left',
      }}>
        {/* Logo above eyebrow */}
        {deckMeta?.clientName && (
          <LogoSlot
            clientName={deckMeta.clientName}
            logoUrl={deckMeta.logoUrl}
            mode="dark" theme={theme} size="md"
            editable={editable}
            style={{ marginBottom: '28px' }}
          />
        )}

        {eyebrow && (
          <EditableText value={eyebrow} onSave={v => up({ eyebrow: v })} editable={!!editable}
            style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: accentBar, marginBottom: 20, display: 'block' }} />
        )}
        <EditableText value={title} onSave={v => up({ title: v })} editable={!!editable} multiline
          style={{ fontSize: headlineFontSize, fontWeight: 600, lineHeight: 1.08, color: coverText, marginBottom: subtitle ? 20 : 32, maxWidth: isCentered ? '80%' : '70%', display: 'block' }} />
        {subtitle && (
          <EditableText value={subtitle} onSave={v => up({ subtitle: v })} editable={!!editable} multiline
            style={{ fontSize: 'clamp(13px, 1.4vw, 18px)', fontWeight: 400, lineHeight: 1.5, color: bodyText, marginBottom: 32, maxWidth: '55%', display: 'block' }} />
        )}
        {meta && (
          <EditableText value={meta} onSave={v => up({ meta: v })} editable={!!editable}
            style={{ fontSize: 13, fontWeight: 400, color: bodyText, display: 'block' }} />
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 32, right: 48, fontSize: 13, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.borderDark }}>SIGNAL</div>
    </SlideShell>
  )
}
