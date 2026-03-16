import { useState, useRef, useEffect } from 'react'
import { colors } from '../design-system'
import type { SlideData } from '../types/deck'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

interface ChatPanelProps {
  slide: SlideData
  onUpdate: (patch: Partial<SlideData>) => void
}

const QUICK_ACTIONS = [
  'Make this more concise',
  'Strengthen the headline',
  'Add a supporting stat',
  'Sharpen the narrative',
]

export function ChatPanel({ slide, onUpdate }: ChatPanelProps) {
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
      const data = await res.json()
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${data.error}` }])
        return
      }
      if (data.patch) onUpdate(data.patch)
      setMessages(prev => [...prev, { role: 'assistant', text: data.message ?? 'Done.' }])
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
