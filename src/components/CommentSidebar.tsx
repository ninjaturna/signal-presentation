import { useState, useEffect } from 'react'
import { colors } from '../design-system'

interface Comment {
  id: string
  text: string
  createdAt: number
}

interface CommentSidebarProps {
  deckKey: string
  slideIndex: number
}

function storageKey(deckKey: string, slideIndex: number) {
  return `signal_comments_${deckKey}_${slideIndex}`
}

function loadComments(deckKey: string, slideIndex: number): Comment[] {
  try {
    const raw = localStorage.getItem(storageKey(deckKey, slideIndex))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveComments(deckKey: string, slideIndex: number, comments: Comment[]) {
  localStorage.setItem(storageKey(deckKey, slideIndex), JSON.stringify(comments))
}

export function CommentSidebar({ deckKey, slideIndex }: CommentSidebarProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [draft, setDraft]       = useState('')

  // Reload comments when slide changes
  useEffect(() => {
    setComments(loadComments(deckKey, slideIndex))
  }, [deckKey, slideIndex])

  const submit = () => {
    if (!draft.trim()) return
    const next: Comment[] = [
      ...comments,
      { id: crypto.randomUUID(), text: draft.trim(), createdAt: Date.now() },
    ]
    setComments(next)
    saveComments(deckKey, slideIndex, next)
    setDraft('')
  }

  const remove = (id: string) => {
    const next = comments.filter(c => c.id !== id)
    setComments(next)
    saveComments(deckKey, slideIndex, next)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
    e.stopPropagation()
  }

  return (
    <div style={{
      width: 280, flexShrink: 0,
      background: '#111113',
      borderLeft: `1px solid ${colors.borderDark}`,
      display: 'flex', flexDirection: 'column',
      height: '100%',
      fontFamily: '"DM Sans", system-ui, sans-serif',
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
          color: '#FFCC2D', textTransform: 'uppercase', flex: 1,
        }}>
          Comments
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, color: colors.mutedLight,
          background: colors.inkSoft, borderRadius: 4,
          padding: '2px 7px', letterSpacing: '0.04em',
        }}>
          Slide {slideIndex + 1}
        </span>
      </div>

      {/* Comment list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {comments.length === 0 && (
          <p style={{ fontSize: 12, color: colors.mutedDark, lineHeight: 1.5 }}>
            No comments yet. Add one below.
          </p>
        )}
        {comments.map(c => (
          <div key={c.id} style={{
            background: '#1a1a1e',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 8, padding: '10px 12px',
            position: 'relative',
          }}>
            <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.5, margin: 0 }}>{c.text}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              <span style={{ fontSize: 10, color: colors.mutedDark }}>
                {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <button
                onClick={() => remove(c.id)}
                style={{
                  background: 'none', border: 'none', fontSize: 12,
                  color: '#333', cursor: 'pointer', padding: '0 2px',
                  fontFamily: 'system-ui',
                }}
                title="Delete comment"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.borderDark}` }}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a comment… (Enter to submit)"
          rows={3}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#1a1a1e',
            border: `1px solid ${colors.borderDark}`,
            borderRadius: 6, padding: '8px 10px',
            fontSize: 13, color: '#FFFFFF', lineHeight: 1.5,
            fontFamily: '"DM Sans", system-ui, sans-serif',
            outline: 'none', resize: 'none',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#FFCC2D')}
          onBlur={e => (e.currentTarget.style.borderColor = colors.borderDark)}
        />
        <button
          onClick={submit}
          disabled={!draft.trim()}
          style={{
            marginTop: 8, width: '100%',
            background: draft.trim() ? '#FFCC2D' : colors.inkSoft,
            border: 'none', borderRadius: 6, padding: '8px 0',
            fontSize: 12, fontWeight: 700,
            color: draft.trim() ? '#111113' : colors.mutedDark,
            cursor: draft.trim() ? 'pointer' : 'default',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            transition: 'all 0.15s',
          }}
        >
          Add comment
        </button>
      </div>
    </div>
  )
}
