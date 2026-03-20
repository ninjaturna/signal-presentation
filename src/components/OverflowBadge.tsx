import { useRef, useState } from 'react'
import { useOverflowDetect } from '../hooks/useOverflowDetect'
import { colors } from '../design-system'
import type { SlideData } from '../types/deck'

interface OverflowBadgeProps {
  slide: SlideData
  editable: boolean
  onUpdate?: (patch: Partial<SlideData>) => void
  children: React.ReactNode
}

export function OverflowBadge({ slide, editable, onUpdate, children }: OverflowBadgeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isOverflowing = useOverflowDetect(containerRef)
  const [trimming, setTrimming]   = useState(false)
  const [showDiff, setShowDiff]   = useState(false)
  const [trimResult, setTrimResult] = useState<{
    original: Record<string, string>
    trimmed:  Record<string, string>
  } | null>(null)

  const handleTrim = async () => {
    setTrimming(true)
    try {
      const res = await fetch('/api/edit-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: 'The text on this slide is overflowing the slide boundaries. Shorten the headline, body, and any other text fields to fit — reduce by about 30%. Preserve the key message. Return only the fields that need shortening.',
          slide,
        }),
      })
      const raw = await res.text()
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
      const data = JSON.parse(cleaned)

      if (data.patch) {
        const original: Record<string, string> = {}
        const trimmed:  Record<string, string> = {}
        Object.keys(data.patch).forEach(key => {
          const k = key as keyof SlideData
          if (slide[k] && typeof slide[k] === 'string') {
            original[key] = slide[k] as string
          }
          trimmed[key] = data.patch[key]
        })
        setTrimResult({ original, trimmed })
        setShowDiff(true)
      }
    } catch (err) {
      console.error('AI Trim failed:', err)
    } finally {
      setTrimming(false)
    }
  }

  const acceptTrim = () => {
    if (trimResult) onUpdate?.(trimResult.trimmed as Partial<SlideData>)
    setShowDiff(false)
    setTrimResult(null)
  }

  const rejectTrim = () => {
    setShowDiff(false)
    setTrimResult(null)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {children}

      {/* Overflow badge — edit mode only */}
      {editable && isOverflowing && !showDiff && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,180,0,0.12)',
          border: '1px solid rgba(255,180,0,0.4)',
          borderRadius: 7, padding: '5px 10px',
          zIndex: 20,
          fontFamily: '"DM Sans", system-ui, sans-serif',
        }}>
          <span style={{ fontSize: 12 }}>⚠</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,180,0,0.9)' }}>
            Text overflow
          </span>
          <button
            onClick={handleTrim}
            disabled={trimming}
            style={{
              background: trimming ? 'rgba(255,180,0,0.1)' : 'rgba(255,180,0,0.2)',
              border: '1px solid rgba(255,180,0,0.4)',
              borderRadius: 4, padding: '2px 8px',
              fontSize: 10, fontWeight: 700,
              color: 'rgba(255,180,0,0.9)',
              cursor: trimming ? 'default' : 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            {trimming ? 'Trimming…' : '✦ AI Trim'}
          </button>
        </div>
      )}

      {/* Diff review panel */}
      {showDiff && trimResult && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10,10,12,0.88)',
          backdropFilter: 'blur(4px)',
          zIndex: 30,
          display: 'flex', flexDirection: 'column',
          padding: 24, gap: 16,
          fontFamily: '"DM Sans", system-ui, sans-serif',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 700, color: colors.gold,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            ✦ AI Trim — Review changes
          </div>

          <div style={{
            flex: 1, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {Object.keys(trimResult.trimmed).map(key => (
              <div key={key} style={{
                background: '#1a1a1e',
                border: `1px solid ${colors.borderDark}`,
                borderRadius: 8, overflow: 'hidden',
              }}>
                <div style={{
                  padding: '6px 12px',
                  fontSize: 9, fontWeight: 700, color: colors.mutedDark,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  borderBottom: `1px solid ${colors.borderDark}`,
                }}>
                  {key}
                </div>
                {trimResult.original[key] && (
                  <div style={{
                    padding: '8px 12px',
                    fontSize: 12, color: 'rgba(255,80,80,0.7)',
                    lineHeight: 1.5,
                    borderBottom: `1px solid ${colors.borderDark}`,
                    textDecoration: 'line-through',
                    opacity: 0.8,
                  }}>
                    {trimResult.original[key]}
                  </div>
                )}
                <div style={{
                  padding: '8px 12px',
                  fontSize: 12, color: 'rgba(80,220,120,0.9)',
                  lineHeight: 1.5,
                }}>
                  {trimResult.trimmed[key]}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={acceptTrim}
              style={{
                flex: 1, background: '#1D9E75', border: 'none',
                borderRadius: 8, padding: '10px',
                fontSize: 13, fontWeight: 700, color: '#FFFFFF',
                cursor: 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
              }}
            >
              ✓ Accept changes
            </button>
            <button
              onClick={rejectTrim}
              style={{
                flex: 1, background: 'transparent',
                border: `1px solid ${colors.borderDark}`,
                borderRadius: 8, padding: '10px',
                fontSize: 13, color: colors.mutedDark, cursor: 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
              }}
            >
              Keep original
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
