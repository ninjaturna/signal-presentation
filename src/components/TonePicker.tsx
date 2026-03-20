import { colors } from '../design-system'

export type Tone = 'Executive' | 'Conversational'
export type Length = 'Concise' | 'Detailed'

interface TonePickerProps {
  onSelect: (tone: Tone, length: Length) => void
  loadingKey: string | null  // e.g. 'Executive-Concise' while that button is loading
  onClose: () => void
}

const OPTIONS: Array<{ tone: Tone; length: Length; desc: string }> = [
  { tone: 'Executive',      length: 'Concise',  desc: 'Sharp & brief'       },
  { tone: 'Executive',      length: 'Detailed', desc: 'Thorough & formal'   },
  { tone: 'Conversational', length: 'Concise',  desc: 'Friendly & tight'    },
  { tone: 'Conversational', length: 'Detailed', desc: 'Natural & full'      },
]

export function TonePicker({ onSelect, loadingKey, onClose }: TonePickerProps) {
  return (
    <div style={{
      background: '#161618',
      border: `1px solid ${colors.borderDark}`,
      borderRadius: 8,
      padding: 10,
      marginTop: 6,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '0.07em',
          textTransform: 'uppercase', color: 'rgba(140,80,220,0.9)',
        }}>
          ✦ Rewrite tone
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none',
            color: colors.mutedDark, cursor: 'pointer',
            fontSize: 14, lineHeight: 1, padding: 0,
            fontFamily: 'system-ui',
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {OPTIONS.map(({ tone, length, desc }) => {
          const key = `${tone}-${length}`
          const isLoading = loadingKey === key
          return (
            <button
              key={key}
              onClick={() => !loadingKey && onSelect(tone, length)}
              disabled={!!loadingKey}
              style={{
                background: isLoading ? 'rgba(140,80,220,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isLoading ? 'rgba(140,80,220,0.4)' : colors.borderDark}`,
                borderRadius: 6,
                padding: '8px 10px',
                cursor: loadingKey ? 'default' : 'pointer',
                textAlign: 'left',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                transition: 'border-color 0.1s',
              }}
            >
              <div style={{
                fontSize: 11, fontWeight: 600,
                color: isLoading ? 'rgba(140,80,220,0.9)' : '#FFFFFF',
                marginBottom: 2,
              }}>
                {isLoading ? 'Rewriting…' : `${tone} / ${length}`}
              </div>
              {!isLoading && (
                <div style={{ fontSize: 10, color: colors.mutedDark }}>{desc}</div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
