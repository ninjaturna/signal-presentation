import { useState, useEffect, useRef, useCallback } from 'react'
import { colors } from '../design-system'
import { renderSlide } from '../utils/renderSlide'
import type { SlideData } from '../types/deck'
import type { DeckTheme } from '../design-system/themes'

interface PresentModeProps {
  slides: SlideData[]
  initialIndex?: number
  theme: DeckTheme
  onClose: () => void
}

export function PresentMode({ slides, initialIndex = 0, theme, onClose }: PresentModeProps) {
  const [current, setCurrent] = useState(initialIndex)
  const [showUI, setShowUI]   = useState(true)
  const [showNotes, setShowNotes] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const startTime = useRef(Date.now())

  const slide     = slides[current]
  const nextSlide = slides[current + 1]

  // Elapsed timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Auto-hide UI after 3s inactivity
  const showAndResetTimer = useCallback(() => {
    setShowUI(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowUI(false), 3000)
  }, [])

  useEffect(() => {
    showAndResetTimer()
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current) }
  }, [showAndResetTimer])

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault()
          setCurrent(c => Math.min(c + 1, slides.length - 1))
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          setCurrent(c => Math.max(c - 1, 0))
          break
        case 'Escape':
          onClose()
          break
        case 'n':
        case 'N':
          setShowNotes(v => !v)
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slides.length, onClose])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    return `${m}:${(s % 60).toString().padStart(2, '0')}`
  }

  const progress = slides.length > 1 ? current / (slides.length - 1) : 1

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        cursor: showUI ? 'default' : 'none',
        fontFamily: '"DM Sans", system-ui, sans-serif',
      }}
      onMouseMove={showAndResetTimer}
      onClick={showAndResetTimer}
    >
      {/* Slide area */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: showNotes && slide.notes ? '16px 16px 0' : '16px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 'min(100vw, calc((100vh - 80px) * 16 / 9))',
        }}>
          {renderSlide(slide, { editable: false, theme: theme.tokens })}
        </div>
      </div>

      {/* Presenter notes panel */}
      {showNotes && slide.notes && (
        <div style={{
          background: '#111', borderTop: '1px solid #222',
          padding: '12px 24px',
          maxHeight: '25vh', overflowY: 'auto',
          flexShrink: 0,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: colors.blue,
            letterSpacing: '0.08em', marginBottom: 6,
          }}>
            PRESENTER NOTES
          </div>
          <div style={{ fontSize: 14, color: '#ccc', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {slide.notes}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ height: 3, background: '#1a1a1a', flexShrink: 0 }}>
        <div style={{
          height: '100%',
          width: `${progress * 100}%`,
          background: colors.blue,
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Top-right controls overlay */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        display: 'flex', gap: 6, alignItems: 'center',
        opacity: showUI ? 1 : 0,
        transition: 'opacity 0.3s',
        pointerEvents: showUI ? 'auto' : 'none',
      }}>
        <div style={hud}>
          {formatTime(elapsed)}
        </div>
        <div style={hud}>
          {current + 1} / {slides.length}
        </div>
        {slide.notes && (
          <button
            onClick={e => { e.stopPropagation(); setShowNotes(v => !v) }}
            style={{
              ...hud,
              border: `1px solid ${showNotes ? colors.blue : '#333'}`,
              background: showNotes ? 'rgba(30,90,242,0.25)' : 'rgba(0,0,0,0.65)',
              color: showNotes ? colors.blue : '#888',
              cursor: 'pointer',
            }}
          >
            N Notes
          </button>
        )}
        <button
          onClick={e => { e.stopPropagation(); onClose() }}
          style={{ ...hud, cursor: 'pointer', border: '1px solid #333' }}
        >
          Esc ✕
        </button>
      </div>

      {/* Prev/next arrows */}
      {showUI && (
        <>
          <button
            onClick={e => { e.stopPropagation(); setCurrent(c => Math.max(c - 1, 0)) }}
            disabled={current === 0}
            style={navArrow('left', current === 0)}
          >
            ‹
          </button>
          <button
            onClick={e => { e.stopPropagation(); setCurrent(c => Math.min(c + 1, slides.length - 1)) }}
            disabled={current === slides.length - 1}
            style={navArrow('right', current === slides.length - 1)}
          >
            ›
          </button>
        </>
      )}

      {/* Up next — bottom left */}
      {nextSlide && showUI && (
        <div style={{
          position: 'absolute', bottom: 18, left: 14,
          background: 'rgba(0,0,0,0.7)',
          borderRadius: 6, padding: '7px 12px',
          display: 'flex', alignItems: 'center', gap: 8,
          maxWidth: 280,
          opacity: showUI ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#444', letterSpacing: '0.08em', flexShrink: 0 }}>
            UP NEXT
          </span>
          <span style={{
            fontSize: 11, color: '#777',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {nextSlide.title ?? nextSlide.headline ?? nextSlide.statement ?? nextSlide.type}
          </span>
        </div>
      )}
    </div>
  )
}

const hud: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#888',
  background: 'rgba(0,0,0,0.65)',
  border: '1px solid transparent',
  borderRadius: 5, padding: '4px 10px',
  fontVariantNumeric: 'tabular-nums',
  fontFamily: '"DM Sans", system-ui, sans-serif',
}

function navArrow(side: 'left' | 'right', disabled: boolean): React.CSSProperties {
  return {
    position: 'absolute', [side]: 12,
    top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid #222',
    borderRadius: 6, width: 40, height: 56,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26, color: disabled ? '#222' : '#555',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'system-ui',
    transition: 'color 0.15s',
  }
}
