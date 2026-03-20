import { useState, useEffect } from 'react'
import { renderSlide } from '../utils/renderSlide'
import type { SlideData } from '../types/deck'

// AudienceView — clean audience-facing window, no chrome.
// Receives slide data via BroadcastChannel from PresentMode.

export function AudienceView() {
  const [slide, setSlide] = useState<SlideData | null>(null)
  const [revealStep, setRevealStep] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const channel = new BroadcastChannel('signal-present')
    channel.onmessage = (e) => {
      if (e.data.type === 'SLIDE_CHANGE') {
        setRevealStep(0)
        setFading(true)
        setTimeout(() => {
          setSlide(e.data.slide)
          setFading(false)
        }, 150)
      }
      if (e.data.type === 'BUILD_STEP') {
        setRevealStep(e.data.revealStep)
      }
      if (e.data.type === 'PRESENT_END') {
        window.close()
      }
    }
    return () => channel.close()
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      {slide ? (
        <div style={{
          width: 'min(100vw, calc(100vh * 16 / 9))',
          aspectRatio: '16/9',
          overflow: 'hidden',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.15s ease',
        }}>
          {renderSlide(slide, { editable: false, revealStep })}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.2)',
        }}>
          <div style={{ fontSize: 13, letterSpacing: '0.08em', fontWeight: 600 }}>SIGNAL</div>
          <div style={{ fontSize: 11, marginTop: 8 }}>Waiting for presenter…</div>
        </div>
      )}
    </div>
  )
}
