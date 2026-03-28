import { useClientLogo } from '../utils/logoService'
import type { DeckTheme } from '../design-system/themes'

interface LogoSlotProps {
  clientName?:   string
  logoUrl?:      string
  mode?:         'light' | 'dark'
  theme?:        DeckTheme
  size?:         'sm' | 'md' | 'lg'
  editable?:     boolean
  onLogoChange?: (url: string) => void
  style?:        React.CSSProperties
}

const SIZE_MAP = {
  sm: { maxWidth: '80px',  maxHeight: '32px' },
  md: { maxWidth: '120px', maxHeight: '48px' },
  lg: { maxWidth: '160px', maxHeight: '56px' },
}

export function LogoSlot({
  clientName, logoUrl, mode = 'light',
  size = 'md', editable = false, onLogoChange, style = {},
}: LogoSlotProps) {
  const { logo, loading } = useClientLogo(logoUrl ? undefined : clientName)
  const resolvedLogo = logoUrl
    ? { url: logoUrl, format: 'png' as const, source: 'brandfetch' as const }
    : logo

  const { maxWidth, maxHeight } = SIZE_MAP[size]

  if (loading) {
    return (
      <div
        style={{
          width: maxWidth, height: maxHeight, borderRadius: '4px',
          background: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          animation: 'signal-shimmer 1.5s ease-in-out infinite',
          ...style,
        }}
        aria-label="Loading client logo"
      />
    )
  }

  if (!resolvedLogo || resolvedLogo.format === 'placeholder' || !resolvedLogo.url) {
    const initials = clientName
      ? clientName.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('').slice(0, 3)
      : '?'

    return (
      <div
        title={editable ? 'Click to add logo URL' : `${clientName ?? 'Client'} – logo not found`}
        onClick={() => {
          if (!editable) return
          const url = window.prompt('Paste logo URL (SVG or PNG):')
          if (url?.trim()) onLogoChange?.(url.trim())
        }}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: maxWidth, height: maxHeight,
          border: `1px dashed ${mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
          borderRadius: '4px',
          fontFamily: '"DM Mono", monospace', fontSize: '11px', fontWeight: '500',
          letterSpacing: '0.06em',
          color: mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)',
          cursor: editable ? 'pointer' : 'default',
          userSelect: 'none',
          ...style,
        }}
      >
        {initials}
      </div>
    )
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, position: 'relative', ...style }}>
      <img
        src={resolvedLogo.url}
        alt={`${clientName ?? 'Client'} logo`}
        style={{
          maxWidth, maxHeight, width: 'auto', height: 'auto',
          objectFit: 'contain',
          filter: mode === 'dark' && resolvedLogo.format !== 'svg' ? 'brightness(0) invert(1)' : undefined,
          display: 'block',
        }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      {editable && (
        <div
          title="Replace logo"
          onClick={() => {
            const url = window.prompt('Paste logo URL (SVG or PNG):')
            if (url?.trim()) onLogoChange?.(url.trim())
          }}
          style={{
            position: 'absolute', inset: '-4px',
            background: 'rgba(0,0,0,0)', border: '1px solid transparent',
            borderRadius: '4px', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLDivElement
            el.style.background = 'rgba(0,0,0,0.4)'
            el.style.borderColor = 'rgba(255,255,255,0.4)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLDivElement
            el.style.background = 'rgba(0,0,0,0)'
            el.style.borderColor = 'transparent'
          }}
        />
      )}
    </div>
  )
}
