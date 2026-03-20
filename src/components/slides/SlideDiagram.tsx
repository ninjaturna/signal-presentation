import { useState, useRef, useEffect } from 'react'
import { colors } from '../../design-system'
import type { SlideMode } from '../../design-system'
import type { SlideData, DiagramData } from '../../types/deck'
import { DiagramCanvas } from '../DiagramCanvas'

interface SlideDiagramProps {
  eyebrow?: string
  title?: string
  svgContent?: string
  diagramData?: DiagramData
  placeholder?: string
  mode?: SlideMode
  context?: string
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
}

type PanelState = 'idle' | 'input' | 'preview' | 'accepted'

// Measures its container and passes px dimensions to DiagramCanvas
function DiagramCanvasWrapper({
  data,
  editable,
  onUpdate,
}: {
  data: DiagramData
  editable: boolean
  onUpdate?: (d: DiagramData) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect
      setDims({ w: r.width, h: r.height })
    })
    ro.observe(el)
    setDims({ w: el.clientWidth, h: el.clientHeight })
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {dims.w > 0 && dims.h > 0 && (
        <DiagramCanvas
          data={data}
          editable={editable}
          containerWidth={dims.w}
          containerHeight={dims.h}
          onChange={onUpdate}
        />
      )}
    </div>
  )
}

export function SlideDiagram({
  eyebrow, title,
  svgContent, diagramData,
  placeholder,
  mode = 'light',
  context,
  editable = true,
  onUpdate,
}: SlideDiagramProps) {
  const [panel, setPanel]         = useState<PanelState>(
    (diagramData || svgContent) ? 'accepted' : 'idle'
  )
  const [pendingData, setPendingData] = useState<DiagramData | null>(null)
  const [prompt, setPrompt]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const textPrimary  = mode === 'dark' ? '#FFFFFF' : colors.ink
  const canvasBg     = mode === 'dark' ? colors.inkSoft : '#FFFFFF'
  const canvasBorder = mode === 'dark' ? colors.borderDark : colors.border

  const activeData = panel === 'preview' ? pendingData : (diagramData ?? null)

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
      if (data.error) { setError(data.error); setLoading(false); return }
      if (data.diagramData) {
        setPendingData(data.diagramData)
        setPanel('preview')
      } else {
        setError('Unexpected response format from diagram API')
      }
    } catch {
      setError('Generation failed — check API key in Vercel settings')
    } finally {
      setLoading(false)
    }
  }

  const accept = () => {
    if (!pendingData) return
    onUpdate?.({ diagramData: pendingData, svgContent: undefined })
    setPendingData(null)
    setPanel('accepted')
    setPrompt('')
  }

  const discard = () => {
    setPendingData(null)
    setPanel(diagramData ? 'accepted' : 'idle')
  }

  const openInput = () => {
    setPanel('input')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === 'Enter') generate()
    if (e.key === 'Escape') discard()
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '32px 48px',
      boxSizing: 'border-box',
      background: mode === 'dark' ? colors.ink : colors.surface,
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      {/* Slide header */}
      {(eyebrow || title) && (
        <div style={{ marginBottom: 16, flexShrink: 0 }}>
          {eyebrow && (
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: colors.blue, marginBottom: 6,
            }}>
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 style={{
              fontSize: 24, fontWeight: 600,
              color: textPrimary, lineHeight: 1.2, margin: 0,
            }}>
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Canvas area */}
      <div style={{
        flex: 1,
        background: canvasBg,
        border: `1px solid ${canvasBorder}`,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 0,
      }}>
        {panel === 'preview' && (
          <div style={{
            position: 'absolute', top: 10, left: 10, zIndex: 20,
            background: 'rgba(255,204,45,0.15)',
            border: '1px solid rgba(255,204,45,0.35)',
            borderRadius: 5, padding: '3px 8px',
            fontSize: 10, fontWeight: 600, color: colors.gold,
          }}>
            Preview — click Accept to add to deck
          </div>
        )}

        {panel === 'accepted' && editable && (
          <button
            onClick={openInput}
            style={{
              position: 'absolute', top: 10, right: 10, zIndex: 20,
              background: 'rgba(17,17,19,0.8)',
              border: `1px solid ${colors.borderDark}`,
              borderRadius: 6, padding: '4px 10px',
              fontSize: 11, fontWeight: 600, color: colors.mutedDark,
              cursor: 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          >
            Replace diagram
          </button>
        )}

        {activeData ? (
          <DiagramCanvasWrapper
            data={activeData}
            editable={!!editable && panel !== 'preview'}
            onUpdate={updated => onUpdate?.({ diagramData: updated })}
          />
        ) : svgContent ? (
          <div
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: mode === 'dark' ? colors.borderDark : colors.border,
              margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="9" height="9" rx="2" stroke={colors.blue} strokeWidth="1.5"/>
                <rect x="13" y="2" width="9" height="9" rx="2" stroke={colors.mutedDark} strokeWidth="1.5"/>
                <rect x="2" y="13" width="9" height="9" rx="2" stroke={colors.mutedDark} strokeWidth="1.5"/>
                <rect x="13" y="13" width="9" height="9" rx="2" stroke={colors.mutedDark} strokeWidth="1.5"/>
              </svg>
            </div>
            <p style={{ fontSize: 13, color: colors.mutedDark, margin: 0 }}>
              {placeholder ?? 'Describe a diagram to generate it'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      {editable && (
        <div style={{ marginTop: 10, flexShrink: 0 }}>
          {panel === 'idle' && (
            <button onClick={openInput} style={coPilotBtn}>
              <span style={{ opacity: 0.6 }}>✦</span>
              AI graphic co-pilot
            </button>
          )}

          {panel === 'input' && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                background: mode === 'dark' ? '#1a1a1c' : '#FFFFFF',
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
                  placeholder="Describe the diagram (Enter to generate)"
                  style={{
                    flex: 1, background: 'transparent', border: 'none',
                    outline: 'none', fontSize: 13, color: textPrimary,
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                  }}
                />
              </div>
              <button onClick={generate} disabled={loading || !prompt.trim()}
                style={generateBtn(loading || !prompt.trim())}>
                {loading ? 'Generating…' : 'Generate →'}
              </button>
              <button onClick={discard} style={cancelBtn}>Cancel</button>
            </div>
          )}

          {panel === 'preview' && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={accept} style={acceptBtn}>✓ Accept</button>
              <button onClick={generate} disabled={loading} style={cancelBtn}>
                {loading ? 'Generating…' : 'Try again'}
              </button>
              <button onClick={() => setPanel('input')} style={cancelBtn}>Edit prompt</button>
              <button onClick={discard} style={ghostBtn}>Discard</button>
            </div>
          )}

          {error && (
            <p style={{ fontSize: 11, color: '#FF4D6D', marginTop: 6 }}>{error}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Button styles ────────────────────────────────────────────────────────────

const coPilotBtn: React.CSSProperties = {
  background: 'transparent', border: `1px solid ${colors.borderDark}`,
  borderRadius: 8, padding: '7px 14px',
  fontSize: 12, fontWeight: 600, color: colors.blue,
  cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
  display: 'inline-flex', alignItems: 'center', gap: 6,
}

const generateBtn = (disabled: boolean): React.CSSProperties => ({
  background: disabled ? colors.borderDark : colors.blue,
  border: 'none', borderRadius: 8, padding: '8px 16px',
  fontSize: 13, fontWeight: 600, color: '#FFFFFF',
  cursor: disabled ? 'default' : 'pointer',
  fontFamily: '"DM Sans", system-ui, sans-serif',
  whiteSpace: 'nowrap' as const,
})

const acceptBtn: React.CSSProperties = {
  background: '#1D9E75', border: 'none', borderRadius: 8,
  padding: '8px 20px', fontSize: 13, fontWeight: 600, color: '#FFFFFF',
  cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
}

const cancelBtn: React.CSSProperties = {
  background: 'transparent', border: `1px solid ${colors.borderDark}`,
  borderRadius: 8, padding: '8px 14px',
  fontSize: 13, color: colors.mutedDark, cursor: 'pointer',
  fontFamily: '"DM Sans", system-ui, sans-serif',
}

const ghostBtn: React.CSSProperties = {
  background: 'transparent', border: 'none',
  fontSize: 12, color: colors.mutedDark, cursor: 'pointer',
  fontFamily: '"DM Sans", system-ui, sans-serif', marginLeft: 4,
}
