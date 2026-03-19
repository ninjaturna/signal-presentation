import { useState, useRef, useEffect } from 'react'
import { ToneEditor } from './ToneEditor'

interface EditableTextProps {
  value: string
  onSave: (next: string) => void
  editable: boolean
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span'
  style?: React.CSSProperties
  className?: string
  multiline?: boolean
  placeholder?: string
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
}: EditableTextProps) {
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(value)
  const [hovered, setHovered]   = useState(false)
  const [showTone, setShowTone] = useState(false)
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
    if (draft.trim() !== value) onSave(draft.trim() || value)
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

  return (
    <>
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Tag
          style={{
            ...style,
            cursor: 'text',
            borderRadius: 4,
            transition: 'background 0.1s, outline 0.1s',
            outline: hovered ? '1.5px solid rgba(30,90,242,0.3)' : '1.5px solid transparent',
            outlineOffset: 3,
            background: hovered ? 'rgba(30,90,242,0.04)' : 'transparent',
          }}
          className={className}
          onClick={() => setEditing(true)}
          title="Click to edit"
        >
          {value || <span style={{ opacity: 0.35 }}>{placeholder}</span>}
        </Tag>

        {hovered && !showTone && (
          <button
            onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setShowTone(true) }}
            style={{
              position: 'absolute',
              top: -22,
              left: 0,
              background: '#1a1a2e',
              border: '1px solid rgba(30,90,242,0.4)',
              borderRadius: 4,
              padding: '2px 7px',
              fontSize: 10,
              fontWeight: 700,
              color: 'rgba(30,90,242,0.9)',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            ✦ Rewrite
          </button>
        )}
      </div>

      {showTone && (
        <ToneEditor
          originalText={value}
          onAccept={rewritten => {
            onSave(rewritten)
            setShowTone(false)
          }}
          onClose={() => setShowTone(false)}
        />
      )}
    </>
  )
}
