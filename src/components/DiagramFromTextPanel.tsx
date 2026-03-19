import { useState, useRef, useEffect } from 'react'
import { colors } from '../design-system'

interface DiagramFromTextPanelProps {
  sourceText: string
  onInsert: (svgContent: string) => void
  onClose: () => void
}

type PanelState = 'input' | 'loading' | 'preview'

function buildPrompt(text: string): string {
  return `Create a clean SVG diagram that visually explains this concept:\n"${text}"\n\nStyle requirements:\n- Dark background (#111113)\n- Blue (#1E5AF2) as primary accent\n- White text and labels\n- Clean lines and geometric shapes\n- No decorative flourishes\n- Suitable for a professional client presentation`
}

export function DiagramFromTextPanel({ sourceText, onInsert, onClose }: DiagramFromTextPanelProps) {
  const [prompt, setPrompt]     = useState(buildPrompt(sourceText))
  const [svg, setSvg]           = useState('')
  const [panel, setPanel]       = useState<PanelState>('input')
  const [error, setError]       = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const generate = async () => {
    if (!prompt.trim()) return
    setPanel('loading')
    setError('')
    try {
      const res = await fetch('/api/graphic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: prompt }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setPanel('input'); return }
      setSvg(data.svg)
      setPanel('preview')
    } catch {
      setError('Generation failed — check API key in Vercel settings')
      setPanel('input')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div style={{
      width: 360,
      height: '100%',
      background: '#111113',
      borderLeft: `1px solid ${colors.borderDark}`,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px',
        borderBottom: `1px solid ${colors.borderDark}`,
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: colors.blue, letterSpacing: '0.08em' }}>
          ◈ DIAGRAM FROM TEXT
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      {/* Source text chip */}
      <div style={{ padding: '10px 16px', borderBottom: `1px solid ${colors.borderDark}`, flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#444', letterSpacing: '0.08em', marginBottom: 4 }}>
          SOURCE TEXT
        </div>
        <div style={{
          fontSize: 12, color: '#777', fontStyle: 'italic',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          lineHeight: 1.5,
        }}>
          "{sourceText}"
        </div>
      </div>

      {/* Prompt editor */}
      <div style={{ padding: '12px 16px', flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#444', letterSpacing: '0.08em', marginBottom: 6 }}>
          PROMPT — edit before generating
        </div>
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={8}
          style={{
            width: '100%',
            background: '#16161a',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 12, color: '#ccc', lineHeight: 1.55,
            fontFamily: '"DM Mono", monospace',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* SVG preview */}
      {panel === 'preview' && svg && (
        <div style={{ padding: '0 16px 12px', flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#444', letterSpacing: '0.08em', marginBottom: 6 }}>
            PREVIEW
          </div>
          <div style={{
            background: '#111113',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 8,
            overflow: 'hidden',
            aspectRatio: '16/9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div
              style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '0 16px 8px', fontSize: 11, color: colors.red, flexShrink: 0 }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div style={{
        padding: '12px 16px',
        borderTop: `1px solid ${colors.borderDark}`,
        marginTop: 'auto',
        display: 'flex', flexDirection: 'column', gap: 8,
        flexShrink: 0,
      }}>
        {panel === 'preview' ? (
          <>
            <button
              onClick={() => onInsert(svg)}
              style={{
                background: '#1D9E75', border: 'none',
                borderRadius: 6, padding: '9px 16px',
                fontSize: 12, fontWeight: 700, color: '#fff',
                cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L5.5 10.5L12 3.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Insert as new slide
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={generate}
                style={secondaryBtn}
              >
                Try again
              </button>
              <button
                onClick={() => setPanel('input')}
                style={secondaryBtn}
              >
                Edit prompt
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={generate}
            disabled={panel === 'loading' || !prompt.trim()}
            style={{
              background: panel === 'loading' ? colors.borderDark : colors.blue,
              border: 'none', borderRadius: 6, padding: '9px 16px',
              fontSize: 12, fontWeight: 700, color: '#fff',
              cursor: panel === 'loading' ? 'default' : 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              opacity: !prompt.trim() ? 0.4 : 1,
            }}
          >
            {panel === 'loading' ? 'Generating…' : '✦ Generate diagram'}
          </button>
        )}
      </div>
    </div>
  )
}

const secondaryBtn: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: `1px solid ${colors.borderDark}`,
  borderRadius: 6, padding: '7px 12px',
  fontSize: 12, color: colors.mutedDark, cursor: 'pointer',
  fontFamily: '"DM Sans", system-ui, sans-serif',
}
