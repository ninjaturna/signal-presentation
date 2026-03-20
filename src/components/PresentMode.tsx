import { useState, useEffect, useCallback, useRef } from 'react'
import { renderSlide } from '../utils/renderSlide'
import { colors } from '../design-system'
import type { SlideData } from '../types/deck'

interface PresentModeProps {
  slides: SlideData[]
  startIndex?: number
  onExit: () => void
}

const DRAWER_HEIGHT = 220
const TRANSITION = '0.32s cubic-bezier(0.4, 0, 0.2, 1)'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function PresentMode({ slides, startIndex = 0, onExit }: PresentModeProps) {
  const [current, setCurrent]           = useState(startIndex)
  const [showNotes, setShowNotes]       = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [elapsed, setElapsed]           = useState(0)
  const [fading, setFading]             = useState(false)
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const slide     = slides[current]
  const nextSlide = slides[current + 1]
  const hasNotes  = !!(slide?.notes?.trim())

  // Timer
  useEffect(() => {
    timerInterval.current = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => { if (timerInterval.current) clearInterval(timerInterval.current) }
  }, [])

  const resetControlsTimer = useCallback(() => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current)
    setShowControls(true)
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000)
  }, [])

  useEffect(() => { resetControlsTimer() }, [current, resetControlsTimer])

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= slides.length || fading) return
    setFading(true)
    setTimeout(() => { setCurrent(idx); setFading(false) }, 160)
  }, [slides.length, fading])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case ' ': case 'PageDown':
          e.preventDefault(); goTo(current + 1); break
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
  }, [current, goTo, onExit, slides.length])

  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {})
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    }
  }, [])

  const progress = ((current + 1) / slides.length) * 100

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: '#000',
        zIndex: 9999, display: 'flex', flexDirection: 'column',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        cursor: showControls ? 'default' : 'none',
        overflow: 'hidden',
      }}
      onMouseMove={resetControlsTimer}
    >
      {/* ── Slide stage ── */}
      <div
        onClick={() => goTo(current + 1)}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxHeight: showNotes
            ? `calc(100vh - ${DRAWER_HEIGHT + 44}px)`
            : '100vh',
          transition: `max-height ${TRANSITION}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: showNotes
              ? `calc((100vh - ${DRAWER_HEIGHT + 44}px) * 16/9)`
              : 'calc(100vh * 16/9)',
            aspectRatio: '16/9',
            position: 'relative',
            overflow: 'hidden',
            transition: `max-width ${TRANSITION}`,
            opacity: fading ? 0 : 1,
          }}
        >
          {renderSlide(slide, { editable: false })}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{
        position: 'absolute',
        bottom: showNotes ? DRAWER_HEIGHT : 0,
        left: 0, right: 0, height: 3,
        background: 'rgba(255,255,255,0.08)',
        transition: `bottom ${TRANSITION}`,
        zIndex: 20,
      }}>
        <div style={{
          height: '100%', width: `${progress}%`,
          background: colors.blue,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* ── Controls bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: showNotes ? DRAWER_HEIGHT + 12 : 12,
          left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(17,17,19,0.92)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${colors.borderDark}`,
          borderRadius: 12,
          padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: showControls ? 1 : 0,
          transition: `opacity 0.3s ease, bottom ${TRANSITION}`,
          pointerEvents: showControls ? 'auto' : 'none',
          zIndex: 30, whiteSpace: 'nowrap',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={() => goTo(current - 1)} disabled={current === 0}
          style={ctrlBtn(current === 0)}>‹</button>

        <span style={{
          fontSize: 13, fontWeight: 600, color: '#FFFFFF',
          fontVariantNumeric: 'tabular-nums', minWidth: 52, textAlign: 'center',
        }}>
          {current + 1} / {slides.length}
        </span>

        <button onClick={() => goTo(current + 1)} disabled={current === slides.length - 1}
          style={ctrlBtn(current === slides.length - 1)}>›</button>

        <Sep />

        <span style={{ fontSize: 12, color: colors.mutedDark, fontVariantNumeric: 'tabular-nums', minWidth: 40 }}>
          {formatTime(elapsed)}
        </span>

        <Sep />

        <button
          onClick={() => setShowNotes(v => !v)}
          style={{
            background: showNotes ? 'rgba(255,204,45,0.15)' : 'transparent',
            border: `1px solid ${showNotes ? colors.gold : colors.borderDark}`,
            borderRadius: 5, padding: '3px 10px',
            fontSize: 11, fontWeight: 600,
            color: showNotes ? colors.gold : colors.mutedDark,
            cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          📝 Notes {hasNotes && <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.gold, display: 'inline-block' }} />}
        </button>

        <Sep />

        <button onClick={onExit} style={{
          background: 'transparent', border: 'none',
          color: colors.mutedDark, cursor: 'pointer',
          fontSize: 11, fontWeight: 600,
          fontFamily: '"DM Sans", system-ui, sans-serif', padding: '2px 4px',
        }}>
          ✕ Esc
        </button>
      </div>

      {/* ── Notes drawer — slides up from bottom ── */}
      <div
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: DRAWER_HEIGHT,
          background: '#111113',
          borderTop: `1px solid ${colors.borderDark}`,
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
                background: colors.borderDark, cursor: 'pointer',
              }}
            />
            <span style={{
              fontSize: 10, fontWeight: 700, color: colors.mutedDark,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Presenter notes
            </span>
            <span style={{ fontSize: 10, color: colors.borderDark }}>·</span>
            <span style={{ fontSize: 10, color: colors.mutedDark }}>
              Slide {current + 1} of {slides.length}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {nextSlide && (
              <span style={{ fontSize: 9, fontWeight: 700, color: colors.mutedDark, letterSpacing: '0.06em' }}>
                UP NEXT →
              </span>
            )}
            <button
              onClick={() => setShowNotes(false)}
              style={{
                background: 'transparent', border: 'none',
                color: colors.mutedDark, cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0,
              }}
              title="Close notes (N)"
            >
              ×
            </button>
          </div>
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
              <p style={{ fontSize: 15, lineHeight: 1.65, color: '#FFFFFF', margin: 0, whiteSpace: 'pre-wrap' }}>
                {slide.notes}
              </p>
            ) : (
              <p style={{ fontSize: 13, color: colors.mutedDark, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
                No notes for this slide. Add them in Edit mode via the 📝 Presenter notes field in the right panel.
              </p>
            )}
          </div>

          {/* Next slide preview */}
          {nextSlide && (
            <div style={{
              borderLeft: `1px solid ${colors.borderDark}`,
              padding: '12px 16px', display: 'flex',
              flexDirection: 'column', gap: 8, background: '#0d0d0f',
            }}>
              <span style={{
                fontSize: 9, fontWeight: 700, color: colors.mutedDark,
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Up next
              </span>
              <div style={{
                width: '100%', aspectRatio: '16/9', borderRadius: 6,
                overflow: 'hidden', border: `1px solid ${colors.borderDark}`,
                position: 'relative',
                background: nextSlide.mode === 'dark' ? colors.ink : '#FCF8F5',
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
              <span style={{ fontSize: 10, color: colors.mutedDark }}>
                Slide {current + 2}
                {nextSlide.title ? ` · ${nextSlide.title.slice(0, 28)}` : nextSlide.headline ? ` · ${nextSlide.headline.slice(0, 28)}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Hint toast ── */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(17,17,19,0.85)', borderRadius: 8, padding: '6px 16px',
        fontSize: 11, color: colors.mutedDark, zIndex: 40,
        opacity: elapsed < 3 ? 1 : 0, transition: 'opacity 1s ease',
        pointerEvents: 'none', whiteSpace: 'nowrap',
      }}>
        ← → navigate · N notes · Esc exit
      </div>
    </div>
  )
}

function ctrlBtn(disabled: boolean): React.CSSProperties {
  return {
    background: 'transparent', border: 'none',
    color: disabled ? colors.borderDark : '#FFFFFF',
    fontSize: 20, cursor: disabled ? 'default' : 'pointer',
    padding: '0 4px', lineHeight: 1, fontFamily: 'system-ui',
  }
}

function Sep() {
  return <div style={{ width: 1, height: 16, background: colors.borderDark, flexShrink: 0 }} />
}
