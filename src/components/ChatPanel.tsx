import { useState, useRef, useEffect } from 'react'
import { colors } from '../design-system'
import type { SlideData } from '../types/deck'

interface Message {
  role: 'user' | 'assistant'
  text: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface ChatPanelProps {
  slide: SlideData
  onUpdate: (patch: Partial<SlideData>) => void
  onInsertSlide?: (slide: SlideData) => number | undefined
  onNavigateToSlide?: (index: number) => void
  onClose?: () => void
}

const QUICK_ACTIONS = [
  'Make this more concise',
  'Strengthen the headline',
  'Add a supporting stat',
  'Sharpen the narrative',
]

export function ChatPanel({ slide, onUpdate, onInsertSlide, onNavigateToSlide, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (instruction: string) => {
    if (!instruction.trim() || loading) return
    const userMsg = instruction.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/edit-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction: userMsg, slide }),
      })
      const raw = await res.text()
      let data: { error?: string; patch?: Partial<SlideData>; message?: string; action?: string; slide?: SlideData }
      try {
        const cleaned = raw
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim()
        data = JSON.parse(cleaned)
      } catch {
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: 'Parse error — Claude returned unexpected format. Try again.',
        }])
        setLoading(false)
        return
      }
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${data.error}` }])
        return
      }
      if (data.action === 'insert' && data.slide && onInsertSlide) {
        const newSlide: SlideData = {
          ...data.slide,
          id: `ai-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 6)}`,
        }
        const insertedIndex = onInsertSlide(newSlide)
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: data.message ?? 'New slide created.',
          action: insertedIndex !== undefined ? {
            label: `→ Go to slide ${insertedIndex + 1}`,
            onClick: () => onNavigateToSlide?.(insertedIndex),
          } : undefined,
        }])
      } else {
        if (data.patch) onUpdate(data.patch)
        setMessages(prev => [...prev, { role: 'assistant', text: data.message ?? 'Done.' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Request failed — check API key.' }])
    } finally {
      setLoading(false)
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div style={{
      width: 300, flexShrink: 0,
      background: '#16161a',
      borderLeft: `1px solid ${colors.borderDark}`,
      display: 'flex', flexDirection: 'column',
      height: '100%',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${colors.borderDark}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 11, color: colors.blue, fontWeight: 700, letterSpacing: '0.08em' }}>✦</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>AI Co-pilot</span>
        <span style={{
          marginLeft: 'auto', fontSize: 10, fontWeight: 600,
          color: colors.mutedLight, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {slide.type}
        </span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              fontSize: 16, color: colors.mutedDark, cursor: 'pointer',
              lineHeight: 1, padding: '4px 6px',
              fontFamily: 'system-ui', marginLeft: 4,
            }}
            title="Close co-pilot"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick actions */}
      {messages.length === 0 && (
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ fontSize: 11, color: colors.mutedLight, marginBottom: 10, letterSpacing: '0.04em' }}>
            QUICK ACTIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {QUICK_ACTIONS.map(action => (
              <button
                key={action}
                onClick={() => send(action)}
                disabled={loading}
                style={{
                  background: 'transparent',
                  border: `1px solid ${colors.borderDark}`,
                  borderRadius: 6, padding: '7px 12px',
                  fontSize: 12, color: colors.mutedDark,
                  cursor: loading ? 'default' : 'pointer',
                  textAlign: 'left',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = colors.blue;
                    (e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF'
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = colors.borderDark;
                  (e.currentTarget as HTMLButtonElement).style.color = colors.mutedDark
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message thread */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 6,
          }}>
            <div style={{
              maxWidth: '90%',
              background: msg.role === 'user' ? colors.blue : colors.inkSoft,
              borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
              padding: '8px 12px',
              fontSize: 13, lineHeight: 1.5,
              color: msg.role === 'user' ? '#FFFFFF' : colors.mutedDark,
            }}>
              {msg.text}
            </div>
            {msg.action && (
              <button
                onClick={msg.action.onClick}
                style={{
                  alignSelf: 'flex-start',
                  background: 'transparent',
                  border: `1px solid ${colors.blue}`,
                  borderRadius: 6,
                  padding: '5px 12px',
                  fontSize: 12, fontWeight: 600,
                  color: colors.blue,
                  cursor: 'pointer',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  transition: 'background 0.12s',
                  marginLeft: 4,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,90,242,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                {msg.action.label}
              </button>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              background: colors.inkSoft, borderRadius: '10px 10px 10px 2px',
              padding: '8px 14px', fontSize: 18, color: colors.mutedLight,
              letterSpacing: 3,
            }}>
              •••
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        borderTop: `1px solid ${colors.borderDark}`,
      }}>
        <div style={{
          background: colors.inkSoft,
          border: `1px solid ${colors.borderDark}`,
          borderRadius: 8,
          padding: '8px 12px',
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Edit this slide… (Enter to send)"
            rows={2}
            disabled={loading}
            style={{
              width: '100%', background: 'transparent',
              border: 'none', outline: 'none', resize: 'none',
              fontSize: 13, color: '#FFFFFF', lineHeight: 1.5,
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: colors.mutedLight }}>Shift+Enter for new line</span>
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? colors.borderDark : colors.blue,
                border: 'none', borderRadius: 5,
                padding: '4px 10px',
                fontSize: 12, fontWeight: 600, color: '#FFFFFF',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                transition: 'background 0.15s',
              }}
            >
              {loading ? '…' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
