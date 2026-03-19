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
  onInsertPoll: (poll: NonNullable<SlideData['poll']>) => void
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

export function EditPanel({ slide, onUpdate, onClose, onResetDiagrams, onInsertDiagram, onInsertPoll }: EditPanelProps) {
  const [showChat, setShowChat]               = useState(false)
  const [showDiagram, setShowDiagram]         = useState(false)
  const [diagramPrompt, setDiagramPrompt]     = useState('')
  const [diagramSvg, setDiagramSvg]           = useState('')
  const [diagramLoading, setDiagramLoading]   = useState(false)
  const [diagramError, setDiagramError]       = useState('')
  const [showPoll, setShowPoll]               = useState(false)
  const [pollQuestion, setPollQuestion]       = useState('')
  const [pollType, setPollType]               = useState<'yes-no' | 'multiple-choice' | 'rating'>('yes-no')
  const [pollOptions, setPollOptions]         = useState(['', '', '', ''])
  const [pollMultiple, setPollMultiple]       = useState(false)

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

  const addPoll = () => {
    if (!pollQuestion.trim()) return
    const poll: NonNullable<SlideData['poll']> = {
      question: pollQuestion.trim(),
      type: pollType,
      options: pollType === 'multiple-choice' ? pollOptions.filter(o => o.trim()) : [],
      allowMultiple: pollType === 'multiple-choice' ? pollMultiple : false,
    }
    onInsertPoll(poll)
    setPollQuestion('')
    setPollType('yes-no')
    setPollOptions(['', '', '', ''])
    setPollMultiple(false)
    setShowPoll(false)
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

      {/* Insert Poll section */}
      <div style={{ borderTop: `1px solid ${colors.borderDark}`, padding: '14px 16px' }}>
        <button
          onClick={() => setShowPoll(v => !v)}
          style={{
            width: '100%', background: 'transparent',
            border: `1px solid ${showPoll ? colors.gold : colors.borderDark}`,
            borderRadius: 7, padding: '8px 14px',
            fontSize: 12, fontWeight: 600,
            color: showPoll ? colors.gold : colors.mutedDark,
            cursor: 'pointer', textAlign: 'left',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span>◎</span>
          {showPoll ? 'Close poll builder' : 'Insert poll'}
        </button>

        {showPoll && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={fieldLabelStyle}>Question</label>
              <textarea
                value={pollQuestion}
                onChange={e => setPollQuestion(e.target.value)}
                onKeyDown={e => e.stopPropagation()}
                placeholder="Ask your audience something…"
                rows={2}
                style={fieldTextareaStyle}
                onFocus={e => (e.currentTarget.style.borderColor = colors.gold)}
                onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
              />
            </div>

            <div>
              <label style={fieldLabelStyle}>Poll type</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['yes-no', 'multiple-choice', 'rating'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setPollType(t)}
                    style={{
                      flex: 1, background: pollType === t ? colors.gold : 'transparent',
                      border: `1px solid ${pollType === t ? colors.gold : colors.borderDark}`,
                      borderRadius: 5, padding: '5px 4px',
                      fontSize: 10, fontWeight: 600,
                      color: pollType === t ? colors.ink : colors.mutedDark,
                      cursor: 'pointer',
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}
                  >
                    {t === 'yes-no' ? 'Yes / No' : t === 'multiple-choice' ? 'Choice' : 'Rating'}
                  </button>
                ))}
              </div>
            </div>

            {pollType === 'multiple-choice' && (
              <div>
                <label style={fieldLabelStyle}>Options (up to 4)</label>
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={e => {
                      const next = [...pollOptions]
                      next[i] = e.target.value
                      setPollOptions(next)
                    }}
                    onKeyDown={e => e.stopPropagation()}
                    placeholder={`Option ${i + 1}`}
                    style={{ ...fieldInputStyle, marginBottom: 6 }}
                    onFocus={e => (e.currentTarget.style.borderColor = colors.gold)}
                    onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
                  />
                ))}
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 11, color: colors.mutedDark, cursor: 'pointer', marginTop: 4,
                }}>
                  <input
                    type="checkbox"
                    checked={pollMultiple}
                    onChange={e => setPollMultiple(e.target.checked)}
                  />
                  Allow multiple selections
                </label>
              </div>
            )}

            <div style={{
              background: '#1a1a1e', borderRadius: 6, padding: '8px 10px',
              fontSize: 11, color: colors.mutedDark, lineHeight: 1.5,
            }}>
              {pollQuestion.trim()
                ? `"${pollQuestion.trim()}" — ${pollType === 'yes-no' ? 'Yes or No' : pollType === 'rating' ? 'Rating 1–5' : `${pollOptions.filter(o => o.trim()).length} option(s)`}`
                : 'Enter a question above to preview'}
            </div>

            <button
              onClick={addPoll}
              disabled={!pollQuestion.trim()}
              style={{
                background: pollQuestion.trim() ? colors.gold : colors.inkSoft,
                border: 'none', borderRadius: 6, padding: '8px 14px',
                fontSize: 12, fontWeight: 700,
                color: pollQuestion.trim() ? colors.ink : colors.mutedDark,
                cursor: pollQuestion.trim() ? 'pointer' : 'default',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                opacity: !pollQuestion.trim() ? 0.4 : 1,
              }}
            >
              ◎ Insert poll slide
            </button>
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

const fieldLabelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 600,
  color: colors.mutedDark, letterSpacing: '0.06em',
  textTransform: 'uppercase', marginBottom: 5,
}

const fieldInputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#1a1a1e',
  border: `1px solid ${colors.borderDark}`,
  borderRadius: 6, padding: '7px 10px',
  fontSize: 13, color: '#FFFFFF',
  fontFamily: '"DM Sans", system-ui, sans-serif',
  outline: 'none', display: 'block',
}

const fieldTextareaStyle: React.CSSProperties = {
  ...fieldInputStyle,
  resize: 'vertical' as const,
  lineHeight: 1.5,
}
