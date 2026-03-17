import { useState, useRef } from 'react'
import type { TextStyleName, CanvasElement, TextElement } from '../types'
import { TEXT_STYLES } from '../utils'
import { colors } from '../../../design-system'

const STYLE_LABELS: Record<TextStyleName, string> = {
  headline:   'Headline — 44px, 600',
  subheading: 'Subheading — 24px, 600',
  body:       'Body — 16px, 400',
  caption:    'Caption — 12px, 400',
  eyebrow:    'EYEBROW — 13px, 600',
  stat:       'Stat — 56px, 600',
  pullquote:  'Pullquote — 20px italic',
}

const BRAND_COLORS = [
  { label: 'Ink',     value: '#111113' },
  { label: 'White',   value: '#FFFFFF' },
  { label: 'Blue',    value: colors.blue },
  { label: 'Gold',    value: colors.gold },
  { label: 'Muted',   value: colors.mutedDark },
]

interface TopBarProps {
  selectedElement: CanvasElement | null
  canUndo: boolean
  canRedo: boolean
  presenting: boolean
  onAddText: (styleName: TextStyleName) => void
  onAddEmbed: (url: string) => void
  onUpdateSelected: (patch: Partial<CanvasElement>) => void
  onUndo: () => void
  onRedo: () => void
  onTogglePresent: () => void
  onAddSlide: () => void
}

export function TopBar({
  selectedElement,
  canUndo,
  canRedo,
  presenting,
  onAddText,
  onAddEmbed,
  onUpdateSelected,
  onUndo,
  onRedo,
  onTogglePresent,
  onAddSlide,
}: TopBarProps) {
  const [showTextMenu, setShowTextMenu] = useState(false)
  const [embedUrl, setEmbedUrl] = useState('')
  const [showEmbedInput, setShowEmbedInput] = useState(false)
  const embedInputRef = useRef<HTMLInputElement>(null)

  const selectedText = selectedElement?.type === 'text' ? selectedElement as TextElement : null

  const handleAddEmbed = () => {
    const trimmed = embedUrl.trim()
    if (!trimmed) return
    onAddEmbed(trimmed)
    setEmbedUrl('')
    setShowEmbedInput(false)
  }

  return (
    <div style={{
      height: 48,
      flexShrink: 0,
      background: '#111113',
      borderBottom: `1px solid ${colors.borderDark}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 8,
      fontFamily: '"DM Sans", system-ui, sans-serif',
      position: 'relative',
      zIndex: 50,
    }}>
      {/* Brand */}
      <span style={{ fontSize: 11, fontWeight: 700, color: colors.blue, letterSpacing: '0.08em', marginRight: 8 }}>
        SIGNAL
      </span>

      <div style={{ width: 1, height: 20, background: colors.borderDark }} />

      {/* +Text dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setShowTextMenu(v => !v); setShowEmbedInput(false) }}
          style={btnStyle(showTextMenu)}
        >
          + Text ▾
        </button>

        {showTextMenu && (
          <div style={{
            position: 'absolute',
            top: 36,
            left: 0,
            background: '#1a1a1e',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 8,
            padding: 4,
            width: 260,
            zIndex: 100,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}>
            {(Object.keys(TEXT_STYLES) as TextStyleName[]).map(name => {
              const def = TEXT_STYLES[name]
              return (
                <button
                  key={name}
                  onClick={() => { onAddText(name); setShowTextMenu(false) }}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 8,
                    width: '100%',
                    padding: '8px 10px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 5,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = colors.inkSoft)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{
                    fontSize: Math.min(def.fontSize * 0.45, 20),
                    fontWeight: def.fontWeight,
                    fontStyle: def.fontStyle,
                    textTransform: def.textTransform as React.CSSProperties['textTransform'],
                    letterSpacing: def.letterSpacing,
                    color: '#fff',
                    flexShrink: 0,
                    width: 90,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                    {name === 'eyebrow' ? name.toUpperCase() : name.charAt(0).toUpperCase() + name.slice(1)}
                  </span>
                  <span style={{ fontSize: 10, color: colors.mutedDark }}>
                    {def.fontSize}px · {def.fontWeight}
                    {def.fontStyle === 'italic' ? ' · italic' : ''}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ⊞ Embed */}
      <div style={{ position: 'relative' }}>
        {showEmbedInput ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#1a1a1c',
              border: `1px solid ${colors.blue}`,
              borderRadius: 6,
              padding: '4px 10px',
              gap: 6,
            }}>
              <span style={{ fontSize: 10, color: colors.blue, fontWeight: 600, whiteSpace: 'nowrap' }}>URL</span>
              <input
                ref={embedInputRef}
                autoFocus
                value={embedUrl}
                onChange={e => setEmbedUrl(e.target.value)}
                onKeyDown={e => {
                  e.stopPropagation()
                  if (e.key === 'Enter') handleAddEmbed()
                  if (e.key === 'Escape') { setShowEmbedInput(false); setEmbedUrl('') }
                }}
                placeholder="YouTube, Figma, image URL..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 12,
                  color: '#fff',
                  width: 220,
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                }}
              />
            </div>
            <button
              onClick={handleAddEmbed}
              disabled={!embedUrl.trim()}
              style={{
                ...btnStyle(false),
                background: colors.blue,
                borderColor: colors.blue,
                color: '#fff',
                opacity: embedUrl.trim() ? 1 : 0.4,
              }}
            >
              Add →
            </button>
            <button
              onClick={() => { setShowEmbedInput(false); setEmbedUrl('') }}
              style={{ ...btnStyle(false), color: colors.mutedDark }}
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setShowEmbedInput(true); setShowTextMenu(false) }}
            style={btnStyle(false)}
          >
            ⊞ Embed
          </button>
        )}
      </div>

      <div style={{ width: 1, height: 20, background: colors.borderDark }} />

      {/* Style picker — only when text element selected */}
      {selectedText && (
        <>
          <select
            value={selectedText.styleName}
            onChange={e => onUpdateSelected({ styleName: e.target.value as TextStyleName } as Partial<CanvasElement>)}
            style={{
              background: colors.inkSoft,
              border: `1px solid ${colors.borderDark}`,
              borderRadius: 5,
              padding: '4px 8px',
              fontSize: 12,
              color: '#fff',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              cursor: 'pointer',
            }}
          >
            {(Object.keys(TEXT_STYLES) as TextStyleName[]).map(name => (
              <option key={name} value={name}>{STYLE_LABELS[name]}</option>
            ))}
          </select>

          {/* Brand color swatches */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {BRAND_COLORS.map(c => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => onUpdateSelected({ color: c.value } as Partial<CanvasElement>)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: c.value,
                  border: selectedText.color === c.value
                    ? `2px solid ${colors.blue}`
                    : `1.5px solid ${colors.borderDark}`,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'border 0.1s',
                }}
              />
            ))}
            {/* Custom color */}
            <label title="Custom color" style={{ cursor: 'pointer', position: 'relative', width: 20, height: 20 }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'conic-gradient(red, yellow, green, cyan, blue, magenta, red)',
                border: `1.5px solid ${colors.borderDark}`,
              }} />
              <input
                type="color"
                value={selectedText.color ?? '#111113'}
                onChange={e => onUpdateSelected({ color: e.target.value } as Partial<CanvasElement>)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </label>
          </div>

          <div style={{ width: 1, height: 20, background: colors.borderDark }} />
        </>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Add slide */}
      <button onClick={onAddSlide} style={btnStyle(false)}>
        + Slide
      </button>

      <div style={{ width: 1, height: 20, background: colors.borderDark }} />

      {/* Undo / Redo */}
      <button onClick={onUndo} disabled={!canUndo} style={{ ...btnStyle(false), opacity: canUndo ? 1 : 0.3 }}>
        ↩ Undo
      </button>
      <button onClick={onRedo} disabled={!canRedo} style={{ ...btnStyle(false), opacity: canRedo ? 1 : 0.3 }}>
        Redo ↪
      </button>

      <div style={{ width: 1, height: 20, background: colors.borderDark }} />

      {/* Present */}
      <button
        onClick={onTogglePresent}
        style={{
          ...btnStyle(presenting),
          background: presenting ? colors.blue : 'transparent',
          borderColor: presenting ? colors.blue : colors.borderDark,
          color: presenting ? '#fff' : colors.mutedDark,
        }}
      >
        {presenting ? '✕ Exit' : '▶ Present'}
      </button>
    </div>
  )
}

function btnStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? colors.inkSoft : 'transparent',
    border: `1px solid ${active ? colors.borderDark : colors.borderDark}`,
    borderRadius: 5,
    padding: '4px 10px',
    fontSize: 12,
    fontWeight: 600,
    color: active ? '#fff' : colors.mutedDark,
    cursor: 'pointer',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    transition: 'all 0.12s',
    whiteSpace: 'nowrap' as const,
  }
}
