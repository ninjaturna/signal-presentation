import { colors } from '../design-system'

export interface ToneOption {
  id: string
  label: string
  sublabel: string
  whisper: string
  accentColor: string
  instruction: string
}

interface TonePickerProps {
  onSelect: (option: ToneOption) => void
  loading: string | null  // option.id while that button is loading
  onClose: () => void
}

const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'professional-concise',
    label: 'Professional',
    sublabel: 'Concise',
    whisper: 'Boardroom-ready',
    accentColor: 'rgba(30,90,242,0.5)',
    instruction: 'Rewrite this in a sharp, authoritative executive register. '
      + 'One idea per sentence. No filler. Lead with the conclusion. '
      + 'Sound like a senior McKinsey partner who respects the audience\'s time. '
      + 'Max 15 words for headlines, 30 words for body. '
      + 'Cut every word that doesn\'t earn its place.',
  },
  {
    id: 'professional-expanded',
    label: 'Professional',
    sublabel: 'Expanded',
    whisper: 'Evidence-led',
    accentColor: 'rgba(30,90,242,0.25)',
    instruction: 'Rewrite this in a confident, evidence-based executive register. '
      + 'Include supporting context and specific proof points. '
      + 'Authoritative but never stiff — formal enough for a boardroom, '
      + 'human enough for a conversation. '
      + 'Use precise language. No hedging. No passive voice.',
  },
  {
    id: 'bold-concise',
    label: 'Bold',
    sublabel: 'Concise',
    whisper: 'Room-stopping',
    accentColor: 'rgba(255,204,45,0.5)',
    instruction: 'Rewrite this to be punchy, direct, and impossible to ignore. '
      + 'Think billboard, not white paper. '
      + 'Lead with the most provocative true thing. '
      + 'Short sentences. Active verbs. No qualifiers. '
      + 'If it could be on a poster, you\'re close.',
  },
  {
    id: 'bold-expanded',
    label: 'Bold',
    sublabel: 'Expanded',
    whisper: 'Story-first',
    accentColor: 'rgba(255,204,45,0.25)',
    instruction: 'Rewrite this in a bold, narrative-driven register. '
      + 'Start with the human truth or the tension, then build to the insight. '
      + 'Conversational confidence — sounds like a founder on stage, '
      + 'not a consultant on paper. '
      + 'Use contrast, rhythm, and specificity to make it memorable.',
  },
]

export function TonePicker({ onSelect, loading, onClose }: TonePickerProps) {
  return (
    <div style={{
      background: '#161618',
      border: `1px solid ${colors.borderDark}`,
      borderRadius: 8,
      padding: 10,
      marginTop: 6,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 10,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700,
          color: colors.blue, letterSpacing: '0.08em',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span>✦</span> Rewrite Tone
        </div>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none',
          color: colors.mutedDark, cursor: 'pointer',
          fontSize: 14, lineHeight: 1, padding: 0,
        }}>×</button>
      </div>

      {/* Axis labels */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        marginBottom: 4,
      }}>
        <div style={{
          fontSize: 8, fontWeight: 700, color: colors.mutedDark,
          letterSpacing: '0.1em', textTransform: 'uppercase' as const,
          paddingLeft: 12,
        }}>
          Professional
        </div>
        <div style={{
          fontSize: 8, fontWeight: 700, color: colors.mutedDark,
          letterSpacing: '0.1em', textTransform: 'uppercase' as const,
          paddingLeft: 12,
        }}>
          Bold
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {TONE_OPTIONS.map((option, idx) => {
          const isLoading = loading === option.id
          // top row = idx 0,1; bottom row = idx 2,3
          // left col = idx 0,2 (Professional); right col = idx 1,3 (Bold)
          // Reorder: Professional Concise, Bold Concise, Professional Expanded, Bold Expanded
          return (
            <button
              key={option.id}
              onClick={() => !loading && onSelect(option)}
              disabled={loading !== null}
              style={{
                background: isLoading
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isLoading
                  ? option.accentColor
                  : colors.borderDark}`,
                borderLeft: `3px solid ${option.accentColor}`,
                borderRadius: 7,
                padding: '10px 12px',
                cursor: loading !== null ? 'default' : 'pointer',
                textAlign: 'left' as const,
                transition: 'border-color 0.12s, background 0.12s',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                opacity: loading !== null && !isLoading ? 0.35 : 1,
                position: 'relative' as const,
              }}
              onMouseEnter={e => {
                if (loading) return
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = 'rgba(255,255,255,0.05)'
                el.style.borderColor = option.accentColor
              }}
              onMouseLeave={e => {
                if (loading) return
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = 'rgba(255,255,255,0.02)'
                el.style.borderColor = colors.borderDark
                el.style.borderLeftColor = option.accentColor
              }}
            >
              {/* Label row */}
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 5,
                marginBottom: 3,
              }}>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                }}>
                  {isLoading ? 'Rewriting…' : option.label}
                </span>
                {!isLoading && (
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: option.accentColor,
                    letterSpacing: '0.04em',
                  }}>
                    / {option.sublabel}
                  </span>
                )}
              </div>
              {/* Whisper */}
              {!isLoading && (
                <div style={{
                  fontSize: 10,
                  color: colors.mutedDark,
                  letterSpacing: '0.02em',
                }}>
                  {option.whisper}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <p style={{
        fontSize: 9, color: colors.mutedDark,
        marginTop: 8, lineHeight: 1.4, fontStyle: 'italic',
      }}>
        Rewrites this field only. Original is replaced on accept.
      </p>
    </div>
  )
}
