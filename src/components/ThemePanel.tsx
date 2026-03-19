import { DECK_THEMES } from '../design-system/themes'
import type { DeckTheme } from '../design-system/themes'
import { colors } from '../design-system'

export type TransitionType = 'none' | 'fade' | 'slide-left' | 'zoom'

const TRANSITIONS: { id: TransitionType; label: string }[] = [
  { id: 'none',       label: 'None'  },
  { id: 'fade',       label: 'Fade'  },
  { id: 'slide-left', label: 'Slide' },
  { id: 'zoom',       label: 'Zoom'  },
]

interface ThemePanelProps {
  currentThemeId: string
  onSelect: (theme: DeckTheme) => void
  onClose: () => void
  activeTransition: TransitionType
  onTransitionChange: (t: TransitionType) => void
}

export function ThemePanel({ currentThemeId, onSelect, onClose, activeTransition, onTransitionChange }: ThemePanelProps) {
  return (
    <div style={{
      position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
      width: 240, background: '#16161a', border: '1px solid #1e1e24',
      borderRadius: 12, zIndex: 1000, overflow: 'hidden',
      boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', borderBottom: '1px solid #1e1e24',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: colors.blue, letterSpacing: '0.08em' }}>
          THEME
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16,
        }}>×</button>
      </div>

      <div style={{ padding: '10px 12px', borderBottom: '1px solid #1e1e24' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#444', letterSpacing: '0.08em', marginBottom: 8 }}>
          TRANSITION
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {TRANSITIONS.map(t => (
            <button
              key={t.id}
              onClick={() => onTransitionChange(t.id)}
              style={{
                flex: 1,
                padding: '5px 0',
                borderRadius: 5,
                border: `1px solid ${activeTransition === t.id ? colors.blue : '#1e1e24'}`,
                background: activeTransition === t.id ? '#1a1a2e' : 'transparent',
                color: activeTransition === t.id ? colors.blue : '#555',
                fontSize: 11, fontWeight: 600,
                cursor: 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DECK_THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme)}
            style={{
              background: currentThemeId === theme.id ? '#1a1a2e' : '#111',
              border: `1px solid ${currentThemeId === theme.id ? colors.blue : '#1e1e24'}`,
              borderRadius: 8, padding: '10px 12px',
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          >
            {/* Color swatch */}
            <div style={{
              width: 32, height: 32, borderRadius: 6, flexShrink: 0,
              background: theme.tokens.coverBg,
              border: `2px solid ${theme.tokens.primary}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: 2,
                background: theme.tokens.primary,
              }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#ccc' }}>{theme.name}</div>
              <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{theme.description}</div>
            </div>
            {currentThemeId === theme.id && (
              <div style={{ marginLeft: 'auto', fontSize: 10, color: colors.blue }}>✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
