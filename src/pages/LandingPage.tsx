import { useState, useRef } from 'react'
import { colors } from '../design-system'
import { parseContentDoc } from '../utils/parseContentDoc'
import type { ParsedContentDoc } from '../utils/parseContentDoc'
import type { SlideData } from '../types/deck'
import { deckStore } from '../utils/deckStore'

interface LandingPageProps {
  onViewDemo: () => void
  onHowItsMade: () => void
  onDeckGenerated: (slides: SlideData[], title: string) => void
}

type UploadState = 'idle' | 'parsed' | 'generating' | 'error'

export function LandingPage({ onViewDemo, onHowItsMade, onDeckGenerated }: LandingPageProps) {
  const [file, setFile]               = useState<File | null>(null)
  const [parsedDoc, setParsedDoc]     = useState<ParsedContentDoc | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMsg, setErrorMsg]       = useState('')
  const [dragging, setDragging]       = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (f: File) => {
    if (!f.name.endsWith('.md') && !f.name.endsWith('.txt')) {
      setErrorMsg('Please upload a .md or .txt file')
      setUploadState('error')
      return
    }
    setFile(f)
    setErrorMsg('')
    try {
      const text = await f.text()
      const doc = parseContentDoc(text)
      if (doc.slides.length === 0) {
        setErrorMsg('No slides found. Make sure your doc uses the SIGNAL template format (### SLIDE 1 | TITLE).')
        setUploadState('error')
        return
      }
      setParsedDoc(doc)
      setUploadState('parsed')
    } catch {
      setErrorMsg('Could not parse file. Download the template and check your formatting.')
      setUploadState('error')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const generateDeck = async () => {
    if (!parsedDoc) return
    setUploadState('generating')
    setErrorMsg('')
    try {
      const res  = await fetch('/api/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedDoc),
      })
      const text = await res.text()
      let data: { error?: string; slides?: unknown[]; meta?: { documentTitle?: string; clientName?: string } }
      try {
        data = JSON.parse(text)
      } catch {
        // Vercel returned an HTML error page — surface it directly
        setErrorMsg(`API error ${res.status}: ${text.slice(0, 200)}`)
        setUploadState('error')
        return
      }
      if (data.error) { setErrorMsg(data.error); setUploadState('error'); return }
      const title      = data.meta?.documentTitle ?? parsedDoc.documentTitle
      const clientName = data.meta?.clientName    ?? parsedDoc.clientName
      deckStore.add({ title, clientName, slideCount: data.slides!.length, slides: data.slides as never })
      onDeckGenerated(data.slides as never, title)
    } catch (err) {
      setErrorMsg(`Generation failed: ${err instanceof Error ? err.message : String(err)}`)
      setUploadState('error')
    }
  }

  const reset = () => {
    setFile(null)
    setParsedDoc(null)
    setUploadState('idle')
    setErrorMsg('')
  }

  return (
    <div style={{
      minHeight: '100vh', background: colors.ink,
      display: 'flex', flexDirection: 'column',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      color: '#FFFFFF',
    }}>
      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: colors.blue }}>
          SIGNAL
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button
            onClick={onViewDemo}
            style={{ background: 'transparent', border: 'none', fontSize: 13, color: '#666', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Demo deck
          </button>
          <button
            onClick={onHowItsMade}
            style={{ background: 'transparent', border: '1px solid #222', borderRadius: 6, padding: '6px 14px', fontSize: 13, color: '#666', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            How this was made →
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 80px', textAlign: 'center' }}>

        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: colors.blue, marginBottom: 20 }}>
          Strategic presentation system
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 600, lineHeight: 1.1, color: '#FFFFFF', marginBottom: 14, maxWidth: 600 }}>
          Upload your content doc.<br />
          <span style={{ color: colors.blue }}>Get a branded deck.</span>
        </h1>

        <p style={{ fontSize: 15, color: colors.mutedDark, lineHeight: 1.6, maxWidth: 460, marginBottom: 40 }}>
          Fill in the SIGNAL content doc template with your slide content — heading, subheading, body, footer.
          SIGNAL builds the presentation.
        </p>

        {/* Upload card */}
        <div
          style={{
            width: '100%', maxWidth: 600,
            background: '#16161a',
            border: `1px solid ${dragging ? colors.blue : uploadState === 'parsed' ? '#1D9E75' : '#2a2a2e'}`,
            borderRadius: 16, overflow: 'hidden',
            transition: 'border-color 0.15s',
          }}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {/* idle */}
          {uploadState === 'idle' && (
            <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#111', border: '1px solid #2a2a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={colors.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>
                  Upload your content doc
                </p>
                <p style={{ fontSize: 13, color: '#555' }}>
                  Accepted formats: <span style={{ color: '#888' }}>.md · .txt</span>
                </p>
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                style={{ background: colors.blue, border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Choose file
              </button>
              <p style={{ fontSize: 12, color: '#333' }}>or drag and drop</p>
              <input
                ref={fileRef}
                type="file"
                accept=".md,.txt"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
            </div>
          )}

          {/* parsed */}
          {uploadState === 'parsed' && parsedDoc && (
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(29,158,117,0.15)', border: '1px solid rgba(29,158,117,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 2 }}>
                    {file?.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#555' }}>
                    {parsedDoc.documentTitle}
                  </div>
                </div>
                <button
                  onClick={reset}
                  style={{ background: 'transparent', border: 'none', color: '#444', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>

              {/* Slide breakdown */}
              <div style={{ background: '#111', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Detected — {parsedDoc.slides.length} slides
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {parsedDoc.slides.slice(0, 6).map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, background: '#1a1a1e', border: '1px solid #2a2a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 9, fontWeight: 600, color: '#555' }}>{s.number}</span>
                      </div>
                      <span style={{ fontSize: 12, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.title}
                      </span>
                    </div>
                  ))}
                  {parsedDoc.slides.length > 6 && (
                    <div style={{ fontSize: 11, color: '#444', paddingLeft: 30 }}>
                      + {parsedDoc.slides.length - 6} more slides
                    </div>
                  )}
                </div>
              </div>

              {parsedDoc.summary && (
                <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6, marginBottom: 20 }}>
                  {parsedDoc.summary.slice(0, 180)}{parsedDoc.summary.length > 180 ? '…' : ''}
                </p>
              )}

              <button
                onClick={generateDeck}
                style={{ width: '100%', background: colors.blue, border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Generate deck →
              </button>
            </div>
          )}

          {/* generating */}
          {uploadState === 'generating' && (
            <div style={{ padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${colors.blue}`, borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>Building your deck…</div>
              <div style={{ fontSize: 12, color: '#555' }}>Claude is reading your content and designing the slides</div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* error */}
          {uploadState === 'error' && (
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 13, color: colors.red, textAlign: 'center', lineHeight: 1.5 }}>
                {errorMsg}
              </div>
              <button
                onClick={reset}
                style={{ background: 'transparent', border: '1px solid #333', borderRadius: 6, padding: '6px 16px', fontSize: 12, color: '#666', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Try again
              </button>
            </div>
          )}
        </div>

        {/* Template download */}
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: '#444' }}>Don't have a content doc?</span>
          <a
            href="/signal-content-doc-template.md"
            download="signal-content-doc-template.md"
            style={{ fontSize: 13, fontWeight: 600, color: colors.blue, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke={colors.blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download template (.md)
          </a>
        </div>
        <p style={{ fontSize: 11, color: '#333', marginTop: 6 }}>
          Fill in your slide content, save as .md, and upload above
        </p>

        {/* Demo deck card */}
        <div style={{
          marginTop: 48, width: '100%', maxWidth: 600,
          background: '#16161a', border: '1px solid #1e1e24',
          borderRadius: 12, padding: '18px 20px',
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <div style={{
            width: 100, height: 56, background: colors.ink,
            borderRadius: 6, flexShrink: 0,
            border: '1px solid #333', position: 'relative',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: 7, overflow: 'hidden',
          }}>
            <div style={{ width: 3, height: '100%', background: colors.blue, position: 'absolute', left: 0, top: 0 }} />
            <div style={{ fontSize: 5, fontWeight: 600, color: colors.blue, marginBottom: 2, paddingLeft: 5 }}>TE CONNECTIVITY</div>
            <div style={{ fontSize: 6, fontWeight: 600, color: '#FFF', lineHeight: 1.2, paddingLeft: 5 }}>500,000 SKUs. One Sales Conversation.</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', marginBottom: 3 }}>
              See an example — TE Connectivity pitch deck
            </div>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 10 }}>
              11 slides · Built from a content doc · Launch by NTT DATA
            </div>
            <button
              onClick={onViewDemo}
              style={{ background: 'transparent', border: '1px solid #333', borderRadius: 6, padding: '5px 12px', fontSize: 12, color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              View demo deck →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px 24px', borderTop: '1px solid #111', fontSize: 12, color: '#333' }}>
        Made by Tam Danier
      </div>
    </div>
  )
}
