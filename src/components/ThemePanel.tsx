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

// Mini slide thumbnail — visualizes the theme's cover layout + colors
function ThemeThumbnail({ theme, size = 40 }: { theme: DeckTheme; size?: number }) {
  const t = theme.tokens
  const w = size * 1.78  // 16:9
  const h = size
  const coverLayout = t.coverLayout

  return (
    <div style={{
      width: w, height: h,
      background: t.coverBg,
      borderRadius: 4,
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Left accent bar (default/bold layouts) */}
      {(coverLayout === 'default' || coverLayout === 'bold') && (
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: coverLayout === 'bold' ? 3 : 2,
          height: '100%',
          background: t.accentBar,
        }} />
      )}

      {/* Top accent rule (cinematic/editorial) */}
      {(coverLayout === 'cinematic' || coverLayout === 'editorial') && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 2, background: t.accentColor,
        }} />
      )}

      {/* Split left block (split layout) */}
      {coverLayout === 'split' && (
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: '40%', height: '100%',
          background: t.accentColor,
        }} />
      )}

      {/* Diagonal accent (cinematic) */}
      {coverLayout === 'cinematic' && (
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '45%', height: '100%',
          background: t.accentColor,
          clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)',
          opacity: 0.18,
        }} />
      )}

      {/* Headline block */}
      <div style={{
        position: 'absolute',
        left: coverLayout === 'split' ? '44%' : coverLayout === 'editorial' ? 8 : 6,
        right: coverLayout === 'cinematic' ? '42%' : 6,
        top: '50%',
        transform: 'translateY(-50%)',
      }}>
        <div style={{
          width: '70%',
          height: 3,
          background: t.coverText,
          opacity: 0.9,
          marginBottom: 3,
          borderRadius: 2,
        }} />
        <div style={{
          width: '50%',
          height: 2,
          background: t.coverText,
          opacity: 0.4,
          borderRadius: 2,
        }} />
      </div>

      {/* Bottom bar (editorial layout) */}
      {coverLayout === 'editorial' && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 6, background: t.accentColor,
        }} />
      )}
    </div>
  )
}

interface ThemePanelProps {
  currentThemeId: string
  onSelect: (theme: DeckTheme) => void
  onClose: () => void
  activeTransition: TransitionType
  onTransitionChange: (t: TransitionType) => void
}

export function ThemePanel({
  currentThemeId, onSelect, onClose, activeTransition, onTransitionChange,
}: ThemePanelProps) {
  return (
    <div style={{
      position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
      width: 256, background: '#16161a', border: '1px solid #1e1e24',
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

      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {DECK_THEMES.map(theme => {
          const isActive = currentThemeId === theme.id
          return (
            <button
              key={theme.id}
              onClick={() => onSelect(theme)}
              style={{
                background: isActive ? '#1a1a2e' : '#111',
                border: `1px solid ${isActive ? colors.blue : '#1e1e24'}`,
                borderRadius: 8, padding: '8px 10px',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: '"DM Sans", system-ui, sans-serif',
                transition: 'border-color 0.15s',
              }}
            >
              <ThemeThumbnail theme={theme} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600,
                  color: isActive ? '#fff' : '#ccc',
                }}>
                  {theme.name}
                </div>
                <div style={{
                  fontSize: 10, color: '#555', marginTop: 1,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {theme.description}
                </div>
              </div>
              {isActive && (
                <div style={{ fontSize: 10, color: colors.blue, flexShrink: 0 }}>✓</div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
