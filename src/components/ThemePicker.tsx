import { useState } from 'react'
import { DECK_THEMES } from '../design-system/themes'
import type { DeckTheme } from '../design-system/themes'
import type { DeckMeta } from '../types/deck'

interface ThemePickerProps {
  activeThemeId:   string
  deckMeta?:       DeckMeta
  onThemeChange:   (themeId: string) => void
  onClose?:        () => void
}

export function ThemePicker({ activeThemeId, deckMeta, onThemeChange, onClose }: ThemePickerProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div style={{
      width: 280,
      background: '#16161A',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: '12px',
      padding: '20px',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff', letterSpacing: '0.04em' }}>
          Theme
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
              fontSize: '16px', lineHeight: 1, padding: '2px 6px',
            }}
          >✕</button>
        )}
      </div>

      {deckMeta?.themeReason && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '6px', padding: '10px 12px', marginBottom: '16px',
          fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.5',
        }}>
          <span style={{
            fontFamily: '"DM Mono", monospace', fontSize: '9px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)', display: 'block', marginBottom: '4px',
          }}>
            Auto-selected · {deckMeta.themeConfidence ?? 'low'} confidence
          </span>
          {deckMeta.themeReason}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {DECK_THEMES.map(theme => {
          const isActive  = theme.id === activeThemeId
          const isHovered = theme.id === hoveredId
          return (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              onMouseEnter={() => setHoveredId(theme.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px',
                background: isActive ? 'rgba(255,255,255,0.08)' : isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
                borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.12s', fontFamily: '"DM Sans", system-ui, sans-serif',
              }}
            >
              <ThemeSwatch theme={theme} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13px', fontWeight: isActive ? '500' : '400',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)', marginBottom: '1px',
                }}>
                  {theme.name}
                </div>
                <div style={{
                  fontSize: '11px', color: 'rgba(255,255,255,0.3)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {theme.tagline}
                </div>
              </div>
              {isActive && (
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: theme.tokens.accent, flexShrink: 0,
                }} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ThemeSwatch({ theme, size }: { theme: DeckTheme; size: number }) {
  const h = Math.round(size * 9 / 16)
  return (
    <div style={{
      width: size, height: h, borderRadius: '3px', overflow: 'hidden',
      background: theme.tokens.groundPrimary,
      border: '1px solid rgba(255,255,255,0.08)',
      flexShrink: 0, position: 'relative',
    }}>
      {theme.style.accentBarPosition === 'left' && (
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '2px', background: theme.tokens.accent }} />
      )}
      {theme.style.accentBarPosition === 'top' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: theme.tokens.accent }} />
      )}
      <div style={{
        position: 'absolute',
        left: theme.style.accentBarPosition === 'left' ? '5px' : '4px',
        right: '4px', bottom: '4px',
      }}>
        <div style={{ height: '2px', background: theme.tokens.textPrimary, opacity: 0.5, borderRadius: '1px', width: '80%', marginBottom: '2px' }} />
        <div style={{ height: '1px', background: theme.tokens.textSecondary, opacity: 0.3, borderRadius: '1px', width: '55%' }} />
      </div>
    </div>
  )
}
