import { useState, useRef, useEffect } from 'react'
import { colors } from '../design-system'
import { HighlightText } from './HighlightText'
import type { TextHighlight } from '../types/deck'

interface EditableTextProps {
  value: string
  onSave: (next: string) => void
  editable: boolean
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span'
  style?: React.CSSProperties
  className?: string
  multiline?: boolean
  placeholder?: string
  highlights?: TextHighlight[]
}

export function EditableText({
  value,
  onSave,
  editable,
  as: Tag = 'div',
  style = {},
  className,
  multiline = false,
  placeholder = 'Click to edit',
  highlights,
}: EditableTextProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(value)
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  useEffect(() => { setDraft(value) }, [value])

  useEffect(() => {
    if (editing) {
      ref.current?.focus()
      const el = ref.current as HTMLInputElement
      el?.setSelectionRange(el.value.length, el.value.length)
    }
  }, [editing])

  const commit = () => {
    setEditing(false)
    if (draft.trim() !== value) {
      onSave(draft.trim() || value)
    }
  }

  const cancel = () => {
    setEditing(false)
    setDraft(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') cancel()
    e.stopPropagation()
  }

  const handleDiagramClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.dispatchEvent(new CustomEvent('signal:diagram-request', { detail: { text: value } }))
  }

  const handleRewriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.dispatchEvent(new CustomEvent('signal:rewrite-request', { detail: { text: value } }))
  }

  if (!editable) {
    return <Tag style={style} className={className}>{value}</Tag>
  }

  if (editing) {
    const inputStyle: React.CSSProperties = {
      ...style,
      background: 'rgba(30,90,242,0.06)',
      border: '1.5px solid rgba(30,90,242,0.4)',
      borderRadius: 4,
      outline: 'none',
      resize: 'none',
      width: '100%',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      padding: '2px 6px',
      cursor: 'text',
    }

    return multiline ? (
      <textarea
        ref={ref as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        rows={3}
        style={inputStyle}
      />
    ) : (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        style={inputStyle}
      />
    )
  }

  const showDiagramBadge = hovered && value.length > 30

  return (
    <div
      style={{ position: 'relative', display: 'inline-block', width: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Tag
        style={{
          ...style,
          cursor: 'text',
          borderRadius: 4,
          transition: 'outline 0.1s',
          outline: hovered ? '1.5px solid rgba(30,90,242,0.35)' : '1.5px solid transparent',
          background: hovered ? 'rgba(30,90,242,0.04)' : 'transparent',
          outlineOffset: 3,
          display: 'block',
        }}
        className={className}
        onClick={() => setEditing(true)}
        title="Click to edit"
      >
        {highlights?.length
          ? <HighlightText text={value} highlights={highlights} />
          : (value || <span style={{ opacity: 0.35 }}>{placeholder}</span>)
        }
      </Tag>

      {/* Badge row — visible on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', top: -20, right: 0,
          display: 'flex', gap: 4,
          pointerEvents: 'none',
        }}>
          {/* EDIT badge */}
          <div
            onClick={() => setEditing(true)}
            style={badgeStyle('#1E5AF2', true)}
          >
            EDIT
          </div>

          {/* Rewrite badge */}
          <div
            onClick={handleRewriteClick}
            style={badgeStyle('rewrite', true)}
          >
            ✦ Rewrite
          </div>

          {/* Diagram badge — only for longer text */}
          {showDiagramBadge && (
            <div
              onClick={handleDiagramClick}
              style={badgeStyle(colors.mutedDark, true)}
            >
              ◈ Diagram
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function badgeStyle(bg: string, clickable: boolean): React.CSSProperties {
  let background = 'rgba(119,112,111,0.85)'
  if (bg === '#1E5AF2') background = 'rgba(30,90,242,0.9)'
  else if (bg === 'rewrite') background = 'rgba(140,80,220,0.88)'
  return {
    background,
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.06em',
    padding: '2px 6px',
    borderRadius: 3,
    cursor: clickable ? 'pointer' : 'default',
    pointerEvents: clickable ? 'auto' : 'none',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    whiteSpace: 'nowrap',
    zIndex: 10,
    userSelect: 'none',
  }
}
