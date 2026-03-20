import { useState, useEffect, useCallback, useRef } from 'react'
import { renderSlide } from '../utils/renderSlide'
import type { SlideData } from '../types/deck'

interface PresentModeProps {
  slides: SlideData[]
  startIndex?: number
  onExit: () => void
}

const DRAWER_HEIGHT = 220
const TRANSITION    = '0.32s cubic-bezier(0.4, 0, 0.2, 1)'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function PresentMode({ slides, startIndex = 0, onExit }: PresentModeProps) {
  const [current, setCurrent]           = useState(startIndex)
  const [revealStep, setRevealStep]     = useState(0)
  const [showNotes, setShowNotes]       = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [elapsed, setElapsed]           = useState(0)
  const [fading, setFading]             = useState(false)
  const [audienceWin, setAudienceWin]   = useState<Window | null>(null)

  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const channelRef    = useRef<BroadcastChannel | null>(null)

  const slide     = slides[current]
  const nextSlide = slides[current + 1]
  const hasNotes  = !!(slide?.notes?.trim())

  // Open audience popup + BroadcastChannel on mount
  useEffect(() => {
    const ch = new BroadcastChannel('signal-present')
    channelRef.current = ch

    const popup = window.open(
      `${window.location.origin}/?mode=audience`,
      'signal-audience',
      [
        `width=${Math.round(screen.width * 0.65)}`,
        `height=${Math.round(screen.height * 0.65)}`,
        `left=${Math.round(screen.width * 0.35)}`,
        'top=0',
        'menubar=no', 'toolbar=no', 'location=no', 'status=no',
      ].join(',')
    )
    setAudienceWin(popup)

    // Let the audience window load before first broadcast
    setTimeout(() => {
      ch.postMessage({ type: 'SLIDE_CHANGE', slide: slides[startIndex] })
    }, 600)

    return () => {
      ch.postMessage({ type: 'PRESENT_END' })
      ch.close()
      popup?.close()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Broadcast on slide change
  useEffect(() => {
    channelRef.current?.postMessage({ type: 'SLIDE_CHANGE', slide })
  }, [current, slide])

  // Timer
  useEffect(() => {
    timerInterval.current = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => { if (timerInterval.current) clearInterval(timerInterval.current) }
  }, [])

  const resetControlsTimer = useCallback(() => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current)
    setShowControls(true)
    controlsTimer.current = setTimeout(() => setShowControls(false), 3500)
  }, [])

  useEffect(() => { resetControlsTimer() }, [current, resetControlsTimer])

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= slides.length || fading) return
    setRevealStep(0)
    setFading(true)
    setTimeout(() => { setCurrent(idx); setFading(false) }, 140)
  }, [slides.length, fading])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown': {
          e.preventDefault()
          const buildSteps = slides[current]?.buildSteps ?? 0
          if (revealStep < buildSteps) {
            const nextStep = revealStep + 1
            setRevealStep(nextStep)
            channelRef.current?.postMessage({ type: 'BUILD_STEP', revealStep: nextStep, slideIndex: current })
          } else {
            goTo(current + 1)
          }
          break
        }
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
          e.preventDefault(); goTo(current - 1); break
        case 'Escape': onExit(); break
        case 'n': case 'N': setShowNotes(v => !v); break
        case 'Home': goTo(0); break
        case 'End': goTo(slides.length - 1); break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, revealStep, goTo, onExit, slides.length])

  const refocusOrReopenAudience = useCallback(() => {
    if (audienceWin && !audienceWin.closed) {
      audienceWin.focus()
    } else {
      const popup = window.open(
        `${window.location.origin}/?mode=audience`,
        'signal-audience',
        `width=${Math.round(screen.width * 0.65)},height=${Math.round(screen.height * 0.65)}`
      )
      setAudienceWin(popup)
      setTimeout(() => {
        channelRef.current?.postMessage({ type: 'SLIDE_CHANGE', slide })
      }, 600)
    }
  }, [audienceWin, slide])

  const progress = ((current + 1) / slides.length) * 100
  const headerH  = 44  // px, height of PRESENTER VIEW banner

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        // GRAYSCALE: entire presenter view is desaturated — makes it
        // immediately obvious this is NOT the screen to share on a call
        filter: 'grayscale(100%)',
        background: '#1a1a1a',
        display: 'flex', flexDirection: 'column',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        cursor: showControls ? 'default' : 'none',
        overflow: 'hidden',
      }}
      onMouseMove={resetControlsTimer}
    >
      {/* ── PRESENTER VIEW banner ── */}
      <div style={{
        height: headerH,
        flexShrink: 0,
        background: '#252525',
        borderBottom: '1px solid #333',
        padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: '#3a3a3a', border: '1px solid #555',
            borderRadius: 4, padding: '2px 8px',
            fontSize: 10, fontWeight: 700, color: '#ccc',
            letterSpacing: '0.1em',
          }}>
            PRESENTER VIEW
          </div>
          <span style={{ fontSize: 11, color: '#555' }}>
            Do not share this screen — move the audience window to the projector
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={refocusOrReopenAudience} style={headerBtn}>
            ↗ Audience window
          </button>
          <button onClick={onExit} style={headerBtn}>
            ✕ End
          </button>
        </div>
      </div>

      {/* ── Slide stage ── */}
      <div
        onClick={() => {
          const buildSteps = slides[current]?.buildSteps ?? 0
          if (revealStep < buildSteps) {
            const nextStep = revealStep + 1
            setRevealStep(nextStep)
            channelRef.current?.postMessage({ type: 'BUILD_STEP', revealStep: nextStep, slideIndex: current })
          } else {
            goTo(current + 1)
          }
        }}
        style={{
          flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          maxHeight: showNotes
            ? `calc(100vh - ${DRAWER_HEIGHT + headerH}px)`
            : `calc(100vh - ${headerH}px)`,
          transition: `max-height ${TRANSITION}`,
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: showNotes
            ? `calc((100vh - ${DRAWER_HEIGHT + headerH}px) * 16/9)`
            : `calc((100vh - ${headerH}px) * 16/9)`,
          aspectRatio: '16/9',
          position: 'relative',
          overflow: 'hidden',
          transition: `max-width ${TRANSITION}`,
          opacity: fading ? 0 : 1,
          boxShadow: '0 4px 32px rgba(0,0,0,0.7)',
          borderRadius: 4,
        }}>
          {renderSlide(slide, { editable: false, revealStep })}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{
        position: 'absolute',
        bottom: showNotes ? DRAWER_HEIGHT : 0,
        left: 0, right: 0, height: 3,
        background: 'rgba(255,255,255,0.06)',
        transition: `bottom ${TRANSITION}`,
        zIndex: 20,
      }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: '#666',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* ── Controls bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: showNotes ? DRAWER_HEIGHT + 12 : 12,
          left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(35,35,35,0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #3a3a3a',
          borderRadius: 12, padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: showControls ? 1 : 0,
          transition: `opacity 0.3s ease, bottom ${TRANSITION}`,
          pointerEvents: showControls ? 'auto' : 'none',
          zIndex: 30, whiteSpace: 'nowrap' as const,
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={() => goTo(current - 1)} disabled={current === 0}
          style={ctrlBtn(current === 0)}>‹</button>

        <span style={{
          fontSize: 13, fontWeight: 600, color: '#ccc',
          fontVariantNumeric: 'tabular-nums',
          minWidth: 52, textAlign: 'center' as const,
        }}>
          {current + 1} / {slides.length}
        </span>

        <button onClick={() => goTo(current + 1)} disabled={current === slides.length - 1}
          style={ctrlBtn(current === slides.length - 1)}>›</button>

        <Sep />

        <span style={{ fontSize: 12, color: '#666', fontVariantNumeric: 'tabular-nums', minWidth: 40 }}>
          {formatTime(elapsed)}
        </span>

        {(slides[current]?.buildSteps ?? 0) > 0 && (
          <>
            <Sep />
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {Array.from({ length: slides[current].buildSteps! }).map((_, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: i < revealStep ? '#FFFFFF' : 'rgba(255,255,255,0.2)',
                  transition: 'background 0.2s',
                }} />
              ))}
            </div>
          </>
        )}

        <Sep />

        <button
          onClick={() => setShowNotes(v => !v)}
          style={{
            background: showNotes ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: `1px solid ${showNotes ? '#666' : '#3a3a3a'}`,
            borderRadius: 5, padding: '3px 10px',
            fontSize: 11, fontWeight: 600,
            color: showNotes ? '#ccc' : '#666',
            cursor: 'pointer',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          📝 Notes
          {hasNotes && (
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#888', display: 'inline-block',
            }} />
          )}
        </button>
      </div>

      {/* ── Notes drawer ── */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: DRAWER_HEIGHT,
          background: '#161616',
          borderTop: '1px solid #2a2a2a',
          transform: showNotes ? 'translateY(0)' : `translateY(${DRAWER_HEIGHT}px)`,
          transition: `transform ${TRANSITION}`,
          zIndex: 25, display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 20px 0', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              onClick={() => setShowNotes(false)}
              style={{
                width: 36, height: 3, borderRadius: 999,
                background: '#2a2a2a', cursor: 'pointer',
              }}
            />
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#555',
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
            }}>
              Presenter notes · Slide {current + 1} of {slides.length}
            </span>
          </div>
          <button
            onClick={() => setShowNotes(false)}
            style={{
              background: 'transparent', border: 'none',
              color: '#444', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Drawer body */}
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: nextSlide ? '1fr 240px' : '1fr',
          overflow: 'hidden',
        }}>
          {/* Notes text */}
          <div style={{ padding: '12px 20px 16px', overflowY: 'auto' }}>
            {hasNotes ? (
              <p style={{
                fontSize: 15, lineHeight: 1.65,
                color: '#bbb', margin: 0, whiteSpace: 'pre-wrap',
              }}>
                {slide.notes}
              </p>
            ) : (
              <p style={{
                fontSize: 13, color: '#444',
                fontStyle: 'italic', margin: 0, lineHeight: 1.6,
              }}>
                No notes for this slide. Add them in Edit mode via the 📝 Presenter notes field.
              </p>
            )}
          </div>

          {/* Up next thumbnail */}
          {nextSlide && (
            <div style={{
              borderLeft: '1px solid #222',
              padding: '12px 16px',
              display: 'flex', flexDirection: 'column', gap: 8,
              background: '#111',
            }}>
              <span style={{
                fontSize: 9, fontWeight: 700, color: '#444',
                letterSpacing: '0.08em', textTransform: 'uppercase' as const,
              }}>
                Up next
              </span>
              <div style={{
                width: '100%', aspectRatio: '16/9', borderRadius: 6,
                overflow: 'hidden', border: '1px solid #222',
                position: 'relative',
                background: nextSlide.mode === 'dark' ? '#111113' : '#FCF8F5',
              }}>
                <div style={{
                  position: 'absolute', width: 1280, height: 720,
                  transformOrigin: 'top left',
                  transform: `scale(${208 / 1280})`,
                  pointerEvents: 'none',
                }}>
                  {renderSlide(nextSlide, { editable: false })}
                </div>
              </div>
              <span style={{ fontSize: 10, color: '#444' }}>
                Slide {current + 2}
                {nextSlide.title
                  ? ` · ${nextSlide.title.slice(0, 28)}`
                  : nextSlide.headline
                  ? ` · ${nextSlide.headline.slice(0, 28)}`
                  : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const headerBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #3a3a3a',
  borderRadius: 4, padding: '3px 10px',
  fontSize: 11, color: '#666', cursor: 'pointer',
  fontFamily: '"DM Sans", system-ui, sans-serif',
}

function ctrlBtn(disabled: boolean): React.CSSProperties {
  return {
    background: 'transparent', border: 'none',
    color: disabled ? '#333' : '#ccc',
    fontSize: 20, cursor: disabled ? 'default' : 'pointer',
    padding: '0 4px', lineHeight: 1, fontFamily: 'system-ui',
  }
}

function Sep() {
  return <div style={{ width: 1, height: 16, background: '#333', flexShrink: 0 }} />
}
