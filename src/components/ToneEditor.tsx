import { useState } from 'react'
import { colors } from '../design-system'

type Tone = 'executive-concise' | 'executive-detailed' | 'casual-concise' | 'casual-detailed'

interface ToneEditorProps {
  originalText: string
  onAccept: (rewritten: string) => void
  onClose: () => void
}

const TONES: { id: Tone; label: string }[] = [
  { id: 'executive-concise',  label: 'Executive\nConcise'  },
  { id: 'executive-detailed', label: 'Executive\nDetailed' },
  { id: 'casual-concise',     label: 'Casual\nConcise'     },
  { id: 'casual-detailed',    label: 'Casual\nDetailed'    },
]

export function ToneEditor({ originalText, onAccept, onClose }: ToneEditorProps) {
  const [selected, setSelected] = useState<Tone | null>(null)
  const [preview, setPreview]   = useState<string>('')
  const [loading, setLoading]   = useState(false)

  const handleToneSelect = async (tone: Tone) => {
    setSelected(tone)
    setLoading(true)
    setPreview('')
    try {
      const res = await fetch('/api/rewrite-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: originalText, tone }),
      })
      const data = await res.json()
      setPreview(data.rewritten)
    } catch {
      setPreview('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
      width: 320, background: '#16161a', border: '1px solid #1e1e24',
      borderRadius: 12, zIndex: 1000, overflow: 'hidden',
      boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', borderBottom: '1px solid #1e1e24',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: colors.blue, letterSpacing: '0.08em' }}>
          ✦ AI REWRITE
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16,
        }}>×</button>
      </div>

      {/* Axis labels + 2×2 grid */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: '#444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Executive</span>
          <span style={{ fontSize: 10, color: '#444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Casual</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          {TONES.map(tone => (
            <button
              key={tone.id}
              onClick={() => handleToneSelect(tone.id)}
              style={{
                background: selected === tone.id ? colors.blue : '#111',
                border: `1px solid ${selected === tone.id ? colors.blue : '#222'}`,
                borderRadius: 8, padding: '12px 8px',
                color: selected === tone.id ? '#fff' : '#555',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'pre-line', textAlign: 'center', lineHeight: 1.4,
                transition: 'all 0.15s ease',
                fontFamily: '"DM Sans", system-ui, sans-serif',
              }}
            >
              {tone.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, color: '#444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Concise</span>
          <span style={{ fontSize: 10, color: '#444', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Detailed</span>
        </div>
      </div>

      {/* Preview */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          background: '#111', border: '1px solid #1e1e24', borderRadius: 8,
          padding: 12, minHeight: 80,
        }}>
          {loading && (
            <div style={{ fontSize: 12, color: '#444' }}>Rewriting...</div>
          )}
          {!loading && preview && (
            <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{preview}</div>
          )}
          {!loading && !preview && (
            <div style={{ fontSize: 12, color: '#333' }}>Select a tone to preview a rewrite</div>
          )}
        </div>

        {preview && !loading && (
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              onClick={() => onAccept(preview)}
              style={{
                flex: 1, background: colors.blue, border: 'none',
                borderRadius: 6, padding: '8px 0', fontSize: 12,
                fontWeight: 600, color: '#fff', cursor: 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
              }}
            >
              Accept
            </button>
            <button
              onClick={() => selected && handleToneSelect(selected)}
              style={{
                flex: 1, background: 'transparent', border: '1px solid #222',
                borderRadius: 6, padding: '8px 0', fontSize: 12,
                color: '#555', cursor: 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
              }}
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
