import { useState, useRef } from 'react'
import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'
import type { SlideMode } from '../../design-system'

interface SlideDiagramProps {
  eyebrow?: string
  title?: string
  svgContent?: string
  placeholder?: string
  mode?: SlideMode
  context?: string
  editable?: boolean
}

export function SlideDiagram({
  eyebrow,
  title,
  svgContent: initialSvg,
  placeholder,
  mode = 'light',
  context,
  editable = true,
}: SlideDiagramProps) {
  const [svg, setSvg]             = useState(initialSvg ?? '')
  const [prompt, setPrompt]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [showInput, setShowInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const textPrimary  = mode === 'dark' ? '#FFFFFF' : colors.ink
  const canvasBg     = mode === 'dark' ? colors.inkSoft : colors.surfaceAlt
  const canvasBorder = mode === 'dark' ? colors.borderDark : colors.border
  const inputBg      = mode === 'dark' ? '#1a1a1c' : '#FFFFFF'

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/graphic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: prompt, context }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setSvg(data.svg)
      setShowInput(false)
      setPrompt('')
    } catch {
      setError('Generation failed — check API key in Vercel dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') generate()
    if (e.key === 'Escape') { setShowInput(false); setPrompt('') }
  }

  return (
    <SlideShell slideType="content" mode={mode}>
      {(eyebrow || title) && (
        <div style={{ marginBottom: 20 }}>
          {eyebrow && (
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: colors.blue, marginBottom: 6,
            }}>
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 style={{ fontSize: 24, fontWeight: 600, color: textPrimary }}>{title}</h2>
          )}
        </div>
      )}

      <div style={{
        flex: 1, background: canvasBg,
        border: `1px solid ${canvasBorder}`,
        borderRadius: 12, overflow: 'hidden',
        position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {svg ? (
          <div
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: mode === 'dark' ? colors.borderDark : colors.border,
              margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="2" stroke={colors.blue} strokeWidth="1.5"/>
                <rect x="13" y="3" width="8" height="8" rx="2" stroke={colors.mutedDark} strokeWidth="1.5"/>
                <rect x="3" y="13" width="8" height="8" rx="2" stroke={colors.mutedDark} strokeWidth="1.5"/>
                <rect x="13" y="13" width="8" height="8" rx="2" stroke={colors.mutedDark} strokeWidth="1.5"/>
              </svg>
            </div>
            <p style={{ fontSize: 13, color: colors.mutedDark, marginBottom: 4 }}>
              {placeholder ?? 'Describe a diagram to generate it'}
            </p>
            {editable && !showInput && (
              <p style={{ fontSize: 11, color: colors.mutedLight }}>
                Click the co-pilot button below
              </p>
            )}
          </div>
        )}

        {/* Regenerate button — top right when SVG is present */}
        {svg && editable && !showInput && (
          <button
            onClick={() => { setShowInput(true); setTimeout(() => inputRef.current?.focus(), 50) }}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: colors.inkSoft, border: `1px solid ${colors.borderDark}`,
              borderRadius: 6, padding: '5px 10px',
              fontSize: 11, fontWeight: 600, color: colors.mutedDark,
              cursor: 'pointer', letterSpacing: '0.04em',
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          >
            Regenerate
          </button>
        )}
      </div>

      {/* Co-pilot input bar */}
      {editable && (
        <div style={{ marginTop: 10 }}>
          {showInput ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                background: inputBg,
                border: `1px solid ${colors.blue}`,
                borderRadius: 8, padding: '8px 12px',
              }}>
                <span style={{ fontSize: 11, color: colors.blue, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  Co-pilot
                </span>
                <input
                  ref={inputRef}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the diagram — e.g. 'data pipeline from guest behavior to personalization engine'"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    fontSize: 13, color: textPrimary,
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                  }}
                />
              </div>
              <button
                onClick={generate}
                disabled={loading || !prompt.trim()}
                style={{
                  background: loading ? colors.mutedDark : colors.blue,
                  border: 'none', borderRadius: 8,
                  padding: '8px 16px', fontSize: 13, fontWeight: 600,
                  color: '#FFFFFF', cursor: loading ? 'default' : 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                {loading ? 'Generating…' : 'Generate →'}
              </button>
              <button
                onClick={() => { setShowInput(false); setPrompt('') }}
                style={{
                  background: 'transparent', border: `1px solid ${canvasBorder}`,
                  borderRadius: 8, padding: '8px 12px',
                  fontSize: 13, color: colors.mutedDark, cursor: 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setShowInput(true); setTimeout(() => inputRef.current?.focus(), 50) }}
              style={{
                background: 'transparent',
                border: `1px solid ${canvasBorder}`,
                borderRadius: 8, padding: '7px 14px',
                fontSize: 12, fontWeight: 600,
                color: colors.blue, cursor: 'pointer',
                letterSpacing: '0.04em',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <span style={{ opacity: 0.6 }}>✦</span>
              AI graphic co-pilot
            </button>
          )}
          {error && (
            <p style={{ fontSize: 11, color: colors.red, marginTop: 6 }}>{error}</p>
          )}
        </div>
      )}
    </SlideShell>
  )
}
