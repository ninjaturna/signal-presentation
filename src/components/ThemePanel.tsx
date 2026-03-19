import { DECK_THEMES } from '../design-system/themes'
import type { DeckTheme } from '../design-system/themes'
import { colors } from '../design-system'

interface ThemePanelProps {
  currentThemeId: string
  onSelect: (theme: DeckTheme) => void
  onClose: () => void
}

export function ThemePanel({ currentThemeId, onSelect, onClose }: ThemePanelProps) {
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
