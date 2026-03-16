import { useState, useEffect, useCallback } from 'react'
import { colors } from '../design-system'
import type { DeckSlide } from '../data/disney-deck'

interface PresenterProps {
  slides: DeckSlide[]
  title?: string
}

export function Presenter({ slides, title }: PresenterProps) {
  const [current, setCurrent] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), [])
  const next = useCallback(() => setCurrent(c => Math.min(slides.length - 1, c + 1)), [slides.length])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')                    { e.preventDefault(); prev() }
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, toggleFullscreen])

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const progress = ((current + 1) / slides.length) * 100

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0b',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      {/* Top bar */}
      <div style={{
        width: '100%', maxWidth: 1200,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 24px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444' }}>
          {title ?? 'SIGNAL'}
        </div>
        <button
          onClick={toggleFullscreen}
          style={{
            background: 'transparent', border: '1px solid #333', borderRadius: 6,
            color: '#666', fontSize: 12, padding: '4px 10px', cursor: 'pointer',
          }}
        >
          {isFullscreen ? 'Exit fullscreen' : 'Fullscreen (F)'}
        </button>
      </div>

      {/* Slide stage */}
      <div style={{ width: '100%', maxWidth: 1200, padding: '0 24px' }}>
        <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative' }}>
          {slides[current].element}
        </div>
      </div>

      {/* Nav bar */}
      <div style={{
        width: '100%', maxWidth: 1200,
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 24px',
      }}>
        <button
          onClick={prev}
          disabled={current === 0}
          style={{
            background: 'transparent', border: '1px solid #333', borderRadius: 6,
            color: current === 0 ? '#333' : '#888', fontSize: 18,
            width: 36, height: 36, cursor: current === 0 ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ←
        </button>

        {/* Progress track */}
        <div style={{ flex: 1, height: 2, background: '#222', borderRadius: 2 }}>
          <div style={{
            height: '100%', background: colors.blue, borderRadius: 2,
            width: `${progress}%`, transition: 'width 0.2s ease',
          }} />
        </div>

        <button
          onClick={next}
          disabled={current === slides.length - 1}
          style={{
            background: 'transparent', border: '1px solid #333', borderRadius: 6,
            color: current === slides.length - 1 ? '#333' : '#888', fontSize: 18,
            width: 36, height: 36, cursor: current === slides.length - 1 ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          →
        </button>

        {/* Slide counter */}
        <div style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: '#444', minWidth: 48, textAlign: 'right' }}>
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Dot nav */}
      <div style={{ display: 'flex', gap: 6, paddingBottom: 16 }}>
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 20 : 6, height: 6,
              borderRadius: 3, border: 'none', cursor: 'pointer',
              background: i === current ? colors.blue : '#333',
              transition: 'all 0.2s ease', padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}
