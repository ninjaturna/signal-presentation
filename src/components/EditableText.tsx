import { useState, useRef, useEffect } from 'react'

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
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(value)
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
    e.stopPropagation() // prevent slide nav
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
    <Tag
      style={{
        ...style,
        cursor: 'text',
        borderRadius: 4,
        transition: 'background 0.1s, outline 0.1s',
        outline: '1.5px solid transparent',
        outlineOffset: 3,
      }}
      className={className}
      onClick={() => setEditing(true)}
      title="Click to edit"
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.outline = '1.5px solid rgba(30,90,242,0.3)'
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(30,90,242,0.04)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.outline = '1.5px solid transparent'
        ;(e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      {value || <span style={{ opacity: 0.35 }}>{placeholder}</span>}
    </Tag>
  )
}
