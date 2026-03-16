import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { colors } from '../design-system'

const EXAMPLE_PROMPTS = [
  'Build a pitch deck for a healthcare AI startup targeting hospital CIOs',
  'Create a strategic brief for Disney on unifying guest data across parks and streaming',
  'Design a board presentation on AI readiness for a Fortune 500 retailer',
  'Make an executive summary deck for a fintech company expanding into Europe',
]

export function LandingPage() {
  const [prompt, setPrompt]     = useState('')
  const [dragging, setDragging] = useState(false)
  const [file, setFile]         = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  return (
    <div style={{
      minHeight: '100vh', background: colors.ink,
      fontFamily: '"DM Sans", system-ui, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center',
        padding: '20px 40px',
        borderBottom: `1px solid ${colors.borderDark}`,
      }}>
        <div style={{
          fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#FFFFFF',
        }}>
          SIGNAL
        </div>
        <div style={{ flex: 1 }} />
        <Link
          to="/view"
          style={{
            fontSize: 13, color: colors.mutedDark,
            textDecoration: 'none', marginRight: 24,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={e => (e.currentTarget.style.color = colors.mutedDark)}
        >
          View demo deck
        </Link>
        <Link
          to="/how"
          style={{
            fontSize: 13, fontWeight: 600, color: colors.blue,
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          How this was made →
        </Link>
      </nav>

      {/* Hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 680 }}>
          {/* Eyebrow */}
          <div style={{
            fontSize: 12, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: colors.blue,
            marginBottom: 20, textAlign: 'center',
          }}>
            SIGNAL · Strategic Presentation System
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 52, fontWeight: 600, lineHeight: 1.08,
            color: '#FFFFFF', textAlign: 'center', marginBottom: 16,
          }}>
            Turn a brief into a deck.
          </h1>
          <p style={{
            fontSize: 18, color: colors.mutedDark, lineHeight: 1.55,
            textAlign: 'center', marginBottom: 48, maxWidth: 520, margin: '0 auto 48px',
          }}>
            Describe your engagement. SIGNAL generates a structured brief, builds the slide architecture, and opens a live editor — AI co-pilot included.
          </p>

          {/* Input card */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              background: '#16161a',
              border: `1px solid ${dragging ? colors.blue : colors.borderDark}`,
              borderRadius: 14,
              padding: '20px 24px',
              transition: 'border-color 0.2s',
            }}
          >
            {/* Textarea */}
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe the engagement — client, industry, goal, audience…"
              rows={4}
              style={{
                width: '100%', background: 'transparent',
                border: 'none', outline: 'none', resize: 'none',
                fontSize: 15, color: '#FFFFFF', lineHeight: 1.6,
                fontFamily: '"DM Sans", system-ui, sans-serif',
                marginBottom: 16,
              }}
            />

            {/* File attachment */}
            {file ? (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: colors.inkSoft, borderRadius: 6,
                padding: '5px 12px', marginBottom: 16,
                fontSize: 12, color: colors.mutedDark,
              }}>
                <span>📎</span>
                <span>{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  style={{
                    background: 'none', border: 'none',
                    color: colors.mutedLight, cursor: 'pointer',
                    fontSize: 14, padding: 0, lineHeight: 1,
                  }}
                >×</button>
              </div>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    background: 'transparent',
                    border: `1px dashed ${colors.borderDark}`,
                    borderRadius: 6, padding: '6px 14px',
                    fontSize: 12, color: colors.mutedLight,
                    cursor: 'pointer',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = colors.blue)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = colors.borderDark)}
                >
                  + Attach context (PDF, notes)
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.txt,.md,.doc,.docx"
                  onChange={handleFile}
                  style={{ display: 'none' }}
                />
              </div>
            )}

            {/* Actions row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: colors.mutedLight }}>
                {dragging ? 'Drop file here' : 'Or drop a PDF / brief above'}
              </span>
              <Link
                to="/view"
                style={{
                  background: prompt.trim() ? colors.blue : colors.inkSoft,
                  border: 'none', borderRadius: 8,
                  padding: '10px 24px',
                  fontSize: 14, fontWeight: 600, color: '#FFFFFF',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'background 0.15s',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                }}
              >
                Build deck →
              </Link>
            </div>
          </div>

          {/* Example prompt chips */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, color: colors.mutedLight, marginBottom: 10, textAlign: 'center', letterSpacing: '0.04em' }}>
              EXAMPLES
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {EXAMPLE_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(p)}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${colors.borderDark}`,
                    borderRadius: 20, padding: '5px 14px',
                    fontSize: 12, color: colors.mutedDark,
                    cursor: 'pointer',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = colors.blue
                    e.currentTarget.style.color = '#FFFFFF'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = colors.borderDark
                    e.currentTarget.style.color = colors.mutedDark
                  }}
                >
                  {p.length > 55 ? p.slice(0, 52) + '…' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Mini deck preview */}
          <div style={{
            marginTop: 52, display: 'flex', justifyContent: 'center', gap: 8,
          }}>
            {[colors.blue, colors.inkSoft, colors.inkSoft, colors.inkSoft].map((bg, i) => (
              <div
                key={i}
                style={{
                  width: 48, height: 27,
                  background: bg,
                  borderRadius: 3,
                  border: `1px solid ${colors.borderDark}`,
                  opacity: i === 0 ? 1 : 0.5 + i * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '20px 40px',
        borderTop: `1px solid ${colors.borderDark}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 12, color: colors.mutedLight }}>
          Made by Tam Danier
        </span>
        <span style={{ fontSize: 11, color: colors.borderDark, letterSpacing: '0.08em' }}>
          SIGNAL · Demo prototype
        </span>
      </div>
    </div>
  )
}
