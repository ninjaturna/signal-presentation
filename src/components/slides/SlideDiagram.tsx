import { useState, useRef } from 'react'
import { SlideShell } from '../SlideShell'
import { colors } from '../../design-system'
import type { SlideMode } from '../../design-system'
import type { SlideData } from '../../types/deck'

interface SlideDiagramProps {
  eyebrow?: string
  title?: string
  svgContent?: string
  placeholder?: string
  mode?: SlideMode
  context?: string
  editable?: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
}

type PanelState = 'idle' | 'input' | 'preview' | 'accepted'

export function SlideDiagram({
  eyebrow,
  title,
  svgContent: committedSvg,
  placeholder,
  mode = 'light',
  context,
  editable = true,
  onUpdate,
}: SlideDiagramProps) {
  const [pendingSvg, setPendingSvg] = useState<string>('')
  const [panel, setPanel]           = useState<PanelState>(committedSvg ? 'accepted' : 'idle')
  const [prompt, setPrompt]         = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const textPrimary  = mode === 'dark' ? '#FFFFFF' : colors.ink
  const canvasBg     = mode === 'dark' ? colors.inkSoft : colors.surfaceAlt
  const canvasBorder = mode === 'dark' ? colors.borderDark : colors.border

  const displaySvg = panel === 'preview' ? pendingSvg : committedSvg ?? ''

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
      setPendingSvg(data.svg)
      setPanel('preview')
    } catch {
      setError('Generation failed — check API key in Vercel settings')
    } finally {
      setLoading(false)
    }
  }

  const accept = () => {
    if (!pendingSvg) return
    onUpdate?.({ svgContent: pendingSvg })
    setPendingSvg('')
    setPanel('accepted')
    setPrompt('')
  }

  const discard = () => {
    setPendingSvg('')
    setPanel(committedSvg ? 'accepted' : 'idle')
    setPrompt('')
  }

  const openInput = () => {
    setPanel('input')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === 'Enter') generate()
    if (e.key === 'Escape') {
      setPanel(committedSvg ? 'accepted' : 'idle')
      setPrompt('')
    }
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

      {/* SVG Canvas */}
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
      }}>
        {displaySvg ? (
          <div
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            dangerouslySetInnerHTML={{ __html: displaySvg }}
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
            <p style={{ fontSize: 13, color: colors.mutedDark }}>
              {placeholder ?? 'Describe a diagram to generate it'}
            </p>
          </div>
        )}

        {/* Preview badge */}
        {panel === 'preview' && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(255,204,45,0.15)',
            border: '1px solid rgba(255,204,45,0.35)',
            borderRadius: 5, padding: '3px 8px',
            fontSize: 11, fontWeight: 600, color: colors.gold,
            letterSpacing: '0.06em',
          }}>
            Preview — not yet in deck
          </div>
        )}

        {/* Accepted badge */}
        {panel === 'accepted' && editable && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(29,158,117,0.1)',
            border: '1px solid rgba(29,158,117,0.25)',
            borderRadius: 5, padding: '3px 8px',
            fontSize: 11, fontWeight: 600, color: '#1D9E75',
            letterSpacing: '0.06em',
          }}>
            In deck
          </div>
        )}

        {/* Regenerate button */}
        {displaySvg && editable && panel !== 'input' && (
          <button
            onClick={openInput}
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

      {/* Bottom action area */}
      {editable && (
        <div style={{ marginTop: 10 }}>

          {/* idle or accepted → co-pilot button */}
          {(panel === 'idle' || panel === 'accepted') && (
            <button
              onClick={openInput}
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
              {panel === 'accepted' ? 'Replace diagram' : 'AI graphic co-pilot'}
            </button>
          )}

          {/* input → prompt bar */}
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
                  placeholder="Describe the diagram — press Enter to generate"
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
                onClick={() => { setPanel(committedSvg ? 'accepted' : 'idle'); setPrompt('') }}
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
          )}

          {/* preview → accept / try again / edit prompt / discard */}
          {panel === 'preview' && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={accept}
                style={{
                  background: '#1D9E75',
                  border: 'none', borderRadius: 8,
                  padding: '8px 20px', fontSize: 13, fontWeight: 600,
                  color: '#FFFFFF', cursor: 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7L5.5 10.5L12 3.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Accept — add to deck
              </button>
              <button
                onClick={generate}
                disabled={loading}
                style={{
                  background: 'transparent',
                  border: `1px solid ${canvasBorder}`,
                  borderRadius: 8, padding: '8px 14px',
                  fontSize: 13, color: colors.mutedDark, cursor: 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                }}
              >
                {loading ? 'Regenerating…' : 'Try again'}
              </button>
              <button
                onClick={() => setPanel('input')}
                style={{
                  background: 'transparent',
                  border: `1px solid ${canvasBorder}`,
                  borderRadius: 8, padding: '8px 14px',
                  fontSize: 13, color: colors.mutedDark, cursor: 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                }}
              >
                Edit prompt
              </button>
              <button
                onClick={discard}
                style={{
                  background: 'transparent', border: 'none',
                  fontSize: 12, color: colors.mutedDark, cursor: 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  marginLeft: 4,
                }}
              >
                Discard
              </button>
              {prompt && (
                <div style={{
                  marginLeft: 'auto', fontSize: 11, color: colors.mutedDark,
                  maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap', fontStyle: 'italic',
                }}>
                  "{prompt}"
                </div>
              )}
            </div>
          )}

          {error && (
            <p style={{ fontSize: 11, color: colors.red, marginTop: 6 }}>{error}</p>
          )}
        </div>
      )}
    </SlideShell>
  )
}
