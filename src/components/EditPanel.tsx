import { useState } from 'react'
import { colors } from '../design-system'
import { ChatPanel } from './ChatPanel'
import type { SlideData } from '../types/deck'

interface EditPanelProps {
  slide: SlideData
  onUpdate: (patch: Partial<SlideData>) => void
  onClose: () => void
  onResetDiagrams: () => void
  onInsertDiagram: (svg: string) => void
}

const EDITABLE_FIELDS: Record<string, Array<{ key: keyof SlideData; label: string; multiline?: boolean }>> = {
  cover:           [{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'title', label: 'Title', multiline: true }, { key: 'subtitle', label: 'Subtitle', multiline: true }, { key: 'meta', label: 'Meta' }],
  narrative:       [{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'headline', label: 'Headline', multiline: true }, { key: 'body', label: 'Body', multiline: true }, { key: 'pullQuote', label: 'Pull quote', multiline: true }],
  'stat-grid':     [{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'headline', label: 'Headline', multiline: true }],
  'two-pane':      [{ key: 'eyebrow', label: 'Eyebrow' }],
  'section-break': [{ key: 'number', label: 'Number' }, { key: 'title', label: 'Title', multiline: true }, { key: 'subtitle', label: 'Subtitle', multiline: true }],
  'full-bleed':    [{ key: 'statement', label: 'Statement', multiline: true }, { key: 'accentWord', label: 'Accent word' }],
  diagram:         [{ key: 'eyebrow', label: 'Eyebrow' }, { key: 'title', label: 'Title', multiline: true }, { key: 'placeholder', label: 'Placeholder', multiline: true }],
  closing:         [{ key: 'headline', label: 'Headline', multiline: true }, { key: 'cta', label: 'CTA text' }, { key: 'contact', label: 'Contact' }],
}

export function EditPanel({ slide, onUpdate, onClose, onResetDiagrams, onInsertDiagram }: EditPanelProps) {
  const [showChat, setShowChat]               = useState(false)
  const [showDiagram, setShowDiagram]         = useState(false)
  const [diagramPrompt, setDiagramPrompt]     = useState('')
  const [diagramSvg, setDiagramSvg]           = useState('')
  const [diagramLoading, setDiagramLoading]   = useState(false)
  const [diagramError, setDiagramError]       = useState('')

  const fields = EDITABLE_FIELDS[slide.type] ?? []

  const generateDiagram = async () => {
    if (!diagramPrompt.trim()) return
    setDiagramLoading(true)
    setDiagramError('')
    setDiagramSvg('')
    try {
      const res = await fetch('/api/graphic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: diagramPrompt,
          context: `Slide type: ${slide.type}. ${slide.headline ?? slide.title ?? ''}`,
        }),
      })
      const data = await res.json()
      if (data.error) { setDiagramError(data.error); return }
      setDiagramSvg(data.svg)
    } catch {
      setDiagramError('Generation failed — check API key')
    } finally {
      setDiagramLoading(false)
    }
  }

  const acceptDiagram = () => {
    onInsertDiagram(diagramSvg)
    setDiagramSvg('')
    setDiagramPrompt('')
    setShowDiagram(false)
  }

  if (showChat) {
    return (
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          height: 48, flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '0 16px',
          borderBottom: `1px solid ${colors.borderDark}`,
          background: '#111113',
        }}>
          <button
            onClick={() => setShowChat(false)}
            style={{
              background: 'transparent', border: 'none',
              fontSize: 18, color: colors.mutedDark, cursor: 'pointer',
              lineHeight: 1, padding: 0, fontFamily: 'system-ui',
            }}
          >
            ‹
          </button>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>AI Co-pilot</span>
        </div>
        <ChatPanel slide={slide} onUpdate={onUpdate} onClose={() => setShowChat(false)} />
      </div>
    )
  }

  return (
    <div style={{
      width: 280,
      flexShrink: 0,
      background: '#111113',
      borderLeft: `1px solid ${colors.borderDark}`,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        height: 48, flexShrink: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        borderBottom: `1px solid ${colors.borderDark}`,
        gap: 8,
      }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
          color: colors.blue, textTransform: 'uppercase', flex: 1,
        }}>
          Edit mode
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, color: colors.mutedLight,
          background: colors.inkSoft, borderRadius: 4,
          padding: '2px 7px', letterSpacing: '0.04em',
        }}>
          {slide.type}
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'transparent', border: 'none',
            fontSize: 16, color: colors.mutedDark, cursor: 'pointer',
            lineHeight: 1, padding: '4px 6px',
            fontFamily: 'system-ui',
          }}
          title="Exit edit mode"
        >
          ✕
        </button>
      </div>

      {/* Editable fields */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {fields.length > 0 ? (
          fields.map(({ key, label, multiline }) => {
            const value = (slide[key] as string) ?? ''
            return (
              <div key={key}>
                <label style={{
                  display: 'block', fontSize: 10, fontWeight: 600,
                  color: colors.mutedDark, letterSpacing: '0.06em',
                  textTransform: 'uppercase', marginBottom: 5,
                }}>
                  {label}
                </label>
                {multiline ? (
                  <textarea
                    value={value}
                    onChange={e => onUpdate({ [key]: e.target.value } as Partial<SlideData>)}
                    onKeyDown={e => e.stopPropagation()}
                    rows={3}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: '#1a1a1e',
                      border: `1px solid ${colors.borderDark}`,
                      borderRadius: 6, padding: '7px 10px',
                      fontSize: 13, color: '#FFFFFF', lineHeight: 1.5,
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                      outline: 'none', resize: 'vertical',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
                    onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
                  />
                ) : (
                  <input
                    value={value}
                    onChange={e => onUpdate({ [key]: e.target.value } as Partial<SlideData>)}
                    onKeyDown={e => e.stopPropagation()}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: '#1a1a1e',
                      border: `1px solid ${colors.borderDark}`,
                      borderRadius: 6, padding: '7px 10px',
                      fontSize: 13, color: '#FFFFFF',
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                      outline: 'none',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
                    onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
                  />
                )}
              </div>
            )
          })
        ) : (
          <p style={{ fontSize: 13, color: colors.mutedDark, lineHeight: 1.5 }}>
            No editable text fields for this slide type. Use AI Co-pilot to make changes.
          </p>
        )}

        {/* Diagram-specific: SVG state + clear option */}
        {slide.type === 'diagram' && slide.svgContent && (
          <div style={{
            background: 'rgba(29,158,117,0.08)',
            border: '1px solid rgba(29,158,117,0.2)',
            borderRadius: 7, padding: '10px 12px',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: '#1D9E75',
              letterSpacing: '0.06em', marginBottom: 6,
            }}>
              DIAGRAM IN DECK
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => onUpdate({ svgContent: undefined })}
                style={{
                  flex: 1, background: 'transparent',
                  border: `1px solid ${colors.borderDark}`,
                  borderRadius: 5, padding: '6px 10px',
                  fontSize: 11, color: '#FF1C52', cursor: 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                }}
              >
                Clear diagram
              </button>
            </div>
            <p style={{
              fontSize: 10, color: colors.mutedDark, marginTop: 6, lineHeight: 1.5,
            }}>
              Use "Insert diagram" below to replace it.
            </p>
          </div>
        )}
      </div>

      {/* Insert Diagram section */}
      <div style={{
        borderTop: `1px solid ${colors.borderDark}`,
        padding: '14px 16px',
      }}>
        <button
          onClick={() => { setShowDiagram(v => !v); setDiagramSvg(''); setDiagramError('') }}
          style={{
            width: '100%', background: 'transparent',
            border: `1px solid ${showDiagram ? colors.blue : colors.borderDark}`,
            borderRadius: 7, padding: '8px 14px',
            fontSize: 12, fontWeight: 600,
            color: showDiagram ? colors.blue : colors.mutedDark,
            cursor: 'pointer', textAlign: 'left',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ fontSize: 14 }}>⬡</span>
          {showDiagram ? 'Close diagram generator' : 'Insert diagram'}
        </button>

        {showDiagram && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea
              value={diagramPrompt}
              onChange={e => setDiagramPrompt(e.target.value)}
              onKeyDown={e => {
                e.stopPropagation()
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generateDiagram() }
              }}
              placeholder="Describe the diagram… (Enter to generate)"
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#1a1a1e',
                border: `1px solid ${colors.borderDark}`,
                borderRadius: 6, padding: '8px 10px',
                fontSize: 12, color: '#FFFFFF', lineHeight: 1.5,
                fontFamily: '"DM Sans", system-ui, sans-serif',
                outline: 'none', resize: 'none',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
              onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
            />

            <button
              onClick={generateDiagram}
              disabled={diagramLoading || !diagramPrompt.trim()}
              style={{
                background: diagramLoading ? colors.inkSoft : colors.blue,
                border: 'none', borderRadius: 6, padding: '8px 14px',
                fontSize: 12, fontWeight: 600, color: '#FFFFFF',
                cursor: diagramLoading ? 'default' : 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                opacity: !diagramPrompt.trim() ? 0.4 : 1,
              }}
            >
              {diagramLoading ? 'Generating…' : 'Generate →'}
            </button>

            {diagramError && (
              <p style={{ fontSize: 11, color: '#FF1C52', margin: 0 }}>{diagramError}</p>
            )}

            {diagramSvg && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{
                  background: '#1a1a1e',
                  border: `1px solid ${colors.blue}`,
                  borderRadius: 8, overflow: 'hidden',
                  padding: 8, position: 'relative',
                }}>
                  <div style={{
                    fontSize: 9, fontWeight: 700, color: colors.gold,
                    letterSpacing: '0.06em', marginBottom: 6,
                  }}>
                    PREVIEW
                  </div>
                  <div
                    style={{ width: '100%' }}
                    dangerouslySetInnerHTML={{ __html: diagramSvg }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={acceptDiagram}
                    style={{
                      flex: 1, background: '#1D9E75', border: 'none',
                      borderRadius: 6, padding: '7px 10px',
                      fontSize: 12, fontWeight: 600, color: '#FFFFFF',
                      cursor: 'pointer',
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                    }}
                  >
                    ✓ Insert
                  </button>
                  <button
                    onClick={generateDiagram}
                    disabled={diagramLoading}
                    style={{
                      flex: 1, background: 'transparent',
                      border: `1px solid ${colors.borderDark}`,
                      borderRadius: 6, padding: '7px 10px',
                      fontSize: 12, color: colors.mutedDark, cursor: 'pointer',
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                    }}
                  >
                    Try again
                  </button>
                  <button
                    onClick={() => setDiagramSvg('')}
                    style={{
                      background: 'transparent', border: 'none',
                      fontSize: 11, color: colors.mutedDark, cursor: 'pointer',
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                      padding: '7px 4px',
                    }}
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div style={{
        padding: '14px 16px',
        borderTop: `1px solid ${colors.borderDark}`,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <button
          onClick={() => setShowChat(true)}
          style={{
            background: colors.blue, border: 'none',
            borderRadius: 7, padding: '9px 14px',
            fontSize: 13, fontWeight: 600, color: '#FFFFFF',
            cursor: 'pointer',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
            width: '100%', justifyContent: 'center',
          }}
        >
          <span style={{ opacity: 0.8 }}>✦</span> AI Co-pilot
        </button>
        <button
          onClick={onResetDiagrams}
          style={{
            background: 'transparent',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 7, padding: '8px 14px',
            fontSize: 12, color: colors.mutedDark,
            cursor: 'pointer',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            width: '100%',
          }}
        >
          Reset diagrams (R)
        </button>
      </div>
    </div>
  )
}
