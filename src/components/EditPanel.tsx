import { useState, useRef } from 'react'
import { colors, Button, Badge } from '../design-system'
import { useTextSelection } from '../hooks/useTextSelection'
import { ChatPanel } from './ChatPanel'
import { TonePicker } from './TonePicker'
import type { ToneOption } from './TonePicker'
import { getVariantsForType } from '../utils/layoutVariants'
import { detectEmbedType, getEmbedLabel } from '../utils/embedDetect'
import type { SlideData, DiagramData } from '../types/deck'

interface EditPanelProps {
  slide: SlideData
  onUpdate: (patch: Partial<SlideData>) => void
  onClose: () => void
  onResetDiagrams: () => void
  onInsertDiagram: (data: DiagramData) => void
  onInsertPoll: (poll: NonNullable<SlideData['poll']>) => void
  onInsertImage: (src: string) => void
  onInsertEmbed: (embed: NonNullable<SlideData['embed']>) => void
}

const EDITABLE_FIELDS: Record<string, Array<{ key: keyof SlideData; label: string; multiline?: boolean }>> = {
  cover: [
    { key: 'eyebrow', label: 'Eyebrow' },
    { key: 'title', label: 'Title', multiline: true },
    { key: 'subtitle', label: 'Subtitle', multiline: true },
    { key: 'meta', label: 'Meta line' },
  ],
  narrative: [
    { key: 'eyebrow', label: 'Eyebrow' },
    { key: 'headline', label: 'Headline', multiline: true },
    { key: 'body', label: 'Body', multiline: true },
    { key: 'pullQuote', label: 'Pull quote', multiline: true },
  ],
  'stat-grid': [
    { key: 'eyebrow', label: 'Eyebrow' },
    { key: 'headline', label: 'Headline', multiline: true },
  ],
  'two-pane': [
    { key: 'eyebrow', label: 'Eyebrow (shared)' },
  ],
  'section-break': [
    { key: 'number', label: 'Number (e.g. 01)' },
    { key: 'title', label: 'Title', multiline: true },
    { key: 'subtitle', label: 'Subtitle', multiline: true },
  ],
  'full-bleed': [
    { key: 'statement', label: 'Statement', multiline: true },
    { key: 'accentWord', label: 'Accent word (highlighted in gold)' },
  ],
  diagram: [
    { key: 'eyebrow', label: 'Eyebrow' },
    { key: 'title', label: 'Title', multiline: true },
    { key: 'placeholder', label: 'Placeholder hint', multiline: true },
  ],
  closing: [
    { key: 'headline', label: 'Headline', multiline: true },
    { key: 'cta', label: 'CTA button text' },
    { key: 'contact', label: 'Contact line' },
  ],
  poll: [
    { key: 'eyebrow', label: 'Eyebrow' },
  ],
  embed: [
    { key: 'eyebrow', label: 'Eyebrow' },
    { key: 'title', label: 'Title', multiline: true },
  ],
}

export function EditPanel({ slide, onUpdate, onClose, onResetDiagrams, onInsertDiagram, onInsertPoll, onInsertImage, onInsertEmbed }: EditPanelProps) {
  const [showChat, setShowChat]               = useState(false)
  const [showDiagram, setShowDiagram]         = useState(false)
  const [diagramPrompt, setDiagramPrompt]     = useState('')
  const [diagramData, setDiagramData]         = useState<DiagramData | null>(null)
  const [diagramLoading, setDiagramLoading]   = useState(false)
  const [diagramError, setDiagramError]       = useState('')
  const [showPoll, setShowPoll]               = useState(false)
  const [pollQuestion, setPollQuestion]       = useState('')
  const [pollType, setPollType]               = useState<'yes-no' | 'multiple-choice' | 'rating' | 'likert'>('yes-no')
  const [pollOptions, setPollOptions]         = useState(['', '', '', ''])
  const [pollMultiple, setPollMultiple]       = useState(false)
  const [showImage, setShowImage]             = useState(false)
  const [imageUrl, setImageUrl]               = useState('')
  const imageFileRef                          = useRef<HTMLInputElement>(null)
  const [showEmbed, setShowEmbed]             = useState(false)
  const [embedUrl, setEmbedUrl]               = useState('')
  const [embedTitle, setEmbedTitle]           = useState('')

  // Rewrite state
  const [activeRewriteField, setActiveRewriteField] = useState<string | null>(null)
  const [rewriteLoadingKey, setRewriteLoadingKey]   = useState<string | null>(null)
  const [hoveredLabelKey, setHoveredLabelKey]       = useState<string | null>(null)

  // Links state
  const [showAddLink, setShowAddLink]   = useState(false)
  const [newLinkText, setNewLinkText]   = useState('')
  const [newLinkUrl, setNewLinkUrl]     = useState('')

  // Highlights state
  const [newHighlightText, setNewHighlightText]   = useState('')
  const [newHighlightColor, setNewHighlightColor] = useState<'blue' | 'gold' | 'red' | 'ink'>('blue')
  const [showHighlightForm, setShowHighlightForm] = useState(false)

  // Text selection → link affordance
  const {
    selection: textSelection,
    onFocus: onFieldFocus,
    onBlur: onFieldBlur,
    onSelect: onFieldSelect,
    clearSelection: clearTextSelection,
  } = useTextSelection()

  const fields = EDITABLE_FIELDS[slide.type] ?? []

  // ── Rewrite handler ──────────────────────────────────────────────────────
  const rewriteField = async (fieldKey: string, option: ToneOption) => {
    setRewriteLoadingKey(option.id)
    try {
      const res = await fetch('/api/edit-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: `Rewrite only the "${fieldKey}" field. ${option.instruction}`,
          slide,
        }),
      })
      const data = await res.json()
      if (data.patch) {
        onUpdate(data.patch)
        setActiveRewriteField(null)
      }
    } catch {
      // silently ignore — user can retry
    } finally {
      setRewriteLoadingKey(null)
    }
  }

  // ── Links helpers ────────────────────────────────────────────────────────
  const currentLinks = slide.links ?? []

  const addLink = () => {
    if (!newLinkText.trim() || !newLinkUrl.trim()) return
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
    const url = newLinkUrl.trim().startsWith('http') ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`
    onUpdate({ links: [...currentLinks, { id, text: newLinkText.trim(), url }] })
    setNewLinkText('')
    setNewLinkUrl('')
    setShowAddLink(false)
  }

  const removeLink = (id: string) => {
    onUpdate({ links: currentLinks.filter(l => l.id !== id) })
  }

  // ── Diagram / poll / image / embed handlers ──────────────────────────────
  const generateDiagram = async () => {
    if (!diagramPrompt.trim()) return
    setDiagramLoading(true)
    setDiagramError('')
    setDiagramData(null)
    try {
      const res = await fetch('/api/graphic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: diagramPrompt,
          context: `Slide type: ${slide.type}. ${slide.headline ?? slide.title ?? ''}`,
        }),
      })
      const json = await res.json()
      if (json.error) { setDiagramError(json.error); return }
      if (!json.diagramData) { setDiagramError('Unexpected response — try again'); return }
      setDiagramData(json.diagramData)
    } catch {
      setDiagramError('Generation failed — check API key')
    } finally {
      setDiagramLoading(false)
    }
  }

  const acceptDiagram = () => {
    if (!diagramData) return
    onInsertDiagram(diagramData)
    setDiagramData(null)
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

  const insertImageUrl = () => {
    if (!imageUrl.trim()) return
    onInsertImage(imageUrl.trim())
    setImageUrl('')
    setShowImage(false)
  }

  const insertEmbed = () => {
    if (!embedUrl.trim()) return
    const embedType = detectEmbedType(embedUrl)
    onInsertEmbed({
      url: embedUrl.trim(),
      embedType,
      title: embedTitle.trim() || getEmbedLabel(embedType),
      aspectRatio: '16:9',
    })
    setEmbedUrl('')
    setEmbedTitle('')
    setShowEmbed(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const src = ev.target?.result as string
      if (src) { onInsertImage(src); setShowImage(false) }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
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
    <>
    <style>{`
      @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
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

        {/* Layout variants */}
        {(() => {
          const variants = getVariantsForType(slide.type)
          if (!['cover', 'narrative', 'stat-grid', 'closing'].includes(slide.type)) return null
          if (variants.length === 0) return null
          return (
            <div>
              <label style={fieldLabelStyle}>Layout</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {variants.map(v => {
                  const isActive = (slide.layout ?? 'default') === v.variant
                  return (
                    <button
                      key={v.variant}
                      onClick={() => onUpdate({ layout: v.variant })}
                      style={{
                        background: isActive ? colors.blue : 'transparent',
                        border: `1px solid ${isActive ? colors.blue : colors.borderDark}`,
                        borderRadius: 5, padding: '5px 9px',
                        fontSize: 11, fontWeight: 600,
                        color: isActive ? '#FFFFFF' : colors.mutedDark,
                        cursor: 'pointer',
                        fontFamily: '"DM Sans", system-ui, sans-serif',
                      }}
                    >
                      {v.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {fields.length > 0 ? (
          fields.map(({ key, label, multiline }) => {
            const value = (slide[key] as string) ?? ''
            const canRewrite = value.trim().length > 2
            const isPickerOpen = activeRewriteField === key

            return (
              <div key={key}>
                {/* Label row with Rewrite button */}
                <div
                  style={{ display: 'flex', alignItems: 'center', marginBottom: 5, gap: 6 }}
                  onMouseEnter={() => setHoveredLabelKey(key)}
                  onMouseLeave={() => setHoveredLabelKey(null)}
                >
                  <label style={{ ...fieldLabelStyle, marginBottom: 0, flex: 1 }}>
                    {label}
                  </label>
                  {(hoveredLabelKey === key || isPickerOpen) && canRewrite && (
                    <button
                      onClick={() => setActiveRewriteField(isPickerOpen ? null : key)}
                      style={{
                        background: isPickerOpen ? 'rgba(140,80,220,0.15)' : 'transparent',
                        border: `1px solid ${isPickerOpen ? 'rgba(140,80,220,0.4)' : 'transparent'}`,
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        color: 'rgba(140,80,220,0.9)',
                        cursor: 'pointer',
                        fontFamily: '"DM Sans", system-ui, sans-serif',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ✦ Rewrite
                    </button>
                  )}
                </div>

                {multiline ? (
                  <textarea
                    value={value}
                    onChange={e => onUpdate({ [key]: e.target.value } as Partial<SlideData>)}
                    onKeyDown={e => e.stopPropagation()}
                    onFocus={e => { e.currentTarget.style.borderColor = colors.blue; onFieldFocus(key as string) }}
                    onBlur={e => { e.currentTarget.style.borderColor = colors.borderDark; onFieldBlur() }}
                    onSelect={onFieldSelect}
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
                  />
                ) : (
                  <input
                    value={value}
                    onChange={e => onUpdate({ [key]: e.target.value } as Partial<SlideData>)}
                    onKeyDown={e => e.stopPropagation()}
                    onFocus={e => { e.currentTarget.style.borderColor = colors.blue; onFieldFocus(key as string) }}
                    onBlur={e => { e.currentTarget.style.borderColor = colors.borderDark; onFieldBlur() }}
                    onSelect={onFieldSelect}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: '#1a1a1e',
                      border: `1px solid ${colors.borderDark}`,
                      borderRadius: 6, padding: '7px 10px',
                      fontSize: 13, color: '#FFFFFF',
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                      outline: 'none',
                    }}
                  />
                )}

                {/* TonePicker inline below the field */}
                {isPickerOpen && (
                  <TonePicker
                    loading={rewriteLoadingKey}
                    onSelect={(option) => rewriteField(key, option)}
                    onClose={() => setActiveRewriteField(null)}
                  />
                )}
              </div>
            )
          })
        ) : (
          <div style={{
            background: '#1a1a1e',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 8, padding: '14px',
            fontSize: 12, color: colors.mutedDark, lineHeight: 1.6,
          }}>
            {slide.type === 'two-pane' && (
              <>
                <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>Two-pane slide</div>
                Use ✦ AI Co-pilot to edit left/right pane content — e.g.
                "Update the left pane heading to..." or "Add a bullet to the right pane about..."
              </>
            )}
            {slide.type === 'poll' && (
              <>
                <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>Poll slide</div>
                Poll question and options are set at creation time.
                Use ✦ AI Co-pilot to rephrase the question or change options.
              </>
            )}
            {slide.type !== 'two-pane' && slide.type !== 'poll' && (
              <>No editable text fields for this slide type. Use ✦ AI Co-pilot.</>
            )}
          </div>
        )}

        {/* ── Poll content editor ───────────────────────────────────────── */}
        {slide.type === 'poll' && slide.poll && (
          <div style={{
            background: '#1a1a1e',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 8, padding: '12px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: colors.mutedDark, letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 2,
            }}>
              Poll question &amp; options
            </div>

            {/* Question */}
            <div>
              <label style={{ display: 'block', fontSize: 11, color: colors.mutedDark, marginBottom: 4 }}>Question</label>
              <textarea
                value={slide.poll.question}
                onChange={e => onUpdate({ poll: { ...slide.poll!, question: e.target.value } })}
                onKeyDown={e => e.stopPropagation()}
                onFocus={e => { e.currentTarget.style.borderColor = colors.blue }}
                onBlur={e => { e.currentTarget.style.borderColor = colors.borderDark }}
                rows={2}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#111', border: `1px solid ${colors.borderDark}`,
                  borderRadius: 6, padding: '7px 10px',
                  fontSize: 13, color: '#FFFFFF', lineHeight: 1.5,
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  outline: 'none', resize: 'vertical',
                }}
              />
            </div>

            {/* Poll type selector */}
            <div>
              <label style={{ display: 'block', fontSize: 11, color: colors.mutedDark, marginBottom: 4 }}>Type</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['yes-no', 'multiple-choice', 'rating', 'likert'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => onUpdate({ poll: { ...slide.poll!, type: t, options: t === 'multiple-choice' ? (slide.poll!.options?.length ? slide.poll!.options : ['', '', '', '']) : [] } })}
                    style={{
                      flex: 1,
                      padding: '5px 4px',
                      borderRadius: 5,
                      border: `1px solid ${slide.poll!.type === t ? colors.gold : colors.borderDark}`,
                      background: slide.poll!.type === t ? '#1a1a2e' : 'transparent',
                      color: slide.poll!.type === t ? colors.gold : colors.mutedDark,
                      fontSize: 9, fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}
                  >
                    {t === 'yes-no' ? 'Yes/No' : t === 'multiple-choice' ? 'Multi' : t === 'rating' ? '1–5' : 'Likert'}
                  </button>
                ))}
              </div>
            </div>

            {/* Multiple-choice options */}
            {slide.poll.type === 'multiple-choice' && (
              <div>
                <label style={{ display: 'block', fontSize: 11, color: colors.mutedDark, marginBottom: 4 }}>Options</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(slide.poll.options?.length ? slide.poll.options : ['', '', '', '']).map((opt, i) => (
                    <input
                      key={i}
                      value={opt}
                      onChange={e => {
                        const opts = [...(slide.poll!.options ?? ['', '', '', ''])]
                        opts[i] = e.target.value
                        onUpdate({ poll: { ...slide.poll!, options: opts } })
                      }}
                      onKeyDown={e => e.stopPropagation()}
                      onFocus={ev => { ev.currentTarget.style.borderColor = colors.blue }}
                      onBlur={ev => { ev.currentTarget.style.borderColor = colors.borderDark }}
                      placeholder={`Option ${i + 1}`}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        background: '#111', border: `1px solid ${colors.borderDark}`,
                        borderRadius: 6, padding: '7px 10px',
                        fontSize: 13, color: '#FFFFFF',
                        fontFamily: '"DM Sans", system-ui, sans-serif',
                        outline: 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Two-pane content editor ───────────────────────────────────── */}
        {slide.type === 'two-pane' && (
          <div style={{
            background: '#1a1a1e',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 8, padding: '12px',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: colors.mutedDark, letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Pane content
            </div>

            {(['left', 'right'] as const).map(side => {
              const pane = slide[side] ?? { heading: '' }
              return (
                <div key={side} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, color: colors.mutedDark,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    {side === 'left' ? '← Left pane' : '→ Right pane'}
                  </div>

                  {/* Eyebrow */}
                  <input
                    value={pane.eyebrow ?? ''}
                    onChange={e => onUpdate({ [side]: { ...pane, eyebrow: e.target.value } })}
                    onKeyDown={e => e.stopPropagation()}
                    onFocus={ev => { ev.currentTarget.style.borderColor = colors.blue }}
                    onBlur={ev => { ev.currentTarget.style.borderColor = colors.borderDark }}
                    placeholder="Eyebrow (optional)"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: '#111', border: `1px solid ${colors.borderDark}`,
                      borderRadius: 6, padding: '5px 8px',
                      fontSize: 11, color: colors.mutedDark,
                      fontFamily: '"DM Sans", system-ui, sans-serif', outline: 'none',
                    }}
                  />

                  {/* Heading */}
                  <input
                    value={pane.heading}
                    onChange={e => onUpdate({ [side]: { ...pane, heading: e.target.value } })}
                    onKeyDown={e => e.stopPropagation()}
                    onFocus={ev => { ev.currentTarget.style.borderColor = colors.blue }}
                    onBlur={ev => { ev.currentTarget.style.borderColor = colors.borderDark }}
                    placeholder="Heading"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: '#111', border: `1px solid ${colors.borderDark}`,
                      borderRadius: 6, padding: '7px 10px',
                      fontSize: 13, color: '#FFFFFF',
                      fontFamily: '"DM Sans", system-ui, sans-serif', outline: 'none',
                    }}
                  />

                  {/* Bullets */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {(pane.bullets ?? []).map((b, i) => (
                      <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        <span style={{ color: colors.mutedDark, fontSize: 11, flexShrink: 0 }}>•</span>
                        <input
                          value={b}
                          onChange={e => {
                            const bullets = [...(pane.bullets ?? [])]
                            bullets[i] = e.target.value
                            onUpdate({ [side]: { ...pane, bullets } })
                          }}
                          onKeyDown={e => e.stopPropagation()}
                          onFocus={ev => { ev.currentTarget.style.borderColor = colors.blue }}
                          onBlur={ev => { ev.currentTarget.style.borderColor = colors.borderDark }}
                          placeholder={`Bullet ${i + 1}`}
                          style={{
                            flex: 1, background: '#111',
                            border: `1px solid ${colors.borderDark}`,
                            borderRadius: 5, padding: '5px 8px',
                            fontSize: 12, color: '#FFFFFF',
                            fontFamily: '"DM Sans", system-ui, sans-serif', outline: 'none',
                          }}
                        />
                        <button
                          onClick={() => {
                            const bullets = (pane.bullets ?? []).filter((_, idx) => idx !== i)
                            onUpdate({ [side]: { ...pane, bullets } })
                          }}
                          style={{
                            background: 'none', border: 'none',
                            color: colors.mutedDark, cursor: 'pointer',
                            fontSize: 14, lineHeight: 1, padding: '0 2px', flexShrink: 0,
                          }}
                          title="Remove bullet"
                        >×</button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const bullets = [...(pane.bullets ?? []), '']
                        onUpdate({ [side]: { ...pane, bullets } })
                      }}
                      style={{
                        background: 'transparent',
                        border: `1px dashed ${colors.borderDark}`,
                        borderRadius: 5, padding: '4px 8px',
                        fontSize: 11, color: colors.mutedDark,
                        cursor: 'pointer',
                        fontFamily: '"DM Sans", system-ui, sans-serif',
                        textAlign: 'left',
                      }}
                    >
                      + Add bullet
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Inline Links section ──────────────────────────────────────── */}
        <div
          id="inline-links-section"
          style={{
            background: '#1a1a1e',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 8,
            padding: '12px',
          }}
        >
          <div style={{
            fontSize: 10, fontWeight: 700,
            color: colors.mutedDark, letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 10,
          }}>
            🔗 Inline links
          </div>

          {/* Existing links list */}
          {currentLinks.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {currentLinks.map(link => (
                <div
                  key={link.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(30,90,242,0.06)',
                    border: '1px solid rgba(30,90,242,0.18)',
                    borderRadius: 5, padding: '5px 8px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      "{link.text}"
                    </div>
                    <div style={{ fontSize: 10, color: colors.blue, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      → {link.url.replace(/^https?:\/\//, '')}
                    </div>
                  </div>
                  <button
                    onClick={() => removeLink(link.id)}
                    style={{
                      background: 'none', border: 'none',
                      color: colors.mutedDark, cursor: 'pointer',
                      fontSize: 14, lineHeight: 1, padding: '0 2px',
                      fontFamily: 'system-ui', flexShrink: 0,
                    }}
                    title="Remove link"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add link form */}
          {showAddLink ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input
                value={newLinkText}
                onChange={e => setNewLinkText(e.target.value)}
                onKeyDown={e => { e.stopPropagation(); if (e.key === 'Escape') setShowAddLink(false) }}
                placeholder={newLinkText ? 'Text to link' : 'Text phrase to link (exact match)'}
                autoFocus={!newLinkText}
                style={{ ...fieldInputStyle, fontSize: 12 }}
                onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
                onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
              />
              <input
                id="link-url-input"
                value={newLinkUrl}
                onChange={e => setNewLinkUrl(e.target.value)}
                onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') addLink(); if (e.key === 'Escape') setShowAddLink(false) }}
                placeholder="https://…"
                style={{ ...fieldInputStyle, fontSize: 12 }}
                onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
                onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
              />
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={addLink}
                  disabled={!newLinkText.trim() || !newLinkUrl.trim()}
                  style={{
                    flex: 1,
                    background: newLinkText.trim() && newLinkUrl.trim() ? colors.blue : colors.inkSoft,
                    border: 'none', borderRadius: 5, padding: '6px 10px',
                    fontSize: 11, fontWeight: 600, color: '#FFFFFF',
                    cursor: newLinkText.trim() && newLinkUrl.trim() ? 'pointer' : 'default',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    opacity: newLinkText.trim() && newLinkUrl.trim() ? 1 : 0.4,
                  }}
                >
                  Add link
                </button>
                <button
                  onClick={() => { setShowAddLink(false); setNewLinkText(''); setNewLinkUrl('') }}
                  style={{
                    background: 'transparent', border: `1px solid ${colors.borderDark}`,
                    borderRadius: 5, padding: '6px 10px',
                    fontSize: 11, color: colors.mutedDark, cursor: 'pointer',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddLink(true)}
              style={{
                background: 'transparent',
                border: `1px dashed ${colors.borderDark}`,
                borderRadius: 5, padding: '6px 10px',
                fontSize: 11, fontWeight: 600,
                color: colors.mutedDark, cursor: 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                width: '100%',
              }}
            >
              + Add link
            </button>
          )}
        </div>

        {/* ── Text Highlights section ── */}
        {(['narrative', 'full-bleed', 'closing'] as const).includes(slide.type as 'narrative' | 'full-bleed' | 'closing') && (
          <div
            id="highlights-section"
            style={{
              marginTop: 8, paddingTop: 16,
              borderTop: `1px solid ${colors.borderDark}`,
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 8,
            }}>
              <label style={fieldLabelStyle}>
                🎨 Text highlights
              </label>
              <button
                onClick={() => setShowHighlightForm(v => !v)}
                style={{
                  background: showHighlightForm
                    ? 'rgba(30,90,242,0.15)' : 'transparent',
                  border: `1px solid ${showHighlightForm
                    ? colors.blue : colors.borderDark}`,
                  borderRadius: 4, padding: '2px 8px',
                  fontSize: 9, fontWeight: 700,
                  color: showHighlightForm ? colors.blue : colors.mutedDark,
                  cursor: 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                }}
              >
                + Highlight
              </button>
            </div>

            {/* Existing highlights */}
            {(slide.highlights ?? []).length > 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8,
              }}>
                {(slide.highlights ?? []).map(h => {
                  const colorMap: Record<string, string> = {
                    blue: '#1E5AF2', gold: '#FFCC2D',
                    red: '#FF1C52', ink: '#111113',
                  }
                  return (
                    <div key={h.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: '#1a1a1e',
                      border: `1px solid ${colors.borderDark}`,
                      borderRadius: 6, padding: '5px 10px',
                    }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: 2,
                        background: colorMap[h.color ?? 'blue'],
                        flexShrink: 0,
                      }} />
                      <div style={{
                        flex: 1, fontSize: 11, fontWeight: 600,
                        color: '#FFFFFF',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        "{h.text}"
                      </div>
                      <button
                        onClick={() => onUpdate({
                          highlights: (slide.highlights ?? [])
                            .filter(x => x.id !== h.id)
                        })}
                        style={{
                          background: 'transparent', border: 'none',
                          color: colors.mutedDark, cursor: 'pointer',
                          fontSize: 13, lineHeight: 1, padding: '0 2px',
                          flexShrink: 0,
                        }}
                      >×</button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Add highlight form */}
            {showHighlightForm && (
              <div style={{
                background: '#1a1a1e',
                border: `1px solid ${colors.borderDark}`,
                borderRadius: 8, padding: 10,
              }}>
                <label style={{ ...fieldLabelStyle, marginBottom: 4 }}>
                  Text to highlight (exact match)
                </label>
                <input
                  id="highlight-text-input"
                  value={newHighlightText}
                  onChange={e => setNewHighlightText(e.target.value)}
                  onKeyDown={e => e.stopPropagation()}
                  placeholder="e.g. disconnected digital tools"
                  style={fieldInputStyle}
                />
                <p style={{
                  fontSize: 9, color: colors.mutedDark,
                  marginTop: 3, marginBottom: 8, lineHeight: 1.4,
                }}>
                  Select text in a field above to auto-fill,
                  or type manually. Must match exactly.
                </p>

                {/* Color picker */}
                <label style={{ ...fieldLabelStyle, marginBottom: 6 }}>
                  Highlight color
                </label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  {([
                    { value: 'blue' as const, bg: '#1E5AF2', label: 'Blue' },
                    { value: 'gold' as const, bg: '#FFCC2D', label: 'Gold' },
                    { value: 'red'  as const, bg: '#FF1C52', label: 'Red'  },
                    { value: 'ink'  as const, bg: '#111113', label: 'Ink'  },
                  ]).map(c => (
                    <button
                      key={c.value}
                      onClick={() => setNewHighlightColor(c.value)}
                      title={c.label}
                      style={{
                        width: 24, height: 24,
                        borderRadius: 4,
                        background: c.bg,
                        border: newHighlightColor === c.value
                          ? '2px solid #FFFFFF'
                          : `1.5px solid ${colors.borderDark}`,
                        cursor: 'pointer', padding: 0,
                        outline: newHighlightColor === c.value
                          ? `2px solid ${colors.blue}` : 'none',
                        outlineOffset: 1,
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>

                {/* Preview */}
                {newHighlightText.trim() && (
                  <div style={{
                    marginBottom: 10, padding: '6px 10px',
                    background: '#111113', borderRadius: 5,
                    fontSize: 11, color: '#FFFFFF',
                  }}>
                    Preview:{' '}
                    <mark style={{
                      background: ({
                        blue: '#1E5AF2', gold: '#FFCC2D',
                        red: '#FF1C52', ink: '#111113',
                      } as Record<string, string>)[newHighlightColor],
                      color: newHighlightColor === 'gold' ? '#111113' : '#FFFFFF',
                      borderRadius: 3, padding: '0 4px 1px',
                      fontSize: 'inherit',
                    }}>
                      {newHighlightText.trim()}
                    </mark>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => {
                      if (!newHighlightText.trim()) return
                      const newH = {
                        id: Math.random().toString(36).slice(2, 10),
                        text: newHighlightText.trim(),
                        color: newHighlightColor,
                      }
                      onUpdate({
                        highlights: [...(slide.highlights ?? []), newH]
                      })
                      setNewHighlightText('')
                      setShowHighlightForm(false)
                    }}
                    disabled={!newHighlightText.trim()}
                    style={{
                      flex: 1,
                      background: newHighlightText.trim()
                        ? colors.blue : colors.borderDark,
                      border: 'none', borderRadius: 6,
                      padding: '7px 12px',
                      fontSize: 12, fontWeight: 600, color: '#FFFFFF',
                      cursor: newHighlightText.trim() ? 'pointer' : 'default',
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                    }}
                  >
                    Add highlight
                  </button>
                  <button
                    onClick={() => {
                      setShowHighlightForm(false)
                      setNewHighlightText('')
                    }}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${colors.borderDark}`,
                      borderRadius: 6, padding: '7px 12px',
                      fontSize: 12, color: colors.mutedDark,
                      cursor: 'pointer',
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {(slide.highlights ?? []).length === 0 && !showHighlightForm && (
              <p style={{
                fontSize: 10, color: colors.mutedDark, lineHeight: 1.6,
              }}>
                Add a color background to key words or phrases.
                SIGNAL uses highlight instead of bold for emphasis.
                Select text above to auto-fill.
              </p>
            )}
          </div>
        )}

        {/* ── Slide Build toggle ── */}
        {(['stat-grid', 'narrative', 'two-pane', 'section-break'] as const).includes(slide.type as 'stat-grid' | 'narrative' | 'two-pane' | 'section-break') && (
          <div style={{
            marginTop: 8, paddingTop: 16,
            borderTop: `1px solid ${colors.borderDark}`,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 6,
            }}>
              <label style={{ ...fieldLabelStyle, marginBottom: 0 }}>
                🎬 Slide build
              </label>
              <button
                onClick={() => {
                  const defaultSteps: Record<string, number> = {
                    'stat-grid': slide.stats?.length ?? 4,
                    'narrative': 2,
                    'two-pane': 1,
                    'section-break': 2,
                  }
                  const steps = defaultSteps[slide.type] ?? 0
                  onUpdate({ buildSteps: (slide.buildSteps ?? 0) > 0 ? 0 : steps })
                }}
                style={{
                  background: (slide.buildSteps ?? 0) > 0
                    ? 'rgba(30,90,242,0.15)' : 'transparent',
                  border: `1px solid ${(slide.buildSteps ?? 0) > 0
                    ? colors.blue : colors.borderDark}`,
                  borderRadius: 4, padding: '3px 10px',
                  fontSize: 10, fontWeight: 700,
                  color: (slide.buildSteps ?? 0) > 0 ? colors.blue : colors.mutedDark,
                  cursor: 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                }}
              >
                {(slide.buildSteps ?? 0) > 0
                  ? `✓ On — ${slide.buildSteps} steps`
                  : 'Enable'}
              </button>
            </div>
            <p style={{ fontSize: 10, color: colors.mutedDark, lineHeight: 1.5, margin: 0 }}>
              In Present mode, elements reveal one at a time.
              {(slide.buildSteps ?? 0) > 0 && (
                <> Each → advances one step before the next slide.</>
              )}
            </p>
          </div>
        )}

        {/* Presenter notes — all slide types */}
        <div style={{ marginTop: 4 }}>
          <label style={{
            display: 'block', fontSize: 10, fontWeight: 600,
            color: colors.mutedDark, letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: 5,
          }}>
            Presenter notes
          </label>
          <textarea
            value={slide.notes ?? ''}
            onChange={e => onUpdate({ notes: e.target.value || undefined })}
            onKeyDown={e => e.stopPropagation()}
            placeholder="Private notes visible only in Present mode…"
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: '#1a1a1e',
              border: `1px solid ${colors.borderDark}`,
              borderRadius: 6, padding: '7px 10px',
              fontSize: 12, color: '#FFFFFF', lineHeight: 1.5,
              fontFamily: '"DM Sans", system-ui, sans-serif',
              outline: 'none', resize: 'vertical',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
            onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
          />
        </div>

        {/* CTA URL — closing slides only */}
        {slide.type === 'closing' && (
          <div style={{
            background: '#1a1a1e',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 8, padding: '12px',
            marginTop: 4,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: colors.mutedDark,
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
            }}>
              CTA Button
            </div>

            <label style={fieldLabelStyle}>Button label</label>
            <input
              value={slide.cta ?? ''}
              onChange={e => onUpdate({ cta: e.target.value })}
              onKeyDown={e => e.stopPropagation()}
              placeholder="Schedule a working session"
              style={{ ...fieldInputStyle, marginBottom: 8 }}
              onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
              onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
            />

            <label style={fieldLabelStyle}>Link URL</label>
            <input
              value={slide.ctaUrl ?? ''}
              onChange={e => onUpdate({ ctaUrl: e.target.value })}
              onKeyDown={e => e.stopPropagation()}
              placeholder="https://cal.com/yourname"
              style={{ ...fieldInputStyle, marginBottom: 8 }}
              onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
              onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
            />

            <label style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 11, color: colors.mutedDark, cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={(slide.ctaTarget ?? '_blank') === '_blank'}
                onChange={e => onUpdate({ ctaTarget: e.target.checked ? '_blank' : '_self' })}
              />
              Open in new tab
            </label>

            {slide.ctaUrl && (
              <div style={{
                marginTop: 10, padding: '6px 8px',
                background: 'rgba(30,90,242,0.08)',
                border: '1px solid rgba(30,90,242,0.2)',
                borderRadius: 5,
                fontSize: 10, color: colors.blue,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <span>↗</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {slide.ctaUrl}
                </span>
              </div>
            )}
          </div>
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
          onClick={() => { setShowDiagram(v => !v); setDiagramData(null); setDiagramError('') }}
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

            {diagramData && (
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
                    PREVIEW — {diagramData.nodes.length} nodes, {diagramData.edges.length} edges
                  </div>
                  <div style={{ fontSize: 11, color: colors.mutedDark }}>
                    Click Insert to add the interactive diagram to the deck.
                  </div>
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
                    onClick={() => setDiagramData(null)}
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {(['yes-no', 'multiple-choice', 'rating', 'likert'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setPollType(t)}
                    style={{
                      background: pollType === t ? colors.gold : 'transparent',
                      border: `1px solid ${pollType === t ? colors.gold : colors.borderDark}`,
                      borderRadius: 5, padding: '5px 8px',
                      fontSize: 10, fontWeight: 600,
                      color: pollType === t ? colors.ink : colors.mutedDark,
                      cursor: 'pointer',
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}
                  >
                    {t === 'yes-no' ? 'Yes/No' : t === 'multiple-choice' ? 'Choice' : t === 'rating' ? 'Rating' : 'Likert'}
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
                ? `"${pollQuestion.trim()}" — ${pollType === 'yes-no' ? 'Yes or No' : pollType === 'rating' ? 'Rating 1–5' : pollType === 'likert' ? 'Likert scale 1–5' : `${pollOptions.filter(o => o.trim()).length} option(s)`}`
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

      {/* Insert Image section */}
      <div style={{ borderTop: `1px solid ${colors.borderDark}`, padding: '14px 16px' }}>
        <button
          onClick={() => setShowImage(v => !v)}
          style={{
            width: '100%', background: 'transparent',
            border: `1px solid ${showImage ? colors.blue : colors.borderDark}`,
            borderRadius: 7, padding: '8px 14px',
            fontSize: 12, fontWeight: 600,
            color: showImage ? colors.blue : colors.mutedDark,
            cursor: 'pointer', textAlign: 'left',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ fontSize: 14 }}>⬚</span>
          {showImage ? 'Close image panel' : 'Insert image'}
        </button>

        {showImage && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <label style={fieldLabelStyle}>From URL</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') insertImageUrl() }}
                  placeholder="https://…"
                  style={{ ...fieldInputStyle, flex: 1 }}
                  onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
                  onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
                />
                <button
                  onClick={insertImageUrl}
                  disabled={!imageUrl.trim()}
                  style={{
                    background: imageUrl.trim() ? colors.blue : colors.inkSoft,
                    border: 'none', borderRadius: 6, padding: '0 12px',
                    fontSize: 12, fontWeight: 600, color: '#FFFFFF',
                    cursor: imageUrl.trim() ? 'pointer' : 'default',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    flexShrink: 0, opacity: imageUrl.trim() ? 1 : 0.4,
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            <div>
              <label style={fieldLabelStyle}>Or upload file</label>
              <input
                ref={imageFileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <button
                onClick={() => imageFileRef.current?.click()}
                style={{
                  width: '100%', background: 'transparent',
                  border: `1px dashed ${colors.borderDark}`,
                  borderRadius: 6, padding: '8px 12px',
                  fontSize: 12, color: colors.mutedDark, cursor: 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                }}
              >
                Choose file…
              </button>
            </div>
            <p style={{ fontSize: 10, color: colors.mutedDark, margin: 0, lineHeight: 1.5 }}>
              Image will be added as a draggable overlay. Resize and reposition on the slide.
            </p>
          </div>
        )}
      </div>

      {/* Insert Embed section */}
      <div style={{ borderTop: `1px solid ${colors.borderDark}`, padding: '14px 16px' }}>
        <button
          onClick={() => setShowEmbed(v => !v)}
          style={{
            width: '100%', background: 'transparent',
            border: `1px solid ${showEmbed ? colors.blue : colors.borderDark}`,
            borderRadius: 7, padding: '8px 14px',
            fontSize: 12, fontWeight: 600,
            color: showEmbed ? colors.blue : colors.mutedDark,
            cursor: 'pointer', textAlign: 'left',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span>⊕</span>
          {showEmbed ? 'Close embed' : 'Insert embed'}
        </button>

        {showEmbed && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <label style={fieldLabelStyle}>URL to embed</label>
              <input
                value={embedUrl}
                onChange={e => setEmbedUrl(e.target.value)}
                onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') insertEmbed() }}
                placeholder="YouTube, Figma, Loom, or any URL"
                style={fieldInputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
                onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
              />
            </div>

            {embedUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Badge variant="blue" size="sm">
                  {getEmbedLabel(detectEmbedType(embedUrl))}
                </Badge>
                <span style={{ fontSize: 10, color: colors.blue }}>detected</span>
              </div>
            )}

            <div>
              <label style={fieldLabelStyle}>Title (optional)</label>
              <input
                value={embedTitle}
                onChange={e => setEmbedTitle(e.target.value)}
                onKeyDown={e => e.stopPropagation()}
                placeholder="e.g. Disney Journey Map"
                style={fieldInputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = colors.blue)}
                onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
              />
            </div>

            <div style={{
              background: '#1a1a1e', borderRadius: 6,
              padding: '8px 10px',
              fontSize: 10, color: colors.mutedDark, lineHeight: 1.6,
            }}>
              Supported: YouTube · Figma · Loom · Typeform · Any URL
            </div>

            <button
              onClick={insertEmbed}
              disabled={!embedUrl.trim()}
              style={{
                background: embedUrl.trim() ? colors.blue : colors.inkSoft,
                border: 'none', borderRadius: 6, padding: '8px 14px',
                fontSize: 12, fontWeight: 600, color: '#FFFFFF',
                cursor: embedUrl.trim() ? 'pointer' : 'default',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                opacity: !embedUrl.trim() ? 0.4 : 1,
              }}
            >
              ⊕ Insert embed slide
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
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setShowChat(true)}
        >
          <span style={{ opacity: 0.8 }}>✦</span> AI Co-pilot
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onClick={onResetDiagrams}
        >
          Reset diagrams (R)
        </Button>
      </div>

      {/* Floating "Link this" badge — appears on text selection */}
      {textSelection && (
        <div style={{
          position: 'sticky',
          bottom: 0,
          left: 0, right: 0,
          background: colors.blue,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          zIndex: 40,
          borderTop: `1px solid rgba(255,255,255,0.1)`,
          borderRadius: '8px 8px 0 0',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.4)',
          animation: 'slideUpFade 0.18s ease',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.06em', marginBottom: 1,
            }}>
              SELECTED TEXT
            </div>
            <div style={{
              fontSize: 12, fontWeight: 600, color: '#FFFFFF',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              "{textSelection.text}"
            </div>
          </div>
          <button
            onMouseDown={e => {
              e.preventDefault()
              setNewLinkText(textSelection.text)
              setShowAddLink(true)
              clearTextSelection()
              setTimeout(() => {
                document.getElementById('inline-links-section')?.scrollIntoView({
                  behavior: 'smooth', block: 'nearest',
                })
                document.getElementById('link-url-input')?.focus()
              }, 80)
            }}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 6, padding: '5px 12px',
              fontSize: 12, fontWeight: 700, color: '#FFFFFF',
              cursor: 'pointer', flexShrink: 0,
              fontFamily: '"DM Sans", system-ui, sans-serif',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            🔗 Link this
          </button>
          {(['narrative', 'full-bleed', 'closing'] as const).includes(slide.type as 'narrative' | 'full-bleed' | 'closing') && (
            <button
              onMouseDown={e => {
                e.preventDefault()
                setNewHighlightText(textSelection.text)
                setNewHighlightColor('blue')
                setShowHighlightForm(true)
                clearTextSelection()
                setTimeout(() => {
                  document.getElementById('highlights-section')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                  document.getElementById('highlight-text-input')?.focus()
                }, 80)
              }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 6, padding: '5px 10px',
                fontSize: 12, fontWeight: 700, color: '#FFFFFF',
                cursor: 'pointer', flexShrink: 0,
                fontFamily: '"DM Sans", system-ui, sans-serif',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              🎨 Highlight
            </button>
          )}
          <button
            onMouseDown={e => { e.preventDefault(); clearTextSelection() }}
            style={{
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              fontSize: 14, lineHeight: 1, padding: '2px 4px', flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
    </>
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
