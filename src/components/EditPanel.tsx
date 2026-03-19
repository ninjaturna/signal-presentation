import { useState } from 'react'
import { colors } from '../design-system'
import { ChatPanel } from './ChatPanel'
import type { SlideData } from '../types/deck'

interface EditPanelProps {
  slide: SlideData
  onUpdate: (patch: Partial<SlideData>) => void
  onClose: () => void
  onResetDiagrams: () => void
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

export function EditPanel({ slide, onUpdate, onClose, onResetDiagrams }: EditPanelProps) {
  const [showChat, setShowChat] = useState(false)
  const fields = EDITABLE_FIELDS[slide.type] ?? []

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
